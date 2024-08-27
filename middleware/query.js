const query = (model) => {
  return async (req, res, next) => {
    try {
      // Extract and prepare filter from query parameters
      let filter = { ...req.query };
      const excludeFields = ['page', 'sort', 'limit', 'fields'];
      excludeFields.forEach((field) => delete filter[field]);

      // Convert query operators to MongoDB operators
      let queryStr = JSON.stringify(filter).replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      filter = JSON.parse(queryStr);

      // Build the query
      let query = model.find(filter);

      // Apply sorting if specified
      if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('-createdAt'); // Default sort
      }

      // Apply field selection if specified
      if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
      } else {
        query = query.select('-__v'); // Default field exclusion
      }

      // Apply pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);

      // Execute the query and attach results to `res.queryResults`
      res.queryResults = await query;

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { query };
