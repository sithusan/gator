import { readConfig } from "src/config";
import { fetchFeed } from "../lib/rss";
import { findUserBy } from "src/lib/db/queries/users";
import { createFeed } from "src/lib/db/queries/feed";
import { Feed, User } from "src/lib/db/schema";

export const handlerAgg = async (): Promise<void> => {
  const result = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(result, null, 2));
};

export const handlerAddFeed = async (
  cmdName: string,
  ...args: string[]
): Promise<void> => {
  const { currentUserName } = readConfig();

  if (currentUserName === undefined) {
    throw new Error(`You need to login first to use the command: ${cmdName}`);
  }

  const [feedName, url] = args.slice(0, 2);

  if (feedName === undefined || url === undefined) {
    throw new Error("Both feed name and url are required");
  }

  const user = await findUserBy(currentUserName);

  if (user === undefined) {
    throw new Error("User not found");
  }

  const feed = await createFeed({
    name: feedName,
    url: url,
    userId: user.id,
  });

  printFeed(feed, user);
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
