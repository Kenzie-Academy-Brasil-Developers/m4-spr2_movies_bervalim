import { Router } from "express";
import {
  createMovie,
  deleteMovieById,
  getAllMovies,
  getMoviesById,
  updateMovie,
} from "../logic";
import { isMovieNameUnique } from "../middlewares/isMovieNameUnique";
import { isMovieIdValid } from "../middlewares/isMovieIdValid";

export const movieRoutes = Router();

movieRoutes.post("/", isMovieNameUnique, createMovie);

movieRoutes.get("/", getAllMovies);

movieRoutes.get("/:id", isMovieIdValid, getMoviesById);

movieRoutes.patch("/:id", isMovieIdValid, isMovieNameUnique, updateMovie);

movieRoutes.delete("/:id", isMovieIdValid, deleteMovieById);
