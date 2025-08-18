export const parseDuration = (durationStr: string): number => {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (match === null) {
    throw new Error("Format is time:ms|s|m|h");
  }

  const [_, intervalStr, timeUnit] = match;
  const interval = Number(intervalStr);

  switch (timeUnit) {
    case "ms":
      return interval;
    case "s":
      return interval * 1000;
    case "m":
      return interval * 1000 * 60;
    case "h":
      return interval * 1000 * 60 * 60;
    default:
      return 0;
  }
};
