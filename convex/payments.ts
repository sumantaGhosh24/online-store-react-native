import {v} from "convex/values";

import {Id} from "./_generated/dataModel";
import {mutation, query} from "./_generated/server";
import {userByExternalId} from "./users";

export const calculateCartTotal = query({
  args: {
    products: v.array(v.object({_id: v.id("products"), quantity: v.number()})),
  },
  handler: async (ctx, args) => {
    const itemTotalPromises = args.products.map(async (item) => {
      const product = await ctx.db.get(item._id);
      return item.quantity * (product?.price ?? 0);
    });
    const itemTotals = await Promise.all(itemTotalPromises);
    const total = itemTotals.reduce((sum, t) => {
      return sum + t;
    }, 0);

    const productsPromise = args.products.map(async (item) => {
      const product = await ctx.db.get(item._id);
      return {product, quantity: item.quantity};
    });
    const allProducts = await Promise.all(productsPromise);
    const orderItems = allProducts.map((item) => {
      return {
        product: {
          _id: item?.product?._id!,
          title: item?.product?.title!,
          description: item?.product?.description!,
          images: item?.product?.images!,
          price: item?.product?.price!,
          categoryId: item?.product?.categoryId!,
        },
        quantity: item.quantity,
      };
    });

    return {total, orderItems};
  },
});

export const validateCoupon = mutation({
  args: {
    couponCode: v.string(),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.couponCode))
      .collect();
    if (coupon.length === 0) {
      return {
        message: "Coupon not found",
        status: "error",
      };
    }

    const couponMinCartPrice = coupon[0].minCartPrice;

    if (args.total < couponMinCartPrice) {
      return {
        message:
          "Total must be greater than or equal to the minimum cart price",
        status: "error",
      };
    }

    return {
      coupon: coupon[0]._id,
      status: "success",
      message: "Coupon applied successfully",
    };
  },
});

export const createStripeAccount = mutation({
  args: {
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await userByExternalId(ctx, identity.subject);
    if (user === null) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      customerId: args.customerId,
    });
  },
});

export const createPayment = mutation({
  args: {
    products: v.array(v.object({_id: v.id("products"), quantity: v.number()})),
    amount: v.number(),
    couponId: v.optional(v.string()),
    paymentId: v.string(),
    addressId: v.id("addresses"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await userByExternalId(ctx, identity.subject);
    if (user === null) throw new Error("User not found");

    const address = await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("user", user._id))
      .filter((q) => q.eq(q.field("_id"), args.addressId))
      .unique();

    if (!address) {
      throw new Error("Address not found for this user");
    }

    let coupon = null;
    if (args.couponId) {
      coupon = await ctx.db.get(args.couponId as Id<"coupons">);
    }

    const productsPromise = args.products.map(async (item) => {
      const product = await ctx.db.get(item._id);
      return {product, quantity: item.quantity};
    });
    const allProducts = await Promise.all(productsPromise);
    const orderItems = allProducts.map((item) => {
      return {
        product: {
          _id: item?.product?._id!,
          title: item?.product?.title!,
          description: item?.product?.description!,
          images: item?.product?.images!,
          price: item?.product?.price!,
          categoryId: item?.product?.categoryId!,
        },
        quantity: item.quantity,
      };
    });

    return await ctx.db.insert("orders", {
      user: user._id,
      orderItems: orderItems,
      coupon: {
        _id: args.couponId ?? "",
        name: coupon?.name ?? "",
        code: coupon?.code ?? "",
        discount: coupon?.discount ?? 0,
        minCartPrice: coupon?.minCartPrice ?? 0,
      },
      shippingAddress: {
        address: address?.addressline,
        city: address?.city,
        zip: address?.zip,
        country: address?.country,
        state: address?.state,
      },
      paymentStatus: "completed",
      price: args.amount,
      discount: coupon?.discount ?? 0,
      finalPrice: coupon?.discount
        ? args.amount - coupon?.discount
        : args.amount,
      isPaid: true,
      paidAt: new Date().toISOString(),
      isDelivered: false,
      paymentId: args.paymentId,
    });
  },
});
