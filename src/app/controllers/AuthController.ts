import { Response } from "express";
import { BaseController } from "./BaseController";
import { AuthService } from "../services/AuthService";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Messages } from "../../constants/messages";

export class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  register = this.asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, email, password, role } = req.body;
    const result = await this.authService.register(name, email, password, role);

    return this.created(res, result, Messages.REGISTER_SUCCESS);
  });

  login = this.asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);

    return this.ok(res, result, Messages.LOGIN_SUCCESS);
  });

  getProfile = this.asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await this.authService.getProfile(req.userId!);
    return this.ok(res, user, Messages.SUCCESS);
  });

  updateProfile = this.asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name } = req.body;
    const user = await this.authService.updateProfile(req.userId!, { name });
    return this.ok(res, user, Messages.PROFILE_UPDATED);
  });

  changePassword = this.asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { currentPassword, newPassword } = req.body;
      await this.authService.changePassword(
        req.userId!,
        currentPassword,
        newPassword
      );
      return this.ok(res, null, Messages.PASSWORD_CHANGED);
    }
  );
}
