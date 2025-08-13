import { setUser } from "src/config";
import {
  createUser,
  findUserBy,
  truncateUsers,
} from "src/lib/db/queries/users";

export const handlerLogin = async (
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

export const handlerRegister = async (
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

export const handlerReset = async () => {
  await truncateUsers();
  console.log(`Users table truncated`);
};

const validate = (cmdName: string, ...args: string[]) => {
  if (args.length === 0) {
    throw new Error(`${cmdName} expects a single argument, the username`);
  }
};
