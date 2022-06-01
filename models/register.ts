import { query } from "../db";

interface Arg {
  auth: string;
  phoneNumber: string;
  lastUpdateAt: string;
}

const register = async ({ auth, phoneNumber, lastUpdateAt }: Arg) =>
  query(
    `
      INSERT INTO users
      SET auth=?,
      SET phone_number=?
      SET last_update_at=?
    `,
    [auth, phoneNumber, lastUpdateAt]
  ).catch(console.error);

export default register;
