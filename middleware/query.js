const query = (model) => {
  return async (req, res, next) => {
    try {
      let filter = { ...req.query };
      const excludeFields = ["page", "sort", "limit", "fields"];
      excludeFields.forEach((field) => delete filter[field]);

      // Convert query operators to MongoDB operators
      let queryStr = JSON.stringify(filter).replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      filter = JSON.parse(queryStr);

      let query = model.find(filter); // Use the dynamic model here

      // Sort users if specified
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }

      // Select specific fields if specified
      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
      } else {
        query = query.select("-__v"); // Exclude version key
      }

      // Pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);

      // Execute the query and set the results in `res.queryResults`
      res.queryResults = await query;

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { query };
