import { Router } from "express";
import { getErrorResponse } from "../lib/errors.js";
import { requirePermission } from "../lib/session.js";
import { createUser, deleteUser, listUsers, updateUser } from "../lib/users.js";

export const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  try {
    await requirePermission(req, "users:read");
    res.json({ users: await listUsers() });
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    res.status(status).json({ message });
  }
});

usersRouter.post("/", async (req, res) => {
  try {
    const actor = await requirePermission(req, "users:create");
    const user = await createUser(req.body, actor.id);
    res.status(201).json({ user });
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    res.status(status).json({ message });
  }
});

usersRouter.patch("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({ message: "Invalid user id." });
      return;
    }

    const actor = await requirePermission(req, "users:update");
    const user = await updateUser(userId, req.body, actor.id);
    res.json({ user });
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    res.status(status).json({ message });
  }
});

usersRouter.delete("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({ message: "Invalid user id." });
      return;
    }

    const actor = await requirePermission(req, "users:delete");
    await deleteUser(userId, actor.id);
    res.json({ ok: true });
  } catch (error) {
    const { message, status } = getErrorResponse(error);
    res.status(status).json({ message });
  }
});
