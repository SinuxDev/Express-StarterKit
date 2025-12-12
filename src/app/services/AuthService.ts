import { UserRepository } from "../repositories/UserRepository";
import { AppException } from "../exceptions/AppException";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { HydratedDocument } from "mongoose";
import { IUser } from "../models/User";
import { Messages } from "../../constants/messages";
import logger from "../../config/logger";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(
    name: string,
    email: string,
    password: string,
    role: "admin" | "user" = "user"
  ): Promise<{ user: HydratedDocument<IUser>; token: string }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      logger.warn(`Registration attempt with existing email: ${email}`);
      throw new AppException(Messages.EMAIL_EXISTS, 409);
    }

    if (!name || name.trim().length < 2) {
      throw new AppException(Messages.NAME_TOO_SHORT, 400);
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new AppException(Messages.INVALID_EMAIL, 400);
    }

    if (!password || password.length < 6) {
      throw new AppException(Messages.PASSWORD_TOO_SHORT, 400);
    }

    const user = await this.userRepository.create({
      name,
      email,
      password,
      role,
    } as any);

    logger.info(`New user registered: ${email} (${role})`);

    const token = this.generateToken(user._id.toString(), user.role);

    return { user, token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: HydratedDocument<IUser>; token: string }> {
    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user) {
      logger.warn(`Failed login attempt for email: ${email}`);
      throw new AppException(Messages.INVALID_CREDENTIALS, 401);
    }

    if (!user.isActive) {
      logger.warn(`Login attempt for deactivated account: ${email}`);
      throw new AppException(Messages.ACCOUNT_DEACTIVATED, 403);
    }

    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
      throw new AppException(Messages.INVALID_CREDENTIALS, 401);
    }

    const token = this.generateToken(user._id.toString(), user.role);
    const userObject = user.toJSON();

    return { user: userObject as any, token };
  }

  async getProfile(userId: string): Promise<HydratedDocument<IUser>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppException(Messages.NOT_FOUND, 404);
    }
    return user;
  }

  async updateProfile(
    userId: string,
    data: { name?: string }
  ): Promise<HydratedDocument<IUser>> {
    const user = await this.userRepository.updateById(userId, data as any);
    if (!user) {
      throw new AppException(Messages.NOT_FOUND, 404);
    }
    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new AppException(Messages.NOT_FOUND, 404);
    }

    const isPasswordValid = await (user as any).comparePassword(
      currentPassword
    );
    if (!isPasswordValid) {
      throw new AppException(Messages.CURRENT_PASSWORD_INCORRECT, 401);
    }

    if (!newPassword || newPassword.length < 6) {
      throw new AppException(Messages.PASSWORD_TOO_SHORT, 400);
    }

    await this.userRepository.updatePassword(userId, newPassword);
  }

  private generateToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, env.jwtSecret, {
      expiresIn: env.jwtExpiry,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): { userId: string; role: string } {
    try {
      return jwt.verify(token, env.jwtSecret) as {
        userId: string;
        role: string;
      };
    } catch (error) {
      logger.warn("Invalid JWT token", error);
      throw new AppException(Messages.UNAUTHORIZED, 401);
    }
  }
}
