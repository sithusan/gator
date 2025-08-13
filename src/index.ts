import {
  CommandsRegistry,
  handlerLogin,
  registerCommand,
  runCommand,
} from "./config.js";
import { argv } from "node:process";

function main() {
  const args = argv.slice(2);

  if (args.length === 0) {
    console.log("Please type desire command");
    process.exit(1);
  }

  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);
  runCommand(commandsRegistry, args.shift()!, ...args);
}

main();
