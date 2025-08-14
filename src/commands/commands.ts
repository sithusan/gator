type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export const registerCommand = (
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
): void => {
  registry[cmdName] = handler;
};

export const runCommand = async (
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> => {
  const cmd = registry[cmdName];

  if (cmd === undefined) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  await cmd(cmdName, ...args);
};
