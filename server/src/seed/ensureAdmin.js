const bcrypt = require("bcrypt");
const User = require("../models/user.model");

async function ensureAdminUserExists() {
  const adminEmail = "admin@example.com";
  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash("Admin@123", 10);
  await User.create({
    firstName: "Admin",
    lastName: "User",
    email: adminEmail,
    password: passwordHash,
    role: "ADMIN",
  });
  console.log("Seeded default admin user → email: admin@example.com / password: Admin@123");
}

module.exports = { ensureAdminUserExists };


