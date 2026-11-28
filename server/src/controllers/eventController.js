import Event from '../models/Event.js';
import { isMongoConnected } from '../config/db.js';

// Initial default events data for Brahm Shakti Hospital
export const INITIAL_EVENTS = [
  {
    _id: 'evt-hospice-care-2026',
    title: 'World Hospice and Palliative Care Day 2026',
    slug: 'world-hospice-and-palliative-care-day-2026',
    coverImage: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183378/brahmshakti_event_hero_resized.jpg',
    location: 'Main Auditorium, Brahm Shakti Hospital, U-1/78, Budh Vihar, Main Kanjhawala Road, Delhi-110086',
    date: '2026-10-09',
    summary: 'A day of learning, clinical reflection, and compassionate healthcare at Brahm Shakti Hospital.',
    description: `On 5th October, the Department of Palliative Medicine and Critical Care at Brahm Shakti Hospital marked World Hospice and Palliative Care Day with over 125 medical delegates, senior clinicians, and community healthcare leaders coming together to reflect on what compassionate, patient-first medicine truly means.

The programme was inaugurated by senior medical trustees and consultant physicians of Brahm Shakti Hospital, who presided over the ceremonial lamp lighting. Guest medical dignitaries and pioneers in hospice and palliative home-based healthcare in Delhi-NCR shared foundational guidance on pain management and emotional reassurance.

Through insightful academic discussions on intensive care management, oncology pain management protocols, and compassionate family counseling for advanced illness, the symposium highlighted the multi-dimensional facets of clinical care.

A deeply moving 'Caregiver Expressions' session brought personal experiences to the forefront, while our student nursing corps captured the essence of dignity, recovery, and holistic healing through an inspiring cultural presentation.

A meaningful milestone that reaffirmed our founding principle under Brahm Shakti Trust: when treatment can no longer preserve life, care can always preserve dignity, comfort, and humanity.`,
    additionalImages: [
      'https://res.cloudinary.com/urzka7oz/image/upload/v1795183537/WhatsApp_Image_2026-11-04_at_8.03.05_AM_2.jpg',
      'https://res.cloudinary.com/urzka7oz/image/upload/v1795179942/Indian_Flag_Ceremony_Group_Photo.png'
    ],
    author: 'Brahm Shakti Hospital Administration',
    readTime: '4 min read',
    category: 'Clinical Symposium & Care Day',
    status: 'published',
    createdAt: new Date('2026-10-09T09:00:00Z').toISOString()
  },
  {
    _id: 'evt-national-flag-ceremony-2026',
    title: 'National Flag Ceremony & Healthcare Dedication Assembly',
    slug: 'national-flag-ceremony-and-healthcare-dedication-assembly',
    coverImage: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795179941/Proud_Indian_Flag_Group_Portrait.png',
    location: 'Hospital Front Courtyard, Budh Vihar Main Campus, Delhi',
    date: '2026-08-15',
    summary: 'Senior doctors, surgeons, nurses, and administrative leadership assemble to celebrate national service and clinical excellence.',
    description: `On the auspicious occasion of Independence Day, the Brahm Shakti Hospital fraternity gathered at the campus front courtyard for the ceremonial tricolor flag hoisting and healthcare oath renewal.

Led by Managing Trustees, Medical Superintendent, and Chief of Surgery, the assembly acknowledged our round-the-clock emergency casualty workers, critical care ICU nurses, and laboratory technicians who serve the citizens of Budh Vihar, Pooth Khurd, Rohini, and Sultanpuri without interruption.

Following the ceremonial flag hoisting, free medical health checkups were provided to over 300 walk-in senior citizens, including complimentary diabetes profile screenings and ECG assessments.`,
    additionalImages: [
      'https://res.cloudinary.com/urzka7oz/image/upload/v1795179942/Indian_Flag_Ceremony_Group_Photo.png',
      'https://res.cloudinary.com/urzka7oz/image/upload/v1795183378/brahmshakti_event_hero_resized.jpg'
    ],
    author: 'Brahm Shakti Hospital Administration',
    readTime: '3 min read',
    category: 'Community Celebration',
    status: 'published',
    createdAt: new Date('2026-08-15T08:30:00Z').toISOString()
  },
  {
    _id: 'evt-mega-health-camp-2026',
    title: 'Mega Multi-Specialty Free Health Camp & Screening Drive',
    slug: 'mega-multi-specialty-free-health-camp-and-screening-drive',
    coverImage: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183537/WhatsApp_Image_2026-11-04_at_8.03.05_AM_2.jpg',
    location: 'Super-Specialty OPD Complex, Brahm Shakti Hospital, New Delhi',
    date: '2026-11-02',
    summary: 'Complimentary specialist consultations in Cardiology, Orthopaedics, Gynaecology, and Paediatrics for local families.',
    description: `Under the aegis of Brahm Shakti Trust (Regd.), a comprehensive Mega Multi-Specialty Health Camp was organized at the hospital OPD complex. Over 450 patients from Budh Vihar, Rohini Sectors 20-25, and surrounding localities received expert consultations.

Clinical services included:
- Free blood sugar & HbA1c tests
- On-the-spot 12-lead ECG & cardiac risk assessment
- Orthopaedic bone mineral density (BMD) testing
- Subsidized medicine distribution by Brahm Shakti Hospital 24x7 Pharmacy

Senior Consultant Physician Dr. S.K. Goyal and Consultant Orthopaedic Surgeon Dr. Kapil Goyal counseled families on preventive cardiology and joint preservation techniques.`,
    additionalImages: [
      'https://res.cloudinary.com/urzka7oz/image/upload/v1795185834/WhatsApp_Image_2026-11-04_at_8.03.06_AM_1.jpg',
      'https://res.cloudinary.com/urzka7oz/image/upload/v1795185835/WhatsApp_Image_2026-11-04_at_8.03.06_AM.jpg'
    ],
    author: 'Brahm Shakti Hospital Outreach Team',
    readTime: '4 min read',
    category: 'Health Camp & Outreach',
    status: 'published',
    createdAt: new Date('2026-11-02T10:00:00Z').toISOString()
  },
  {
    _id: 'evt-blood-donation-drive-2026',
    title: 'Voluntary Blood Donation Drive & Donor Felicitations',
    slug: 'voluntary-blood-donation-drive-and-donor-felicitations',
    coverImage: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185836/WhatsApp_Image_2026-11-04_at_8.03.05_AM.jpg',
    location: 'Licensed Blood Centre, Brahm Shakti Hospital Campus',
    date: '2026-06-14',
    summary: 'Replenishing vital emergency blood reserves with 135 volunteer donors on World Blood Donor Day.',
    description: `On World Blood Donor Day, Brahm Shakti Hospital Blood Bank hosted its annual voluntary blood donation drive to ensure ample supply of whole blood, PRBC, and fresh frozen plasma for trauma emergencies, obstetric hemorrhages, and dialysis patients.

A total of 135 units were safely collected under the strict supervision of our transfusion medicine specialists and certified phlebotomists. All voluntary donors received a formal certificate of honor, donor card, and complimentary wellness screening kit.`,
    additionalImages: [
      'https://res.cloudinary.com/urzka7oz/image/upload/v1795185835/WhatsApp_Image_2026-11-04_at_8.03.06_AM.jpg'
    ],
    author: 'Brahm Shakti Blood Centre',
    readTime: '3 min read',
    category: 'Blood Bank Initiative',
    status: 'published',
    createdAt: new Date('2026-06-14T09:30:00Z').toISOString()
  }
];

// In-memory fallback buffer
let memoryEvents = [...INITIAL_EVENTS];

const generateSlug = (text) => {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `event-${Date.now()}`
  );
};

// Seed MongoDB if empty
export const seedEventsIfEmpty = async () => {
  if (!isMongoConnected) return;
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      const itemsToSeed = INITIAL_EVENTS.map(({ _id, ...rest }) => rest);
      await Event.insertMany(itemsToSeed);
      console.log('Seeded initial Brahm Shakti Hospital events into MongoDB');
    }
  } catch (err) {
    console.error('Error seeding events into MongoDB:', err.message);
  }
};

// 1. GET ALL EVENTS
export const getEvents = async (req, res, next) => {
  try {
    if (isMongoConnected) {
      try {
        let events = await Event.find().sort({ date: -1, createdAt: -1 }).lean();
        if (!events || events.length === 0) {
          const itemsToSeed = INITIAL_EVENTS.map(({ _id, ...rest }) => rest);
          events = await Event.insertMany(itemsToSeed);
        }
        return res.status(200).json({
          success: true,
          count: events.length,
          data: events
        });
      } catch (err) {
        console.error('Error querying MongoDB for events:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      count: memoryEvents.length,
      data: memoryEvents
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET SINGLE EVENT BY ID OR SLUG
export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      try {
        let event = null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          event = await Event.findById(id).lean();
        }
        if (!event) {
          event = await Event.findOne({ slug: id }).lean();
        }
        if (event) {
          return res.status(200).json({
            success: true,
            data: event
          });
        }
      } catch (err) {
        console.error('Error finding event in MongoDB:', err.message);
      }
    }

    const memEvent = memoryEvents.find((e) => e._id === id || e.slug === id);
    if (memEvent) {
      return res.status(200).json({
        success: true,
        data: memEvent
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Event not found.'
    });
  } catch (error) {
    next(error);
  }
};

// 3. CREATE NEW EVENT (Admin)
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      coverImage,
      location,
      date,
      summary,
      description,
      additionalImages = [],
      author = 'Brahm Shakti Hospital Administration',
      category = 'Hospital Event',
      readTime = '3 min read'
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Event Name / Title is required.' });
    }
    if (!coverImage || !coverImage.trim()) {
      return res.status(400).json({ success: false, message: 'Cover photo is required.' });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ success: false, message: 'Event location is required.' });
    }
    if (!date) {
      return res.status(400).json({ success: false, message: 'Event date is required.' });
    }
    if (!summary || !summary.trim()) {
      return res.status(400).json({ success: false, message: 'Event summary / short description is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Detailed event description text is required.' });
    }

    // Clean additionalImages
    const cleanedAdditional = Array.isArray(additionalImages)
      ? additionalImages.map((img) => img.trim()).filter((img) => img.length > 0)
      : [];

    let slug = generateSlug(title);

    const eventPayload = {
      title: title.trim(),
      slug,
      coverImage: coverImage.trim(),
      location: location.trim(),
      date,
      summary: summary.trim(),
      description: description.trim(),
      additionalImages: cleanedAdditional,
      author: author.trim() || 'Brahm Shakti Hospital Administration',
      category: category.trim() || 'Hospital Event',
      readTime: readTime || '3 min read',
      status: 'published'
    };

    if (isMongoConnected) {
      try {
        // Ensure unique slug
        const existing = await Event.findOne({ slug });
        if (existing) {
          eventPayload.slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }
        const created = await Event.create(eventPayload);
        return res.status(201).json({
          success: true,
          message: 'Event successfully created and published.',
          data: created
        });
      } catch (err) {
        console.error('Error creating event in MongoDB:', err.message);
      }
    }

    // Fallback in-memory
    const memItem = {
      ...eventPayload,
      _id: `evt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    memoryEvents.unshift(memItem);

    return res.status(201).json({
      success: true,
      message: 'Event successfully created and published.',
      data: memItem
    });
  } catch (error) {
    next(error);
  }
};

// 4. UPDATE EVENT (Admin)
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      coverImage,
      location,
      date,
      summary,
      description,
      additionalImages,
      author,
      category,
      readTime
    } = req.body;

    const updates = {};
    if (title && title.trim()) {
      updates.title = title.trim();
      updates.slug = generateSlug(title);
    }
    if (coverImage && coverImage.trim()) updates.coverImage = coverImage.trim();
    if (location && location.trim()) updates.location = location.trim();
    if (date) updates.date = date;
    if (summary && summary.trim()) updates.summary = summary.trim();
    if (description && description.trim()) updates.description = description.trim();
    if (Array.isArray(additionalImages)) {
      updates.additionalImages = additionalImages.map((img) => img.trim()).filter((img) => img.length > 0);
    }
    if (author) updates.author = author.trim();
    if (category) updates.category = category.trim();
    if (readTime) updates.readTime = readTime;

    if (isMongoConnected && id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const updated = await Event.findByIdAndUpdate(id, updates, { new: true });
        if (updated) {
          return res.status(200).json({
            success: true,
            message: 'Event successfully updated.',
            data: updated
          });
        }
      } catch (err) {
        console.error('Error updating event in MongoDB:', err.message);
      }
    }

    // Memory store update
    const memIndex = memoryEvents.findIndex((e) => e._id === id || e.slug === id);
    if (memIndex !== -1) {
      memoryEvents[memIndex] = {
        ...memoryEvents[memIndex],
        ...updates
      };
      return res.status(200).json({
        success: true,
        message: 'Event successfully updated.',
        data: memoryEvents[memIndex]
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Event not found.'
    });
  } catch (error) {
    next(error);
  }
};

// 5. DELETE EVENT (Admin)
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        await Event.findByIdAndDelete(id);
      } catch (err) {
        console.error('Error deleting event from MongoDB:', err.message);
      }
    }

    const memIndex = memoryEvents.findIndex((e) => e._id === id || e.slug === id);
    if (memIndex !== -1) {
      memoryEvents.splice(memIndex, 1);
    }

    return res.status(200).json({
      success: true,
      message: 'Event successfully deleted.'
    });
  } catch (error) {
    next(error);
  }
};
