class APIFeatures {
  constructor(query, queryString) {
    // query : Product.find() or Category.find()
    // queryString : req.query
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((field) => delete queryObj[field]);

    const filters = {};

    for (const key in queryObj) {
      const value = queryObj[key];

      if (key.includes("[") && key.includes("]")) {
        const field = key.split("[")[0];
        const operator = key.match(/\[(.*)\]/)[1];
        filters[field] = { [`$${operator}`]: parseFloat(value) };
      } else if (typeof value === "string" && value.includes(",")) {
        filters[key] = { $in: value.split(",").map((v) => v.trim()) };
      } else {
        filters[key] = { $regex: value, $options: "i" };
      }
    }

    if (this.queryString.search) {
      filters.title = { $regex: this.queryString.search, $options: "i" };
    }

    this.query = this.query.find(filters);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
