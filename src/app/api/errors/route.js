import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ErrorLog from '@/lib/models/ErrorLog';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Helper to return mock data if MongoDB is not connected
const getMockErrors = () => [
  {
    _id: 'mock-1',
    title: 'Docker: Port already allocated error',
    logContent: 'Error starting userland proxy: listen tcp4 0.0.0.0:11434: bind: address already in use',
    solution: 'Find the process occupying the port: "netstat -ano | findstr 11434" (Windows) or "lsof -i :11434" (macOS) and kill it, or edit docker-compose.yml to map to an alternate port, e.g., "11435:11434".',
    tag: 'Docker',
    status: 'Solved',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    _id: 'mock-2',
    title: 'Kafka: Broker coordinator not available',
    logContent: 'org.apache.kafka.common.errors.CoordinatorNotAvailableException: The coordinator is not available.',
    solution: 'Ensure your ZooKeeper or KRaft broker is fully started first and advertising the correct network address. Check network settings and increase initialization timeouts in producer properties.',
    tag: 'Kafka',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || 'default_user';

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ data: getMockErrors(), isMock: true });
    }
    const errors = await ErrorLog.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ data: errors, isMock: false });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ data: getMockErrors(), isMock: true, error: error.message });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || 'default_user';

    const body = await req.json();
    const db = await dbConnect();
    if (!db) {
      // Mock creation response
      const newMockItem = {
        _id: 'mock-' + Math.random().toString(36).substr(2, 9),
        ...body,
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json({ data: newMockItem, isMock: true });
    }
    const newLog = await ErrorLog.create({ ...body, userId });
    return NextResponse.json({ data: newLog, isMock: false });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || 'default_user';

    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    const db = await dbConnect();
    if (!db) {
      // Mock update response
      return NextResponse.json({ data: { _id: id, ...updates }, isMock: true });
    }
    const updated = await ErrorLog.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
    return NextResponse.json({ data: updated, isMock: false });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || 'default_user';

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ success: true, isMock: true });
    }
    await ErrorLog.findOneAndDelete({ _id: id, userId });
    return NextResponse.json({ success: true, isMock: false });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
