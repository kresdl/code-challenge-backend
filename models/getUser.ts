import { query } from "../db";
import { User, UserDB } from "./User";

const getUser = async (id: string): Promise<User> => {
  const [result]: UserDB[] = await query(
    `
      SELECT
      id, phone_number, last_update_at, last_area, latitude, longitude
      FROM 
      users
      WHERE
      id = ?
    `,
    [id]
  );
  const { phone_number: phoneNumber, last_update_at: lastUpdateAt, last_area: lastArea, ...rest } = result;
  return { phoneNumber, lastUpdateAt, lastArea, ...rest };
};

export default getUser;
