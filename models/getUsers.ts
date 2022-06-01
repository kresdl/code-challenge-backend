import { query } from "../db";
import { User, UserDB } from "./User";

const getUsers = async (): Promise<User[]> => {
  const result: UserDB[] = await query(
    `
      SELECT
      id, phone_number, last_update_at, last_area, latitude, longitude
      FROM 
      users
    `
  );

  return result.map(user => {
    const { phone_number: phoneNumber, last_update_at: lastUpdateAt, last_area: lastArea, ...rest } = user;
    return { phoneNumber, lastUpdateAt, lastArea, ...rest };
  });
};

export default getUsers;
