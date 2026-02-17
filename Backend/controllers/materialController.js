import Material from "../models/Material.js";

export const createMaterial = async (req, res, next) => {
  try {
    const material = await Material.create(req.body);
    res.status(201).json({
      success: true,
      message: "Material created",
      data: material,
    });
  } catch (err) {
    next(err);
  }
};

export const getMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find({}).sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: materials,
    });
  } catch (err) {
    next(err);
  }
};

export const getMaterialById = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: "Material not found" });
    }
    res.status(200).json({ success: true, data: material });
  } catch (err) {
    next(err);
  }
};

export const updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: "Material not found" });
    }
    res.status(200).json({
      success: true,
      message: "Material updated",
      data: material,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: "Material not found" });
    }
    res.status(200).json({
      success: true,
      message: "Material deleted",
    });
  } catch (err) {
    next(err);
  }
};

