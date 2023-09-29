import { Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import format from "pg-format";

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
  console.log(data);

  return res.status(201).json(data.rows[0]);
};

// export const getAllMovies = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   let queryConfig: string | QueryConfig;

//   if (req.query.category) {
//     const search = "%" + req.query.category + "%";
//     queryConfig = format(
//       `SELECT * FROM movies WHERE category ILIKE '%s';`,
//       search
//     );
//   } else {
//     queryConfig = `SELECT * FROM movies;`;
//   }
//   const data = await client.query(queryConfig);
//   console.log(data.rowCount);

//   if (!data.rowCount) {
//     const query = `SELECT * FROM movies;`;
//     const data = await client.query(query);
//     return res.status(200).json(data.rows);
//   }

//   return res.status(200).json(data.rows);
// };

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
  const { id } = req.params;
  const query = format(
    `UPDATE movies SET (%I) = ROW(%L) WHERE id = (%L)
    RETURNING *;`,
    Object.keys(req.body),
    Object.values(req.body),
    id
  );
  const data = await client.query(query);

  return res.status(200).json(data.rows[0]);
};
