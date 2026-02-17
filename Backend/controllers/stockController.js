import mongoose from "mongoose";
import Material from "../models/Material.js";
import Supplier from "../models/Supplier.js";
import StockTransaction from "../models/StockTransaction.js";

export const stockIn = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { materialId, supplierId, quantity, unitPrice, reference, notes } =
      req.body;

    if (!materialId || !supplierId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "materialId, supplierId and quantity are required",
      });
    }

    const material = await Material.findById(materialId).session(session);
    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: "Material not found" });
    }

    const supplier = await Supplier.findById(supplierId).session(session);
    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    material.currentStock += Number(quantity);
    if (unitPrice != null) {
      material.unitPrice = unitPrice;
    }
    await material.save({ session });

    const tx = await StockTransaction.create(
      [
        {
          type: "IN",
          material: material._id,
          supplier: supplier._id,
          quantity,
          unitPrice: unitPrice ?? material.unitPrice,
          reference,
          notes,
          materialCode: material.materialCode,
          supplierCode: supplier.supplierCode,
          stockInQuantity: quantity,
          createdBy: req.user._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Stock-in recorded",
      data: tx[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const stockOut = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { materialId, quantity, reference, notes } = req.body;

    if (!materialId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "materialId and quantity are required",
      });
    }

    const material = await Material.findById(materialId).session(session);
    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: "Material not found" });
    }

    if (material.currentStock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    material.currentStock -= Number(quantity);
    await material.save({ session });

    const tx = await StockTransaction.create(
      [
        {
          type: "OUT",
          material: material._id,
          quantity,
          reference,
          notes,
          materialCode: material.materialCode,
          stockOutQuantity: quantity,
          stockOutDate: new Date(),
          createdBy: req.user._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Stock-out recorded",
      data: tx[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const listTransactions = async (req, res, next) => {
  try {
    const { type, materialId, supplierId } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (materialId) filter.material = materialId;
    if (supplierId) filter.supplier = supplierId;

    const txs = await StockTransaction.find(filter)
      .populate("material", "name unit")
      .populate("supplier", "companyName")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: txs,
    });
  } catch (err) {
    next(err);
  }
};

