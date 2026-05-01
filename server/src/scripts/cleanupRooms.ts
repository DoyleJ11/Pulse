import { cleanupExpiredRooms } from "../services/roomService.js";
import { prisma } from "../utils/prisma.js";

try {
  const result = await cleanupExpiredRooms();
  console.log(`Deleted ${result.deletedRooms} expired room(s).`);
} catch (error) {
  console.error("Failed to clean up expired rooms:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
