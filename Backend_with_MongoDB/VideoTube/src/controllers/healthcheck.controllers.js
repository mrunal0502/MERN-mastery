import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const healthCheck = asyncHandler(async (req, res) => {
  console.log("Inside healthcheck controller");
  return res.status(200).json(new ApiResponse(200, "OK", "API is healthy"));
});

export { healthCheck };
