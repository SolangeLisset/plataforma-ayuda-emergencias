const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./config/database');

// Routes
const authRoutes = require('./features/auth/authRoutes');
const needRoutes = require('./features/needs/needRoutes');
const donationRoutes = require('./features/donations/donationRoutes');
const messageRoutes = require('./features/messages/messageRoutes');
const announcementRoutes = require('./features/announcements/announcementRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/needs', needRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/announcements', announcementRoutes);

// Config endpoint for frontend
app.get('/api/config', (req, res) => {
    // Read from the shared config file
    const config = require('../../config/disaster-config.json');
    res.json(config);
});

// Database Sync & Server Start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Sync models (in production usage migrations instead of sync)
        // await sequelize.sync({ force: false }); // Don't force in prod
        // For development, to create tables:
        await sequelize.sync({ alter: true });
        console.log('Models synced...');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

startServer();
