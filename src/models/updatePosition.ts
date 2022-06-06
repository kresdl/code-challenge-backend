import { query } from "../db";

interface Position {
  latitude: number;
  longitude: number;
}

const updatePosition = (id: string, { latitude, longitude }: Position) =>
  query(
    `
      UPDATE
      users
      SET
      latitude = ?,
      longitude = ?
      WHERE
      id = ?
    `,
    [latitude, longitude, id]
  );

export default updatePosition;
