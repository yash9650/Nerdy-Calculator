import { NextFunction, Request, Response } from "express";
import { successResponse } from "../Utils/request.utils";
import { errorResponse } from "../Utils/request.utils";
import appDataSource from "../Database/DataSource";
import { UserEntity } from "../Database/Entities/user.entity";
import bcrypt from "bcrypt";
import passport from "passport";

export class AuthController {
  static async login(req: Request, res: Response) {
    if (req.user?.id) {
      return successResponse(res, req.user);
    }

    return errorResponse(res, "Login failed");
  }

  static async register(req: Request, res: Response): Promise<any> {
    const userRepo = appDataSource.getRepository(UserEntity);
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return errorResponse(res, "Please provide all the details");
    }

    let user = new UserEntity();
    user.name = name;
    user.email = email;
    user.username = username;
    user.hash = bcrypt.hashSync(password, 10);

    try {
      user = await userRepo.save(user);
      passport.authenticate("local")(req, res, () => {
        return successResponse(res, {
          ...user,
          hash: undefined,
        });
      });
    } catch (error) {
      return errorResponse(
        res,
        error?.message || "Unable to register the user"
      );
    }
  }

  static async protect(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      return next();
    }
    return errorResponse(res, "UnAuthorized Access!!", 401);
  }

  static async detect(req: Request, res: Response) {
    if (req.isAuthenticated()) {
      return successResponse(res, {
        ...req.user,
        hash: undefined,
      });
    }
    return errorResponse(res, "", 200);
  }

  static logout(req: Request, res: Response) {
    req.logout(
      {
        keepSessionInfo: false,
      },
      (err) => {
        console.log(err);
      }
    );
    return successResponse(res, "Logged out successfully");
  }
}
