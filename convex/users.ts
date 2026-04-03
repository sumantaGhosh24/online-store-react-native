import {UserJSON} from "@clerk/backend";
import {paginationOptsValidator} from "convex/server";
import {v, Validator} from "convex/values";

import {Id} from "./_generated/dataModel";
import {internalMutation, mutation, query, QueryCtx} from "./_generated/server";

export const upsertFromClerk = internalMutation({
  args: {data: v.any() as Validator<UserJSON>},
  async handler(ctx, {data}) {
    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      const userAttributes = {
        name: `${data.first_name} ${data.last_name}`,
        externalId: data.id,
        email: data.email_addresses[0].email_address,
        image: "kg23ja67chk1vmm6h33hm5tzj57rajrx" as Id<"_storage">,
      };

      await ctx.db.insert("users", {...userAttributes, role: "user"});
    } else {
      const userAttributes = {
        name: `${data.first_name} ${data.last_name}`,
        externalId: data.id,
        email: data.email_addresses[0].email_address,
      };

      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: {clerkUserId: v.string()},
  async handler(ctx, {clerkUserId}) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      if (user.image !== "kg23ja67chk1vmm6h33hm5tzj57rajrx") {
        await ctx.storage.delete(user.image!);
      }

      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

export async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_externalId", (q) => q.eq("externalId", externalId))
    .unique();
}

export const getUser = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const image = await ctx.storage.getUrl(user.image!);

    return {...user, image};
  },
});

export const updateUserDetails = mutation({
  args: {
    mobileNumber: v.string(),
    username: v.string(),
    dob: v.optional(v.string()),
    gender: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await userByExternalId(ctx, identity.subject);
    if (user === null) throw new Error("User not found");

    const existingMobile = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("mobileNumber"), args.mobileNumber))
      .first();
    if (existingMobile) throw new Error("Mobile already registered");

    const existingUsername = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username.toLowerCase()))
      .first();
    if (existingUsername) throw new Error("Username already taken");

    await ctx.db.patch(user?._id, {
      mobileNumber: args.mobileNumber,
      username: args.username.toLowerCase(),
      dob: args.dob,
      gender: args.gender?.toLowerCase(),
    });
  },
});

export const updateUserImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await userByExternalId(ctx, identity.subject);
    if (user === null) throw new Error("User not found");

    if (user.image !== "kg23ja67chk1vmm6h33hm5tzj57rajrx") {
      await ctx.storage.delete(user.image!);
    }

    await ctx.db.patch(user?._id, {
      image: args.storageId,
    });
  },
});

export const getPaginatedUsers = query({
  args: {paginationOpts: paginationOptsValidator},
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .order("desc")
      .paginate(args.paginationOpts);
    const usersWithImages = await Promise.all(
      users.page.map(async (user) => ({
        ...user,
        image: await ctx.storage.getUrl(user.image!),
      })),
    );

    return {
      page: usersWithImages,
      isDone: users.isDone,
      continueCursor: users.continueCursor,
    };
  },
});

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    return users;
  },
});
