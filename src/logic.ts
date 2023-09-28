import { Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";

export const createMovie = async (req: Request, res: Response) => {
  const { name, category, duration, price } = req.body;

  const queryString = `INSERT INTO movies (name, category, duration, price)
  VALUES ($1,$2,$3,$4)
  RETURNING *;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name, category, duration, price],
  };

  const data = await client.query(queryConfig);
  console.log(data);

  return res.status(201).json(data.rows[0]);
};
