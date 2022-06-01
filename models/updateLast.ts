import { query } from "../db";

interface Last {
  lastUpdateAt: string;
  lastArea: string;
}

const updatePosition = (auth: string, { lastUpdateAt, lastArea }: Last) =>
  query(
    `
      UPDATE users 
      SET 
      last_update_at = ?,
      last_area = ?
      WHERE
      auth = ?
    `,
    [lastUpdateAt, lastArea, auth]
  );

export default updatePosition;
