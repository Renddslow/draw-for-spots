import { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "redis";

export const handler: Handler = async (event: HandlerEvent) => {
  const redis = await createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: "redis-12801.c57.us-east-1-4.ec2.redns.redis-cloud.com",
      port: 12801,
    },
  }).connect();

  const payload: { room: string; name: string } = JSON.parse(event.body);

  await redis.hSet(payload.room, payload.name, 0);

  return {
    statusCode: 200,
    body: JSON.stringify({ spot: "Draw saved" }),
  };
};
