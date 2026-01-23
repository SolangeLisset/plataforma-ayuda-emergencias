const Message = require('./messageModel');
const User = require('../auth/userModel');
const Need = require('../needs/needModel');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
    try {
        const { needId, content } = req.body;
        const senderId = req.user.id;

        if (!content || content.trim() === '') {
            return res.status(400).json({ error: 'El contenido del mensaje no puede estar vacío.' });
        }

        const message = await Message.create({
            needId,
            senderId,
            content
        });

        const fullMessage = await Message.findByPk(message.id, {
            include: [{ model: User, as: 'sender', attributes: ['fullName', 'email'] }]
        });

        // Emit socket event
        const io = req.app.get('io');
        io.to(`need_${needId}`).emit('new_message', fullMessage);

        res.status(201).json(fullMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al enviar el mensaje.' });
    }
};

exports.getMessagesByNeed = async (req, res) => {
    try {
        const { needId } = req.params;

        const messages = await Message.findAll({
            where: { needId },
            include: [{ model: User, as: 'sender', attributes: ['fullName', 'email'] }],
            order: [['createdAt', 'ASC']]
        });

        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los mensajes.' });
    }
};

exports.getUserConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Find all needs where the user is either the requester OR has sent a message
        const needsInvolved = await Message.findAll({
            attributes: ['needId'],
            where: { senderId: userId },
            group: ['needId']
        });

        const needIdsFromMessages = needsInvolved.map(m => m.needId);

        const myNeeds = await Need.findAll({
            attributes: ['id'],
            where: { userId }
        });
        const myNeedIds = myNeeds.map(n => n.id);

        const allInvolvedNeedIds = [...new Set([...needIdsFromMessages, ...myNeedIds])];

        if (allInvolvedNeedIds.length === 0) {
            return res.json([]);
        }

        // 2. For each involved need, get the latest message and need details
        // Note: For large scale, this should be an optimized raw query or a more complex sequelize query.
        // For our MVP, we can iterate or use a group/max query.

        const conversations = await Promise.all(allInvolvedNeedIds.map(async (needId) => {
            const lastMessage = await Message.findOne({
                where: { needId },
                include: [{ model: User, as: 'sender', attributes: ['fullName'] }],
                order: [['createdAt', 'DESC']]
            });

            const need = await Need.findByPk(needId, {
                attributes: ['id', 'title', 'status', 'type', 'userId']
            });

            if (!need) return null;

            if (!lastMessage && need.userId === userId) {
                // User owns the need but no messages yet
                return {
                    needId,
                    needTitle: need.title,
                    needStatus: need.status,
                    needType: need.type,
                    lastMessage: null,
                    updatedAt: need.createdAt // Use need creation date as fallback
                };
            }

            if (!lastMessage) return null;

            return {
                needId,
                needTitle: need.title,
                needStatus: need.status,
                needType: need.type,
                lastMessage: lastMessage.content,
                lastSender: lastMessage.sender?.fullName,
                updatedAt: lastMessage.createdAt
            };
        }));

        const filteredConversations = conversations
            .filter(c => c !== null)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        res.json(filteredConversations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las conversaciones.' });
    }
};
