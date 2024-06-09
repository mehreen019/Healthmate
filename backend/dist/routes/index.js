import { Router } from "express";
import userRoutes from "./user-routes.js";
import chatRoutes from "./chat-routes.js";
const appRouter = Router();
appRouter.use("/user", userRoutes); //domain/api/v1/user
appRouter.use("/chat", chatRoutes); //domain/api/v1/chat
appRouter.use("/user/dashboard", userRoutes); //domain/api/v1/user/dashboard
appRouter.use("/user/appointment", userRoutes); //domain/api/v1/user/dashboard
export default appRouter;
//# sourceMappingURL=index.js.map