import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    caption: { type: String, default: '' },
    category: { type: String, default: 'Campus' },
    categoryLabel: { type: String, default: 'Campus' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
