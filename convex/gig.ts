import { v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Mutation is a database transaction that changes the state of the database.
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    subcategoryId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    const gigId = await ctx.db.insert("gigs", {
      title: args.title,
      description: args.description,
      subcategoryId: args.subcategoryId as Id<"subcategories">,
      sellerId: user?._id!,
      published: false,
      clicks: 0,
    });

    return gigId;
  },
});
