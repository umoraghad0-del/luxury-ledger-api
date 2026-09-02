import express from "express";
import {
  getChain,
  createTransaction,
  mineBlock
} from "../controllers/blockchainController.js";

const router = express.Router();

router.get("/blockchain", getChain);
router.post("/transactions", createTransaction);
router.post("/mine", mineBlock);

export default router;