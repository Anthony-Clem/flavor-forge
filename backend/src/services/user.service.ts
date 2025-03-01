import { NOT_FOUND } from "../config/http.config";
import { UserParams } from "../lib/types";
import UserModel from "../models/user.model";
import { appAssert } from "../utils/appAssert";

export const updateUser = async ({ firstName, lastName, id }: UserParams) => {
  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
    },
    {
      new: true,
    }
  );
  appAssert(user, NOT_FOUND, "User not found");

  return {
    user,
  };
};
