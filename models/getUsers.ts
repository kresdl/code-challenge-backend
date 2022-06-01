import { query } from "../db";
import { User, UserDB } from "./User";

const getUsers = async (): Promise<User[]> => {
  const result: UserDB[] = await query(
    `
      SELECT
      auth, phone_number, last_update_at, last_area, latitude, longitude
      FROM 
      users
    `
  );

  return result.map(user => {
    const {
      auth,
      phone_number: phoneNumber,
      last_update_at: lastUpdateAt,
      last_area: lastArea,
      latitude,
      longitude,
    } = user;
    return { auth, phoneNumber, lastUpdateAt, lastArea, latitude, longitude };
  });
};

export default getUsers;
