import jwt from "jsonwebtoken";
import { Session } from "../models/Session.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access Denied. Token missing." });
    }

    // Verify Session is active in Database
    const activeSession = await Session.findOne({ token });
    if (!activeSession) {
      return res
        .status(401)
        .json({ success: false, message: "Session expired or invalidated." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token confirmation." });
  }
};
