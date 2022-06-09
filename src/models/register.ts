import { query } from "../db";

interface Register {
  id: string;
  phoneNumber: string;
  updatesFrom: string;
}

const register = ({ id, phoneNumber, updatesFrom }: Register) =>
  query(
    `
      REPLACE INTO
      users
      SET
      id = ?,
      phone_number = ?,
      last_update_at = ?
    `,
    [id, phoneNumber, updatesFrom]
  );

export default register;
