import { query } from "../db";

const deleteUser = (id: string) =>
  query(
    `
      DELETE FROM
      users
      WHERE
      id = ?
    `,
    [id]
  );

export default deleteUser;
