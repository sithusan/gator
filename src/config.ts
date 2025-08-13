import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export const registerCommand = (
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) => {
  registry[cmdName] = handler;
};

export const runCommand = (
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) => {
  const cmd = registry[cmdName];

  if (cmd === undefined) {
    console.log("command not found");
    process.exit(1);
  }

  cmd(cmdName, ...args);
};

export const handlerLogin = (cmdName: string, ...args: string[]): void => {
  if (args.length === 0) {
    console.log(`${cmdName} expects a single argument, the username`);
    process.exit(1);
  }

  const userName = args.at(0)!;
  setUser(userName); // Already checked the length;
  console.log(`User: ${userName} has been set.`);
};

export const setUser = (userName: string): void => {
  const config = readConfig();
  config.currentUserName = userName;
  writeConfig(config);
};

export const readConfig = (): Config => {
  const configPath = getConfigPath();

  const rawConfig = fs.readFileSync(configPath, "utf-8");

  return validateConfig(JSON.parse(rawConfig));
};

const getConfigPath = (): string => {
  return path.join(os.homedir(), ".gatorconfig.json");
};

const writeConfig = (cfg: Config): void => {
  const configPath = getConfigPath();

  fs.writeFileSync(
    configPath,
    JSON.stringify({
      db_url: cfg.dbUrl,
      current_user_name: cfg.currentUserName,
    }),
    "utf-8"
  );
};

const validateConfig = (rawConfig: any): Config => {
  if (
    rawConfig.db_url === undefined ||
    rawConfig.current_user_name === undefined
  ) {
    throw new Error("Invalid Config");
  }

  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
};
