import mysql, { QueryOptions } from "mysql";

const pool = mysql.createPool({
  database: "traffic",
  host: "localhost",
  user: "root",
  password: "mysql",
});

export const query = (options: string | QueryOptions, values?: any) =>
  new Promise<any>((resolve, reject) => {
    pool.query(options, values, (error, result) => {
      if (error) return reject(Error(error.sqlMessage));
      resolve(result);
    });
  });

export default pool;
