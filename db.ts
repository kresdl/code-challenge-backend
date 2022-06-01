import mysql, { QueryOptions } from "mysql";

const { DB_USER, DB_PASSWORD, DATABASE, DB_HOST } = process.env;
if (!DB_USER) throw Error("DB_USER not set");
if (!DB_PASSWORD) throw Error("DB_PASSWORD not set");
if (!DB_HOST) throw Error("DB_HOST not set");
if (!DATABASE) throw Error("DATABASE not set");

const pool = mysql.createPool({
  database: DATABASE,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
});

export const query = (options: string | QueryOptions, values?: any) =>
  new Promise<any>((resolve, reject) => {
    pool.query(options, values, (error, result) => {
      if (error) {
        console.error(error);
        return reject(error.message);
      }
      resolve(result);
    });
  });

export default pool;
