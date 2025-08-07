import { initializeIndexes } from '../src/lib/db.js';

console.log('Setting up MongoDB database...');

try {
  await initializeIndexes();
  console.log('✅ Database setup completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Database setup failed:', error);
  process.exit(1);
}