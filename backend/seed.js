const bcrypt = require('bcryptjs');
const { Admin, User, Staff } = require('./models');

const seedDatabase = async () => {
  try {
    // Check if admin exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        name: 'Admin',
        email: 'admin@insightbi.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('   ✓ Admin account created: admin@insightbi.com / admin123');
    }

    // Check if user exists
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      await User.create({
        name: 'Demo User',
        email: 'user@demo.com',
        password: hashedPassword,
        role: 'user',
      });
      console.log('   ✓ User account created: user@demo.com / user123');
    }

    // Check if staff exists
    const staffCount = await Staff.countDocuments();
    if (staffCount === 0) {
      const hashedPassword = await bcrypt.hash('staff123', 10);
      await Staff.create({
        name: 'Billing Staff',
        email: 'staff@insightbi.com',
        password: hashedPassword,
        role: 'staff',
      });
      console.log('   ✓ Staff account created: staff@insightbi.com / staff123');
    }

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
};

module.exports = seedDatabase;
