import {
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Transaction,
  type InsertTransaction,
  type Report,
  type InsertReport,
  type SupportTicket,
  type InsertSupportTicket,
  type ActivityLog,
  type InsertActivityLog,
} from "@shared/schema";
import {
  users,
  categories,
  products,
  transactions,
  reports,
  supportTickets,
  activityLogs,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count, or, ilike } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(user: User, password: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  updateUserSellerStatus(id: string, isSeller: boolean): Promise<void>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getAllProducts(filters?: {
    categoryId?: string;
    sellerId?: string;
    status?: string;
    search?: string;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStatus(id: string, status: string): Promise<void>;
  getProductsBySeller(sellerId: string): Promise<Product[]>;

  // Transactions
  getAllTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(
    id: string,
    status: string,
    completedAt?: Date
  ): Promise<void>;
  getTransactionsByUser(userId: string): Promise<Transaction[]>;

  // Reports
  getAllReports(): Promise<Report[]>;
  getReport(id: string): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  updateReportStatus(id: string, status: string): Promise<void>;

  // Support Tickets
  getAllSupportTickets(): Promise<SupportTicket[]>;
  getSupportTicket(id: string): Promise<SupportTicket | undefined>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicketStatus(
    id: string,
    status: string,
    resolvedAt?: Date
  ): Promise<void>;

  // Activity Logs
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getRecentActivityLogs(limit?: number): Promise<ActivityLog[]>;

  // Statistics
  getStatistics(): Promise<{
    totalUsers: number;
    totalProducts: number;
    todayTransactions: number;
    pendingReports: number;
    activeProducts: number;
    totalSellers: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const result = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return result[0];
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserSellerStatus(
    id: string,
    isSeller: boolean
  ): Promise<void> {
    await db.update(users).set({ isSeller }).where(eq(users.id, id));
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(categories.name);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return result[0];
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const result = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return result[0];
  }

  // Products
  async getAllProducts(filters?: {
    categoryId?: string;
    sellerId?: string;
    status?: string;
    search?: string;
  }): Promise<Product[]> {
    let query = db.select().from(products);

    const conditions = [];
    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }
    if (filters?.sellerId) {
      conditions.push(eq(products.sellerId, filters.sellerId));
    }
    if (filters?.status) {
      conditions.push(eq(products.status, filters.status));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(products.title, `%${filters.search}%`),
          ilike(products.description, `%${filters.search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return query.orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(insertProduct).returning();
    return result[0];
  }

  async updateProductStatus(id: string, status: string): Promise<void> {
    await db.update(products).set({ status }).where(eq(products.id, id));
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.sellerId, sellerId))
      .orderBy(desc(products.createdAt));
  }

  // Transactions
  async getAllTransactions(): Promise<Transaction[]> {
    return db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const result = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return result[0];
  }

  async createTransaction(transactionData: {
    productId: string;
    buyerId: string;
    sellerId: string;
    amount: string;
    status: string;
  }): Promise<Transaction> {
    const result = await db
      .insert(transactions)
      .values(transactionData)
      .returning();
    return result[0];
  }

  async updateTransactionStatus(
    id: string,
    status: string,
    completedAt?: Date
  ): Promise<void> {
    await db
      .update(transactions)
      .set({ status, completedAt })
      .where(eq(transactions.id, id));
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(
        or(
          eq(transactions.buyerId, userId),
          eq(transactions.sellerId, userId)
        )
      )
      .orderBy(desc(transactions.createdAt));
  }

  // Reports
  async getAllReports(): Promise<Report[]> {
    return db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async getReport(id: string): Promise<Report | undefined> {
    const result = await db.select().from(reports).where(eq(reports.id, id));
    return result[0];
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const result = await db.insert(reports).values(insertReport).returning();
    return result[0];
  }

  async updateReportStatus(id: string, status: string): Promise<void> {
    await db.update(reports).set({ status }).where(eq(reports.id, id));
  }

  // Support Tickets
  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return db
      .select()
      .from(supportTickets)
      .orderBy(desc(supportTickets.createdAt));
  }

  async getSupportTicket(id: string): Promise<SupportTicket | undefined> {
    const result = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, id));
    return result[0];
  }

  async createSupportTicket(
    insertTicket: InsertSupportTicket
  ): Promise<SupportTicket> {
    const result = await db
      .insert(supportTickets)
      .values(insertTicket)
      .returning();
    return result[0];
  }

  async updateSupportTicketStatus(
    id: string,
    status: string,
    resolvedAt?: Date
  ): Promise<void> {
    await db
      .update(supportTickets)
      .set({ status, resolvedAt })
      .where(eq(supportTickets.id, id));
  }

  // Activity Logs
  async createActivityLog(
    insertLog: InsertActivityLog
  ): Promise<ActivityLog> {
    const result = await db
      .insert(activityLogs)
      .values(insertLog)
      .returning();
    return result[0];
  }

  async getRecentActivityLogs(limit: number = 10): Promise<ActivityLog[]> {
    return db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  // Statistics
  async getStatistics(): Promise<{
    totalUsers: number;
    totalProducts: number;
    todayTransactions: number;
    pendingReports: number;
    activeProducts: number;
    totalSellers: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsersResult,
      totalProductsResult,
      todayTransactionsResult,
      pendingReportsResult,
      activeProductsResult,
      totalSellersResult,
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(products),
      db
        .select({ count: count() })
        .from(transactions)
        .where(sql`${transactions.createdAt} >= ${today}`),
      db
        .select({ count: count() })
        .from(reports)
        .where(eq(reports.status, "pending")),
      db
        .select({ count: count() })
        .from(products)
        .where(eq(products.status, "active")),
      db
        .select({ count: count() })
        .from(users)
        .where(eq(users.isSeller, true)),
    ]);

    return {
      totalUsers: totalUsersResult[0]?.count || 0,
      totalProducts: totalProductsResult[0]?.count || 0,
      todayTransactions: todayTransactionsResult[0]?.count || 0,
      pendingReports: pendingReportsResult[0]?.count || 0,
      activeProducts: activeProductsResult[0]?.count || 0,
      totalSellers: totalSellersResult[0]?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
