import { query } from "../db";

interface Last {
  lastUpdateAt: string;
  lastArea: string;
}

const updatePosition = (id: string, { lastUpdateAt, lastArea }: Last) =>
  query(
    `
      UPDATE
      users
      SET
      last_update_at = ?,
      last_area = ?
      WHERE
      id = ?
    `,
    [lastUpdateAt, lastArea, id]
  );

export default updatePosition;
