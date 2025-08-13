import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export const fetchFeed = async (feedURL: string): Promise<RSSFeed> => {
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
      accept: "application/rss+xml",
    },
  });

  const result = await response.text();
  const parser = new XMLParser();
  const rss = parser.parse(result).rss;

  if (rss.channel === undefined) {
    throw new Error("Channel does not exist");
  }

  if (
    rss.channel.title === undefined ||
    rss.channel.link === undefined ||
    rss.channel.description === undefined
  ) {
    throw new Error("Some required fields are missing");
  }

  const feedItems =
    rss.channel.item && Array.isArray(rss.channel.item)
      ? rss.channel.item
      : [rss.channel.item];

  const mappedFeedItems = feedItems
    .map((item: any) => {
      if (
        item.title !== undefined &&
        item.link !== undefined &&
        item.description !== undefined &&
        item.pubDate !== undefined
      ) {
        return {
          title: item.title,
          link: item.link,
          description: item.description,
          pubDate: item.pubDate,
        };
      }
    })
    .filter(Boolean); // Needs to filter out because map always return same length as the original. (undefined for the implict returns)

  return {
    channel: {
      title: rss.channel.title,
      link: rss.channel.link,
      description: rss.channel.description,
      item: mappedFeedItems,
    },
  };
};
