import { Router } from "express";
import { createMovie } from "../logic";

export const movieRoutes = Router();

movieRoutes.post("/", createMovie);

movieRoutes.get("/");

movieRoutes.get("/:id");

movieRoutes.patch("/:id");

movieRoutes.delete("/:id");
