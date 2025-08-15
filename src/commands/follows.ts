import { readConfig } from "src/config";
import { findFeedBy } from "src/lib/db/queries/feed";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed_follows";
import { findUserBy } from "src/lib/db/queries/users";

export const handlerFollow = async (
  cmdName: string,
  ...args: string[]
): Promise<void> => {
  const { currentUserName } = readConfig();

  if (currentUserName === undefined) {
    throw new Error(`You need to login first to use the command: ${cmdName}`);
  }

  const url = args.at(0);

  if (url === undefined) {
    throw new Error("You needs to provide URL of the feed");
  }

  const [feed, user] = await Promise.all([
    findFeedBy(url),
    findUserBy(currentUserName),
  ]);

  if (feed === undefined || user === undefined) {
    throw new Error("Feed or user not found");
  }

  const feedFollow = await createFeedFollow({
    feedId: feed.id,
    userId: user.id,
  });

  console.log("Feed Follow");
  console.log(`Feed Name: ${feedFollow.feeds.name}`); // Naming convention does not seems right. But, I don't care for now.
  console.log(`Current User : ${feedFollow.users.name}`);
};

export const handlerFollowing = async (cmdName: string): Promise<void> => {
  const { currentUserName } = readConfig();

  if (currentUserName === undefined) {
    throw new Error(`You need to login first to use the command: ${cmdName}`);
  }

  const feeds = await getFeedFollowsForUser(currentUserName);

  for (const feed of feeds) {
    console.log(feed.name);
  }
};
