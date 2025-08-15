import { eq } from "drizzle-orm";
import { db } from "..";
import { Feed, feed_follows, FeedFollow, feeds, User, users } from "../schema";

export const createFeedFollow = async (feedFollow: {
  feedId: string;
  userId: string;
}): Promise<{
  feed_follows: FeedFollow;
  feeds: Feed;
  users: User;
}> => {
  const [createdFeedFollow] = await db
    .insert(feed_follows)
    .values({ feed_id: feedFollow.feedId, user_id: feedFollow.userId })
    .returning();

  const [feedFollowWithFeedAndUser] = await db
    .select()
    .from(feed_follows)
    .where(eq(feed_follows.id, createdFeedFollow.id))
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .innerJoin(users, eq(feed_follows.user_id, users.id));

  return feedFollowWithFeedAndUser;
};

export const getFeedFollowsForUser = async (
  userName: string
): Promise<Feed[]> => {
  
  const result = await db
    .select({ feeds })
    .from(users)
    .where(eq(users.name, userName))
    .innerJoin(feed_follows, eq(feed_follows.user_id, users.id))
    .innerJoin(feeds, eq(feeds.id, feed_follows.feed_id));

  return result.map(({ feeds }) => ({ ...feeds }));
};
