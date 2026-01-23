const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Need = require('./needModel');
const User = require('../auth/userModel');

exports.createNeed = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Anti-fraud: Rate Limiting (Simple)
        // Check if user has created > 3 needs in last 10 minutes
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const recentNeeds = await Need.count({
            where: {
                userId: req.user ? req.user.id : null,
                createdAt: {
                    [Op.gte]: tenMinutesAgo
                }
            }
        });

        if (recentNeeds >= 3) {
            return res.status(429).json({ msg: 'Has creado demasiadas solicitudes recientemente. Intenta más tarde.' });
        }

        const { title, description, category, region, commune, latitude, longitude, petStatus, contactName, contactPhone, type } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Custom validation for guests
        if (!req.user && (!contactName || !contactPhone)) {
            return res.status(400).json({ msg: 'Invitados deben proporcionar Nombre y Teléfono de contacto.' });
        }

        const need = await Need.create({
            userId: req.user ? req.user.id : null,
            title,
            description,
            imageUrl,
            category,
            region,
            commune,
            latitude,
            longitude,
            type: type || 'REQUEST',
            petStatus: category === 'PETS' ? petStatus : null,
            contactName: req.user ? req.user.fullName : contactName,
            contactPhone: req.user ? req.user.phone : contactPhone
        });

        res.status(201).json(need);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getNeeds = async (req, res) => {
    try {
        const { region, category, status, type } = req.query;
        let whereClause = {};

        if (region) whereClause.region = region;
        if (category) whereClause.category = category;
        if (status) whereClause.status = status;
        if (type) whereClause.type = type;

        const needs = await Need.findAll({
            where: whereClause,
            include: [
                { model: User, as: 'requester', attributes: ['fullName'] },
                {
                    model: require('../donations/donationModel'),
                    as: 'Donations',
                    attributes: ['id', 'status', 'type']
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        // Privacy Filter: Hide contact info if user is not logged in
        const cleanNeeds = needs.map(n => {
            const need = n.toJSON();
            if (!req.user) {
                need.contactPhone = null; // Hide phone
                need.contactName = need.contactName ? 'Visible para registrados' : null; // Partially hide name or just null
            }
            return need;
        });

        res.json(cleanNeeds);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getNeedById = async (req, res) => {
    try {
        const need = await Need.findByPk(req.params.id, {
            include: [{ model: User, as: 'requester', attributes: ['fullName', 'email', 'phone'] }]
        });

        if (!need) return res.status(404).json({ msg: 'Need not found' });

        const needData = need.toJSON();

        // Privacy Filter
        if (!req.user) {
            needData.contactPhone = null;
            needData.contactName = needData.contactName ? 'Visible para registrados' : null;
        }

        res.json(needData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateNeedStatus = async (req, res) => {
    try {
        const { status, isVerified } = req.body;
        let need = await Need.findByPk(req.params.id);

        if (!need) return res.status(404).json({ msg: 'Need not found' });

        if (req.user.role !== 'ADMIN' && req.user.id !== need.userId) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (status) need.status = status;

        // Save evidence if file is uploaded
        if (req.file) {
            const protocol = req.protocol;
            const host = req.get('host');
            need.evidenceUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        }

        if (isVerified !== undefined && req.user.role === 'ADMIN') {
            need.isVerified = isVerified;
            if (isVerified) {
                need.verifiedBy = req.user.id;
            } else {
                need.verifiedBy = null;
            }
        }

        await need.save();
        res.json(need);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteNeed = async (req, res) => {
    try {
        const need = await Need.findByPk(req.params.id);

        if (!need) return res.status(404).json({ msg: 'Need not found' });

        // Check permissions: Admin or Owner
        if (req.user.role !== 'ADMIN' && req.user.id !== need.userId) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await need.destroy();
        res.json({ msg: 'Need removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
