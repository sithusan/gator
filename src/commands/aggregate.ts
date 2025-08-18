import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { CommandHandler } from "./commands";
import { fetchFeed } from "src/lib/rss";
import { parseDuration } from "src/lib/time";
import { createPost } from "src/lib/db/queries/posts";
import { title } from "process";

export const handlerAgg: CommandHandler = async (
  cmdName: string,
  ...args: string[]
): Promise<void> => {
  const timeBetweenRequests = args.at(0);

  if (timeBetweenRequests === undefined) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const timeBetweenRequestsInMs = parseDuration(timeBetweenRequests);

  scrapeFeeds().catch(handleError);

  const intervalId = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequestsInMs);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down gator...");
      clearInterval(intervalId);
      resolve();
    });
  });
};

export const scrapeFeeds = async () => {
  const nextFeed = await getNextFeedToFetch();

  if (nextFeed === undefined) {
    throw new Error("You need to add the feed first");
  }

  await markFeedFetched(nextFeed.id);

  const fetchedFeed = await fetchFeed(nextFeed.url);

  console.log(
    `Fetching ${fetchedFeed.channel.title}, ${fetchedFeed.channel.description}`,
  );
  console.log("===========");

  for (const item of fetchedFeed.channel.item) {
    createPost({
      title: item.title,
      url: item.link,
      description: item.description,
      publishedAt: new Date(item.pubDate),
      feedId: nextFeed.id,
    }).catch(handleError);
  }
};

const handleError = (err: unknown) => {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
};
