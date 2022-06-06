import { query } from "../db";

interface Last {
  lastUpdateAt: string;
}

const updatePosition = (id: string, { lastUpdateAt }: Last) =>
  query(
    `
      UPDATE
      users
      SET
      last_update_at = ?
      WHERE
      id = ?
    `,
    [lastUpdateAt, id]
  );

export default updatePosition;
