import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export const createUser = async (name: string) => {
  const [result] = await db.insert(users).values({ name: name }).returning();

  return result;
};

export const findUserBy = async (name: string) => {
  return await db.query.users.findFirst({
    where: eq(users.name, name),
  });
};

export const truncateUsers = async (): Promise<void> => {
  await db.execute(sql.raw(`TRUNCATE TABLE users;`));
};
