import mysql, { QueryOptions } from "mysql";

const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_HOST } = process.env;
if (!MYSQL_USER) throw Error("MYSQL_USER not set");
if (!MYSQL_PASSWORD) throw Error("MYSQL_PASSWORD not set");
if (!MYSQL_HOST) throw Error("MYSQL_HOST not set");
if (!MYSQL_DATABASE) throw Error("MYSQL_DATABASE not set");

const pool = mysql.createPool({
  database: MYSQL_DATABASE,
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  timezone: "2",
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
