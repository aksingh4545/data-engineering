import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Progress from '@/lib/models/Progress';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Helper to return mock progress data if MongoDB is not connected
const getMockProgress = () => ({
  level: 3,
  xp: 450,
  activeTime: 120, // minutes
  streak: 5,
  completedChallenges: ['df-slice', 'docker-build'],
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || 'default_user';

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ data: getMockProgress(), isMock: true });
    }
    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({ userId });
    }
    return NextResponse.json({ data: progress, isMock: false });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ data: getMockProgress(), isMock: true, error: error.message });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || 'default_user';

    const body = await req.json();
    const { xpToAdd, activeTimeToAdd, completedChallengeId, resetStreak } = body;

    const db = await dbConnect();
    if (!db) {
      // Mock progress updates
      const mock = getMockProgress();
      if (xpToAdd) mock.xp += xpToAdd;
      if (activeTimeToAdd) mock.activeTime += activeTimeToAdd;
      if (completedChallengeId && !mock.completedChallenges.includes(completedChallengeId)) {
        mock.completedChallenges.push(completedChallengeId);
      }
      // Calculate level-up (every 500 XP = 1 Level)
      mock.level = Math.floor(mock.xp / 500) + 1;
      return NextResponse.json({ data: mock, isMock: true });
    }

    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({ userId });
    }

    if (xpToAdd) {
      progress.xp += xpToAdd;
      // Simple formula: Level increases at every 500 XP threshold
      progress.level = Math.floor(progress.xp / 500) + 1;
    }

    if (activeTimeToAdd) {
      progress.activeTime += activeTimeToAdd;
    }

    if (completedChallengeId && !progress.completedChallenges.includes(completedChallengeId)) {
      progress.completedChallenges.push(completedChallengeId);
    }

    // Process daily streak updates
    const todayStr = new Date().toISOString().split('T')[0];
    if (progress.lastActiveDate !== todayStr) {
      if (progress.lastActiveDate === new Date(Date.now() - 3600000 * 24).toISOString().split('T')[0]) {
        progress.streak += 1;
      } else if (progress.lastActiveDate === '') {
        progress.streak = 1;
      } else if (resetStreak) {
        progress.streak = 1;
      }
      progress.lastActiveDate = todayStr;
    }

    await progress.save();
    return NextResponse.json({ data: progress, isMock: false });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
