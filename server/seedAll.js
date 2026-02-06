const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config();

const seeders = [
  'seed_core.js',
  'seed_pack_1.js',
  'seed_pack_2.js',
  'seed_pack_3.js',
  'seedLeetCode.js'
];

async function runSeeders() {
  console.log('🚀 Starting Master Seeding Process...');
  console.log('Using MONGO_URI from .env');

  for (const seeder of seeders) {
    try {
      const seederPath = path.join(__dirname, seeder);
      console.log(`\n📦 Running ${seeder}...`);
      execSync(`node "${seederPath}"`, { stdio: 'inherit' });
      console.log(`✅ Finished ${seeder}`);
    } catch (err) {
      console.error(`❌ Error running ${seeder}:`, err.message);
    }
  }

  console.log('\n✨ Database population complete!');
}

runSeeders();
