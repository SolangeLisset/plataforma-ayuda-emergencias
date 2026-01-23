const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../auth/userModel');
const Need = require('../needs/needModel');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    needId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    senderId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
User.hasMany(Message, { foreignKey: 'senderId' });

Message.belongsTo(Need, { as: 'need', foreignKey: 'needId' });
Need.hasMany(Message, { foreignKey: 'needId' });

module.exports = Message;
