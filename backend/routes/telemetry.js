// bipolar-factory/backend/routes/telemetry.js
// POST /api/telemetry — logs user hover/click interactions without slowing down the UI

const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const VALID_EVENT_TYPES = ['hover', 'click', 'view'];

const telemetryValidationRules = [
  body('eventType').trim().isIn(VALID_EVENT_TYPES).withMessage('Invalid event type.'),
  body('elementId').trim().notEmpty().isLength({ max: 100 }).withMessage('Element ID is required.'),
  body('elementName').trim().notEmpty().isLength({ max: 200 }).withMessage('Element name is required.'),
  body('sessionId').optional().trim().isLength({ max: 128 }),
];

/**
 * POST /api/telemetry
 * Lightweight endpoint that records a user interaction event.
 * Returns 204 No Content on success to keep the response tiny and fast.
 */
router.post('/', telemetryValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Still return success — we don't want telemetry failures to block UI
    return res.json({ success: true });
  }

  const { eventType, elementId, elementName, sessionId } = req.body;

  // Fire-and-forget — we respond immediately and write to DB asynchronously
  res.json({ success: true });

  // Write to database in background (non-blocking)
  setImmediate(async () => {
    try {
      await prisma.telemetryLog.create({
        data: {
          eventType,
          elementId,
          elementName,
          sessionId: sessionId || null,
        },
      });
    } catch (error) {
      // Silently log telemetry DB errors — never let these affect the user
      console.error('[TELEMETRY LOG ERROR]', error.message);
    }
  });
});

/**
 * GET /api/telemetry/summary
 * Returns a simple count summary of interactions per element.
 * Useful for an internal dashboard.
 */
router.get('/summary', async (_req, res) => {
  try {
    const summary = await prisma.telemetryLog.groupBy({
      by: ['elementId', 'elementName', 'eventType'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 50,
    });

    return res.json({
      success: true,
      data: summary.map((s) => ({
        elementId: s.elementId,
        elementName: s.elementName,
        eventType: s.eventType,
        count: s._count.id,
      })),
    });
  } catch (error) {
    console.error('[GET /api/telemetry/summary]', error.message);
    return res.status(500).json({ success: false, error: 'Could not load telemetry summary.' });
  }
});

module.exports = router;
