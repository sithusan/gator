import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "..";
import { feed_follows, feeds, Post, posts, users } from "../schema";

export const createPost = async (post: {
  title: string;
  url: string;
  description: string;
  publishedAt: Date;
  feedId: string;
}): Promise<Post> => {
  const [result] = await db
    .insert(posts)
    .values({
      title: post.title,
      url: post.url,
      description: post.description,
      publishedAt: post.publishedAt,
      feed_id: post.feedId,
    })
    .returning();

  return result;
};

export const getPostsForUser = async (
  userId: string,
  limit: number,
): Promise<Post[]> => {
  return await db
    .select(getTableColumns(posts))
    .from(posts)
    .innerJoin(feed_follows, eq(posts.feed_id, feed_follows.feed_id))
    .innerJoin(feeds, eq(posts.feed_id, feeds.id))
    .where(eq(feed_follows.user_id, userId))
    .orderBy(desc(posts.id))
    .limit(limit);
};
