// bipolar-factory/backend/prisma/seed.js
// Run this once to fill the database with initial data: `node prisma/seed.js`

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Bipolar Factory database...');

  // --- PRODUCTS ---
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: [
      {
        name: 'OLY Store Sync',
        humanLabel: 'Retail Security Organizer',
        description:
          'Connects to your existing store security cameras to show you where people walk, how long they look at items, and what makes them buy. Includes smart alerts for theft protection, fire detection, and automated heat maps.',
        featuresArray: JSON.stringify([
          'Live customer movement heat maps',
          'AI-powered theft alert system',
          'Fire & smoke detection',
          'Dwell-time analytics per shelf zone',
          'Works with cameras you already own',
          'Daily PDF summary reports',
        ]),
        siteUrl: 'https://oly.store',
        accentColor: '#FF0066',
        iconSlug: 'store-sync',
        sortOrder: 1,
      },
      {
        name: 'OLY Control Center',
        humanLabel: 'Multi-Video Security Wall',
        description:
          'A central live monitoring dashboard built for heavy security teams. It allows you to watch hundreds of live camera feeds smoothly at the exact same time without the system slowing down or crashing.',
        featuresArray: JSON.stringify([
          'Watch 200+ camera streams at once',
          'Zero-lag video rendering engine',
          'Custom grid layout builder',
          'Instant alert escalation system',
          'One-click camera grouping by zone',
          'On-premise or cloud deployment',
        ]),
        siteUrl: null,
        accentColor: '#FF0066',
        iconSlug: 'control-center',
        sortOrder: 2,
      },
      {
        name: 'Metawood',
        humanLabel: 'Fair Digital Video Platform',
        description:
          'A 3D virtual reality video and streaming platform built for creators and production houses to run live events and concerts. It cuts out greedy middlemen so artists keep 100% of what they earn directly from fans.',
        featuresArray: JSON.stringify([
          '3D immersive virtual venue builder',
          'Direct artist-to-fan payment system',
          '0% platform cut on ticket revenue',
          'HD & 4K live stream support',
          'Interactive virtual crowd rooms',
          'Global CDN for zero-buffer playback',
        ]),
        siteUrl: 'https://metawood.live',
        accentColor: '#FF0066',
        iconSlug: 'metawood',
        sortOrder: 3,
      },
    ],
  });
  console.log('✅ Products seeded');

  // --- CASE STUDIES ---
  await prisma.caseStudy.deleteMany();
  await prisma.caseStudy.createMany({
    data: [
      {
        clientName: 'State Election Commission of Bihar',
        projectTitle: 'Automated Vote Count Reader',
        humanBadge: 'AUTOMATED VOTE COUNTING',
        storyParagraph:
          'To stop human counting mistakes, we built a physical stand with a smart camera reading system that looked at digital voting machine screens, read the digits live using AI, and pushed results to a public tracking website in under 7 seconds.',
        statsJson: JSON.stringify({
          machines_scanned: 4620,
          accuracy: '100%',
          result_publish_time: 'under 7 seconds',
          human_errors_prevented: 4620,
          deployment: 'State-wide, Bihar India',
        }),
        telemetryFact:
          'System Insight: This camera-reading engine scanned 4,620 separate digital machines with 100% digit-recognition accuracy.',
        sortOrder: 1,
      },
      {
        clientName: 'Election Commission of India (Kerala)',
        projectTitle: 'Statewide Booth Live-Stream Network',
        humanBadge: '20,000+ BOOTH SAFETY WATCH',
        storyParagraph:
          'Built a custom desktop application used to live-stream video across 20,000+ voting booths for 150,000 hours straight without a single second of lag, ensuring election rules were followed perfectly.',
        statsJson: JSON.stringify({
          booths_covered: 20000,
          continuous_stream_hours: 150000,
          downtime_seconds: 0,
          state: 'Kerala, India',
          deployment_type: 'Custom desktop application',
        }),
        telemetryFact:
          'System Insight: This streaming engine ran for 150,000 continuous hours across 20,000+ locations — zero crashes, zero dropped frames.',
        sortOrder: 2,
      },
      {
        clientName: 'Industrial Operations — WoTA & Zigma',
        projectTitle: 'Factory Logistics & Recycling Tracker',
        humanBadge: 'FACTORY LOGISTICS ENGINES',
        storyParagraph:
          'From building indoor location-tracking grids (like Google Maps for the inside of a textile factory floor) to creating nationwide tracking portals to log exactly how much plastic trash a recycling firm processes, we build tools that handle real operational pressure.',
        statsJson: JSON.stringify({
          tracking_precision: 'Sub-meter indoor accuracy',
          industries: ['Textile Manufacturing', 'Plastic Recycling'],
          clients: ['WoTA', 'Zigma'],
          scale: 'Nationwide portal deployment',
          tech: 'UWB sensor grid + custom web portal',
        }),
        telemetryFact:
          'System Insight: The indoor tracker pinpoints worker and asset positions inside a factory to within 30 centimeters — no GPS needed.',
        sortOrder: 3,
      },
    ],
  });
  console.log('✅ Case studies seeded');

  console.log('🎉 Database seeding complete. Bipolar Factory is live.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
