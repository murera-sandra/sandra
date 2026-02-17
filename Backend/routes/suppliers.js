import express from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.route("/").get(getSuppliers).post(createSupplier);

router
  .route("/:id")
  .get(getSupplierById)
  .put(updateSupplier)
  .delete(deleteSupplier);

export default router;

