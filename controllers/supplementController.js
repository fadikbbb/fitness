const supplementService = require("../services/supplementService");

// Create a new supplement
exports.createSupplement = async (req, res) => {
  try {
    const body = { ...req.body };
    const imageFile = req.files["image"] ? req.files["image"][0] : null;

    const supplement = await supplementService.createSupplement(
      body,
      imageFile
    );
    res.status(201).json({
      isSuccess: true,
      message: "supplement item created successfully",
      supplement,
    });
  } catch (error) {
    next(error);
  }
};

// Get all supplements
exports.getAllSupplements = async (req, res) => {
  try {
    const { supplements, totalSupplements } =
      await supplementService.getAllSupplements(
        req.filter,
        req.search,
        req.sortBy,
        req.fields,
        req.page,
        req.limit
      );
    res.status(200).json({ isSuccess: true, totalSupplements, supplements });
  } catch (error) {
    next(error);
  }
};

// Get a supplement by ID
exports.getSupplementById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplement = await supplementService.getSupplementById(id);
    if (!supplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }
    res.status(200).json(supplement);
  } catch (error) {
    next(error);
  }
};

// Update a supplement
exports.updateSupplement = async (req, res) => {
  try {
    const { id } = req.params;
    const imageFile = req.files["image"] ? req.files["image"][0] : null;
    const body = { ...req.body };
    const updatedSupplement = await supplementService.updateSupplement(
      id,
      body,
      imageFile
    );
    if (!updatedSupplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }
    res.status(200).json(updatedSupplement);
  } catch (error) {
    next(error);
  }
};

// Delete a supplement
exports.deleteSupplement = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSupplement = await supplementService.deleteSupplement(id);
    if (!deletedSupplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }
    res.status(200).json({ message: "Supplement deleted" });
  } catch (error) {
    next(error);
  }
};
