import { Request, Response, NextFunction } from "express";

export abstract class BaseController {
  protected asyncHandler(fn: (req: Request, res: Response) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res)).catch(next);
    };
  }

  protected ok(res: Response, data: any, message: string = "Success") {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  protected created(res: Response, data: any, message: string = "Created") {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  protected noContent(res: Response) {
    return res.status(204).send();
  }
}
