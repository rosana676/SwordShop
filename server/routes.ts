import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "E-mail já cadastrado" });
      }

      const user = await storage.createUser(validatedData);
      
      if (req.session) {
        req.session.userId = user.id;
      }
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "E-mail ou senha incorretos" });
      }

      const isValidPassword = await storage.verifyPassword(user, password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "E-mail ou senha incorretos" });
      }

      if (req.session) {
        req.session.userId = user.id;
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.post("/api/auth/admin/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Acesso negado" });
      }

      const isValidPassword = await storage.verifyPassword(user, password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "E-mail ou senha incorretos" });
      }

      if (req.session) {
        req.session.userId = user.id;
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
