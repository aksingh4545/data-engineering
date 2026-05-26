import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'default_user', // Simplified for single-user offline-first dashboard
  },
  level: {
    type: Number,
    default: 1,
  },
  xp: {
    type: Number,
    default: 0,
  },
  activeTime: {
    type: Number, // in minutes
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastActiveDate: {
    type: String, // YYYY-MM-DD
    default: '',
  },
  completedChallenges: {
    type: [String], // List of challenge IDs completed
    default: [],
  },
});

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
