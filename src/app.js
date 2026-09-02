import express from "express";
import blockchainRoutes from "./routes/blockchainRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

const app = express();
app.use(express.json());
app.use("/api", blockchainRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;