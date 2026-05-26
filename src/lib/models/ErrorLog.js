import mongoose from 'mongoose';

const ErrorLogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this error log.'],
    trim: true,
  },
  logContent: {
    type: String,
    required: [true, 'Please provide the error message or log content.'],
  },
  solution: {
    type: String,
    required: [true, 'Please provide a solution or debugging steps.'],
  },
  tag: {
    type: String,
    default: 'General',
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Solved', 'Reviewing'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ErrorLog || mongoose.model('ErrorLog', ErrorLogSchema);
