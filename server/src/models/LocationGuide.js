import mongoose from 'mongoose';

const locationGuideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Location, Directions & How to Reach Brahm Shakti Hospital Delhi'
    },
    slug: {
      type: String,
      default: 'location-and-directions'
    },
    author: {
      type: String,
      default: 'Brahm Shakti Hospital Administration'
    },
    date: {
      type: String,
      default: '2026-01-16'
    },
    overview: {
      type: String,
      default:
        'Brahm Shakti Hospital is situated in the Budh Vihar, Rohini zone of North-West Delhi, providing easy access to nearby localities and institutions through various multi-modal transportation systems.'
    },
    address: {
      type: String,
      default: 'Pocket C, Budh Vihar Phase I, Pooth Kurd, New Delhi, Delhi, 110085'
    },
    coordinates: {
      type: String,
      default: '28.7199° North --- 77.0675° East'
    },
    mapEmbedUrl: {
      type: String,
      default:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.9754714488344!2d77.06745197631726!3d28.719894475619106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d06f6bf53bc47%3A0xe53be0c8fc0283f3!2sBrahm%20Shakti%20Hospital!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
    },
    googleMapsUrl: {
      type: String,
      default: 'https://maps.google.com/?q=Brahm+Shakti+Hospital+Budh+Vihar+New+Delhi'
    },
    prominentLocalities: {
      type: [String],
      default: [
        'Budh Vihar Phase I & II',
        'Rohini (Sectors 20, 21, 22, 23, 24, 25)',
        'Pooth Kurd & Sultanpuri',
        'Mangolpuri & Nangloi',
        'Pitampura & Prashant Vihar'
      ]
    },
    prominentInstitutions: {
      type: [String],
      default: [
        'Udyog Nagar Metro Station (Green Line)',
        'Rithala Metro Station (Red Line)',
        'Rohini District Court Complex',
        'Delhi Institute of Rural Development (DIRD)',
        'Bal Bharati Public School Rohini Area'
      ]
    },
    roadAccess: {
      type: String,
      default:
        'Easily reached from Outer Ring Road (via Rohini Sector 22/24 flyover) and Rohtak Road (NH-10 via Peeragarhi/Nangloi). Connected directly via Main Budh Vihar Kanjhawala Road.'
    },
    metroConnectivity: {
      type: String,
      default:
        'Delhi Metro provides fast and affordable connectivity to Brahm Shakti Hospital. Nearest metro stations are Udyog Nagar Metro Station (Green Line, ~1.8 km) and Rithala Metro Station (Red Line, ~3.5 km). Continuous shared e-rickshaws, autos, and feeder buses are stationed outside both metro gates.'
    },
    busConnectivity: {
      type: String,
      default:
        'Delhi Transport Corporation (DTC) and cluster bus routes frequently halt at Budh Vihar Main Bus Stop. Direct DTC routes include 940, 972, 114, 990, and 990A connecting to Old Delhi, Central Secretariat, and ISBT Kashmere Gate.'
    },
    cabConnectivity: {
      type: String,
      default:
        '24x7 cab services including Ola, Uber, and city metered taxis operate round-the-clock with a dedicated drop-off point right at the hospital emergency casualty and main reception porch.'
    },
    railwaysConnectivity: {
      type: String,
      default:
        '• New Delhi Railway Station (NDLS): 18 km (direct metro via Red/Yellow Line interchange or 35 mins by cab)\n• Old Delhi Railway Station (DLI): 17 km\n• Hazrat Nizamuddin Railway Station: 24 km\n• Shakur Basti Railway Station: 8 km (nearest suburban rail link)'
    },
    airportConnectivity: {
      type: String,
      default:
        'Indira Gandhi International Airport (IGI - Terminal 1 & 3): ~22 km. Connected directly via Outer Ring Road or through Delhi Metro Airport Express with interchange at New Delhi / Green Line.'
    }
  },
  { timestamps: true }
);

export const LocationGuide = mongoose.model('LocationGuide', locationGuideSchema);
export default LocationGuide;
