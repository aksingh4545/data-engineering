import mongoose from 'mongoose';

const RevisionSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'default_user',
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for this note.'],
    trim: true,
  },
  question: {
    type: String,
    default: '',
  },
  answer: {
    type: String,
    required: [true, 'Please provide the note content or AI response.'],
  },
  category: {
    type: String,
    default: 'General',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Revision || mongoose.model('Revision', RevisionSchema);
