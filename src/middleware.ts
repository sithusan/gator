import { CommandHandler } from "./commands/commands";
import { readConfig } from "./config";
import { findUserBy } from "./lib/db/queries/users";
import { User } from "./lib/db/schema";

export type UserCommandHandler = (
  user: User,
  cmdName: string,
  ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export const middlewareLoggedIn: middlewareLoggedIn = (
  handler: UserCommandHandler,
): CommandHandler => {
  return async (cmdName: string, ...args) => {
    const { currentUserName } = readConfig();

    if (currentUserName === undefined) {
      throw new Error(`You need to login first to use the command: ${cmdName}`);
    }

    const user = await findUserBy(currentUserName);

    if (user === undefined) {
      throw new Error("User not found");
    }

    return await handler(user, cmdName, ...args);
  };
};
