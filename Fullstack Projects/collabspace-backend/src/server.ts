import "dotenv/config";
import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

const startServer = async () => {
  await prisma.$connect();

  app.listen(env.PORT, () => {
    console.log(`CollabSpace backend running on http://localhost:${env.PORT}`);
  });
};

void startServer();
