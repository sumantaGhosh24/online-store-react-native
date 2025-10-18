import {paginationOptsValidator} from "convex/server";
import {v} from "convex/values";

import {Doc} from "./_generated/dataModel";
import {mutation, query} from "./_generated/server";

async function resolveOrderDetails(
  order: Doc<"orders">,
  db: any,
  storage: any
) {
  const user = await db.get(order.user);

  const userImageUrl = user?.image ? await storage.getUrl(user.image) : null;

  return {
    ...order,
    user: {...user, image: userImageUrl},
  };
}

export const getPaginatedOrders = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const {paginationOpts, userId} = args;

    let results;

    if (userId) {
      results = await ctx.db
        .query("orders")
        .withIndex("by_user", (q) => q.eq("user", userId))
        .paginate(paginationOpts);
    } else {
      results = await ctx.db
        .query("orders")
        .order("desc")
        .paginate(paginationOpts);
    }

    const ordersWithDetails = await Promise.all(
      results.page.map((order) =>
        resolveOrderDetails(order!, ctx.db, ctx.storage)
      )
    );

    return {
      page: ordersWithDetails,
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    };
  },
});

export const getOrder = query({
  args: {id: v.id("orders")},
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found.");

    return resolveOrderDetails(order, ctx.db, ctx.storage);
  },
});

export const updateOrder = mutation({
  args: {
    id: v.id("orders"),
    isDelivered: v.boolean(),
    deliveredAt: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found.");

    await ctx.db.patch(args.id, {
      isDelivered: args.isDelivered,
      deliveredAt: args.deliveredAt,
    });
  },
});
