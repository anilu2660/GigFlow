import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
         res.status(401).json({ success: false, message: "Not authorized, user not found" });
         return;
      }
      req.user = user as IUser;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Not authorized, token failed" });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: "Not authorized, no token" });
    return;
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
       res.status(403).json({
        success: false,
        message: `User role ${req.user?.role} is not authorized to access this route`,
      });
      return;
    }
    next();
  };
};
