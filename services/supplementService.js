const Supplement = require("../models/SupplementModel");
const apiError = require("../utils/apiError");
const {
  uploadToStorage,
  deleteFile,
  updateFile,
} = require("../utils/uploadUtils");

// Create a new supplement
exports.createSupplement = async (supplement, image) => {
  try {
    if (image) {
      supplement.image = await uploadToStorage(
        image.originalname,
        image.mimetype,
        image.buffer,
        "img"
      );
    }
    const createdSupplement = await Supplement.create(supplement);
    return createdSupplement;
  } catch (error) {
    throw error;
  }
};

// Get all supplements with filtering, sorting, searching, and pagination
exports.getAllSupplements = async (
  filter,
  search,
  sortBy,
  fields,
  page = 1,
  limit = 10
) => {
  try {
    let supplementQuery = Supplement.find(filter);

    // Search by name
    if (search) {
      const searchRegex = new RegExp(search, "i");
      supplementQuery = supplementQuery.find({ name: { $regex: searchRegex } });
    }

    // Sort by specified fields
    if (sortBy) {
      const sortByFields = sortBy.split(",").join(" ");
      supplementQuery = supplementQuery.sort(sortByFields);
    }

    // Select specified fields
    if (fields) {
      const selectedFields = fields.split(",").join(" ");
      supplementQuery = supplementQuery.select(selectedFields);
    }

    // Pagination
    const skip = (page - 1) * limit;
    supplementQuery = supplementQuery.skip(skip).limit(limit);

    // Fetch supplements and total count
    const [supplements, totalSupplements] = await Promise.all([
      supplementQuery.exec(),
      Supplement.countDocuments(filter),
    ]);

    return { totalSupplements, supplements };
  } catch (error) {
    throw error;
  }
};

// Get a supplement by ID
exports.getSupplementById = async (id) => {
  try {
    const supplement = await Supplement.findById(id);
    return supplement;
  } catch (error) {
    throw error;
  }
};

// Update a supplement
exports.updateSupplement = async (id, body, image) => {
  try {
    const supplement = await Supplement.findById(id);
    if (!supplement) {
      throw new apiError("Supplement not found", 404);
    }

    if (image) {
      // Replace the existing image
      await updateFile(
        supplement.image,
        image.originalname,
        image.mimetype,
        image.buffer
      );
      body.image = supplement.image;
    }

    const updatedSupplement = await Supplement.findByIdAndUpdate(id, body, {
      new: true,
    });
    return updatedSupplement;
  } catch (error) {
    throw error;
  }
};

// Delete a supplement
exports.deleteSupplement = async (id) => {
  try {
    const supplement = await Supplement.findByIdAndDelete(id);
    if (supplement && supplement.image) {
      await deleteFile(supplement.image); 
    }
    return supplement;
  } catch (error) {
    throw error;
  }
};
