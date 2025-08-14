import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { User, users } from "../schema";

export const createUser = async (name: string): Promise<User> => {
  const [result] = await db.insert(users).values({ name: name }).returning();

  return result;
};

export const findUserBy = async (name: string): Promise<User | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.name, name),
  });
};

export const truncateUsers = async (): Promise<void> => {
  await db.execute(sql.raw(`TRUNCATE TABLE users CASCADE;`));
};

export const getUsers = async (): Promise<User[]> => {
  return await db.query.users.findMany();
};
