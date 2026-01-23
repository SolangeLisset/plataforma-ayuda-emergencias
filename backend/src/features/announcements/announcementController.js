const Announcement = require('./announcementModel');
const { Op } = require('sequelize');

exports.getAnnouncements = async (req, res) => {
    try {
        const now = new Date();
        const announcements = await Announcement.findAll({
            where: {
                isActive: true,
                [Op.or]: [
                    { expiresAt: null },
                    { expiresAt: { [Op.gt]: now } }
                ]
            },
            order: [['type', 'DESC'], ['createdAt', 'DESC']]
        });
        res.json(announcements);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener anuncios.' });
    }
};

exports.createAnnouncement = async (req, res) => {
    try {
        const { title, content, type, expiresAt, isActive } = req.body;
        const announcement = await Announcement.create({
            title,
            content,
            type,
            expiresAt,
            isActive: isActive !== undefined ? isActive : true
        });
        res.status(201).json(announcement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear anuncio.' });
    }
};

exports.updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, type, expiresAt, isActive } = req.body;

        let announcement = await Announcement.findByPk(id);
        if (!announcement) return res.status(404).json({ error: 'Anuncio no encontrado.' });

        announcement.title = title || announcement.title;
        announcement.content = content || announcement.content;
        announcement.type = type || announcement.type;
        announcement.expiresAt = expiresAt !== undefined ? expiresAt : announcement.expiresAt;
        announcement.isActive = isActive !== undefined ? isActive : announcement.isActive;

        await announcement.save();
        res.json(announcement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar anuncio.' });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement.findByPk(id);
        if (!announcement) return res.status(404).json({ error: 'Anuncio no encontrado.' });

        await announcement.destroy();
        res.json({ msg: 'Anuncio eliminado correctamente.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar anuncio.' });
    }
};
