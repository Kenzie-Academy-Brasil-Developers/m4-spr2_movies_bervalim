import "dotenv/config";
import express from "express";
import { connectDatabase, createTable } from "./database";
import { movieRoutes } from "./routers/movies.routes";

const app = express();

app.use(express.json());

app.use("/movies", movieRoutes);

const PORT = process.env.PORT;

app.listen(PORT, async () => {
  console.log(`API started sucessfully in port ${PORT}`);
  await connectDatabase();
  await createTable();
});
