import { getAllWords } from './src/db/queries';

async function testConnection() {
  console.log("Connecting database...");
  try {
    const words = await getAllWords();
    console.log("✅ Connection Successful!");
    console.log(`Returned data type: ${typeof words}. Total records: ${words.length}`);
  } catch (error) {
    console.error("❌ Connection Failed:");
    console.error(error);
  }
}

testConnection();
