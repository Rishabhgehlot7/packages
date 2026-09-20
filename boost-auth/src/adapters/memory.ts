import { AuthAdapter, AuthUser, AuthAccount, AuthSession } from '../types';

export class MemoryAdapter implements AuthAdapter {
  name = 'memory';
  private users = new Map<string, AuthUser>();
  private accounts = new Map<string, AuthAccount>(); // key: `${provider}:${providerAccountId}`
  private sessions = new Map<string, AuthSession>(); // key: token

  async createUser(user: Omit<AuthUser, 'id'> & { id?: string }): Promise<AuthUser> {
    const id = user.id || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const now = new Date().toISOString();
    const newUser: AuthUser = {
      ...user,
      id,
      createdAt: user.createdAt || now,
      updatedAt: user.updatedAt || now,
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUser(id: string): Promise<AuthUser | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<AuthUser | null> {
    const lowerEmail = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email && user.email.toLowerCase().trim() === lowerEmail) {
        return user;
      }
    }
    return null;
  }

  async getUserByPhone(phone: string): Promise<AuthUser | null> {
    const cleanPhone = phone.trim();
    for (const user of this.users.values()) {
      if (user.phone && user.phone.trim() === cleanPhone) {
        return user;
      }
    }
    return null;
  }

  async getUserByAccount(provider: string, providerAccountId: string): Promise<AuthUser | null> {
    const key = `${provider}:${providerAccountId}`;
    const account = this.accounts.get(key);
    if (!account) return null;
    return this.getUser(account.userId);
  }

  async updateUser(user: Partial<AuthUser> & { id: string }): Promise<AuthUser> {
    const existing = this.users.get(user.id);
    if (!existing) {
      throw new Error(`[MemoryAdapter] User with id ${user.id} not found`);
    }
    const updated: AuthUser = {
      ...existing,
      ...user,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(user.id, updated);
    return updated;
  }

  async deleteUser(userId: string): Promise<void> {
    this.users.delete(userId);
    for (const [key, account] of this.accounts.entries()) {
      if (account.userId === userId) {
        this.accounts.delete(key);
      }
    }
  }

  async linkAccount(account: AuthAccount): Promise<void> {
    const key = `${account.provider}:${account.providerAccountId}`;
    this.accounts.set(key, { ...account });
  }

  async unlinkAccount(provider: string, providerAccountId: string): Promise<void> {
    const key = `${provider}:${providerAccountId}`;
    this.accounts.delete(key);
  }

  async createSession(session: Omit<AuthSession, 'id'> & { id?: string }): Promise<AuthSession> {
    const id = session.id || `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newSession: AuthSession = {
      ...session,
      id,
      createdAt: session.createdAt || new Date().toISOString(),
      updatedAt: session.updatedAt || new Date().toISOString(),
    };
    this.sessions.set(session.token, newSession);
    return newSession;
  }

  async getSessionAndUser(sessionToken: string): Promise<{ session: AuthSession; user: AuthUser } | null> {
    const session = this.sessions.get(sessionToken);
    if (!session) return null;

    const expTime = typeof session.expiresAt === 'number' ? session.expiresAt : new Date(session.expiresAt).getTime() / 1000;
    if (expTime < Date.now() / 1000) {
      this.sessions.delete(sessionToken);
      return null;
    }

    const user = await this.getUser(session.userId);
    if (!user) return null;

    return { session, user };
  }

  async updateSession(session: Partial<AuthSession> & { token: string }): Promise<AuthSession | null> {
    const existing = this.sessions.get(session.token);
    if (!existing) return null;

    const updated: AuthSession = {
      ...existing,
      ...session,
      updatedAt: new Date().toISOString(),
    };
    this.sessions.set(session.token, updated);
    return updated;
  }

  async deleteSession(sessionToken: string): Promise<void> {
    this.sessions.delete(sessionToken);
  }
}

export function memoryAdapter(): AuthAdapter {
  return new MemoryAdapter();
}
