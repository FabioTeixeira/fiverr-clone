import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {
    id: v.id("gigs"),
  },
  handler: async (ctx, args) => {
    const categorires = await ctx.db.query("categories").collect();

    const categoriesWithSubcategoriesRelations = categorires.map((category) => {
      return ctx.db
        .query("subcategories")
        .withIndex("by_category", (q) => q.eq("categoryId", category._id))
        .collect()
        .then((subcategories) => {
          return {
            ...category,
            subcategories: subcategories,
          };
        });
    });
  },
});
