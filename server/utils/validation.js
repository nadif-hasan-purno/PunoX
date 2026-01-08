const requireFields = (fields, body) => {
  for (const field of fields) {
    if (
      body[field] === undefined ||
      body[field] === null ||
      body[field] === ""
    ) {
      throw new Error(`${field} is required`);
    }
  }
};

module.exports = { requireFields };
