const Message = require('./messageModel');
const User = require('../auth/userModel');

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
            include: [{ model: User, as: 'sender', attributes: ['name', 'email'] }]
        });

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
            include: [{ model: User, as: 'sender', attributes: ['name', 'email'] }],
            order: [['createdAt', 'ASC']]
        });

        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los mensajes.' });
    }
};
