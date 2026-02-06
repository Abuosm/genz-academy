const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Dynamic models
const Course = require('./models/Course');
const Company = require('./models/Company');
const Assignment = require('./models/Assignment');

async function checkData() {
  try {
    const uri = process.env.MONGO_URI;
    console.log('🔍 Connecting to:', uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED');

    if (!uri) {
      console.error('❌ Error: MONGO_URI is not defined in server/.env');
      process.exit(1);
    }

    await mongoose.connect(uri);

    const courseCount = await Course.countDocuments();
    const companyCount = await Company.countDocuments();
    const assignmentCount = await Assignment.countDocuments();

    console.log('\n📊 Database Statistics:');
    console.log('----------------------');
    console.log(`📚 Courses:     ${courseCount}`);
    console.log(`🏢 Companies:   ${companyCount}`);
    console.log(`📝 Assignments: ${assignmentCount}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error checking database:', err.message);
    process.exit(1);
  }
}

checkData();
