import { Router } from "express";
import { getAllUsers, userLogin, userLogout,userSignup, verifyUser, saveDashboardData, getDashboardData } from "../controllers/user-controller.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";
const userRoutes = Router();
userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/dashboard-data", verifyToken, getDashboardData);
userRoutes.post("/save-dashboard", verifyToken, saveDashboardData);
userRoutes.get("/logout", verifyToken, userLogout);

export default userRoutes;
//# sourceMappingURL=user-routes.js.map