type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export const registerCommand = (
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
): void => {
  registry[cmdName] = handler;
};

export const runCommand = (
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): void => {
  const cmd = registry[cmdName];

  if (cmd === undefined) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  cmd(cmdName, ...args);
};
