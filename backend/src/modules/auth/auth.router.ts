import { Router } from "express";
import { requireAuth } from "../../middlewares/require-auth";
import { signup, login, logout, me } from "./controllers/auth.controller";

// Express 5 forwards rejected promises from async handlers to the central
// error handler, so no asyncHandler wrapper is needed here.
const authRouter = Router();

authRouter.post("/signup", signup); // POST /auth/signup
authRouter.post("/login", login); // POST /auth/login
authRouter.post("/logout", logout); // POST /auth/logout
authRouter.get("/me", requireAuth, me); // GET /auth/me

export default authRouter;
