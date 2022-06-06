import { query } from "../db";
import { User, UserDB } from "./User";

const getUser = async (id: string): Promise<User | null> => {
  const result: UserDB[] = await query(
    `
      SELECT
      id, phone_number, last_update_at, latitude, longitude
      FROM 
      users
      WHERE
      id = ?
    `,
    [id]
  );
  if (!result.length) return null;
  const { phone_number: phoneNumber, last_update_at: lastUpdateAt, ...rest } = result[0];
  return { phoneNumber, lastUpdateAt, ...rest };
};

export default getUser;
