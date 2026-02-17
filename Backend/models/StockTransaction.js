import mongoose from "mongoose";

const stockTransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: function () {
        return this.type === "IN";
      },
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unitPrice: {
      type: Number,
      min: 0,
    },
    reference: {
      type: String,
      trim: true, // e.g. PO number, sales order, etc.
    },
    notes: {
      type: String,
      trim: true,
    },
    // Convenience snapshot fields so reports can show codes and quantities clearly
    materialCode: {
      type: String,
      trim: true,
    },
    supplierCode: {
      type: String,
      trim: true,
    },
    stockInQuantity: {
      type: Number,
      min: 0,
    },
    stockOutQuantity: {
      type: Number,
      min: 0,
    },
    stockOutDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const StockTransaction = mongoose.model(
  "StockTransaction",
  stockTransactionSchema
);

export default StockTransaction;

