import { readConfig, setUser } from "src/config";
import {
  createUser,
  findUserBy,
  getUsers,
  truncateUsers,
} from "src/lib/db/queries/users";
import { CommandHandler } from "./commands";

export const handlerLogin: CommandHandler = async (
  cmdName: string,
  ...args: string[]
): Promise<void> => {
  validate(cmdName, ...args);

  const userName = args.at(0)!;
  const existingUser = await findUserBy(userName);

  if (existingUser === undefined) {
    throw new Error(`User: ${userName} does not exists`);
  }

  setUser(existingUser.name);
  console.log(`User: ${existingUser.name} has been set`);
};

export const handlerRegister: CommandHandler = async (
  cmdName: string,
  ...args: string[]
): Promise<void> => {
  validate(cmdName, ...args);

  const userName = args.at(0)!;
  const existingUser = await findUserBy(userName);

  if (existingUser !== undefined) {
    throw new Error(`User Name ${userName} already exists`);
  }

  const createdUser = await createUser(userName);

  setUser(createdUser.name);
  console.log(`User: ${createdUser.name} has been set`);
};

export const handlerReset: CommandHandler = async (): Promise<void> => {
  await truncateUsers();
  console.log(`Users table truncated`);
};

export const handlerGetUsers = async (): Promise<void> => {
  const users = await getUsers();
  const { currentUserName } = readConfig();

  for (const user of users) {
    console.log(
      `${user.name} ${user.name === currentUserName ? "(current)" : ""}`
    );
  }
};

const validate = (cmdName: string, ...args: string[]): void => {
  if (args.length === 0) {
    throw new Error(`${cmdName} expects a single argument, the username`);
  }
};
