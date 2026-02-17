import express from "express";
import {
  stockIn,
  stockOut,
  listTransactions,
} from "../controllers/stockController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.post("/in", stockIn);
router.post("/out", stockOut);
router.get("/", listTransactions);

export default router;

