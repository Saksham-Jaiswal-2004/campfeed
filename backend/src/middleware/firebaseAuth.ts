import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { db } from "../config/firebaseAdmin.js";

export const firebaseAuth = async (
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

    const decoded = await admin.auth().verifyIdToken(token);

    const userSnap = await db.collection("users").doc(decoded.uid).get();
    const userData = userSnap.data();

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
