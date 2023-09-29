import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";

export const isMovieIdValid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const queryString = `SELECT * FROM movies WHERE id = $1;`;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const data = await client.query(queryConfig);

  if (data.rowCount === 0) {
    return res.status(404).json({ message: "Movie not found!" });
  }

  res.locals.movies = data.rows[0];
  return next();

  // return res.status(200).json(data.rows[0]);
};
