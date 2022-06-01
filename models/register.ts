import { query } from "../db";

interface Register {
  auth: string;
  phoneNumber: string;
  lastUpdateAt: string;
}

const register = ({ auth, phoneNumber, lastUpdateAt }: Register) =>
  query(
    `
      INSERT INTO 
      users
      SET
      auth = ?,
      phone_number = ?,
      last_update_at = ?
    `,
    [auth, phoneNumber, lastUpdateAt]
  );

export default register;
