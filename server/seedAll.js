const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const seeders = [
  'seed_core.js',
  'seed_pack_1.js',
  'seed_pack_2.js',
  'seed_pack_3.js',
  'seedLeetCode.js'
];

async function runSeeders() {
  console.log('🚀 Starting Master Seeding Process...');
  const uri = process.env.MONGO_URI;
  console.log('Using MONGO_URI:', uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED');

  if (!uri) {
    console.error('❌ Error: MONGO_URI is missing in server/.env. Seeding aborted.');
    process.exit(1);
  }

  for (const seeder of seeders) {
    try {
      const seederPath = path.join(__dirname, seeder);
      console.log(`\n📦 Running ${seeder}...`);
      // Pass the process environment to ensure the child process sees the variables
      execSync(`node "${seederPath}"`, { stdio: 'inherit', env: process.env });
      console.log(`✅ Finished ${seeder}`);
    } catch (err) {
      console.error(`❌ Error running ${seeder}:`, err.message);
    }
  }

  console.log('\n✨ Database population complete!');
}

runSeeders();
