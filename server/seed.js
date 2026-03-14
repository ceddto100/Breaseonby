require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Video = require('./models/Video');
const Admin = require('./models/Admin');

const seedData = async () => {
  await connectDB();

  // Seed admin user
  const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
  if (!existingAdmin) {
    const passwordHash = process.env.ADMIN_PASSWORD_HASH || await bcrypt.hash('admin123', 12);
    await Admin.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      passwordHash,
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }

  // Seed sample video
  const videoCount = await Video.countDocuments();
  if (videoCount === 0) {
    await Video.create({
      title: 'The Rise and Fall of a Street Legend',
      subjectName: 'Frank Lucas',
      description:
        'From the backroads of North Carolina to the penthouse suites of Harlem, Frank Lucas built an empire that redefined the drug trade in America. This is the uncovered story of ambition, power, and consequence.',
      category: 'Hustlers',
      tags: ['crime', 'harlem', 'drug trade', '1970s', 'american gangster'],
      cloudinaryUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/sea-turtle',
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/nature-mountains',
      views: 12450,
      featured: true,
    });
    console.log('Sample video seeded');
  } else {
    console.log(`${videoCount} videos already exist`);
  }

  console.log('Seed complete');
  process.exit(0);
};

seedData().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
