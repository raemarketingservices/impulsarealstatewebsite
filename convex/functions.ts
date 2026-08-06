import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ---------- Agents ----------

export const listAgents = query({
  args: {},
  handler: async (ctx) => {
    const agents = await ctx.db.query("agents").collect();
    return agents.sort((a, b) => a.order - b.order);
  },
});

export const getPublicAgents = query({
  args: {},
  handler: async (ctx) => {
    const agents = await ctx.db.query("agents").collect();
    const active = agents
      .filter((a) => a.active)
      .sort((a, b) => a.order - b.order);

    const settings = await ctx.db.query("settings").collect();
    const whatsappMap: Record<string, string> = {};
    for (const s of settings) {
      whatsappMap[s.key] = s.value;
    }

    const properties = await ctx.db.query("properties").collect();
    const published = properties.filter((p) => p.published);

    return active.map((agent) => {
      const firstName = agent.name.split(" ")[0].toLowerCase();
      const overrideWhatsapp = whatsappMap[`whatsapp_${firstName}`];
      const agentProperties = published
        .filter((p) => p.agentId === agent._id)
        .sort((a, b) => Number(b.featured) - Number(a.featured))
        .slice(0, 3)
        .map((p) => ({
          id: p._id,
          title: p.title,
          price: p.price,
          type: p.type,
          city: p.city,
          images: p.images,
          status: p.status,
        }));
      const { password: _pw, ...safeAgent } = { ...agent, id: agent._id };
      return {
        ...safeAgent,
        whatsapp: overrideWhatsapp || agent.whatsapp,
        properties: agentProperties,
        _count: { properties: agentProperties.length },
      };
    });
  },
});

export const getAgentById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const agent = await ctx.db.get(id);
    if (!agent) return null;
    const { password: _pw, ...rest } = { ...agent, id: agent._id };
    return rest;
  },
});

export const authAgent = query({
  args: {
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const agents = await ctx.db.query("agents").collect();
    const normEmail = (args.email || "").toLowerCase().trim();
    const normName = (args.name || "").toLowerCase().replace(/\s+/g, " ").trim();
    const wantsEmail = normEmail.length > 0;
    const wantsName = normName.length > 0;

    const agent = agents.find((a) => {
      if (wantsEmail && a.email.toLowerCase().trim() === normEmail) return true;
      if (wantsName) {
        const an = a.name.toLowerCase().replace(/\s+/g, " ").trim();
        if (an === normName) return true;
        const parts = normName.split(" ").filter(Boolean);
        if (parts.length >= 2) {
          const aParts = an.split(" ").filter(Boolean);
          if (
            aParts.length >= 2 &&
            aParts[0] === parts[0] &&
            aParts[aParts.length - 1] === parts[parts.length - 1]
          ) {
            return true;
          }
        }
      }
      return false;
    });
    if (!agent) return { error: "invalid" };
    if (!agent.active) return { error: "inactive" };
    if (agent.password !== args.password) return { error: "invalid" };
    return {
      id: agent._id,
      name: agent.name,
      email: agent.email,
      title: agent.title,
      photoUrl: agent.photoUrl,
    };
  },
});

// ---------- Properties ----------

const parseNumber = (value: string | number | undefined): number =>
  typeof value === "number" ? value : typeof value === "string" ? parseFloat(value) : NaN;

export const listProperties = query({
  args: {
    zone: v.optional(v.string()),
    type: v.optional(v.string()),
    operation: v.optional(v.string()),
    minPrice: v.optional(v.string()),
    maxPrice: v.optional(v.string()),
    bedrooms: v.optional(v.string()),
    featured: v.optional(v.string()),
    city: v.optional(v.string()),
    q: v.optional(v.string()),
    limit: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let properties = await ctx.db.query("properties").collect();
    const limit = parseInt(args.limit || "20");

    let filtered = properties.filter((p) => {
      if (!p.published) return false;
      if (args.zone && p.zone !== args.zone) return false;
      if (args.type && p.type !== args.type) return false;
      if (args.operation && p.operation !== args.operation) return false;
      if (args.featured === "true" && !p.featured) return false;
      if (args.city && !p.city.toLowerCase().includes(args.city.toLowerCase())) return false;
      if (args.bedrooms && p.bedrooms < parseNumber(args.bedrooms)) return false;
      if (args.minPrice && p.price < parseNumber(args.minPrice)) return false;
      if (args.maxPrice && p.price > parseNumber(args.maxPrice)) return false;
      if (args.q) {
        const q = args.q.toLowerCase();
        const haystack = `${p.title} ${p.description} ${p.location} ${p.city}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    filtered = filtered.sort((a, b) => {
      if (b.featured !== a.featured) return Number(b.featured) - Number(a.featured);
      return b.createdAt - a.createdAt;
    });
    filtered = filtered.slice(0, limit);

    const agents = await ctx.db.query("agents").collect();
    const agentMap: Record<string, Record<string, unknown>> = {};
    for (const a of agents) {
      const { password: _pw, ...safe } = { ...a, id: a._id };
      agentMap[a._id] = safe;
    }

    return filtered.map((p) => {
      const agent = p.agentId ? agentMap[p.agentId] : undefined;
      return { ...p, id: p._id, agent: agent ?? null };
    });
  },
});

export const getPropertyById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const property = await ctx.db.get(id);
    if (!property) return null;

    const agent = property.agentId ? await ctx.db.get(property.agentId) : null;

    const settings = await ctx.db.query("settings").collect();
    const whatsappMap: Record<string, string> = {};
    for (const s of settings) whatsappMap[s.key] = s.value;
    const agentWhatsappKey = agent
      ? `whatsapp_${agent.name.split(" ")[0].toLowerCase()}`
      : "whatsapp_general";
    const whatsappNumber = whatsappMap[agentWhatsappKey] || agent?.whatsapp || "18095550100";

    return {
      ...property,
      id: property._id,
      agent: agent
        ? (() => {
            const { password: _pw, ...safe } = { ...agent, id: agent._id };
            return safe;
          })()
        : null,
      whatsappNumber,
    };
  },
});

export const getAgentProperties = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const agent = await ctx.db.get(id);
    if (!agent) return null;
    const properties = await ctx.db.query("properties").collect();
    return properties
      .filter((p) => p.agentId === id)
      .sort((a, b) => {
        if (b.featured !== a.featured) return Number(b.featured) - Number(a.featured);
        return b.createdAt - a.createdAt;
      })
      .map((p) => ({ ...p, id: p._id }));
  },
});

// ---------- Public collections ----------

export const listSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").collect();
    const ordered = settings.sort((a, b) => a.group.localeCompare(b.group));
    const map: Record<string, { value: string; label: string; group: string }> = {};
    for (const s of ordered) {
      map[s.key] = { value: s.value, label: s.label, group: s.group };
    }
    return { data: ordered, map };
  },
});

export const listSocialPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("socialPosts").collect();
    return posts.sort((a, b) => a.order - b.order);
  },
});

export const listTestimonials = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("testimonials").collect();
    return posts
      .filter((t) => t.verified)
      .sort((a, b) => a.order - b.order);
  },
});

// ---------- Dashboard ----------

export const getDashboard = query({
  args: {},
  handler: async (ctx) => {
    const properties = await ctx.db.query("properties").collect();
    const agents = await ctx.db.query("agents").collect();
    const goals = await ctx.db.query("goals").collect();

    const published = properties.filter((p) => p.published);
    const totalProperties = published.length;
    const totalAgents = agents.filter((a) => a.active).length;
    const soldProperties = properties.filter((p) => p.status === "SOLD").length;
    const featuredProperties = properties.filter((p) => p.featured).length;
    const portfolioValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);

    const agentMap: Record<string, Record<string, unknown>> = {};
    for (const a of agents) agentMap[a._id] = { ...a, id: a._id };

    const myProperties = [...published]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 4)
      .map((p) => ({
        ...p,
        id: p._id,
        agent: p.agentId ? agentMap[p.agentId] ?? null : null,
      }));

    return {
      stats: {
        totalProperties,
        totalAgents,
        soldProperties,
        featuredProperties,
        portfolioValue,
      },
      goals: [...goals]
        .map((g) => ({ ...g, id: g._id }))
        .sort((a, b) => a.createdAt - b.createdAt),
      myProperties,
    };
  },
});

// ---------- Mutations ----------

export const upsertSettings = mutation({
  args: { updates: v.optional(v.array(v.object({
    key: v.string(),
    value: v.string(),
    label: v.optional(v.string()),
    group: v.optional(v.string()),
  }))), key: v.optional(v.string()), value: v.optional(v.string()), label: v.optional(v.string()), group: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.updates && args.updates.length > 0) {
      const results = [];
      for (const u of args.updates) {
        const existing = await ctx.db.query("settings").withIndex("by_key", (q) => q.eq("key", u.key)).unique();
        const doc = {
          value: u.value,
          label: u.label || u.key,
          group: u.group || "general",
          updatedAt: Date.now(),
        };
        const result = existing
          ? await ctx.db.patch(existing._id, doc)
          : await ctx.db.insert("settings", { key: u.key, ...doc });
        results.push(existing ? { ...existing, ...doc } : result);
      }
      return results;
    }
    const { key, value } = args;
    if (!key || value === undefined) throw new Error("key and value required");
    const existing = await ctx.db.query("settings").withIndex("by_key", (q) => q.eq("key", key)).unique();
    const doc = {
      label: args.label || key,
      group: args.group || "general",
      updatedAt: Date.now(),
    };
    if (existing) {
      return await ctx.db.patch(existing._id, { value, ...doc });
    }
    return await ctx.db.insert("settings", { key, value, ...doc });
  },
});

export const deleteSetting = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Setting no encontrado");
    await ctx.db.delete(id);
    return { id };
  },
});

export const createInquiry = mutation({
  args: { propertyId: v.optional(v.string()), name: v.string(), email: v.string(), phone: v.optional(v.string()), message: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("inquiries", {
      propertyId: args.propertyId ?? null,
      name: args.name,
      email: args.email,
      phone: args.phone ?? null,
      message: args.message,
      status: "NEW",
      createdAt: Date.now(),
    });
  },
});

export const createAgent = mutation({
  args: {
    name: v.string(), title: v.string(), bio: v.string(), photoUrl: v.string(), phone: v.string(),
    email: v.string(), password: v.optional(v.string()), whatsapp: v.string(),
    instagram: v.optional(v.string()), tiktok: v.optional(v.string()), facebook: v.optional(v.string()),
    specialties: v.optional(v.string()), rating: v.optional(v.number()), salesCount: v.optional(v.number()), active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const agents = await ctx.db.query("agents").collect();
    const conflict = agents.find((a) => a.email.toLowerCase() === args.email.toLowerCase());
    if (conflict) throw new Error("Ya existe un agente con ese email");
    const maxOrder = Math.max(...agents.map((a) => a.order), -1);
    const now = Date.now();
    return await ctx.db.insert("agents", {
      name: args.name,
      title: args.title,
      bio: args.bio,
      photoUrl: args.photoUrl,
      phone: args.phone,
      email: args.email,
      password: args.password || "impulsa",
      whatsapp: args.whatsapp,
      instagram: args.instagram ?? null,
      tiktok: args.tiktok ?? null,
      facebook: args.facebook ?? null,
      specialties: args.specialties ?? "[]",
      rating: typeof args.rating === "number" ? args.rating : 5.0,
      salesCount: typeof args.salesCount === "number" ? args.salesCount : 0,
      order: maxOrder + 1,
      active: args.active !== false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateAgent = mutation({
  args: { id: v.string(), patch: v.any() },
  handler: async (ctx, { id, patch }) => {
    const agent = await ctx.db.get(id);
    if (!agent) throw new Error("Agente no encontrado");
    if (patch.email && patch.email.toLowerCase() !== agent.email.toLowerCase()) {
      const agents = await ctx.db.query("agents").collect();
      const conflict = agents.find((a) => a.email.toLowerCase() === patch.email.toLowerCase());
      if (conflict) throw new Error("Ya existe un agente con ese email");
    }
    const allowed: Record<string, unknown> = {};
    const fields = ["name", "title", "bio", "photoUrl", "phone", "email", "password", "whatsapp", "instagram", "tiktok", "facebook", "specialties", "rating", "salesCount", "active"];
    for (const f of fields) {
      if (patch[f] !== undefined) {
        if (f === "password" && patch[f] === "") continue;
        allowed[f] = patch[f];
      }
    }
    allowed.updatedAt = Date.now();
    return await ctx.db.patch(id, allowed);
  },
});

export const deleteAgent = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const agent = await ctx.db.get(id);
    if (!agent) throw new Error("Agente no encontrado");
    const properties = await ctx.db.query("properties").collect();
    for (const p of properties) {
      if (p.agentId === id) await ctx.db.patch(p._id, { agentId: null });
    }
    await ctx.db.delete(id);
    return { id };
  },
});

export const createProperty = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    const now = Date.now();
    return await ctx.db.insert("properties", {
      title: String(data.title || ""),
      description: String(data.description || "").trim(),
      type: String(data.type || "APARTMENT"),
      status: String(data.status || "FOR_SALE"),
      operation: String(data.operation || "SALE"),
      price: Number(data.price ?? 0),
      currency: String(data.currency || "USD"),
      bedrooms: Number(data.bedrooms ?? 0),
      bathrooms: Number(data.bathrooms ?? 0),
      area: Number(data.area ?? 0),
      parking: Number(data.parking ?? 0),
      location: String(data.location || "").trim(),
      city: String(data.city || "").trim(),
      zone: String(data.zone || "Nacional"),
      address: data.address ? String(data.address) : null,
      lat: data.lat !== undefined && data.lat !== null && data.lat !== "" ? Number(data.lat) : null,
      lng: data.lng !== undefined && data.lng !== null && data.lng !== "" ? Number(data.lng) : null,
      images: JSON.stringify(Array.isArray(data.images) ? data.images.filter(Boolean).map(String) : []),
      features: JSON.stringify(Array.isArray(data.features) ? data.features.filter(Boolean).map(String) : []),
      featured: Boolean(data.featured),
      videoUrl: data.videoUrl ? String(data.videoUrl) : null,
      published: data.published !== undefined ? Boolean(data.published) : true,
      views: 0,
      agentId: data.agentId && data.agentId !== "none" && data.agentId !== "" ? String(data.agentId) : null,
      ownerId: data.ownerId ?? null,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateProperty = mutation({
  args: { id: v.string(), patch: v.any() },
  handler: async (ctx, { id, patch }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Propiedad no encontrada");
    const update: Record<string, unknown> = {};
    const fields = ["title", "description", "type", "status", "operation", "price", "currency", "bedrooms", "bathrooms", "area", "parking", "location", "city", "zone", "address", "lat", "lng", "featured", "published", "videoUrl"];
    for (const f of fields) {
      if (patch[f] !== undefined) update[f] = patch[f];
    }
    if (Array.isArray(patch.images)) update.images = JSON.stringify(patch.images.filter(Boolean).map(String));
    if (Array.isArray(patch.features)) update.features = JSON.stringify(patch.features.filter(Boolean).map(String));
    if (patch.agentId !== undefined) {
      update.agentId = patch.agentId && patch.agentId !== "none" && patch.agentId !== "" ? String(patch.agentId) : null;
    }
    update.updatedAt = Date.now();
    return await ctx.db.patch(id, update);
  },
});

export const deleteProperty = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Propiedad no encontrada");
    await ctx.db.delete(id);
    return { id };
  },
});

// ---------- Admin ----------

export const adminAgents = query({
  args: {},
  handler: async (ctx) => {
    const agents = await ctx.db.query("agents").collect();
    const properties = await ctx.db.query("properties").collect();
    const ordered = agents.sort((a, b) => a.order - b.order);
    return ordered.map((a) => {
      const { password, ...rest } = { ...a, id: a._id };
      return {
        ...rest,
        propertyCount: properties.filter((p) => p.agentId === a._id).length,
      };
    });
  },
});

export const adminProperties = query({
  args: {},
  handler: async (ctx) => {
    const properties = await ctx.db.query("properties").collect();
    const agents = await ctx.db.query("agents").collect();
    const agentMap: Record<string, Record<string, unknown>> = {};
    for (const a of agents) {
      agentMap[a._id] = { id: a._id, name: a.name, title: a.title, photoUrl: a.photoUrl, email: a.email, phone: a.phone };
    }
    const ordered = properties.sort((a, b) => {
      if (b.featured !== a.featured) return Number(b.featured) - Number(a.featured);
      return b.createdAt - a.createdAt;
    });
    return ordered.map((p) => ({
      ...p,
      id: p._id,
      agent: p.agentId ? agentMap[p.agentId] ?? null : null,
    }));
  },
});

// ---------- Seed ----------

// Convex rejects null for optional(string) fields, so strip nulls before insert
const clean = (doc: Record<string, unknown>): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(doc)) {
    if (v === null || v === undefined) continue;
    out[k] = v;
  }
  return out;
};

export const seedAll = mutation({
  args: {
    agents: v.array(v.any()),
    properties: v.array(v.any()),
    settings: v.array(v.any()),
    testimonials: v.array(v.any()),
    socialPosts: v.array(v.any()),
    goals: v.array(v.any()),
    users: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    // Clear existing data (keep nothing)
    for (const table of ["agents", "properties", "settings", "testimonials", "socialPosts", "goals", "users", "inquiries"] as const) {
      const docs = await ctx.db.query(table).collect();
      for (const d of docs) await ctx.db.delete(d._id);
    }

    // Insert agents, map old id -> new id (it's _id as custom string)
    const idMap: Record<string, string> = {};
    for (const a of args.agents) {
      const id = await ctx.db.insert("agents", clean({
        name: a.name,
        title: a.title,
        bio: a.bio,
        photoUrl: a.photoUrl,
        phone: a.phone,
        email: a.email,
        password: a.password ?? "impulsa",
        whatsapp: a.whatsapp,
        instagram: a.instagram,
        tiktok: a.tiktok,
        facebook: a.facebook,
        specialties: a.specialties ?? "[]",
        rating: typeof a.rating === "number" ? a.rating : 5.0,
        salesCount: typeof a.salesCount === "number" ? a.salesCount : 0,
        order: typeof a.order === "number" ? a.order : 0,
        active: a.active !== false,
        createdAt: a.createdAt ?? Date.now(),
        updatedAt: a.updatedAt ?? Date.now(),
      }));
      idMap[a.id] = id;
    }

    for (const p of args.properties) {
      await ctx.db.insert("properties", clean({
        title: p.title,
        description: p.description ?? "",
        type: p.type ?? "APARTMENT",
        status: p.status ?? "FOR_SALE",
        operation: p.operation ?? "SALE",
        price: p.price,
        currency: p.currency ?? "USD",
        bedrooms: p.bedrooms ?? 0,
        bathrooms: p.bathrooms ?? 0,
        area: p.area ?? 0,
        parking: p.parking ?? 0,
        location: p.location ?? "",
        city: p.city ?? "",
        zone: p.zone ?? "",
        address: p.address,
        lat: p.lat,
        lng: p.lng,
        images: p.images ?? "[]",
        features: p.features ?? "[]",
        featured: p.featured ?? false,
        videoUrl: p.videoUrl,
        published: p.published !== false,
        views: p.views ?? 0,
        agentId: p.agentId ? idMap[p.agentId] ?? null : null,
        ownerId: p.ownerId ? idMap[p.ownerId] ?? null : null,
        createdAt: p.createdAt ?? Date.now(),
        updatedAt: p.updatedAt ?? Date.now(),
      }));
    }

    for (const s of args.settings) {
      await ctx.db.insert("settings", clean({
        key: s.key,
        value: s.value ?? "",
        label: s.label ?? s.key,
        group: s.group ?? "general",
        updatedAt: s.updatedAt ?? Date.now(),
      }));
    }

    for (const t of args.testimonials) {
      await ctx.db.insert("testimonials", clean({
        clientName: t.clientName,
        clientRole: t.clientRole ?? "",
        clientPhoto: t.clientPhoto,
        message: t.message,
        rating: t.rating ?? 5,
        property: t.property,
        verified: t.verified !== false,
        order: t.order ?? 0,
        createdAt: t.createdAt ?? Date.now(),
      }));
    }

    for (const s of args.socialPosts) {
      await ctx.db.insert("socialPosts", clean({
        platform: s.platform,
        caption: s.caption ?? "",
        imageUrl: s.imageUrl,
        postUrl: s.postUrl,
        likes: s.likes ?? 0,
        comments: s.comments ?? 0,
        order: s.order ?? 0,
        createdAt: s.createdAt ?? Date.now(),
      }));
    }

    for (const g of args.goals) {
      await ctx.db.insert("goals", clean({
        userId: idMap[g.userId] ?? g.userId,
        title: g.title,
        type: g.type ?? "SAVINGS",
        targetAmount: g.targetAmount ?? 0,
        currentAmount: g.currentAmount ?? 0,
        targetDate: g.targetDate ?? Date.now(),
        status: g.status ?? "ACTIVE",
        createdAt: g.createdAt ?? Date.now(),
      }));
    }

    for (const u of args.users) {
      await ctx.db.insert("users", clean({
        email: u.email,
        name: u.name,
        phone: u.phone,
        role: u.role ?? "CLIENT",
        avatarUrl: u.avatarUrl,
        createdAt: u.createdAt ?? Date.now(),
      }));
    }

    return {
      agents: args.agents.length,
      properties: args.properties.length,
      settings: args.settings.length,
      testimonials: args.testimonials.length,
      socialPosts: args.socialPosts.length,
      goals: args.goals.length,
      users: args.users.length,
    };
  },
});

export const updateAgentProfile = mutation({
  args: { id: v.string(), patch: v.any() },
  handler: async (ctx, { id, patch }) => {
    const agent = await ctx.db.get(id);
    if (!agent) throw new Error("Agente no encontrado");
    const allowed: Record<string, unknown> = {};
    const fields = ["name", "title", "bio", "photoUrl", "phone", "whatsapp", "instagram", "tiktok", "facebook", "specialties"];
    for (const f of fields) {
      if (typeof patch[f] === "string") allowed[f] = patch[f];
    }
    if (typeof patch.password === "string" && patch.password.trim().length > 0) allowed.password = patch.password;
    allowed.updatedAt = Date.now();
    await ctx.db.patch(id, allowed);
    const updated = await ctx.db.get(id);
    if (!updated) return null;
    const { password: _pw, ...safe } = { ...updated, id: updated._id };
    return safe;
  },
});

// ---------- Leads ----------

export const createLead = mutation({
  args: {
    type: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    propertyType: v.string(),
    budget: v.optional(v.string()),
    zoneName: v.string(),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("leads", {
      type: args.type,
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      phone: args.phone ?? null,
      propertyType: args.propertyType,
      budget: args.budget ?? "",
      zoneName: args.zoneName,
      lat: args.lat ?? null,
      lng: args.lng ?? null,
      message: args.message ?? null,
      status: "PENDIENTE",
      agentId: null,
      notes: [],
      createdAt: now,
      updatedAt: now,
    });
    const lead = await ctx.db.get(id);
    if (!lead) throw new Error("Error al crear lead");
    return { ...lead, id: lead._id };
  },
});

export const listLeads = query({
  args: {
    agentId: v.optional(v.string()),
    status: v.optional(v.string()),
    zone: v.optional(v.string()),
    q: v.optional(v.string()),
    unassigned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let leads = await ctx.db.query("leads").collect();

    if (args.agentId) leads = leads.filter((l) => l.agentId === args.agentId);
    if (args.status) leads = leads.filter((l) => l.status === args.status);
    if (args.unassigned) leads = leads.filter((l) => !l.agentId);
    if (args.zone) {
      const z = args.zone.toLowerCase();
      leads = leads.filter((l) => (l.zoneName || "").toLowerCase().includes(z));
    }
    if (args.q) {
      const q = args.q.toLowerCase();
      leads = leads.filter(
        (l) =>
          `${l.firstName} ${l.lastName}`.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      );
    }
    leads.sort((a, b) => b.createdAt - a.createdAt);

    const agents = await ctx.db.query("agents").collect();
    const agentMap: Record<string, Record<string, unknown>> = {};
    for (const a of agents) {
      const { password: _pw, ...safe } = { ...a, id: a._id };
      agentMap[a._id] = safe;
    }

    return leads.map((l) => ({
      ...l,
      id: l._id,
      agent: l.agentId ? agentMap[l.agentId] ?? null : null,
    }));
  },
});

export const updateLead = mutation({
  args: { id: v.string(), patch: v.any() },
  handler: async (ctx, { id, patch }) => {
    const lead = await ctx.db.get(id);
    if (!lead) throw new Error("Lead no encontrado");
    const allowed: Record<string, unknown> = {};
    const fields = ["type", "firstName", "lastName", "email", "phone", "propertyType", "budget", "zoneName", "lat", "lng", "status"];
    for (const f of fields) {
      if (patch[f] !== undefined) allowed[f] = patch[f];
    }
    if (patch.agentId !== undefined) {
      allowed.agentId =
        patch.agentId && patch.agentId !== "" && patch.agentId !== "none"
          ? String(patch.agentId)
          : null;
    }
    allowed.updatedAt = Date.now();
    await ctx.db.patch(id, allowed);
    const updated = await ctx.db.get(id);
    if (!updated) return null;
    return { ...updated, id: updated._id };
  },
});

export const addLeadNote = mutation({
  args: { id: v.string(), text: v.string(), by: v.string() },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.id);
    if (!lead) throw new Error("Lead no encontrado");
    const text = args.text.trim();
    if (!text) throw new Error("La nota no puede estar vacía");
    const notes = [...(lead.notes || []), { text, createdAt: Date.now(), by: args.by }];
    await ctx.db.patch(args.id, { notes, updatedAt: Date.now() });
    const updated = await ctx.db.get(args.id);
    if (!updated) return null;
    return { ...updated, id: updated._id };
  },
});

export const deleteLead = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const lead = await ctx.db.get(id);
    if (!lead) throw new Error("Lead no encontrado");
    await ctx.db.delete(id);
    return { id };
  },
});

// Backfill approximate coordinates for seeded properties (map zones)
const ZONE_COORDS: Record<string, { lat: number; lng: number }> = {
  "cap cana": { lat: 18.5905, lng: -68.4539 },
  "torre piantini": { lat: 18.4556, lng: -69.9399 },
  "piantini": { lat: 18.4556, lng: -69.9399 },
  "casa de campo": { lat: 18.4259, lng: -68.9634 },
  "blue mall tower": { lat: 18.4312, lng: -69.9447 },
  "las terrenas": { lat: 19.3173, lng: -69.5394 },
  "bavaro": { lat: 18.666, lng: -68.4226 },
  "arroyo hondo": { lat: 18.5002, lng: -69.9189 },
  "zona colonial": { lat: 18.4735, lng: -69.8845 },
  "santo domingo": { lat: 18.4861, lng: -69.9312 },
  "punta cana": { lat: 18.5822, lng: -68.4028 },
  "la romana": { lat: 18.4273, lng: -68.9728 },
  "santiago": { lat: 19.4517, lng: -70.6979 },
};

export const backfillPropertyLocations = mutation({
  args: {},
  handler: async (ctx) => {
    const properties = await ctx.db.query("properties").collect();
    const results: { id: string; title: string; lat?: number; lng?: number }[] = [];
    for (const p of properties) {
      const needle = `${p.location} ${p.city}`.toLowerCase();
      let coord: { lat: number; lng: number } | undefined;
      for (const [key, value] of Object.entries(ZONE_COORDS)) {
        if (needle.includes(key)) {
          coord = value;
          break;
        }
      }
      if (coord && (p.lat === null || p.lat === undefined)) {
        await ctx.db.patch(p._id, { lat: coord.lat, lng: coord.lng, updatedAt: Date.now() });
        results.push({ id: p._id, title: p.title, lat: coord.lat, lng: coord.lng });
      } else {
        results.push({ id: p._id, title: p.title, lat: p.lat ?? undefined, lng: p.lng ?? undefined });
      }
    }
    return { mapped: results.filter((r) => r.lat !== undefined && r.lng !== undefined).length, results };
  },
});