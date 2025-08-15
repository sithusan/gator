import { argv } from "node:process";
import {
  registerCommand,
  runCommand,
  type CommandsRegistry,
} from "./commands/commands";
import {
  handlerGetUsers,
  handlerLogin,
  handlerRegister,
  handlerReset,
} from "./commands/users";
import { handlerAddFeed, handlerAgg, handlerGetFeeds } from "./commands/feeds";
import { handlerFollow, handlerFollowing } from "./commands/follows";
import { middlewareLoggedIn } from "./middleware";

async function main() {
  const args = argv.slice(2);

  if (args.length === 0) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args.shift()!; // Already ensure there is at least one element.

  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", handlerReset);
  registerCommand(commandsRegistry, "users", handlerGetUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(
    commandsRegistry,
    "addfeed",
    middlewareLoggedIn(handlerAddFeed)
  );
  registerCommand(commandsRegistry, "feeds", handlerGetFeeds);
  registerCommand(
    commandsRegistry,
    "follow",
    middlewareLoggedIn(handlerFollow)
  );
  registerCommand(
    commandsRegistry,
    "following",
    middlewareLoggedIn(handlerFollowing)
  );

  try {
    await runCommand(commandsRegistry, cmdName, ...args);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName} : ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName} : ${err}`);
    }

    process.exit(1);
  }

  process.exit(0);
}

main();
