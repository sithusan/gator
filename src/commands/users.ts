import { setUser } from "src/config";

export const handlerLogin = (cmdName: string, ...args: string[]): void => {
  if (args.length === 0) {
    throw new Error(`${cmdName} expects a single argument, the username`);
  }

  const userName = args.at(0)!;
  setUser(userName); // Already checked the length;
  console.log(`User: ${userName} has been set.`);
};
