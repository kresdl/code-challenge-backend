import { query } from "../db";

interface Position {
  latitude: number;
  longitude: number;
}

const updatePosition = (auth: string, { latitude, longitude }: Position) =>
  query(
    `
      UPDATE users 
      SET 
      latitude = ?,
      longitude = ?
      WHERE
      auth = ?
    `,
    [latitude, longitude, auth]
  );

export default updatePosition;
