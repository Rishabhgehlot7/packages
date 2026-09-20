import { AuthAdapter, AuthUser, AuthAccount, AuthSession } from '../types';

export interface PrismaClientLike {
  user: any;
  account: any;
  session?: any;
}

export function prismaAdapter(prisma: PrismaClientLike): AuthAdapter {
  return {
    name: 'prisma',

    async createUser(data: Omit<AuthUser, 'id'> & { id?: string }): Promise<AuthUser> {
      const user = await prisma.user.create({
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          image: data.image,
          role: data.role || 'customer',
          metadata: data.metadata,
        },
      });
      return user;
    },

    async getUser(id: string): Promise<AuthUser | null> {
      return await prisma.user.findUnique({ where: { id } });
    },

    async getUserByEmail(email: string): Promise<AuthUser | null> {
      return await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    },

    async getUserByPhone(phone: string): Promise<AuthUser | null> {
      return await prisma.user.findFirst({ where: { phone: phone.trim() } });
    },

    async getUserByAccount(provider: string, providerAccountId: string): Promise<AuthUser | null> {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        include: { user: true },
      });
      return account?.user ?? null;
    },

    async updateUser(data: Partial<AuthUser> & { id: string }): Promise<AuthUser> {
      return await prisma.user.update({
        where: { id: data.id },
        data,
      });
    },

    async deleteUser(userId: string): Promise<void> {
      await prisma.user.delete({ where: { id: userId } });
    },

    async linkAccount(data: AuthAccount): Promise<void> {
      await prisma.account.create({
        data: {
          userId: data.userId,
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          refreshToken: data.refreshToken,
          accessToken: data.accessToken,
          expiresAt: data.expiresAt,
          tokenType: data.tokenType,
          scope: data.scope,
          idToken: data.idToken,
        },
      });
    },

    async unlinkAccount(provider: string, providerAccountId: string): Promise<void> {
      await prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
      });
    },

    async createSession(data: Omit<AuthSession, 'id'> & { id?: string }): Promise<AuthSession> {
      if (!prisma.session) {
        throw new Error('[prismaAdapter] prisma.session model is not defined in your schema.prisma');
      }
      return await prisma.session.create({
        data: {
          id: data.id,
          userId: data.userId,
          token: data.token,
          expiresAt: new Date(typeof data.expiresAt === 'number' ? data.expiresAt * 1000 : data.expiresAt),
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    },

    async getSessionAndUser(sessionToken: string): Promise<{ session: AuthSession; user: AuthUser } | null> {
      if (!prisma.session) return null;
      const res = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
      });
      if (!res) return null;
      const { user, ...session } = res;
      return { session, user };
    },

    async deleteSession(sessionToken: string): Promise<void> {
      if (!prisma.session) return;
      await prisma.session.delete({ where: { token: sessionToken } });
    },
  };
}
