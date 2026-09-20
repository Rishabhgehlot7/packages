import { AuthAdapter, AuthUser, AuthAccount, AuthSession } from '../types';

export interface MongoDbLike {
  collection: (name: string) => {
    findOne: (filter: any) => Promise<any>;
    find: (filter: any) => { toArray: () => Promise<any[]> };
    insertOne: (doc: any) => Promise<any>;
    updateOne: (filter: any, update: any) => Promise<any>;
    deleteOne: (filter: any) => Promise<any>;
    deleteMany: (filter: any) => Promise<any>;
  };
}

export function mongodbAdapter(db: MongoDbLike): AuthAdapter {
  const users = db.collection('users');
  const accounts = db.collection('accounts');
  const sessions = db.collection('sessions');

  const normalizeId = (doc: any): any => {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { id: _id ? String(_id) : rest.id, ...rest };
  };

  return {
    name: 'mongodb',

    async createUser(data: Omit<AuthUser, 'id'> & { id?: string }): Promise<AuthUser> {
      const id = data.id || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const doc = {
        _id: id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await users.insertOne(doc);
      return normalizeId(doc);
    },

    async getUser(id: string): Promise<AuthUser | null> {
      const doc = await users.findOne({ _id: id });
      return normalizeId(doc);
    },

    async getUserByEmail(email: string): Promise<AuthUser | null> {
      const doc = await users.findOne({ email: email.toLowerCase().trim() });
      return normalizeId(doc);
    },

    async getUserByPhone(phone: string): Promise<AuthUser | null> {
      const doc = await users.findOne({ phone: phone.trim() });
      return normalizeId(doc);
    },

    async getUserByAccount(provider: string, providerAccountId: string): Promise<AuthUser | null> {
      const account = await accounts.findOne({ provider, providerAccountId });
      if (!account) return null;
      return await this.getUser(account.userId);
    },

    async updateUser(data: Partial<AuthUser> & { id: string }): Promise<AuthUser> {
      const { id, ...updateFields } = data;
      await users.updateOne(
        { _id: id },
        { $set: { ...updateFields, updatedAt: new Date() } }
      );
      const updated = await users.findOne({ _id: id });
      return normalizeId(updated);
    },

    async deleteUser(userId: string): Promise<void> {
      await users.deleteOne({ _id: userId });
      await accounts.deleteMany({ userId });
      await sessions.deleteMany({ userId });
    },

    async linkAccount(account: AuthAccount): Promise<void> {
      await accounts.insertOne({
        ...account,
        createdAt: new Date(),
      });
    },

    async unlinkAccount(provider: string, providerAccountId: string): Promise<void> {
      await accounts.deleteOne({ provider, providerAccountId });
    },

    async createSession(session: Omit<AuthSession, 'id'> & { id?: string }): Promise<AuthSession> {
      const id = session.id || `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const doc = {
        _id: id,
        ...session,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await sessions.insertOne(doc);
      return normalizeId(doc);
    },

    async getSessionAndUser(sessionToken: string): Promise<{ session: AuthSession; user: AuthUser } | null> {
      const sessionDoc = await sessions.findOne({ token: sessionToken });
      if (!sessionDoc) return null;

      const session = normalizeId(sessionDoc);
      const user = await this.getUser(session.userId);
      if (!user) return null;

      return { session, user };
    },

    async deleteSession(sessionToken: string): Promise<void> {
      await sessions.deleteOne({ token: sessionToken });
    },
  };
}
