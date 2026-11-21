import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    coverImage: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    summary: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    additionalImages: [{ type: String, trim: true }],
    author: { type: String, default: 'Brahm Shakti Hospital' },
    readTime: { type: String, default: '3 min read' },
    category: { type: String, default: 'Hospital Event' },
    status: { type: String, default: 'published' }
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);
export default Event;
