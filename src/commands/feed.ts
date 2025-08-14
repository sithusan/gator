import { readConfig } from "src/config";
import { fetchFeed } from "../lib/rss";
import { findUserBy } from "src/lib/db/queries/users";
import { createFeed } from "src/lib/db/queries/feed";
import { feeds, users } from "src/lib/db/schema";

export const handlerAgg = async () => {
  const result = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(result, null, 2));
};

export const handlerAddFeed = async (cmdName: string, ...args: string[]) => {
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

type Feed = typeof feeds.$inferSelect;
type User = typeof users.$inferSelect;

const printFeed = (feed: Feed, user: User) => {
  console.log("Feed");
  console.log(`Name: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log(`User ID: ${feed.user_id}`);
  console.log("==========");

  console.log("User");
  console.log(`Name: ${user.name}`);
  console.log("==========");
};
