const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('./userModel');
const Donation = require('../donations/donationModel');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, role, phone } = req.body;

    try {
        let user = await User.findOne({ where: { email } });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            fullName,
            email,
            password: await bcrypt.hash(password, 10),
            role: role || 'AFFECTED',
            phone,
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, fullName: user.fullName, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        const helpCount = await Donation.count({
            where: { donorId: req.user.id, status: 'DELIVERED' }
        });

        res.json({
            ...user.toJSON(),
            helpCount
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'fullName', 'role', 'createdAt']
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const helpCount = await Donation.count({
            where: { donorId: req.params.id, status: 'DELIVERED' }
        });

        res.json({
            id: user.id,
            fullName: user.fullName,
            role: user.role,
            createdAt: user.createdAt,
            helpCount
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
