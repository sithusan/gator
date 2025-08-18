import { eq, sql } from "drizzle-orm";
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

export const markFeedFetched = async (id: string): Promise<void> => {
  await await db
    .update(feeds)
    .set({ lastFetchedAt: sql`NOW()` })
    .where(eq(feeds.id, id));
};

export const getNextFeedToFetch = async (): Promise<Feed | undefined> => {
  const [result] = await db.execute(
    sql`select * from feeds ORDER BY last_fetched_at ASC NULLS FIRST`
  );

  return result as Feed;
};
