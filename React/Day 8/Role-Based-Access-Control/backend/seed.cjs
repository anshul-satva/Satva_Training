const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

async function seed() {
  const dbPath = path.join(__dirname, "db.json");
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const hashedUsers = await Promise.all(
    db.users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    })),
  );

  db.users = hashedUsers;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log("Passwords hashed successfully!");
  console.log(hashedUsers.map((u) => u.email));
}

seed();
