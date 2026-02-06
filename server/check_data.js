const mongoose = require('mongoose');
require('dotenv').config();

// Dynamic models to avoid path issues
const Course = require('./models/Course');
const Company = require('./models/Company');
const Assignment = require('./models/Assignment');

async function checkData() {
  try {
    console.log('🔍 Connecting to:', process.env.MONGO_URI?.replace(/:([^:@]+)@/, ':****@'));
    await mongoose.connect(process.env.MONGO_URI);

    const courseCount = await Course.countDocuments();
    const companyCount = await Company.countDocuments();
    const assignmentCount = await Assignment.countDocuments();

    console.log('\n📊 Database Statistics:');
    console.log('----------------------');
    console.log(`📚 Courses:     ${courseCount}`);
    console.log(`🏢 Companies:   ${companyCount}`);
    console.log(`📝 Assignments: ${assignmentCount}`);

    if (courseCount === 0) console.log('\n⚠️  WARNING: Courses collection is empty!');
    if (companyCount === 0) console.log('⚠️  WARNING: Companies collection is empty!');
    if (assignmentCount === 0) console.log('⚠️  WARNING: Assignments collection is empty!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error checking database:', err.message);
    process.exit(1);
  }
}

checkData();
