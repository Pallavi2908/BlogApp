import { createClient } from "redis";

const client = createClient({
  url: "redis://default:UA8arVow9NOlyqCO4ZXZbdTj1GH4DOY3@redis-11315.crce217.ap-south-1-1.ec2.redns.redis-cloud.com:11315",
});

await client.connect();
console.log("✅ Connected to Redis Cloud!");

await client.set("test", "123");
const value = await client.get("test");
console.log("Value from Redis:", value);
