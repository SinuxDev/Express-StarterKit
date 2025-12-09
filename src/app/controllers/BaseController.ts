import { Request, Response, NextFunction } from "express";

export abstract class BaseController {
  protected asyncHandler(fn: (req: Request, res: Response) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res)).catch(next);
    };
  }

  protected ok(res: Response, data: any) {
    return res.status(200).json({ success: true, data });
  }

  protected created(res: Response, data: any) {
    return res.status(201).json({ success: true, data });
  }
}
