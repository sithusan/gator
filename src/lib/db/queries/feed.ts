import { db } from "..";
import { feeds } from "../schema";

export const createFeed = async (feed: {
  name: string;
  url: string;
  userId: string;
}) => {
  const [result] = await db
    .insert(feeds)
    .values({
      name: feed.name,
      url: feed.url,
      user_id: feed.userId,
    })
    .returning();

  return result;
};
