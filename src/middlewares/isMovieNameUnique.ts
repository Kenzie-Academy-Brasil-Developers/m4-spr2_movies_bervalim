import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";

export const isMovieNameUnique = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  const queryString = `SELECT * FROM movies WHERE name = $1;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };

  const data = await client.query(queryConfig);

  if (data.rows.length > 0 && data.rows[0].name === name) {
    return res.status(409).json({ message: "Movie name already exists" });
  }

  return next();
};
