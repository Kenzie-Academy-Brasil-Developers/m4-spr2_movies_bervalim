import { Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import format from "pg-format";
import { TMovieUPdateData } from "./interfaces";

export const createMovie = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, category, duration, price } = req.body;

  const queryString = `INSERT INTO movies (name, category, duration, price)
  VALUES ($1,$2,$3,$4)
  RETURNING *;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name, category, duration, price],
  };

  const data = await client.query(queryConfig);
  
  return res.status(201).json(data.rows[0]);
};

export const getAllMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let query = `SELECT * FROM movies;`;

  if (req.query.category) {
    query = format(
      `SELECT * FROM movies WHERE category ILIKE %L;`,
      req.query.category
    );
  }
  const data = await client.query(query);

  if (!data.rowCount) {
    const query = `SELECT * FROM movies;`;
    const data = await client.query(query);
    return res.status(200).json(data.rows);
  }

  return res.status(200).json(data.rows);
};

export const getMoviesById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(200).json(res.locals.movies);
};

export const deleteMovieById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  const queryString = `DELETE FROM movies WHERE id = $1;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return res.status(204).json();
};

export const updateMovie = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let objectData: TMovieUPdateData = {};
  Object.entries(req.body).forEach(([key, value]) => {
    if (
      key === "name" ||
      key === "category" ||
      key === "duration" ||
      key === "price"
    ) {
      objectData[key] = value as any;
    }
  });

  const { id } = req.params;
  const query = format(
    `UPDATE movies SET (%I) = ROW(%L) WHERE id = (%L)
    RETURNING *;`,
    Object.keys(objectData),
    Object.values(objectData),
    id
  );
  const data = await client.query(query);

  return res.status(200).json(data.rows[0]);
};
