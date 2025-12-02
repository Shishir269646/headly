const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler.middleware');
const { notFound } = require('./middlewares/notFound.middleware');
const logger = require('./utils/logger');

const app = express();

// Trust proxy (for rate limiting behind proxy)
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: [
        "https://your-frontend.onrender.com",
        "http://localhost:3000"
    ],
    credentials: true,
}));



// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Sessions and Passport
const session = require('express-session');
const passport = require('passport');
require('./config/passport'); 

app.use(session({
    secret: process.env.SESSION_SECRET || 'session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    }
}));


app.use(passport.initialize());
app.use(passport.session());


// Data sanitization against NoSQL injection
app.use(mongoSanitize());


// HTTP request logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: { write: message => logger.info(message.trim()) }
    }));
}


// Static files - serve uploads directory
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});


// API Routes
app.use('/api', routes);


// Handle 404 errors
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
