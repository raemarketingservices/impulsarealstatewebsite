import { ConvexHttpClient } from "convex/browser";

const deploymentUrl =
  process.env.CONVEX_URL ||
  process.env.NEXT_PUBLIC_CONVEX_URL ||
  "https://outgoing-hound-915.convex.cloud";

export const convexClient = new ConvexHttpClient(deploymentUrl);
