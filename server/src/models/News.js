import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String },
    category: {
      type: String,
      default: 'Public Notice'
    },
    refNumber: { type: String },
    audience: {
      type: String,
      enum: ['all', 'patients', 'doctors', 'specific_doctors'],
      default: 'all'
    },
    targetDoctorIds: [{ type: String }],
    targetDoctorNames: [{ type: String }],
    date: { type: String, required: true },
    isPinned: { type: Boolean, default: false },
    isNewBadge: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published'
    },
    author: {
      type: String,
      default: 'Brahm Shakti Hospital Administration'
    },
    readTime: { type: String, default: '2 min read' },
    attachmentUrl: { type: String }
  },
  { timestamps: true }
);

export const News = mongoose.models.News || mongoose.model('News', newsSchema);
export default News;
