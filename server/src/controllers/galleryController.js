import Gallery from '../models/Gallery.js';
import { isMongoConnected } from '../config/db.js';

export const INITIAL_GALLERY_ITEMS = [
  {
    title: 'Proud Indian Flag Group Portrait',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795179941/Proud_Indian_Flag_Group_Portrait.png',
    category: 'events',
    categoryLabel: 'Flag Ceremony',
    caption: 'Brahm Shakti Hospital medical faculty and administrative leadership celebrating national pride at the hospital campus.',
    order: 1
  },
  {
    title: 'Indian Flag Ceremony Group Photo',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795179942/Indian_Flag_Ceremony_Group_Photo.png',
    category: 'events',
    categoryLabel: 'Ceremony',
    caption: 'Senior doctors, clinical nurses, and staff members assembled during the ceremonial flag hoisting event at Budh Vihar.',
    order: 2
  },
  {
    title: 'Hospital Annual Foundation & Care Gathering',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183378/brahmshakti_event_hero_resized.jpg',
    category: 'events',
    categoryLabel: 'Foundation Day',
    caption: 'Annual community healthcare milestone and clinical celebration organized under Brahm Shakti Trust.',
    order: 3
  },
  {
    title: 'Clinical Faculty & Healthcare Team',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183537/WhatsApp_Image_2026-11-04_at_8.03.05_AM_2.jpg',
    category: 'campus',
    categoryLabel: 'Medical Staff',
    caption: 'Dedicated doctors, consultants, and surgical teams delivering round-the-clock patient care and recovery.',
    order: 4
  },
  {
    title: 'Emergency & Surgical Infrastructure',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185836/WhatsApp_Image_2026-11-04_at_8.03.05_AM.jpg',
    category: 'campus',
    categoryLabel: 'Hospital Campus',
    caption: 'Modern facilities and advanced clinical infrastructure serving North-West Delhi families with trusted care.',
    order: 5
  },
  {
    title: 'Hospital Ward & Inpatient Facility',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185834/WhatsApp_Image_2026-11-04_at_8.03.06_AM_1.jpg',
    category: 'campus',
    categoryLabel: 'Inpatient Care',
    caption: 'Clean, sanitized inpatient recovery suites and dedicated clinical nursing stations for peaceful healing.',
    order: 6
  },
  {
    title: 'Diagnostics & Patient Care Units',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185835/WhatsApp_Image_2026-11-04_at_8.03.06_AM.jpg',
    category: 'campus',
    categoryLabel: 'Diagnostics',
    caption: 'Accurate digital diagnostic monitoring and patient-first clinical departments equipped with advanced medical systems.',
    order: 7
  },
  {
    title: 'Surgical Suites & Keyhole Laparoscopy',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185836/WhatsApp_Image_2026-11-04_at_8.03.04_AM_2.jpg',
    category: 'campus',
    categoryLabel: 'Operation Theatres',
    caption: 'Advanced modular operating suites with precision surgical instruments for minimally invasive surgeries.',
    order: 8
  },
  {
    title: 'Critical Care ICU & Monitoring Suites',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185836/WhatsApp_Image_2026-11-04_at_8.03.04_AM_1.jpg',
    category: 'campus',
    categoryLabel: 'Critical Care',
    caption: 'Intensive care unit with multi-para vital monitors and specialized emergency resuscitation infrastructure.',
    order: 9
  },
  {
    title: 'Maternity Wing & Neonatal Nursery',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185837/WhatsApp_Image_2026-11-04_at_8.03.04_AM.jpg',
    category: 'campus',
    categoryLabel: 'Mother & Child',
    caption: 'Comfortable obstetric suites and Level-III NICU care safeguarding mothers and fragile newborn babies.',
    order: 10
  },
  {
    title: 'Subsidized Dialysis Renal Unit',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185838/WhatsApp_Image_2026-11-04_at_8.03.03_AM_2.jpg',
    category: 'campus',
    categoryLabel: 'Dialysis Center',
    caption: 'Charitable high-flux hemodialysis wing operating round-the-clock for kidney patients under Brahm Shakti Trust.',
    order: 11
  },
  {
    title: 'Pathology & Diagnostic Laboratory',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185839/WhatsApp_Image_2026-11-04_at_8.03.03_AM_1.jpg',
    category: 'campus',
    categoryLabel: 'Clinical Labs',
    caption: 'Fully automated biochemistry, haematology, and microbiology analyzers delivering certified rapid turnaround.',
    order: 12
  },
  {
    title: 'Outpatient Reception & Triage Desk',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185840/WhatsApp_Image_2026-11-04_at_8.03.03_AM.jpg',
    category: 'campus',
    categoryLabel: 'Main Reception',
    caption: 'Courteous patient navigation desk and smooth electronic registration for daily specialty OPD visits.',
    order: 13
  },
  {
    title: '24x7 Ambulance & Emergency Lifeline',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185843/WhatsApp_Image_2026-11-04_at_8.03.01_AM_1.jpg',
    category: 'campus',
    categoryLabel: '24x7 Trauma Care',
    caption: 'Rapid response emergency trauma care and mobile cardiac ambulances ready for immediate patient transfer.',
    order: 14
  }
];

// In-memory fallback cache
let memoryGallery = INITIAL_GALLERY_ITEMS.map((item, idx) => ({
  _id: `mem-gal-${idx + 1}`,
  id: `mem-gal-${idx + 1}`,
  ...item,
  createdAt: new Date().toISOString()
}));

export const getGalleryItems = async (req, res) => {
  try {
    if (isMongoConnected) {
      let items = await Gallery.find().sort({ order: 1, createdAt: -1 });
      if (items.length === 0) {
        // Auto-seed initial 14 items if empty
        items = await Gallery.insertMany(INITIAL_GALLERY_ITEMS);
      }
      return res.status(200).json({
        success: true,
        count: items.length,
        data: items
      });
    }

    return res.status(200).json({
      success: true,
      count: memoryGallery.length,
      data: memoryGallery
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery items',
      error: error.message
    });
  }
};

export const createGalleryItem = async (req, res) => {
  try {
    const { title, image, caption, category, categoryLabel, order } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    const itemData = {
      title: title?.trim() || 'Brahm Shakti Hospital Campus',
      image: image.trim(),
      caption: caption?.trim() || '',
      category: category?.trim() || 'campus',
      categoryLabel: categoryLabel?.trim() || 'Hospital Facility',
      order: typeof order === 'number' ? order : 0
    };

    if (isMongoConnected) {
      const newItem = await Gallery.create(itemData);
      return res.status(201).json({
        success: true,
        message: 'Photo successfully added to gallery',
        data: newItem
      });
    }

    const newItem = {
      _id: `mem-gal-${Date.now()}`,
      id: `mem-gal-${Date.now()}`,
      ...itemData,
      createdAt: new Date().toISOString()
    };
    memoryGallery.unshift(newItem);

    return res.status(201).json({
      success: true,
      message: 'Photo successfully added to gallery',
      data: newItem
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add photo to gallery',
      error: error.message
    });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const deleted = await Gallery.findByIdAndDelete(id);
      if (!deleted) {
        // Try fallback by _id or order or image match
        await Gallery.deleteOne({ $or: [{ _id: id }, { id }] });
      }
      return res.status(200).json({
        success: true,
        message: 'Photo successfully removed from gallery'
      });
    }

    memoryGallery = memoryGallery.filter((item) => item._id !== id && item.id !== id);
    return res.status(200).json({
      success: true,
      message: 'Photo successfully removed from gallery'
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove photo from gallery',
      error: error.message
    });
  }
};
