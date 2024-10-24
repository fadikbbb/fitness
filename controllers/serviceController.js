const service = require("../services/service");

exports.getServices = async (req, res, next) => {
  try {
    const services = await service.getServices();
    res.status(200).json({
      success: true,
      message: "Services retrieved successfully",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const imageFile = req.files["image"] ? req.files["image"][0] : null;
    const body = req.body;
    const { id } = req.params;
    const updatedContent = await service.updateService(body, id, imageFile);
    res.status(200).json({
      success: true,
      message: "social media updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    next(error);
  }
};
exports.createService = async (req, res, next) => {
  try {
    const imageFile = req.files["image"] ? req.files["image"][0] : null;
    const body = req.body;
    const createdService = await service.createService(body, imageFile);
    res.status(200).json({
      success: true,
      message: "Service created successfully",
      data: createdService,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteService = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedService = await service.deleteService(id);
    res.status(200).json({
      success: true,
      message: "deleted service successfully",
      data: deletedService,
    });
  } catch (error) {
    next(error);
  }
};
