import {paginationOptsValidator} from "convex/server";
import {v} from "convex/values";

import {mutation, query} from "./_generated/server";

export const getCategory = query({
  args: {id: v.id("categories")},
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    if (!category) throw new Error("Category not found.");

    return {
      ...category,
      image: await ctx.storage.getUrl(category.image),
    };
  },
});

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();

    return await Promise.all(
      categories.map(async (category) => ({
        ...category,
        image: await ctx.storage.getUrl(category.image),
      }))
    );
  },
});

export const getCategoriesPaginated = query({
  args: {paginationOpts: paginationOptsValidator},
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories")
      .order("desc")
      .paginate(args.paginationOpts);
    const categoriesWithImages = await Promise.all(
      categories.page.map(async (category) => ({
        ...category,
        image: await ctx.storage.getUrl(category.image),
      }))
    );

    return {
      page: categoriesWithImages,
      isDone: categories.isDone,
      continueCursor: categories.continueCursor,
    };
  },
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    image: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    await ctx.db.insert("categories", {
      name: args.name.toLowerCase(),
      image: args.image,
    });
  },
});

export const deleteCategory = mutation({
  args: {id: v.id("categories")},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const product = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("categoryId"), args.id))
      .first();
    if (product) {
      throw new Error("Please delete all products of this category first.");
    }

    const category = await ctx.db.get(args.id);
    if (!category) throw new Error("Category not found.");

    await ctx.db.delete(args.id);

    await ctx.storage.delete(category.image);
  },
});

export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
    image: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const category = await ctx.db.get(args.id);
    if (!category) throw new Error("Category not found.");

    if (args.image) {
      await ctx.storage.delete(category.image);

      await ctx.db.patch(args.id, {
        name: args.name.toLowerCase(),
        image: args.image,
      });
    } else {
      await ctx.db.patch(args.id, {
        name: args.name.toLowerCase(),
      });
    }
  },
});
