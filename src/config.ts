import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
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
