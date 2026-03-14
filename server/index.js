require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const videoRoutes = require('./routes/videoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'uncovered-session-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/videos', videoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'UNCOVERED' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`UNCOVERED server running on port ${PORT}`);
});
