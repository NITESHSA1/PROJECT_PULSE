// Builds a Mongoose query from common query-string params: filtering by exact-match
// fields, a text search across given fields, sorting, and pagination.
const applyApiFeatures = (query, reqQuery, { searchFields = [], filterFields = [] } = {}) => {
  const mongoQuery = {};

  filterFields.forEach((field) => {
    if (reqQuery[field] !== undefined && reqQuery[field] !== '') {
      // support comma-separated values -> $in
      const value = reqQuery[field];
      mongoQuery[field] = value.includes(',') ? { $in: value.split(',') } : value;
    }
  });

  if (reqQuery.search && searchFields.length) {
    const regex = new RegExp(reqQuery.search, 'i');
    mongoQuery.$or = searchFields.map((f) => ({ [f]: regex }));
  }

  let dbQuery = query.find(mongoQuery);

  if (reqQuery.sort) {
    dbQuery = dbQuery.sort(reqQuery.sort.split(',').join(' '));
  } else {
    dbQuery = dbQuery.sort('-createdAt');
  }

  const page = parseInt(reqQuery.page, 10) || 1;
  const limit = parseInt(reqQuery.limit, 10) || 25;
  const skip = (page - 1) * limit;
  dbQuery = dbQuery.skip(skip).limit(limit);

  return { dbQuery, mongoQuery, page, limit };
};

module.exports = applyApiFeatures;
