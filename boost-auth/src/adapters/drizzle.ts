import { AuthAdapter, AuthUser, AuthAccount, AuthSession } from '../types';

export interface DrizzleSchemaLike {
  users: any;
  accounts: any;
  sessions?: any;
}

export interface DrizzleDbLike {
  select: (fields?: any) => any;
  insert: (table: any) => any;
  update: (table: any) => any;
  delete: (table: any) => any;
}

export function drizzleAdapter(
  db: DrizzleDbLike,
  schema: DrizzleSchemaLike,
  operators: { eq: (a: any, b: any) => any; and: (...args: any[]) => any }
): AuthAdapter {
  const { eq, and } = operators;

  return {
    name: 'drizzle',

    async createUser(data: Omit<AuthUser, 'id'> & { id?: string }): Promise<AuthUser> {
      const id = data.id || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const values = {
        id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: data.image,
        role: data.role || 'customer',
      };
      const result = await db.insert(schema.users).values(values).returning();
      return result[0] || values;
    },

    async getUser(id: string): Promise<AuthUser | null> {
      const rows = await db.select().from(schema.users).where(eq(schema.users.id, id));
      return rows[0] || null;
    },

    async getUserByEmail(email: string): Promise<AuthUser | null> {
      const rows = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase().trim()));
      return rows[0] || null;
    },

    async getUserByPhone(phone: string): Promise<AuthUser | null> {
      const rows = await db.select().from(schema.users).where(eq(schema.users.phone, phone.trim()));
      return rows[0] || null;
    },

    async getUserByAccount(provider: string, providerAccountId: string): Promise<AuthUser | null> {
      const rows = await db
        .select()
        .from(schema.accounts)
        .where(
          and(
            eq(schema.accounts.provider, provider),
            eq(schema.accounts.providerAccountId, providerAccountId)
          )
        );
      const account = rows[0];
      if (!account) return null;
      return await this.getUser(account.userId);
    },

    async updateUser(data: Partial<AuthUser> & { id: string }): Promise<AuthUser> {
      const result = await db
        .update(schema.users)
        .set(data)
        .where(eq(schema.users.id, data.id))
        .returning();
      return result[0];
    },

    async deleteUser(userId: string): Promise<void> {
      await db.delete(schema.users).where(eq(schema.users.id, userId));
    },

    async linkAccount(account: AuthAccount): Promise<void> {
      await db.insert(schema.accounts).values(account);
    },

    async unlinkAccount(provider: string, providerAccountId: string): Promise<void> {
      await db
        .delete(schema.accounts)
        .where(
          and(
            eq(schema.accounts.provider, provider),
            eq(schema.accounts.providerAccountId, providerAccountId)
          )
        );
    },

    async createSession(session: Omit<AuthSession, 'id'> & { id?: string }): Promise<AuthSession> {
      if (!schema.sessions) {
        throw new Error('[drizzleAdapter] sessions table is not provided in schema');
      }
      const id = session.id || `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const values = {
        id,
        userId: session.userId,
        token: session.token,
        expiresAt: new Date(typeof session.expiresAt === 'number' ? session.expiresAt * 1000 : session.expiresAt),
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
      };
      const result = await db.insert(schema.sessions).values(values).returning();
      return result[0] || values;
    },

    async getSessionAndUser(sessionToken: string): Promise<{ session: AuthSession; user: AuthUser } | null> {
      if (!schema.sessions) return null;
      const sessionRows = await db
        .select()
        .from(schema.sessions)
        .where(eq(schema.sessions.token, sessionToken));
      const session = sessionRows[0];
      if (!session) return null;

      const user = await this.getUser(session.userId);
      if (!user) return null;

      return { session, user };
    },

    async deleteSession(sessionToken: string): Promise<void> {
      if (!schema.sessions) return;
      await db.delete(schema.sessions).where(eq(schema.sessions.token, sessionToken));
    },
  };
}
