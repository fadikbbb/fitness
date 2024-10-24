const SupplementPlan = require("../models/SupplementPlanModel");

exports.createSupplementPlan = async (data) => {
  const supplementPlan = new SupplementPlan(data);
  return await supplementPlan.save();
};

exports.getSupplementPlans = async () => {
  return await SupplementPlan.find().populate("supplementId");
};

exports.getSupplementPlanById = async (id) => {
  return await SupplementPlan.findById(id).populate("supplementId");
};

exports.updateSupplementPlan = async (id, data) => {
  return await SupplementPlan.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteSupplementPlan = async (id) => {
  return await SupplementPlan.findByIdAndDelete(id);
};
