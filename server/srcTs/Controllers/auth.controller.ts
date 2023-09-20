import { NextFunction, Request, Response } from "express";
import { successResponse } from "../Utils/request.utils";
import { errorResponse } from "../Utils/request.utils";
import appDataSource from "../Database/DataSource";
import { UserEntity } from "../Database/Entities/user.entity";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
export class AuthController {
  private static _createToken(user: Partial<UserEntity>) {
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    return token;
  }

  private static _verifyToken(token: string) {
    try {
      const user = jwt.verify(token, JWT_SECRET) as Partial<UserEntity>;
      return { err: null, user: user };
    } catch (error) {
      return { err: error.message, user: null };
    }
  }

  static async login(req: Request, res: Response) {
    if (req.user?.id) {
      const token = AuthController._createToken(req.user);
      res.cookie("token", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
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
        const token = AuthController._createToken(user);
        res.cookie("token", token, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
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
    const verified = AuthController._verifyToken(req.cookies?.token);

    if (verified?.user) {
      req.user = verified.user;
      return next();
    }
    return errorResponse(res, "UnAuthorized Access!!", 401);
  }

  static async detect(req: Request, res: Response) {
    const verified = AuthController._verifyToken(req.cookies?.token);
    if (verified.user) {
      return successResponse(res, {
        ...verified.user,
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
    res.clearCookie("token");
    return successResponse(res, "Logged out successfully");
  }
}
