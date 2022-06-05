import { query } from "../db";

interface Register {
  id: string;
  phoneNumber: string;
  lastUpdateAt: string;
}

const register = ({ id, phoneNumber, lastUpdateAt }: Register) =>
  query(
    `
      REPLACE INTO 
      users
      SET
      id = ?,
      phone_number = ?,
      last_update_at = ?
    `,
    [id, phoneNumber, lastUpdateAt]
  );

export default register;
