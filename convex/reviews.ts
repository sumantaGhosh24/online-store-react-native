import {paginationOptsValidator} from "convex/server";
import {v} from "convex/values";

import {Doc} from "./_generated/dataModel";
import {mutation, query} from "./_generated/server";
import {userByExternalId} from "./users";

async function resolveReviewDetails(
  review: Doc<"reviews">,
  db: any,
  storage: any
) {
  const product = await db.get(review.product);

  const user = await db.get(review.user);
  const userImageUrl = user?.image ? await storage.getUrl(user.image) : null;

  return {
    ...review,
    product,
    user: {...user, image: userImageUrl},
  };
}

export const getPaginatedReviews = query({
  args: {
    paginationOpts: paginationOptsValidator,
    productId: v.optional(v.any()),
    userId: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const {paginationOpts, productId, userId} = args;

    let results;

    if (productId && userId) {
      results = await ctx.db
        .query("reviews")
        .withIndex("by_product_user", (q) =>
          q.eq("product", productId).eq("user", userId)
        )
        .paginate(paginationOpts);
    } else if (productId) {
      results = await ctx.db
        .query("reviews")
        .withIndex("by_product", (q) => q.eq("product", productId))
        .paginate(paginationOpts);
    } else if (userId) {
      results = await ctx.db
        .query("reviews")
        .withIndex("by_user", (q) => q.eq("user", userId))
        .paginate(paginationOpts);
    } else {
      results = await ctx.db
        .query("reviews")
        .order("desc")
        .paginate(paginationOpts);
    }

    const reviewsWithDetails = await Promise.all(
      results.page.map((review) =>
        resolveReviewDetails(review!, ctx.db, ctx.storage)
      )
    );

    return {
      page: reviewsWithDetails,
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    };
  },
});

export const createReview = mutation({
  args: {
    productId: v.id("products"),
    comment: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await userByExternalId(ctx, identity.subject);
    if (user === null) throw new Error("User not found");

    await ctx.db.insert("reviews", {
      product: args.productId,
      user: user._id,
      comment: args.comment.toLowerCase(),
      rating: args.rating,
    });
  },
});

export const deleteReview = mutation({
  args: {
    reviewId: v.id("reviews"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await userByExternalId(ctx, identity.subject);
    if (user === null) throw new Error("User not found");

    if (user.role !== "admin") {
      throw new Error("You are not authorized to perform this action.");
    }

    await ctx.db.delete(args.reviewId);
  },
});
