import { getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/schema";
import { UserCommandHandler } from "src/middleware";

export const handlerBrowse: UserCommandHandler = async (
  user: User,
  _: string,
  ...args: string[]
): Promise<void> => {
  const limit = args.at(0) ?? 2;

  const posts = await getPostsForUser(user.id, +limit);

  if (posts.length === 0) {
    console.log(`No Posts for current user: ${user.name}`);
    return;
  }

  for (const post of posts) {
    console.log(`Title : ${post.title}`);
    console.log(`URL: ${post.url}`);
    console.log(`Description: ${post.description}`);
    console.log(`Published At: ${post.publishedAt}`);
    console.log("====================");
  }
};
