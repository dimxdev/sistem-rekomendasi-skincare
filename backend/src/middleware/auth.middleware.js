import { verifyToken } from "../utils/jwt.js";

export async function authMiddleware(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const token = bearerToken.split(" ")[1];

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
}