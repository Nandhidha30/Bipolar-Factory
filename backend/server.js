// bipolar-factory/backend/server.js
// Main entry point for the Bipolar Factory API server

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const productsRouter = require('./routes/products');
const caseStudiesRouter = require('./routes/caseStudies');
const inquiriesRouter = require('./routes/inquiries');
const telemetryRouter = require('./routes/telemetry');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Security Headers ──────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ── CORS — allow the frontend origin ─────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin, local dev servers, or file:// protocols (which pass 'null')
      if (!origin || origin === 'null' || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) return callback(null, true);
      callback(new Error('This origin is not permitted by the server.'));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'X-Session-Id'],
  })
);

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false }));

// ── Request Logging (dev) ─────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Global Rate Limiter ───────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests — please slow down and try again shortly.' },
});
app.use(globalLimiter);

// ── Stricter limiter for form submissions ─────────────────────────────────────
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, error: 'You have submitted too many messages. Please wait an hour and try again.' },
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/products', productsRouter);
app.use('/api/case-studies', caseStudiesRouter);
app.use('/api/inquiries', formLimiter, inquiriesRouter);
app.use('/api/telemetry', telemetryRouter);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Bipolar Factory API is running.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'That API endpoint does not exist.' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  const isDev = process.env.NODE_ENV !== 'production';
  console.error('[SERVER ERROR]', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: isDev ? err.message : 'Something went wrong on our end. Our engineers have been notified.',
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ██████╗ ██╗██████╗  ██████╗ ██╗      █████╗ ██████╗ 
  ██╔══██╗██║██╔══██╗██╔═══██╗██║     ██╔══██╗██╔══██╗
  ██████╔╝██║██████╔╝██║   ██║██║     ███████║██████╔╝
  ██╔══██╗██║██╔═══╝ ██║   ██║██║     ██╔══██║██╔══██╗
  ██████╔╝██║██║     ╚██████╔╝███████╗██║  ██║██║  ██║
  ╚═════╝ ╚═╝╚═╝      ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
  FACTORY — API Server running on port ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

module.exports = app;
