import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "..";
import { feeds, Post, posts, users } from "../schema";

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

export const getPostsForUser = async (limit: number): Promise<Post[]> => {
  return await db
    .select(getTableColumns(posts))
    .from(posts)
    .innerJoin(feeds, eq(feeds.id, posts.feed_id))
    .innerJoin(users, eq(users.id, feeds.user_id))
    .orderBy(desc(posts.id))
    .limit(limit);
};
