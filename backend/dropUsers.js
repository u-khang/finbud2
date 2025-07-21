const mongoose = require("mongoose");
require("dotenv").config();

async function dropUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection;

    const collections = await db.db.listCollections().toArray();
    const names = collections.map(col => col.name);

    if (names.includes("users")) {
      await db.dropCollection("users");
      console.log("Dropped users collection");
    } else {
      console.log("'users' collection does not exist");
    }

    process.exit(0);
  } catch (err) {
    console.error("Failed to drop users:", err.message);
    process.exit(1);
  }
}

dropUsers();
