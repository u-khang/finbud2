// Script to clean up session data from MongoDB
const mongoose = require("mongoose");
require("dotenv").config();

const config = require("./config");

async function cleanupSessions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get the sessions collection
    const db = mongoose.connection.db;
    const sessionsCollection = db.collection("sessions");

    // Count existing sessions
    const sessionCount = await sessionsCollection.countDocuments();
    console.log(`Found ${sessionCount} session records`);

    if (sessionCount > 0) {
      // Delete all session records
      const result = await sessionsCollection.deleteMany({});
      console.log(`Deleted ${result.deletedCount} session records`);
    } else {
      console.log("No session records found to delete");
    }

    // Also drop the sessions collection entirely
    try {
      await sessionsCollection.drop();
      console.log("Dropped sessions collection");
    } catch (err) {
      if (err.code === 26) {
        console.log("Sessions collection doesn't exist (already dropped)");
      } else {
        console.error("Error dropping sessions collection:", err.message);
      }
    }

    console.log("✅ Session cleanup completed successfully!");
    
  } catch (err) {
    console.error("Error during session cleanup:", err);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Run the cleanup
cleanupSessions();
