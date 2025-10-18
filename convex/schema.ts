import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    externalId: v.string(),
    email: v.string(),
    image: v.optional(v.id("_storage")),
    mobileNumber: v.optional(v.string()),
    username: v.optional(v.string()),
    dob: v.optional(v.string()),
    gender: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    zip: v.optional(v.string()),
    addressline: v.optional(v.string()),
    role: v.optional(v.union(v.literal("user"), v.literal("admin"))),
    customerId: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_externalId", ["externalId"]),

  categories: defineTable({
    name: v.string(),
    image: v.id("_storage"),
  }).index("by_name", ["name"]),

  products: defineTable({
    user: v.id("users"),
    title: v.string(),
    images: v.array(v.id("_storage")),
    description: v.string(),
    content: v.optional(v.string()),
    categoryId: v.id("categories"),
    price: v.number(),
    stock: v.optional(v.number()),
    sold: v.optional(v.number()),
  })
    .index("by_category", ["categoryId"])
    .searchIndex("by_title", {
      searchField: "title",
      staged: false,
    }),

  reviews: defineTable({
    product: v.id("products"),
    user: v.id("users"),
    comment: v.string(),
    rating: v.number(),
  })
    .index("by_product", ["product"])
    .index("by_user", ["user"])
    .index("by_product_user", ["product", "user"]),

  coupons: defineTable({
    name: v.string(),
    code: v.string(),
    discount: v.number(),
    minCartPrice: v.number(),
  }).index("by_code", ["code"]),

  orders: defineTable({
    user: v.id("users"),
    orderItems: v.array(
      v.object({
        product: v.object({
          _id: v.id("products"),
          title: v.string(),
          description: v.string(),
          images: v.array(v.id("_storage")),
          price: v.number(),
          categoryId: v.id("categories"),
        }),
        quantity: v.number(),
      })
    ),
    coupon: v.object({
      _id: v.string(),
      name: v.string(),
      code: v.string(),
      discount: v.number(),
      minCartPrice: v.number(),
    }),
    shippingAddress: v.object({
      address: v.string(),
      city: v.string(),
      zip: v.string(),
      country: v.string(),
      state: v.string(),
    }),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("refund")
    ),
    paymentId: v.string(),
    price: v.number(),
    discount: v.number(),
    finalPrice: v.number(),
    isPaid: v.boolean(),
    paidAt: v.optional(v.string()),
    isDelivered: v.boolean(),
    deliveredAt: v.optional(v.string()),
  })
    .index("by_user", ["user"])
    .index("by_status", ["paymentStatus"]),
});
