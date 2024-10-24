const apiError = require("../utils/apiError");
const {
  updateFile,
  uploadToStorage,
  deleteFile,
} = require("../utils/uploadUtils");
const Service = require("../models/ServiceModels");

exports.getServices = async () => {
  try {
    const services = await Service.find();
    return services;
  } catch (error) {
    throw error;
  }
};

exports.updateService = async (serviceData, id, fileImage) => {
  try {
    let service = await Service.findOne({ _id: id });
    if (!service) {
      throw new apiError("Service not found", 404);
    }
    if (fileImage) {
      service.image = await updateFile(
        service.image,
        fileImage.originalname,
        fileImage.mimetype,
        fileImage.buffer,
        "img"
      );
    }
    Object.assign(service, serviceData);
    const updatedContent = await service.save();
    return updatedContent;
  } catch (error) {
    throw error;
  }
};
exports.createService = async (serviceData, fileImage) => {
  try {
    if (fileImage) {
      serviceData.image = await uploadToStorage(
        fileImage.originalname,
        fileImage.mimetype,
        fileImage.buffer,
        "img"
      );
    }
    const createdService = await Service.create(serviceData);
    return createdService;
  } catch (error) {
    throw error;
  }
};

exports.deleteService = async (id) => {
  try {
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      throw new apiError("Service not found", 404);
    }
    if (deletedService.image) {
      await deleteFile(deletedService.image);
    }
    return deletedService;
  } catch (error) {
    throw error;
  }
};
