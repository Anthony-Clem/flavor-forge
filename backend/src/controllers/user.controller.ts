import { NOT_FOUND, OK } from "../config/http.config";
import { userSchema } from "../lib/schemas";
import UserModel from "../models/user.model";
import { updateUser } from "../services/user.service";
import { appAssert } from "../utils/appAssert";
import { asyncHandler } from "../utils/asyncHandler";

export const getUserHandler = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  return res.status(OK).json(user);
});

export const updateUserHandler = asyncHandler(async (req, res) => {
  const data = userSchema.parse({ ...req.body, id: req.userId });

  await updateUser(data);

  return res.status(OK).json({
    message: "User updated successfully",
  });
});
