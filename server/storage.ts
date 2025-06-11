import { 
  users, 
  type User, 
  type InsertUser, 
  accessibilitySettings, 
  type AccessibilitySettings,
  type InsertAccessibilitySettings,
  accessibilityAnalytics,
  type AccessibilityAnalytics,
  type InsertAccessibilityAnalytics
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { db } from "./db";

// Storage interface with all CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Accessibility settings methods
  getUserSettings(userId: number): Promise<AccessibilitySettings | undefined>;
  createUserSettings(settings: InsertAccessibilitySettings): Promise<AccessibilitySettings>;
  updateUserSettings(id: number, settings: InsertAccessibilitySettings): Promise<AccessibilitySettings | undefined>;
  
  // Analytics methods
  createAnalyticsEvent(event: InsertAccessibilityAnalytics): Promise<AccessibilityAnalytics>;
  getAnalyticsEvents(filter?: Partial<AccessibilityAnalytics>): Promise<AccessibilityAnalytics[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private settings: Map<number, AccessibilitySettings>;
  private analytics: Map<number, AccessibilityAnalytics>;
  currentUserId: number;
  currentSettingsId: number;
  currentAnalyticsId: number;

  constructor() {
    this.users = new Map();
    this.settings = new Map();
    this.analytics = new Map();
    this.currentUserId = 1;
    this.currentSettingsId = 1;
    this.currentAnalyticsId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Settings methods
  async getUserSettings(userId: number): Promise<AccessibilitySettings | undefined> {
    return Array.from(this.settings.values()).find(
      (setting) => setting.userId === userId,
    );
  }

  async createUserSettings(insertSettings: InsertAccessibilitySettings): Promise<AccessibilitySettings> {
    const id = this.currentSettingsId++;
    const now = new Date();
    const settings: AccessibilitySettings = {
      ...insertSettings,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.settings.set(id, settings);
    return settings;
  }

  async updateUserSettings(id: number, updateSettings: InsertAccessibilitySettings): Promise<AccessibilitySettings | undefined> {
    const existing = this.settings.get(id);
    if (!existing) return undefined;

    const updated: AccessibilitySettings = {
      ...existing,
      ...updateSettings,
      updatedAt: new Date(),
    };
    this.settings.set(id, updated);
    return updated;
  }

  // Analytics methods
  async createAnalyticsEvent(insertEvent: InsertAccessibilityAnalytics): Promise<AccessibilityAnalytics> {
    const id = this.currentAnalyticsId++;
    const now = new Date();
    const event: AccessibilityAnalytics = {
      ...insertEvent,
      id,
      createdAt: now,
    };
    this.analytics.set(id, event);
    return event;
  }

  async getAnalyticsEvents(filter?: Partial<AccessibilityAnalytics>): Promise<AccessibilityAnalytics[]> {
    const events = Array.from(this.analytics.values());
    
    if (!filter) return events;
    
    return events.filter(event => {
      return Object.entries(filter).every(([key, value]) => {
        return event[key as keyof AccessibilityAnalytics] === value;
      });
    });
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Settings methods
  async getUserSettings(userId: number): Promise<AccessibilitySettings | undefined> {
    const result = await db.select()
      .from(accessibilitySettings)
      .where(eq(accessibilitySettings.userId, userId));
    return result[0];
  }

  async createUserSettings(insertSettings: InsertAccessibilitySettings): Promise<AccessibilitySettings> {
    const now = new Date();
    const result = await db.insert(accessibilitySettings)
      .values({
        userId: insertSettings.userId,
        settings: insertSettings.settings,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    return result[0];
  }

  async updateUserSettings(id: number, updateSettings: InsertAccessibilitySettings): Promise<AccessibilitySettings | undefined> {
    const result = await db.update(accessibilitySettings)
      .set({
        userId: updateSettings.userId,
        settings: updateSettings.settings,
        updatedAt: new Date()
      })
      .where(eq(accessibilitySettings.id, id))
      .returning();
    
    return result[0];
  }

  // Analytics methods
  async createAnalyticsEvent(insertEvent: InsertAccessibilityAnalytics): Promise<AccessibilityAnalytics> {
    const now = new Date();
    const result = await db.insert(accessibilityAnalytics)
      .values({
        userId: insertEvent.userId,
        sessionId: insertEvent.sessionId,
        event: insertEvent.event,
        data: insertEvent.data || {},
        userAgent: insertEvent.userAgent || null,
        createdAt: now,
      })
      .returning();
    return result[0];
  }

  async getAnalyticsEvents(filter?: Partial<AccessibilityAnalytics>): Promise<AccessibilityAnalytics[]> {
    if (!filter) {
      return db.select().from(accessibilityAnalytics);
    }
    
    // Manually create conditions for each possible filter field
    const conditions = [];
    
    if (filter.id !== undefined) {
      conditions.push(eq(accessibilityAnalytics.id, filter.id));
    }
    
    if (filter.userId !== undefined) {
      conditions.push(eq(accessibilityAnalytics.userId, filter.userId));
    }
    
    if (filter.sessionId !== undefined) {
      conditions.push(eq(accessibilityAnalytics.sessionId, filter.sessionId));
    }
    
    if (filter.event !== undefined) {
      conditions.push(eq(accessibilityAnalytics.event, filter.event));
    }
    
    if (filter.userAgent !== undefined) {
      conditions.push(eq(accessibilityAnalytics.userAgent, filter.userAgent));
    }
    
    if (conditions.length === 0) {
      return db.select().from(accessibilityAnalytics);
    }
    
    return db.select()
      .from(accessibilityAnalytics)
      .where(and(...conditions));
  }
}

// Use database storage as primary storage method
export const storage = new DatabaseStorage();
