import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const validateRequest = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = (error as any).errors.map((e: any) => ({
          field: e.path.join("."),
          message: e.message,
        }));
         res.status(400).json({ success: false, message: "Validation failed", errors });
         return;
      }
      next(error);
    }
  };
};
