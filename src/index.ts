import { argv } from "node:process";
import {
  registerCommand,
  runCommand,
  type CommandsRegistry,
} from "./commands/commands";
import { handlerLogin } from "./commands/users";

function main() {
  const args = argv.slice(2);

  if (args.length === 0) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args.shift()!; // Already ensure there is at least one element.

  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);

  try {
    runCommand(commandsRegistry, cmdName, ...args);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName} : ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName} : ${err}`);
    }

    process.exit(1);
  }
}

main();
