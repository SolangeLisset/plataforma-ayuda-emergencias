const { validationResult } = require('express-validator');
const Donation = require('./donationModel');
const Need = require('../needs/needModel');
const User = require('../auth/userModel');

exports.createDonation = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { type, description, amount, needId } = req.body;

        // If needId is provided, verify it exists
        if (needId) {
            const need = await Need.findByPk(needId);
            if (!need) return res.status(404).json({ msg: 'Need not found' });
        }

        const donation = await Donation.create({
            donorId: req.user.id,
            type,
            description,
            amount,
            needId: needId || null
        });

        res.status(201).json(donation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getDonations = async (req, res) => {
    try {
        const donations = await Donation.findAll({
            include: [
                { model: User, as: 'donor', attributes: ['fullName'] },
                { model: Need, as: 'linkedNeed', attributes: ['title'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(donations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
