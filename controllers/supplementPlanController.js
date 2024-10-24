const supplementPlanService = require("../services/supplementPlanService");

exports.createSupplementPlan = async (req, res) => {
  try {
    const supplementPlan = await supplementPlanService.createSupplementPlan(
      req.body
    );
    res
      .status(201)
      .json({ message: "Supplement Plan created", supplementPlan });
  } catch (error) {
    res.status(500).json({
      message: "Error creating supplement plan",
      error: error.message,
    });
  }
};

exports.getAllSupplementPlans = async (req, res) => {
  try {
    const supplementPlans = await supplementPlanService.getSupplementPlans();
    res.status(200).json(supplementPlans);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching supplement plans",
      error: error.message,
    });
  }
};

exports.getSupplementPlanById = async (req, res) => {
  try {
    const supplementPlan = await supplementPlanService.getSupplementPlanById(
      req.params.supplementPlanId
    );
    if (!supplementPlan) {
      return res.status(404).json({ message: "Supplement Plan not found" });
    }
    res.status(200).json(supplementPlan);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching supplement plan",
      error: error.message,
    });
  }
};

exports.updateSupplementPlan = async (req, res) => {
  try {
    const updatedSupplementPlan =
      await supplementPlanService.updateSupplementPlan(
        req.params.supplementPlanId,
        req.body
      );
    if (!updatedSupplementPlan) {
      return res.status(404).json({ message: "Supplement Plan not found" });
    }
    res
      .status(200)
      .json({ message: "Supplement Plan updated", updatedSupplementPlan });
  } catch (error) {
    res.status(500).json({
      message: "Error updating supplement plan",
      error: error.message,
    });
  }
};

exports.deleteSupplementPlan = async (req, res) => {
  try {
    const deletedSupplementPlan =
      await supplementPlanService.deleteSupplementPlan(
        req.params.supplementPlanId
      );
    if (!deletedSupplementPlan) {
      return res.status(404).json({ message: "Supplement Plan not found" });
    }
    res
      .status(200)
      .json({ message: "Supplement Plan deleted", deletedSupplementPlan });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting supplement plan",
      error: error.message,
    });
  }
};
