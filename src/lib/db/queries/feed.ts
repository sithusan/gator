import { eq } from "drizzle-orm";
import { db } from "..";
import { Feed, feeds } from "../schema";

export const createFeed = async (feed: {
  name: string;
  url: string;
  userId: string;
}): Promise<Feed> => {
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

export const getFeeds = async (): Promise<Feed[]> => {
  return await db.query.feeds.findMany();
};

export const findFeedBy = async (url: string): Promise<Feed | undefined> => {
  return await db.query.feeds.findFirst({
    where: eq(feeds.url, url),
  });
};
