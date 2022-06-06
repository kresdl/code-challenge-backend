import { query } from "../db";
import { User, UserDB } from "./User";

const getUsers = async (): Promise<User[]> => {
  const result: UserDB[] = await query(
    `
      SELECT
      id, phone_number, last_update_at, latitude, longitude
      FROM 
      users
    `
  );

  return result.map(user => {
    const { phone_number: phoneNumber, last_update_at: lastUpdateAt, ...rest } = user;
    return { phoneNumber, lastUpdateAt, ...rest };
  });
};

export default getUsers;
