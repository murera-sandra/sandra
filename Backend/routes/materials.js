import express from "express";
import {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from "../controllers/materialController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.route("/").get(getMaterials).post(createMaterial);

router
  .route("/:id")
  .get(getMaterialById)
  .put(updateMaterial)
  .delete(deleteMaterial);

export default router;

