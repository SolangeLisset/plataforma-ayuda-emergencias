const sequelize = require('../src/config/database');
const User = require('../src/features/auth/userModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const email = 'admin@example.com';
        const password = 'adminpassword123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: {
                fullName: 'Admin Local',
                password: hashedPassword,
                role: 'ADMIN',
                phone: '+56912345678'
            }
        });

        if (created) {
            console.log('✅ Admin user created successfully');
            console.log('-----------------------------------');
            console.log('Email:   ', email);
            console.log('Password:', password);
            console.log('-----------------------------------');
        } else {
            console.log('⚠️ Admin user already exists');
            console.log('Email:', email);
        }

    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        await sequelize.close();
    }
};

createAdmin();
