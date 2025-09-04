const mongoose = require("mongoose");
require("dotenv").config();

async function dropCollections(collectionsToDrop = ['users', 'transactions']) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection;

    const collections = await db.db.listCollections().toArray();
    const existingNames = collections.map(col => col.name);

    for (const collectionName of collectionsToDrop) {
      if (existingNames.includes(collectionName)) {
        await db.dropCollection(collectionName);
        console.log(`✅ Dropped '${collectionName}' collection`);
      } else {
        console.log(`⚠️  '${collectionName}' collection does not exist`);
      }
    }

    console.log("🎉 Collection drop operation completed");
    
  } catch (err) {
    console.error("❌ Failed to drop collections:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const collectionsToDrop = args.length > 0 ? args : ['users', 'transactions'];
  
  console.log(`🗑️  Dropping collections: ${collectionsToDrop.join(', ')}`);
  dropCollections(collectionsToDrop);
}

module.exports = dropCollections;
