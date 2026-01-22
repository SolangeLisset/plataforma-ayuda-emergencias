const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../auth/userModel');

const Need = sequelize.define('Need', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING, // Values from config (FOOD, WATER, etc.)
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'IN_PROCESS', 'FULFILLED'),
        defaultValue: 'PENDING',
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    commune: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.FLOAT,
    },
    longitude: {
        type: DataTypes.FLOAT,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    verifiedBy: {
        type: DataTypes.UUID, // User ID of the admin who verified
        allowNull: true,
    },
    petStatus: {
        type: DataTypes.ENUM('SEARCHING', 'FOUND', 'REUNITED'),
        allowNull: true,
    },
    contactName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contactPhone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

Need.belongsTo(User, { as: 'requester', foreignKey: 'userId', constraints: false });
User.hasMany(Need, { foreignKey: 'userId', constraints: false });

module.exports = Need;
