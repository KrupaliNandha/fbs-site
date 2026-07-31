import { Router } from "express";
import { getErrorResponse } from "../lib/errors.js";
import { isAuthRole } from "../lib/roles.js";
import {
  clearSessionCookie,
  getCurrentUser,
  loginWithRole,
  logoutCurrentSession,
  setSessionCookie,
} from "../lib/session.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const role = req.body?.role;

    if (!isAuthRole(role)) {
      res.status(400).json({ message: "Unsupported role." });
      return;
    }

    const { user, token, expiresAt, redirectTo } = await loginWithRole(
      email,
      password,
      role,
    );
    setSessionCookie(res, token, expiresAt);
    res.json({ user, redirectTo });
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    res.status(status).json({ message });
  }
});

authRouter.post("/logout", async (_req, res) => {
  try {
    await logoutCurrentSession();
    clearSessionCookie(res);
    res.json({ ok: true });
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    res.status(status).json({ message });
  }
});

authRouter.get("/me", async (req, res) => {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      res.status(401).json({ user: null });
      return;
    }

    res.json({ user });
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    res.status(status).json({ message });
  }
});
