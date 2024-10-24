const exerciseService = require("../services/exerciseService");

// Create a new exercise
exports.createExercise = async (req, res, next) => {
  try {
    const body = { ...req.body };
    const imageFile = req.files["image"] ? req.files["image"][0] : null;
    const videoFile = req.files["video"] ? req.files["video"][0] : null;
    const exercise = await exerciseService.createExercise(
      body,
      imageFile,
      videoFile
    );
    res.status(201).send({
      isSuccess: true,
      message: "Exercise created successfully",
      exercises: exercise,
    });
  } catch (error) {
    next(error);
  }
};
exports.getAllExercises = async (req, res, next) => {
  try {
    const { exercises, totalExercises } = await exerciseService.getAllExercises(
      req.filter,
      req.search,
      req.sortBy,
      req.fields,
      req.page,
      req.limit
    );

    res.status(200).send({
      isSuccess: true,
      totalExercises: totalExercises,
      exercises: exercises,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single exercise by ID
exports.getExerciseById = async (req, res, next) => {
  try {
    const { exerciseId } = req.params;
    const exercise = await exerciseService.getExerciseById(exerciseId);
    if (!exercise) {
      return res.status(404).send({ error: "Exercise not found" });
    }
    res.status(200).send({ isSuccess: true, exercise: exercise });
  } catch (error) {
    next(error);
  }
};

// Update an exercise
exports.updateExercise = async (req, res, next) => {
  try {
    const imageFile = req.files["image"] ? req.files["image"][0] : null;
    const videoFile = req.files["video"] ? req.files["video"][0] : null;
    const { exerciseId } = req.params;
    const body = req.body;
    const exercise = await exerciseService.updateExercise(
      exerciseId,
      body,
      imageFile,
      videoFile
    );
    if (!exercise) {
      return res.status(404).send({ error: "Exercise not found" });
    }
    res.status(200).send({
      isSuccess: true,
      message: "Exercise updated successfully",
      exercises: exercise,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an exercise
exports.deleteExercise = async (req, res, next) => {
  try {
    const { exerciseId } = req.params;
    const exercise = await exerciseService.deleteExercise(exerciseId);
    if (!exercise) {
      return res.status(404).send({ error: "Exercise not found" });
    }
    res
      .status(200)
      .send({ isSuccess: true, message: "Exercise deleted successfully" });
  } catch (error) {
    next(error);
  }
};
