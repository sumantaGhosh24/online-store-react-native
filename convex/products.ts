import {paginationOptsValidator} from "convex/server";
import {GenericId, v} from "convex/values";

import {Doc} from "./_generated/dataModel";
import {mutation, query} from "./_generated/server";
import {userByExternalId} from "./users";

async function resolveProductDetails(
  product: Doc<"products">,
  db: any,
  storage: any,
) {
  const category = await db.get(product.categoryId);

  const categoryImageUrl = category?.image
    ? await storage.getUrl(category.image)
    : null;

  const imageUrls = await Promise.all(
    product.images.map(async (imageId) => {
      return imageId ? await storage.getUrl(imageId) : null;
    }),
  );

  const user = await db.get(product.user);

  const userImageUrl = user?.image ? await storage.getUrl(user.image) : null;

  const reviews = await db
    .query("reviews")
    .withIndex(
      "by_product",
      (q: {eq: (arg0: string, arg1: GenericId<"products">) => any}) =>
        q.eq("product", product._id),
    )
    .collect();

  const reviewsCount = reviews.length;
  const averageReview =
    reviewsCount > 0
      ? reviews.reduce((acc: any, cur: {rating: any}) => acc + cur.rating, 0) /
        reviewsCount
      : 0;

  return {
    ...product,
    imageUrls: imageUrls.filter((url) => url !== null),
    category: {...category, image: categoryImageUrl},
    user: {...user, image: userImageUrl},
    reviews: {count: reviewsCount, average: averageReview},
  };
}

export const getPaginatedProducts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    categoryId: v.any(),
    searchTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const {paginationOpts, categoryId, searchTitle} = args;

    let results;

    if (searchTitle && searchTitle.trim().length > 0 && categoryId) {
      const searchResults = await ctx.db
        .query("products")
        .withSearchIndex("by_title", (q) =>
          q.search("title", searchTitle.trim()),
        )
        .paginate(paginationOpts);

      const fullDocs = await Promise.all(
        searchResults.page.map((result) => ctx.db.get(result._id)),
      );

      const filteredProducts = fullDocs.filter(
        (product) => product && product.categoryId === categoryId,
      );

      results = {
        ...searchResults,
        page: filteredProducts.filter(Boolean),
      };
    } else if (searchTitle && searchTitle.trim().length > 0) {
      const searchResults = await ctx.db
        .query("products")
        .withSearchIndex("by_title", (q) =>
          q.search("title", searchTitle.trim()),
        )
        .paginate(paginationOpts);

      const products = await Promise.all(
        searchResults.page.map((res) => ctx.db.get(res._id)),
      );

      results = {
        ...searchResults,
        page: products.filter(Boolean),
      };
    } else if (categoryId) {
      results = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
        .paginate(paginationOpts);
    } else {
      results = await ctx.db
        .query("products")
        .order("desc")
        .paginate(paginationOpts);
    }

    const productsWithDetails = await Promise.all(
      results.page.map((product) =>
        resolveProductDetails(product!, ctx.db, ctx.storage),
      ),
    );

    return {
      page: productsWithDetails,
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    };
  },
});

export const getProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return await Promise.all(
      products.map((product) =>
        resolveProductDetails(product!, ctx.db, ctx.storage),
      ),
    );
  },
});

export const getProduct = query({
  args: {id: v.id("products")},
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found.");

    return resolveProductDetails(product, ctx.db, ctx.storage);
  },
});

export const createProduct = mutation({
  args: {
    title: v.string(),
    price: v.number(),
    description: v.string(),
    category: v.id("categories"),
    image: v.id("_storage"),
    stock: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await userByExternalId(ctx, identity.subject);
    if (user === null) throw new Error("User not found");

    await ctx.db.insert("products", {
      user: user._id,
      title: args.title.toLowerCase(),
      description: args.description.toLowerCase(),
      price: args.price,
      categoryId: args.category,
      images: [args.image],
      stock: args.stock ?? 0,
      sold: 0,
    });
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    title: v.string(),
    price: v.number(),
    description: v.string(),
    category: v.id("categories"),
    stock: v.optional(v.number()),
    sold: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found.");

    await ctx.db.patch(args.id, {
      title: args.title.toLowerCase(),
      price: args.price,
      description: args.description.toLowerCase(),
      categoryId: args.category,
      stock: args.stock,
      sold: args.sold,
    });
  },
});

export const updateProductContent = mutation({
  args: {
    id: v.id("products"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found.");

    await ctx.db.patch(args.id, {
      content: args.content,
    });
  },
});

export const deleteProduct = mutation({
  args: {id: v.id("products")},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("This Product Does Not Exist.");

    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("product", args.id))
      .collect();

    if (reviews.length !== 0) {
      const deletePromises = reviews.map((review: Doc<"reviews">) => {
        return ctx.db.delete(review._id);
      });

      await Promise.all(deletePromises);
    }

    product.images.forEach(async (imageId) => {
      await ctx.storage.delete(imageId);
    });

    await ctx.db.delete(args.id);
  },
});

export const addProductImage = mutation({
  args: {
    productId: v.id("products"),
    newImageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found.");

    const updatedImages = [...product.images, args.newImageId];

    await ctx.db.patch(args.productId, {
      images: updatedImages,
    });
  },
});

export const removeProductImage = mutation({
  args: {
    productId: v.id("products"),
    imageIdToRemove: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found.");

    const updatedImages = product.images.filter(
      (id) => id !== args.imageIdToRemove,
    );

    await ctx.db.patch(args.productId, {
      images: updatedImages,
    });

    await ctx.storage.delete(args.imageIdToRemove);
  },
});
