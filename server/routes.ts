import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  loginSchema,
  insertCategorySchema,
  insertProductSchema,
  insertTransactionSchema,
  insertReportSchema,
  insertSupportTicketSchema,
  updateProductStatusSchema,
  updateProductApprovalSchema,
  updateTransactionStatusSchema,
  updateReportStatusSchema,
  updateSupportTicketStatusSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // ========== Auth Routes ==========
  // Endpoint temporário para criar admin - REMOVER EM PRODUÇÃO
  app.post("/api/auth/create-admin", async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "E-mail já cadastrado" });
      }

      const user = await storage.createUser({
        name,
        email,
        password,
        isAdmin: true,
        isSeller: false,
      });

      await storage.createActivityLog({
        userId: user.id,
        action: "Usuário administrador criado",
        details: user.name,
      });

      res.json({
        message: "Administrador criado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      res.status(400).json({ error: "Erro ao criar administrador" });
    }
  });

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

      await storage.createActivityLog({
        userId: user.id,
        action: "Novo usuário registrado",
        details: user.name,
      });

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

      await storage.createActivityLog({
        userId: user.id,
        action: "Login realizado",
        details: user.name,
      });

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

      await storage.createActivityLog({
        userId: user.id,
        action: "Admin login realizado",
        details: user.name,
      });

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

  // ========== Category Routes ==========
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar categorias" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);

      await storage.createActivityLog({
        userId: user.id,
        action: "Categoria criada",
        details: category.name,
      });

      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  // ========== Product Routes ==========
  app.get("/api/products", async (req, res) => {
    try {
      const filters = {
        categoryId: req.query.categoryId as string | undefined,
        sellerId: req.query.sellerId as string | undefined,
        status: req.query.status as string | undefined,
        search: req.query.search as string | undefined,
        approvalStatus: req.query.approvalStatus as string | undefined,
      };
      
      // Se não for admin, só mostra produtos aprovados
      const user = req.session?.userId ? await storage.getUser(req.session.userId) : null;
      if (!user?.isAdmin && !filters.sellerId) {
        filters.approvalStatus = "approved";
      }
      
      const products = await storage.getAllProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produto" });
    }
  });

  app.post("/api/products", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct({
        ...validatedData,
        sellerId: req.session.userId,
      });

      await storage.updateUserSellerStatus(req.session.userId, true);

      await storage.createActivityLog({
        userId: req.session.userId,
        action: "Produto criado",
        details: product.title,
      });

      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.patch("/api/products/:id/status", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    try {
      const validatedData = updateProductStatusSchema.parse(req.body);
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      const user = await storage.getUser(req.session.userId);
      if (product.sellerId !== req.session.userId && !user?.isAdmin) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      await storage.updateProductStatus(req.params.id, validatedData.status);

      await storage.createActivityLog({
        userId: req.session.userId,
        action: "Status do produto alterado",
        details: `${product.title} - ${validatedData.status}`,
      });

      res.json({ message: "Status atualizado com sucesso" });
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar status" });
    }
  });

  app.patch("/api/products/:id/approval", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    try {
      const validatedData = updateProductApprovalSchema.parse(req.body);
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      await storage.updateProductApproval(
        req.params.id, 
        validatedData.approvalStatus,
        validatedData.rejectionReason
      );

      const action = validatedData.approvalStatus === "approved" ? "Produto aprovado" : "Produto reprovado";
      await storage.createActivityLog({
        userId: req.session.userId,
        action,
        details: `${product.title}${validatedData.rejectionReason ? ` - ${validatedData.rejectionReason}` : ""}`,
      });

      res.json({ message: `Produto ${validatedData.approvalStatus === "approved" ? "aprovado" : "reprovado"} com sucesso` });
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar aprovação" });
    }
  });

  // ========== Transaction Routes ==========
  app.get("/api/transactions", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (user?.isAdmin) {
        const transactions = await storage.getAllTransactions();
        res.json(transactions);
      } else {
        const transactions = await storage.getTransactionsByUser(
          req.session.userId
        );
        res.json(transactions);
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar transações" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      
      const product = await storage.getProduct(validatedData.productId);
      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      if (product.status !== "active") {
        return res.status(400).json({ error: "Produto não está disponível" });
      }

      if (product.sellerId === req.session.userId) {
        return res.status(400).json({ error: "Você não pode comprar seu próprio produto" });
      }

      const transaction = await storage.createTransaction({
        productId: product.id,
        buyerId: req.session.userId,
        sellerId: product.sellerId,
        amount: product.price,
        status: "pending",
      });

      await storage.updateProductStatus(validatedData.productId, "sold");

      await storage.createActivityLog({
        userId: req.session.userId,
        action: "Transação iniciada",
        details: `Produto: ${product.title}`,
      });

      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.patch("/api/transactions/:id/status", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    try {
      const validatedData = updateTransactionStatusSchema.parse(req.body);
      
      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }

      const user = await storage.getUser(req.session.userId);
      const isParticipant =
        transaction.buyerId === req.session.userId ||
        transaction.sellerId === req.session.userId;

      if (!user?.isAdmin && !isParticipant) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const completedAt =
        validatedData.status === "completed" ? new Date() : undefined;
      await storage.updateTransactionStatus(
        req.params.id,
        validatedData.status,
        completedAt
      );

      await storage.createActivityLog({
        userId: req.session.userId,
        action: "Status da transação alterado",
        details: validatedData.status,
      });

      res.json({ message: "Status atualizado com sucesso" });
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar status" });
    }
  });

  // ========== Report Routes ==========
  app.get("/api/reports", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    try {
      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar denúncias" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    try {
      const validatedData = insertReportSchema.parse(req.body);
      const report = await storage.createReport({
        ...validatedData,
        reporterId: req.session.userId,
      });

      await storage.createActivityLog({
        userId: req.session.userId,
        action: "Denúncia criada",
        details: report.reason,
      });

      res.json(report);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.patch("/api/reports/:id/status", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    try {
      const validatedData = updateReportStatusSchema.parse(req.body);
      await storage.updateReportStatus(req.params.id, validatedData.status);

      await storage.createActivityLog({
        userId: req.session.userId,
        action: "Status da denúncia alterado",
        details: validatedData.status,
      });

      res.json({ message: "Status atualizado com sucesso" });
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar status" });
    }
  });

  // ========== Support Ticket Routes ==========
  app.get("/api/support", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    try {
      const tickets = await storage.getAllSupportTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar tickets" });
    }
  });

  app.post("/api/support", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    try {
      const validatedData = insertSupportTicketSchema.parse(req.body);
      const ticket = await storage.createSupportTicket({
        ...validatedData,
        userId: req.session.userId,
      });

      await storage.createActivityLog({
        userId: req.session.userId,
        action: "Ticket de suporte criado",
        details: ticket.subject,
      });

      res.json(ticket);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.patch("/api/support/:id/status", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    try {
      const validatedData = updateSupportTicketStatusSchema.parse(req.body);
      const resolvedAt =
        validatedData.status === "resolved" ? new Date() : undefined;
      await storage.updateSupportTicketStatus(
        req.params.id,
        validatedData.status,
        resolvedAt
      );

      await storage.createActivityLog({
        userId: req.session.userId,
        action: "Status do ticket alterado",
        details: validatedData.status,
      });

      res.json({ message: "Status atualizado com sucesso" });
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar status" });
    }
  });

  // ========== Admin Routes ==========
  app.get("/api/admin/users", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  });

  app.get("/api/admin/statistics", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
  });

  app.get("/api/admin/activity", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : 10;
      const activities = await storage.getRecentActivityLogs(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar atividades" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
