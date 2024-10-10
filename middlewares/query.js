const query = () => {
    return async (req, res, next) => {
        try {
            const DEFAULT_PAGE = 1;
            const DEFAULT_LIMIT = 5;

            let filter = { ...req.query };
            const excludeFields = ['search', 'page', 'sort', 'limit', 'fields'];
            excludeFields.forEach((field) => delete filter[field]);
            let queryStr = JSON.stringify(filter).replace(
                /\b(gte|gt|lte|lt)\b/g,
                (match) => `$${match}`
            );
            
            filter = JSON.parse(queryStr);
            // Assign query params to req object
            req.search = req.query.search ? req.query.search.trim() : null;
            req.filter = filter;
            req.sortBy = req.query.sort || '';
            req.fields = req.query.fields || '';
            req.page = parseInt(req.query.page, 10) || DEFAULT_PAGE;
            req.limit = parseInt(req.query.limit > 20 ? 20 : req.query.limit, 10) || DEFAULT_LIMIT;
            next();
        } catch (err) {
            next(err);
        }
    };
};

module.exports = { query };
