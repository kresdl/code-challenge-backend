import { query } from "../db";

interface Register {
  id: string;
  phoneNumber: string;
  lastUpdateAt: Date;
}

const register = ({ id, phoneNumber, lastUpdateAt }: Register) =>
  query(
    `
      INSERT INTO 
      users
      SET
      id = ?,
      phone_number = ?,
      last_update_at = ?
    `,
    [id, phoneNumber, lastUpdateAt]
  );

export default register;
