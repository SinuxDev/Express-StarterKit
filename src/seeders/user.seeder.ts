import { Database } from "../config/database";
import { UserModel } from "../app/models/User";
import logger from "../config/logger";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    isActive: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "john123",
    role: "user",
    isActive: true,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "jane123",
    role: "user",
    isActive: true,
  },
];

export const seedUsers = async () => {
  try {
    await UserModel.deleteMany({});
    logger.info("Cleared existing users");

    const createdUsers = await UserModel.create(users);
    logger.info(`✅ Seeded ${createdUsers.length} users`);

    console.log("\n📧 Seeded User Credentials:");
    console.log("─────────────────────────────────");
    users.forEach((user) => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Role: ${user.role}`);
      console.log("─────────────────────────────────");
    });
  } catch (error) {
    logger.error("Error seeding users:", error);
    throw error;
  }
};

if (require.main === module) {
  (async () => {
    try {
      await Database.getInstance().connect();
      await seedUsers();
      process.exit(0);
    } catch (error) {
      logger.error("Seeder failed:", error);
      process.exit(1);
    }
  })();
}
