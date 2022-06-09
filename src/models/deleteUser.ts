import { query } from "../db";

const deleteUser = async (id: string) => {
  const result = await query(
    `
      DELETE FROM
      users
      WHERE
      id = ?
    `,
    [id]
  );
  return !!result.affectedRows;
};

export default deleteUser;
