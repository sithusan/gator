import { fetchFeed } from "../lib/rss";
import { getUsers } from "src/lib/db/queries/users";
import { createFeed, getFeeds } from "src/lib/db/queries/feed";
import { Feed, User } from "src/lib/db/schema";
import { createFeedFollow } from "src/lib/db/queries/feed_follows";
import { UserCommandHandler } from "src/middleware";
import { CommandHandler } from "./commands";

export const handlerAgg: CommandHandler = async (): Promise<void> => {
  const result = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(result, null, 2));
};

export const handlerAddFeed: UserCommandHandler = async (
  user: User,
  _: string,
  ...args: string[]
): Promise<void> => {
  const [feedName, url] = args.slice(0, 2);

  if (feedName === undefined || url === undefined) {
    throw new Error("Both feed name and url are required");
  }

  const feed = await createFeed({
    name: feedName,
    url: url,
    userId: user.id,
  });

  await createFeedFollow({
    feedId: feed.id,
    userId: user.id,
  });

  printFeed(feed, user);
};

export const handlerGetFeeds: CommandHandler = async (): Promise<void> => {
  const [users, feeds] = await Promise.all([getUsers(), getFeeds()]); // better to have the query with relation. but not now.

  const userMap: Map<string, User> = new Map();

  for (const user of users) {
    userMap.set(user.id, user);
  }

  for (const feed of feeds) {
    console.log(`Feed Name : ${feed.name}`);
    console.log(`URL : ${feed.url}`);
    console.log(`Created User Name: ${userMap.get(feed.user_id)?.name}`);
  }
};

const printFeed = (feed: Feed, user: User): void => {
  console.log("Feed");
  console.log(`Name: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log(`User ID: ${feed.user_id}`);
  console.log("==========");

  console.log("User");
  console.log(`Name: ${user.name}`);
  console.log("==========");
};
