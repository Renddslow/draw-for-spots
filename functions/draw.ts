import { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "redis";

const shuffle = (names: string[]) => {
  let currentIndex = names.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [names[currentIndex], names[randomIndex]] = [
      names[randomIndex],
      names[currentIndex],
    ];
  }

  return names;
};

export const handler: Handler = async (event: HandlerEvent) => {
  const redis = await createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: "redis-12801.c57.us-east-1-4.ec2.redns.redis-cloud.com",
      port: 12801,
    },
  }).connect();

  const payload: { room: string } = JSON.parse(event.body);

  const keys = await redis.hKeys(payload.room);
  shuffle(keys);

  return {
    statusCode: 200,
    body: JSON.stringify({
      spots: keys.map((name, idx) => ({
        name,
        spot: idx + 1,
      })),
    }),
  };
};
