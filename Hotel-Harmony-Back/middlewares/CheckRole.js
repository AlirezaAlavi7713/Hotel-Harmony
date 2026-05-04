export const checkRole = (...rolesAutorises) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(403).json({ message: "Rôle manquant dans le token" });
    }

    if (!rolesAutorises.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    return next();
  };
};
