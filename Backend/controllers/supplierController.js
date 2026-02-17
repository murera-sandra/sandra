import Supplier from "../models/Supplier.js";

export const createSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({
      success: true,
      message: "Supplier created",
      data: supplier,
    });
  } catch (err) {
    next(err);
  }
};

export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find({}).sort({ companyName: 1 });
    res.status(200).json({
      success: true,
      data: suppliers,
    });
  } catch (err) {
    next(err);
  }
};

export const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (err) {
    next(err);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }
    res.status(200).json({
      success: true,
      message: "Supplier updated",
      data: supplier,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }
    res.status(200).json({
      success: true,
      message: "Supplier deleted",
    });
  } catch (err) {
    next(err);
  }
};

