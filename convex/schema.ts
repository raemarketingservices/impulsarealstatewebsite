import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  agents: defineTable({
    name: v.string(),
    title: v.string(),
    bio: v.string(),
    photoUrl: v.string(),
    phone: v.string(),
    email: v.string(),
    password: v.string(),
    whatsapp: v.string(),
    instagram: v.optional(v.string()),
    tiktok: v.optional(v.string()),
    facebook: v.optional(v.string()),
    specialties: v.string(),
    rating: v.number(),
    salesCount: v.number(),
    order: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_order", ["order"]),

  properties: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.string(),
    status: v.string(),
    operation: v.string(),
    price: v.number(),
    currency: v.string(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    area: v.number(),
    parking: v.number(),
    location: v.string(),
    city: v.string(),
    zone: v.string(),
    address: v.optional(v.union(v.string(), v.null())),
    lat: v.optional(v.union(v.number(), v.null())),
    lng: v.optional(v.union(v.number(), v.null())),
    images: v.string(),
    features: v.string(),
    featured: v.boolean(),
    videoUrl: v.optional(v.union(v.string(), v.null())),
    published: v.boolean(),
    views: v.number(),
    agentId: v.optional(v.union(v.string(), v.null())),
    ownerId: v.optional(v.union(v.string(), v.null())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_agent", ["agentId"])
    .index("by_featured", ["featured"])
    .index("by_created", ["createdAt"]),

  settings: defineTable({
    key: v.string(),
    value: v.string(),
    label: v.string(),
    group: v.string(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  testimonials: defineTable({
    clientName: v.string(),
    clientRole: v.string(),
    clientPhoto: v.optional(v.string()),
    message: v.string(),
    rating: v.number(),
    property: v.optional(v.string()),
    verified: v.boolean(),
    order: v.number(),
    createdAt: v.number(),
  }),

  socialPosts: defineTable({
    platform: v.string(),
    caption: v.string(),
    imageUrl: v.string(),
    postUrl: v.optional(v.string()),
    likes: v.number(),
    comments: v.number(),
    order: v.number(),
    createdAt: v.number(),
  }),

  inquiries: defineTable({
    propertyId: v.optional(v.union(v.string(), v.null())),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.union(v.string(), v.null())),
    message: v.string(),
    status: v.string(),
    createdAt: v.number(),
  }),

  goals: defineTable({
    userId: v.string(),
    title: v.string(),
    type: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    targetDate: v.number(),
    status: v.string(),
    createdAt: v.number(),
  }),

  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.string(),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
  }),

  leads: defineTable({
    type: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.union(v.string(), v.null())),
    propertyType: v.string(),
    budget: v.string(),
    zoneName: v.string(),
    lat: v.optional(v.union(v.number(), v.null())),
    lng: v.optional(v.union(v.number(), v.null())),
    message: v.optional(v.union(v.string(), v.null())),
    status: v.string(),
    agentId: v.optional(v.union(v.string(), v.null())),
    notes: v.array(v.object({
      text: v.string(),
      createdAt: v.number(),
      by: v.string(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_agent", ["agentId"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),
});