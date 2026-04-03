import {v} from "convex/values";

import {mutation, query} from "./_generated/server";
import {userByExternalId} from "./users";
import {Id} from "./_generated/dataModel";

export const getAddress = query({
  args: {id: v.optional(v.string())},
  handler: async (ctx, args) => {
    if (!args.id || args.id === "") return null;

    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await userByExternalId(ctx, identity.subject);
    if (user === null) throw new Error("User not found");

    const address = await ctx.db.get(args.id as Id<"addresses">);
    if (!address || address.user !== user._id)
      throw new Error("Address not found.");

    return address;
  },
});

export const getAddresses = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await userByExternalId(ctx, identity.subject);
    if (user === null) throw new Error("User not found");

    const addresses = await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("user", user._id))
      .collect();

    return addresses;
  },
});

export const createAddress = mutation({
  args: {
    name: v.string(),
    city: v.string(),
    state: v.string(),
    country: v.string(),
    zip: v.string(),
    addressline: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await userByExternalId(ctx, identity.subject);
    if (user === null) throw new Error("User not found");

    const existingAddresses = await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("user", user._id))
      .collect();

    if (existingAddresses.length >= 5) {
      throw new Error("Maximum addresses created by one user is 5");
    }

    await ctx.db.insert("addresses", {
      name: args.name.toLowerCase(),
      user: user._id,
      city: args.city.toLowerCase(),
      state: args.state.toLowerCase(),
      country: args.country.toLowerCase(),
      zip: args.zip.toLowerCase(),
      addressline: args.addressline.toLowerCase(),
    });
  },
});

export const updateAddress = mutation({
  args: {
    id: v.id("addresses"),
    name: v.string(),
    city: v.string(),
    state: v.string(),
    country: v.string(),
    zip: v.string(),
    addressline: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await userByExternalId(ctx, identity.subject);
    if (user === null) throw new Error("User not found");

    const address = await ctx.db.get(args.id);
    if (!address) {
      throw new Error("Address not found.");
    }
    if (address.user !== user._id) {
      throw new Error("You are not authorized to update this address.");
    }

    await ctx.db.patch(args.id, {
      name: args.name.toLowerCase(),
      city: args.city.toLowerCase(),
      state: args.state.toLowerCase(),
      country: args.country.toLowerCase(),
      zip: args.zip.toLowerCase(),
      addressline: args.addressline.toLowerCase(),
    });
  },
});

export const deleteAddress = mutation({
  args: {
    addressId: v.id("addresses"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await userByExternalId(ctx, identity.subject);
    if (user === null) throw new Error("User not found");

    const address = await ctx.db.get(args.addressId);
    if (!address) {
      throw new Error("Address not found.");
    }
    if (address.user !== user._id) {
      throw new Error("You are not authorized to delete this address.");
    }

    await ctx.db.delete(args.addressId);
  },
});
