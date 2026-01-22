const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../auth/userModel');
const Need = require('../needs/needModel');

const Donation = sequelize.define('Donation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    type: {
        type: DataTypes.ENUM('MONEY', 'GOODS', 'SERVICE'),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2), // For money donations
    },
    status: {
        type: DataTypes.ENUM('OFFERED', 'COMMITTED', 'DELIVERED'),
        defaultValue: 'OFFERED',
    },
});

Donation.belongsTo(User, { as: 'donor', foreignKey: 'donorId' });
User.hasMany(Donation, { foreignKey: 'donorId' });

Donation.belongsTo(Need, { as: 'linkedNeed', foreignKey: 'needId' }); // Optional: Link to specific need
Need.hasMany(Donation, { foreignKey: 'needId' });

module.exports = Donation;
