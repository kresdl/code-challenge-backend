import mysql, { QueryOptions } from "mysql";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const database = process.env.DATABASE;

if (!dbUser) throw Error("DB_USER not set");
if (!dbPassword) throw Error("DB_PASSWORD not set");
if (!database) throw Error("DATABASE not set");

const pool = mysql.createPool({
  database,
  host: "localhost",
  user: dbUser,
  password: dbPassword,
});

export const query = (options: string | QueryOptions, values?: any) =>
  new Promise<any>((resolve, reject) => {
    pool.query(options, values, (error, result) => {
      if (error) return reject(Error(error.sqlMessage));
      resolve(result);
    });
  });

export default pool;
