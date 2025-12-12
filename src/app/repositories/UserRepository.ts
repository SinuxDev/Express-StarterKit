import { BaseRepository } from "./BaseRepository";
import { IUser, UserModel } from "../models/User";
import { HydratedDocument } from "mongoose";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<HydratedDocument<IUser> | null> {
    return this.model.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByEmailWithPassword(
    email: string
  ): Promise<HydratedDocument<IUser> | null> {
    return this.model
      .findOne({ email: email.toLowerCase() })
      .select("+password")
      .exec();
  }

  async findActiveUsers(): Promise<HydratedDocument<IUser>[]> {
    return this.findAll({ isActive: true });
  }

  async findByIdWithPassword(
    userId: string
  ): Promise<HydratedDocument<IUser> | null> {
    return this.model.findById(userId).select("+password").exec();
  }

  async updatePassword(
    userId: string,
    newPassword: string
  ): Promise<HydratedDocument<IUser> | null> {
    const user = await this.model.findById(userId).select("+password").exec();
    if (!user) return null;

    user.password = newPassword;
    await user.save();
    return user;
  }
}
