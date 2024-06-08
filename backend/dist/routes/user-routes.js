import { Router } from "express";
import { getAllUsers, userLogin, userSignup, verifyUser, saveDashboardData } from "../controllers/user-controller.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";
const userRoutes = Router();
userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.post("/save-dashboard", verifyToken, saveDashboardData);
export default userRoutes;
//# sourceMappingURL=user-routes.js.map