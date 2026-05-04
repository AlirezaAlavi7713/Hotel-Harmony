import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const checkToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Format invalide: Bearer <token>" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
