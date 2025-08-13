import { fetchFeed } from "../lib/rss";

export const handlerAgg = async () => {
  const result = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(result, null, 2));
};
