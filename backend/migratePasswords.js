const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

async function migratePasswords() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/expense-tracker");
    console.log("Connected to MongoDB");

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        console.log(`User ${user.email} already has encrypted password, skipping...`);
        skippedCount++;
        continue;
      }

      // Hash the plain text password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      // Update the user with the hashed password
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });
      console.log(`Migrated password for user: ${user.email}`);
      migratedCount++;
    }

    console.log(`\nMigration complete!`);
    console.log(`Migrated: ${migratedCount} users`);
    console.log(`Skipped (already encrypted): ${skippedCount} users`);

  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  migratePasswords();
}

module.exports = migratePasswords;
