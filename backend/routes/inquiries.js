// bipolar-factory/backend/routes/inquiries.js
// POST /api/inquiries — accepts, validates, and stores contact form submissions

const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const router = express.Router();
const prisma = new PrismaClient();

// Allowed values for the project objective dropdown
const VALID_OBJECTIVES = [
  'purchase_or_demo',     // Buy or demo a ready-made tool
  'hire_for_custom',      // Hire us to build something custom
  'expert_consulting',    // Get expert advice on a business problem
];

// Validation rules for the contact form
const inquiryValidationRules = [
  body('projectObjective')
    .trim()
    .isIn(VALID_OBJECTIVES)
    .withMessage('Please select a valid reason for reaching out from the dropdown.'),

  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address so we can reach you back.'),

  body('message')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Your message must be under 2,000 characters.'),
];

/**
 * POST /api/inquiries
 * Receives a contact form submission, validates the data,
 * and stores it in the database.
 */
router.post('/', inquiryValidationRules, async (req, res) => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: 'Some of your form details need fixing before we can submit.',
      fieldErrors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  const { projectObjective, email, message } = req.body;

  try {
    // Hash the IP address for spam tracking — we never store raw IPs
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const hashedIp = crypto.createHash('sha256').update(rawIp).digest('hex');

    const inquiry = await prisma.inquiry.create({
      data: {
        projectObjective,
        email,
        message: message || null,
        ipAddress: hashedIp,
        userAgent: req.headers['user-agent'] || null,
        status: 'NEW',
      },
      select: {
        id: true,
        projectObjective: true,
        email: true,
        timestamp: true,
        status: true,
      },
    });

    console.log(`[NEW INQUIRY] ID: ${inquiry.id} | Objective: ${inquiry.projectObjective}`);

    return res.status(201).json({
      success: true,
      message: 'Connection Protocol Established Successfully. An Engineer Has Been Dispatched to Your Request.',
      data: {
        referenceId: inquiry.id,
        submittedAt: inquiry.timestamp,
      },
    });
  } catch (error) {
    console.error('[POST /api/inquiries]', error.message);
    return res.status(500).json({
      success: false,
      error: 'We could not save your message right now. Please try again or email us directly.',
    });
  }
});

module.exports = router;
