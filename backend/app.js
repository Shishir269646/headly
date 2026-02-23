const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo').default; 
const passport = require('passport');
const path = require('path');
const fs = require('fs');

const routes = require('./routes');
const logger = require('./utils/logger');
const { errorHandler } = require('./middlewares/errorHandler.middleware');
const { notFound } = require('./middlewares/notFound.middleware');

require('./config/passport');

const app = express();

/* ===============================
   Trust Proxy (Important for Render / Vercel)
================================ */
app.set('trust proxy', 1);

/* ===============================
   Security
================================ */
app.use(helmet());

app.use(cors({
    origin: [
        "https://headly-nine.vercel.app",
        "http://localhost:3000",
    ],
    credentials: true,
}));

/* ===============================
   Body & Cookies
================================ */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET)); // ✅ same secret

/* ===============================
   Mongo Session Store
================================ */
let sessionStore;
if (process.env.NODE_ENV === 'test') {
    // Use in-memory store for tests to avoid external Mongo dependencies
    sessionStore = new session.MemoryStore();
} else {
    sessionStore = MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
        ttl: 60 * 60 * 24,
        autoRemove: 'native',
    });
}

/* ===============================
   Session
================================ */
app.use(session({
    name: 'headly.sid',
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    proxy: true, // ✅ important when using trust proxy
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // ✅ auto detect
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24,
    }
}));

/* ===============================
   Passport
================================ */
app.use(passport.initialize());
app.use(passport.session());

/* ===============================
   Sanitize
================================ */
app.use(mongoSanitize());

/* ===============================
   Logger
================================ */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: { write: msg => logger.info(msg.trim()) }
    }));
}

/* ===============================
   Uploads
================================ */
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

/* ===============================
   Health Check
================================ */
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

/* ===============================
   Routes
================================ */
app.use('/api', routes);

/* ===============================
   Errors
================================ */
app.use(notFound);
app.use(errorHandler);

module.exports = app;