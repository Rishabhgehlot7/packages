export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  createdAt: string;
}

export interface CreateOrgParams {
  name: string;
  slug?: string;
  userId: string; // The creating user automatically becomes 'owner'
  metadata?: Record<string, any>;
}

export class OrganizationManager {
  private orgs = new Map<string, Organization>();
  private members = new Map<string, OrganizationMember[]>(); // key: organizationId

  /**
   * Creates a new organization and assigns the user as 'owner'
   */
  async create(params: CreateOrgParams): Promise<{ organization: Organization; membership: OrganizationMember }> {
    const slug =
      params.slug ||
      params.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const orgId = `org_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();

    const organization: Organization = {
      id: orgId,
      name: params.name,
      slug,
      metadata: params.metadata || {},
      createdAt: now,
      updatedAt: now,
    };

    const membership: OrganizationMember = {
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      organizationId: orgId,
      userId: params.userId,
      role: 'owner',
      createdAt: now,
    };

    this.orgs.set(orgId, organization);
    this.members.set(orgId, [membership]);

    return { organization, membership };
  }

  /**
   * Adds or updates a member in an organization
   */
  async addMember(params: {
    organizationId: string;
    userId: string;
    role?: 'owner' | 'admin' | 'member';
  }): Promise<OrganizationMember> {
    const org = this.orgs.get(params.organizationId);
    if (!org) throw new Error(`Organization ${params.organizationId} not found`);

    const membersList = this.members.get(params.organizationId) || [];
    const existing = membersList.find((m) => m.userId === params.userId);

    if (existing) {
      existing.role = params.role || existing.role;
      return existing;
    }

    const membership: OrganizationMember = {
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      organizationId: params.organizationId,
      userId: params.userId,
      role: params.role || 'member',
      createdAt: new Date().toISOString(),
    };

    membersList.push(membership);
    this.members.set(params.organizationId, membersList);
    return membership;
  }

  /**
   * Removes a member from an organization
   */
  async removeMember(organizationId: string, userId: string): Promise<void> {
    const membersList = this.members.get(organizationId) || [];
    const filtered = membersList.filter((m) => m.userId !== userId);
    this.members.set(organizationId, filtered);
  }

  /**
   * Lists all organizations a user is a member of
   */
  async listUserOrganizations(
    userId: string
  ): Promise<Array<{ organization: Organization; role: OrganizationMember['role'] }>> {
    const results: Array<{ organization: Organization; role: OrganizationMember['role'] }> = [];

    for (const [orgId, membersList] of this.members.entries()) {
      const match = membersList.find((m) => m.userId === userId);
      if (match) {
        const org = this.orgs.get(orgId);
        if (org) {
          results.push({ organization: org, role: match.role });
        }
      }
    }

    return results;
  }

  /**
   * Gets details of an organization by ID or slug
   */
  async get(idOrSlug: string): Promise<Organization | null> {
    const orgById = this.orgs.get(idOrSlug);
    if (orgById) return orgById;

    for (const org of this.orgs.values()) {
      if (org.slug === idOrSlug) return org;
    }
    return null;
  }
}
