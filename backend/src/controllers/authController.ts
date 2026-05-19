import { Request, Response } from "express";
import User from "../models/User";
import generateToken from "../utils/generateToken";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
       res.status(400).json({ success: false, message: "User already exists" });
       return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
       res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
      return;
    } else {
       res.status(400).json({ success: false, message: "Invalid user data" });
       return;
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id as unknown as string, user.role);

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
      return;
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select("-password");
    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
      return;
    } else {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};
