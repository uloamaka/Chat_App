const { z } = require("zod");
const { BadRequest } = require("../errors/httpErrors");
const { INVALID_REQUEST_PARAMETERS } = require("../errors/httpErrorCodes");

const emailSchema = z.string().refine((value) => {
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    throw new BadRequest("Invalid email format", INVALID_REQUEST_PARAMETERS);
  }
  return true;
});

module.exports = {
  emailSchema,
};