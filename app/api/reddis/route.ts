import { redis } from "@/lib/reddis";

export async function GET() {
  await redis.set("test", "working");

  const value = await redis.get("test");

  return Response.json({ value });
}