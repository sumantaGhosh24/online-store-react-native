import {paginationOptsValidator} from "convex/server";
import {v} from "convex/values";

import {Id} from "./_generated/dataModel";
import {mutation, query} from "./_generated/server";

export const getCoupon = query({
  args: {id: v.optional(v.string())},
  handler: async (ctx, args) => {
    if (!args.id || args.id === "") return null;

    const coupon = await ctx.db.get(args.id as Id<"coupons">);
    if (!coupon) return null;

    return coupon;
  },
});

export const getCoupons = query({
  args: {},
  handler: async (ctx) => {
    const coupons = await ctx.db.query("coupons").collect();

    return coupons;
  },
});

export const getCouponsPaginated = query({
  args: {paginationOpts: paginationOptsValidator},
  handler: async (ctx, args) => {
    const coupons = await ctx.db
      .query("coupons")
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      page: coupons.page,
      isDone: coupons.isDone,
      continueCursor: coupons.continueCursor,
    };
  },
});

export const createCoupon = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    discount: v.number(),
    minCartPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    if (args.discount > args.minCartPrice) {
      throw new Error("Coupon discount cannot be greater than min cart price");
    }

    await ctx.db.insert("coupons", {
      name: args.name.toLowerCase(),
      code: args.code,
      discount: args.discount,
      minCartPrice: args.minCartPrice,
    });
  },
});

export const updateCoupon = mutation({
  args: {
    id: v.id("coupons"),
    name: v.string(),
    code: v.string(),
    discount: v.number(),
    minCartPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const coupon = await ctx.db.get(args.id);
    if (!coupon) throw new Error("Coupon not found.");

    if (args.discount > args.minCartPrice) {
      throw new Error("Coupon discount cannot be greater than min cart price");
    }

    await ctx.db.patch(args.id, {
      name: args.name.toLowerCase(),
      code: args.code,
      discount: args.discount,
      minCartPrice: args.minCartPrice,
    });
  },
});

export const deleteCoupon = mutation({
  args: {id: v.id("coupons")},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const coupon = await ctx.db.get(args.id);
    if (!coupon) throw new Error("Coupon not found.");

    await ctx.db.delete(args.id);
  },
});
