const mongoose = require("mongoose");
require("dotenv").config();

async function dropTransactions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection;

    const collections = await db.db.listCollections().toArray();
    const names = collections.map(col => col.name);

    if (names.includes("transactions")) {
      await db.dropCollection("transactions");
      console.log("Dropped transactions collection");
    } else {
      console.log("'transactions' collection does not exist");
    }

    process.exit(0);
  } catch (err) {
    console.error("Failed to drop transactions:", err.message);
    process.exit(1);
  }
}

dropTransactions();
