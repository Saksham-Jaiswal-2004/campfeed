import { Request, Response, NextFunction } from "express";
import { db, auth } from "../config/firebaseAdmin.js";

export const notAStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await auth.verifyIdToken(token);

    const userSnap = await db.collection("users").doc(decoded.uid).get();
    const userData = userSnap.data();

    const role = userData?.role || "student";

    if (role === "student") {
      return res.status(403).json({
        message: "Forbidden: Students are not allowed",
      });
    }

    (req as any).user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || "",
      role: userData?.role || "student",
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
