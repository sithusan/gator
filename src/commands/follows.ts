import { findFeedBy } from "src/lib/db/queries/feed";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed_follows";
import { User } from "src/lib/db/schema";
import { UserCommandHandler } from "src/middleware";

export const handlerFollow: UserCommandHandler = async (
  user: User,
  _: string,
  ...args: string[]
): Promise<void> => {
  const url = args.at(0);

  if (url === undefined) {
    throw new Error("You needs to provide URL of the feed");
  }

  const feed = await findFeedBy(url);

  if (feed === undefined) {
    throw new Error("Feed not found");
  }

  const feedFollow = await createFeedFollow({
    feedId: feed.id,
    userId: user.id,
  });

  console.log("Feed Follow");
  console.log(`Feed Name: ${feedFollow.feeds.name}`); // Naming convention does not seems right. But, I don't care for now.
  console.log(`Current User : ${feedFollow.users.name}`);
};

export const handlerFollowing: UserCommandHandler = async (
  user: User
): Promise<void> => {
  const feeds = await getFeedFollowsForUser(user.name);

  for (const feed of feeds) {
    console.log(feed.name);
  }
};
