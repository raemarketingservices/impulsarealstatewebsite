import { ConvexHttpClient } from "convex/browser";
import { readFileSync } from "node:fs";

const URL = process.env.CONVEX_URL || "https://outgoing-hound-915.convex.cloud";
const client = new ConvexHttpClient(URL);

const read = (name) => JSON.parse(readFileSync(`./scripts/dump/${name}.json`, "utf8"));

// SQLite stores booleans as 0/1 and optionals as null → sanitize to Convex types
const bool = (v) => v === true || v === 1 || v === "true";
const undef = (obj, keys) => {
  const out = { ...obj };
  for (const k of keys) {
    if (out[k] === null || out[k] === undefined) delete out[k];
  }
  return out;
};
const num = (v) => (v === null || v === undefined ? undefined : Number(v));

const agents = read("Agent").map((a) =>
  undef(a, ["instagram", "tiktok", "facebook"]),
);
const properties = read("Property").map((p) =>
  undef(p, ["address", "lat", "lng", "videoUrl", "ownerId"]),
);
const settings = read("Setting");
const testimonials = read("Testimonial").map((t) => undef(t, ["clientPhoto", "property"]));
const socialPosts = read("SocialPost").map((s) => undef(s, ["postUrl"]));
const goals = read("Goal").map((g) => ({ ...g, targetDate: num(g.targetDate) }));
const users = read("User").map((u) => undef(u, ["name", "phone", "avatarUrl"]));

// Normalize booleans
for (const a of agents) a.active = bool(a.active);
for (const p of properties) {
  p.featured = bool(p.featured);
  p.published = bool(p.published);
  p.views = num(p.views) ?? 0;
}
for (const t of testimonials) t.verified = bool(t.verified);
for (const g of goals) g.status = g.status ?? "ACTIVE";
for (const s of settings) s.value = String(s.value ?? "");

console.log(`Seeding to ${URL}...`);
const result = await client.mutation("functions:seedAll", {
  agents,
  properties,
  settings,
  testimonials,
  socialPosts,
  goals,
  users,
});
console.log("Seed result:", result);
