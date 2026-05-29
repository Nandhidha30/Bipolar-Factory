// bipolar-factory/backend/routes/caseStudies.js
// GET /api/case-studies — returns all verified real-world project achievements

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/case-studies
 * Returns the full list of real-world project stories
 * used to prove what we've actually built.
 */
router.get('/', async (_req, res) => {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        clientName: true,
        projectTitle: true,
        humanBadge: true,
        storyParagraph: true,
        statsJson: true,
        telemetryFact: true,
      },
    });

    // Parse the SQLite JSON string back to an object
    const parsedCaseStudies = caseStudies.map(cs => ({
      ...cs,
      statsJson: typeof cs.statsJson === 'string' ? JSON.parse(cs.statsJson) : cs.statsJson
    }));

    return res.json({
      success: true,
      count: parsedCaseStudies.length,
      data: parsedCaseStudies,
    });
  } catch (error) {
    console.error('[GET /api/case-studies]', error.message);
    return res.status(500).json({
      success: false,
      error: 'We could not load the project stories right now. Please refresh and try again.',
    });
  }
});

module.exports = router;
