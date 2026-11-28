import { News } from '../models/News.js';
import { isMongoConnected } from '../config/db.js';

// Default verified government/hospital notices data for Brahm Shakti Hospital
export const INITIAL_NEWS_NOTICES = [
  {
    id: 'notice-patient-01',
    title: 'Winter Seasonal Respiratory Care & Subsidized OPD Nebulization Desk Notification',
    summary: 'Special winter pediatric and geriatric respiratory desk operational in Block A. Daily nebulization, pulse oximetry, and senior physician consultations available at subsidized trust rates.',
    content: `CIRCULAR REF: BSH/ADM/2026/104
DATE OF ISSUANCE: 22nd November 2026
ISSUED BY: Office of the Medical Superintendent, Brahm Shakti Hospital, Budh Vihar

All patients, outpatients, and visiting families are hereby informed that in view of winter air quality fluctuations and seasonal bronchitis prevalence across North-West Delhi, Brahm Shakti Hospital has instituted a Dedicated Respiratory Support Desk at the Ground Floor OPD Block.

Key Patient Facilities:
1. Subsidized Consultation: Daily OPD assessment by consultant chest physicians and pediatricians between 09:00 AM and 04:00 PM.
2. Rapid Nebulization Suite: Equipped with hospital-grade ultrasonic nebulizers and oxygen concentrators.
3. Priority Senior Citizen Desk: Wheelchair access and zero-wait triage for patients aged 60 and above experiencing acute shortness of breath.
4. 24x7 Emergency Casualty: Round-the-clock emergency admission and nebulization available via Emergency Desk (Tel: 7982897603 / 8423934205 / 6388554517).

For further assistance, please contact the Main Hospital Reception or consult the Desk Officer at Counter 4.`,
    category: 'Patient Advisory',
    refNumber: 'BSH/ADM/2026/104',
    audience: 'patients',
    targetDoctorIds: [],
    targetDoctorNames: [],
    date: '2026-11-22',
    isPinned: true,
    isNewBadge: true,
    status: 'published',
    author: 'Medical Superintendent Office',
    readTime: '2 min read'
  },
  {
    id: 'notice-patient-02',
    title: 'Ayushman Bharat (PM-JAY) & Delhi Arogya Kosh (DAK) Cashless Helpdesk Operational Hours',
    summary: 'Designated Ayushman Mitras available 24x7 at the Cashless Triage Counter. Pre-authorization guidelines for tertiary surgical procedures and critical care admissions.',
    content: `CIRCULAR REF: BSH/GOV/2026/098
DATE OF ISSUANCE: 18th November 2026
ISSUED BY: Department of Government Empanelment & Public Welfare, Brahm Shakti Hospital

Brahm Shakti Hospital reaffirms its commitment to providing accessible, cashless healthcare under Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY) and Delhi Arogya Kosh (DAK).

Beneficiary Guidelines:
- Beneficiaries must present their active PM-JAY Golden Card or DAK allotment certificate along with Aadhaar authentication at Counter 2.
- Dedicated Ayushman Mitras will complete digital biometric verification and initiate real-time pre-authorization with the National Health Authority (NHA) within 45 minutes of admission.
- Covered specialties include General & Laparoscopic Surgery, Orthopedics & Joint Trauma, Dialysis & Nephrology, ICU/HDU Care, and Obstetrics & Gynecology.

Helpdesk Contact: 7840089703 (Ayushman Desk / Trauma Triage).`,
    category: 'Public Notice',
    refNumber: 'BSH/GOV/2026/098',
    audience: 'patients',
    targetDoctorIds: [],
    targetDoctorNames: [],
    date: '2026-11-18',
    isPinned: true,
    isNewBadge: true,
    status: 'published',
    author: 'Government Schemes Liaison Desk',
    readTime: '3 min read'
  },
  {
    id: 'notice-patient-03',
    title: 'Revised Morning & Evening OPD Consultation Timings for Winter Session 2026',
    summary: 'Clinical consultation schedule updated across General Medicine, General Surgery, Pediatrics, Orthopedics, and Gynecology departments.',
    content: `CIRCULAR REF: BSH/OPD/2026/091
DATE OF ISSUANCE: 15th November 2026
ISSUED BY: Director Clinical Services, Brahm Shakti Hospital

To optimize patient comfort and minimize early-morning chill exposure for infants and elderly visitors, OPD consultation hours have been revised as follows, effective immediately:

- Morning OPD Session: 09:30 AM to 01:30 PM (Monday through Saturday)
- Evening OPD Session: 04:30 PM to 07:30 PM (Monday through Saturday)
- Sunday Specialty Clinics: 10:00 AM to 01:00 PM (Cardiology, Diabetology & Pediatrics)
- Emergency Casualty & Trauma Ward: Functioning 24 Hours / 7 Days continuously.

Digital appointment tokens can be scheduled via our official online booking portal or by calling our desk at 7982897603 / 8423934205 / 6388554517.`,
    category: 'OPD Schedule',
    refNumber: 'BSH/OPD/2026/091',
    audience: 'patients',
    targetDoctorIds: [],
    targetDoctorNames: [],
    date: '2026-11-15',
    isPinned: false,
    isNewBadge: false,
    status: 'published',
    author: 'Clinical Administration',
    readTime: '2 min read'
  },
  {
    id: 'notice-patient-04',
    title: 'Free Weekly Community Diabetes & Hypertension Screening Camp Every Sunday',
    summary: 'Complimentary blood sugar, HbA1c screening, blood pressure monitoring, and nutritionist consultations for local residents of Budh Vihar and Rohini.',
    content: `CIRCULAR REF: BSH/WLF/2026/085
DATE OF ISSUANCE: 10th November 2026
ISSUED BY: Community Health Outreach Division, Brahm Shakti Trust

Under the philanthropic banner of Brahm Shakti Trust, the hospital will conduct a Free Preventive Diabetes & Hypertension Camp on every Sunday throughout November and December 2026.

Camp Venue: Main OPD Foyer, Brahm Shakti Hospital, U-1/78, Budh Vihar, Main Kanjhawala Road, Delhi-110086.
Timings: 09:00 AM to 01:00 PM.
Free Deliverables: Random Blood Sugar Test, BP checkup, BMI calculation, and diet counseling by certified nutritionists. No registration fee required.`,
    category: 'Health Campaign',
    refNumber: 'BSH/WLF/2026/085',
    audience: 'patients',
    targetDoctorIds: [],
    targetDoctorNames: [],
    date: '2026-11-10',
    isPinned: false,
    isNewBadge: false,
    status: 'published',
    author: 'Brahm Shakti Trust Board',
    readTime: '2 min read'
  },
  {
    id: 'notice-doctor-01',
    title: 'Mandatory Implementation of National Antimicrobial Stewardship (AMSP) Protocols',
    summary: 'Clinical guidelines on restricted antimicrobial formulary, double sign-off for carbapenems, and weekly departmental antibiotic utilization audits.',
    content: `CIRCULAR REF: BSH/CLI/2026/112
DATE OF ISSUANCE: 20th November 2026
TARGET AUDIENCE: All Consultant Doctors, Senior Residents & Duty Medical Officers
ISSUED BY: Hospital Infection Control Committee (HICC) & Academic Board

In alignment with National Centre for Disease Control (NCDC) and DMC recommendations, all prescribing clinicians are directed to strictly adhere to the updated Brahm Shakti Antimicrobial Formulary:

1. Category 'Reserve' Antibiotics (Colistin, Meropenem, Polymyxin B) require pre-authorization sign-off by the HICC Chairperson or Head of Internal Medicine.
2. Blood and culture specimens must be drawn before initiating broad-spectrum empirical therapy in all surgical ICU admissions.
3. De-escalation or cessation of empirical antimicrobials must occur within 48 to 72 hours based on microbiology sensitivity reports.
4. Compliance will be monitored through randomized bi-weekly case audits presented at the Departmental Mortality & Morbidity forum.`,
    category: 'Clinical Advisory',
    refNumber: 'BSH/CLI/2026/112',
    audience: 'doctors',
    targetDoctorIds: [],
    targetDoctorNames: [],
    date: '2026-11-20',
    isPinned: true,
    isNewBadge: true,
    status: 'published',
    author: 'HICC & Academic Board',
    readTime: '3 min read'
  },
  {
    id: 'notice-doctor-02',
    title: 'Monthly Institutional Mortality & Morbidity (M&M) Review Meeting - November 2026',
    summary: 'Mandatory clinical governance assembly scheduled for Friday, 28th November at 04:00 PM in the Hospital Board Room. Case presentations by Surgery and ICU teams.',
    content: `CIRCULAR REF: BSH/MED/2026/108
DATE OF ISSUANCE: 16th November 2026
TARGET AUDIENCE: All Departmental HODs, Consultants and Senior Residents
ISSUED BY: Chairperson, Medical Advisory Council

The institutional Clinical Audit and Mortality & Morbidity (M&M) Review for the month of November will take place on:
- Date: Friday, 28th November 2026
- Time: 04:00 PM to 05:30 PM Sharp
- Venue: Hospital Conference Hall / Board Room, 4th Floor
- Agenda:
  1. Review of critical ICU transfer protocols and ventilator bundle compliance.
  2. Laparoscopic surgery complication audit presented by Surgical Sciences.
  3. Discussion of clinical documentation completeness for statutory audits.

Attendance is mandatory for all senior clinicians. Kindly ensure clinical duties are handed over to designated cover officers.`,
    category: 'Administrative Circular',
    refNumber: 'BSH/MED/2026/108',
    audience: 'doctors',
    targetDoctorIds: [],
    targetDoctorNames: [],
    date: '2026-11-16',
    isPinned: false,
    isNewBadge: true,
    status: 'published',
    author: 'Medical Advisory Council',
    readTime: '2 min read'
  },
  {
    id: 'notice-specific-doctor-01',
    title: 'Departmental Clinical Audit: Diabetic Foot Triage & Vascular Intervention Protocol',
    summary: 'Direct clinical advisory regarding multidisciplinary vascular & diabetology protocols for high-risk diabetic ulcers.',
    content: `CIRCULAR REF: BSH/CONF/2026/045
DATE OF ISSUANCE: 14th November 2026
TARGET AUDIENCE: Department of Internal Medicine & Surgical Faculty
ISSUED BY: Chief Medical Officer

This specific clinical advisory is issued for the attention of senior clinicians managing diabetic vascular complications.
Following inter-departmental consensus, all grade 3 and 4 diabetic foot lesions admitted to the surgical wing will undergo immediate glycemic stabilization and Doppler vascular mapping within 6 hours of presentation.`,
    category: 'Departmental Directive',
    refNumber: 'BSH/CONF/2026/045',
    audience: 'specific_doctors',
    targetDoctorIds: ['doc-01', 'doc-sk-goyal', 'doc-02', 'doc-nishant-verma'],
    targetDoctorNames: ['Dr. S. K. Goyal', 'Dr. Nishant Verma (Neuro Sergion)', 'Dr. Nishant Verma (Cardio)'],
    date: '2026-11-14',
    isPinned: false,
    isNewBadge: false,
    status: 'published',
    author: 'Chief Medical Officer',
    readTime: '2 min read'
  },
  {
    id: 'notice-all-01',
    title: 'Disaster Preparedness & 24x7 Emergency Trauma Triage Readiness Order',
    summary: 'Annual review of disaster casualty ramp, oxygen storage tanks, and backup electrical generation verification completed with 100% statutory clearance.',
    content: `CIRCULAR REF: BSH/SAF/2026/001
DATE OF ISSUANCE: 01st November 2026
TARGET AUDIENCE: All Staff, Patients, Medical Officers and Visitors
ISSUED BY: Managing Trustee & Hospital Quality Directorate

Brahm Shakti Hospital has successfully completed its annual statutory fire, electrical, and clinical disaster preparedness drill under Delhi Fire Service (DFS) and statutory authorities.
All central oxygen supplies, ICU backup generators, and trauma resuscitation suites have been certified fully operational with zero downtime redundancy. Emergency Casualty Helpline: 7840089703.`,
    category: 'Statutory Notice',
    refNumber: 'BSH/SAF/2026/001',
    audience: 'all',
    targetDoctorIds: [],
    targetDoctorNames: [],
    date: '2026-11-01',
    isPinned: false,
    isNewBadge: false,
    status: 'published',
    author: 'Hospital Quality Directorate',
    readTime: '2 min read'
  }
];

// In-memory cache for fallback when MongoDB is unavailable
let memoryNews = [...INITIAL_NEWS_NOTICES];

export const getNews = async (req, res, next) => {
  try {
    const { category, audience, doctorId, allAudience } = req.query;

    if (isMongoConnected) {
      let query = { status: { $ne: 'archived' } };

      // Category filter
      if (category && category !== 'all') {
        query.category = new RegExp(category, 'i');
      }

      // Audience filtering logic
      if (!allAudience || allAudience === 'false') {
        if (audience === 'patients') {
          // Public / Patient views: only show news intended for patients or all
          query.audience = { $in: ['patients', 'all'] };
        } else if (audience === 'doctors') {
          // Doctor view: show news for doctors, all, and specific_doctors targeted to this doctor
          const doctorConditions = [{ audience: { $in: ['doctors', 'all'] } }];
          if (doctorId) {
            doctorConditions.push({
              audience: 'specific_doctors',
              targetDoctorIds: doctorId
            });
          }
          query.$or = doctorConditions;
        } else if (audience === 'specific_doctors') {
          query.audience = 'specific_doctors';
          if (doctorId) {
            query.targetDoctorIds = doctorId;
          }
        }
      }

      const dbNews = await News.find(query).sort({ isPinned: -1, createdAt: -1 });
      if (dbNews && dbNews.length > 0) {
        return res.status(200).json({
          success: true,
          count: dbNews.length,
          source: 'mongodb',
          data: dbNews
        });
      }
    }

    // Fallback in-memory dataset
    let filtered = [...memoryNews].filter((n) => n.status !== 'archived');

    if (category && category !== 'all') {
      filtered = filtered.filter((n) =>
        (n.category || '').toLowerCase().includes(category.toLowerCase())
      );
    }

    if (!allAudience || allAudience === 'false') {
      if (audience === 'patients') {
        filtered = filtered.filter((n) => n.audience === 'patients' || n.audience === 'all');
      } else if (audience === 'doctors') {
        filtered = filtered.filter((n) => {
          if (n.audience === 'doctors' || n.audience === 'all') return true;
          if (n.audience === 'specific_doctors') {
            if (!doctorId) return true;
            return (
              Array.isArray(n.targetDoctorIds) &&
              n.targetDoctorIds.some((id) => id.toLowerCase().includes(doctorId.toLowerCase()))
            );
          }
          return false;
        });
      } else if (audience === 'specific_doctors') {
        filtered = filtered.filter((n) => {
          if (n.audience !== 'specific_doctors') return false;
          if (!doctorId) return true;
          return (
            Array.isArray(n.targetDoctorIds) &&
            n.targetDoctorIds.some((id) => id.toLowerCase().includes(doctorId.toLowerCase()))
          );
        });
      }
    }

    // Sort by pinned first, then date descending
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0);
    });

    return res.status(200).json({
      success: true,
      count: filtered.length,
      source: 'verified_dataset',
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};

export const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const item = await News.findOne({
        $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
      if (item) {
        return res.status(200).json({ success: true, data: item });
      }
    }

    const item = memoryNews.find((n) => n.id === id || n._id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const createNews = async (req, res, next) => {
  try {
    const {
      title,
      summary,
      content,
      category,
      audience,
      targetDoctorIds,
      targetDoctorNames,
      date,
      refNumber,
      isPinned,
      isNewBadge,
      status,
      author
    } = req.body;

    if (!title || !summary) {
      return res.status(400).json({
        success: false,
        message: 'Title and Summary are required fields for hospital circulars'
      });
    }

    const newId = `notice-${Date.now()}`;
    const generatedRef =
      refNumber || `BSH/${(category || 'PUB').substring(0, 3).toUpperCase()}/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`;

    const noticeData = {
      id: newId,
      title: title.trim(),
      summary: summary.trim(),
      content: content ? content.trim() : summary.trim(),
      category: category || 'Public Notice',
      audience: audience || 'all',
      targetDoctorIds: Array.isArray(targetDoctorIds) ? targetDoctorIds : [],
      targetDoctorNames: Array.isArray(targetDoctorNames) ? targetDoctorNames : [],
      date: date || new Date().toISOString().split('T')[0],
      refNumber: generatedRef,
      isPinned: Boolean(isPinned),
      isNewBadge: isNewBadge !== undefined ? Boolean(isNewBadge) : true,
      status: status || 'published',
      author: author || 'Brahm Shakti Hospital Administration'
    };

    if (isMongoConnected) {
      const created = await News.create(noticeData);
      return res.status(201).json({
        success: true,
        message: 'Notice circular created and distributed successfully',
        data: created
      });
    }

    memoryNews.unshift(noticeData);
    return res.status(201).json({
      success: true,
      message: 'Notice circular saved in verified dataset',
      data: noticeData
    });
  } catch (error) {
    next(error);
  }
};

export const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (isMongoConnected) {
      const updated = await News.findOneAndUpdate(
        { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        updates,
        { new: true }
      );
      if (updated) {
        return res.status(200).json({
          success: true,
          message: 'Notice circular updated successfully',
          data: updated
        });
      }
    }

    const idx = memoryNews.findIndex((n) => n.id === id || n._id === id);
    if (idx !== -1) {
      memoryNews[idx] = { ...memoryNews[idx], ...updates };
      return res.status(200).json({
        success: true,
        message: 'Notice circular updated in memory',
        data: memoryNews[idx]
      });
    }

    return res.status(404).json({ success: false, message: 'Notice circular not found' });
  } catch (error) {
    next(error);
  }
};

export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const deleted = await News.findOneAndDelete({
        $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
      if (deleted) {
        return res.status(200).json({
          success: true,
          message: 'Notice circular deleted successfully'
        });
      }
    }

    const idx = memoryNews.findIndex((n) => n.id === id || n._id === id);
    if (idx !== -1) {
      memoryNews.splice(idx, 1);
      return res.status(200).json({
        success: true,
        message: 'Notice circular removed successfully'
      });
    }

    return res.status(404).json({ success: false, message: 'Notice circular not found' });
  } catch (error) {
    next(error);
  }
};
