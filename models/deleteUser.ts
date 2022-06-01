import { query } from "../db";

const deleteUser = (auth: string) =>
  query(
    `
      DELETE FROM users 
      WHERE
      auth = ?
    `,
    [auth]
  );

export default deleteUser;
