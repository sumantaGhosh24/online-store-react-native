import {query} from "./_generated/server";

interface UserSummary {
  totalUsers: number;
  adminCount: number;
  userCount: number;
}

export const getUserSummary = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    let adminCount = 0;
    let userCount = 0;

    for (const user of users) {
      if (user.role === "admin") {
        adminCount++;
      } else if (user.role === "user") {
        userCount++;
      }
    }

    return {
      totalUsers: users.length,
      adminCount,
      userCount,
    } as UserSummary;
  },
});

interface ProductSummary {
  totalProducts: number;
  totalStock: number;
  totalUnitsSold: number;
  lowStockProducts: number;
  averagePrice: number;
  topSellingProducts: {title: string; sold: number}[];
}

export const getProductSummary = query({
  args: {},
  handler: async (ctx, args) => {
    const threshold = 10;
    const products = await ctx.db.query("products").collect();

    let totalStock = 0;
    let totalUnitsSold = 0;
    let lowStockProducts = 0;
    let totalPrice = 0;

    const productSalesMap = new Map<string, number>();

    for (const product of products) {
      totalStock += product.stock ?? 0;
      totalUnitsSold += product.sold ?? 0;
      totalPrice += product.price;

      if ((product.stock ?? 0) < threshold) {
        lowStockProducts++;
      }

      productSalesMap.set(product.title, product.sold ?? 0);
    }

    const sortedSales = Array.from(productSalesMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([title, sold]) => ({title, sold}));

    return {
      totalProducts: products.length,
      totalStock,
      totalUnitsSold,
      lowStockProducts,
      averagePrice: products.length > 0 ? totalPrice / products.length : 0,
      topSellingProducts: sortedSales,
    } as ProductSummary;
  },
});

interface ReviewSummary {
  totalReviews: number;
  overallAverageRating: number;
  ratingDistribution: {[key: number]: number};
}

export const getReviewSummary = query({
  args: {},
  handler: async (ctx) => {
    const reviews = await ctx.db.query("reviews").collect();
    let totalRating = 0;
    const ratingDistribution: {[key: number]: number} = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    for (const review of reviews) {
      totalRating += review.rating;
      if (review.rating >= 1 && review.rating <= 5) {
        ratingDistribution[review.rating]++;
      }
    }

    const totalReviews = reviews.length;

    return {
      totalReviews,
      overallAverageRating: totalReviews > 0 ? totalRating / totalReviews : 0,
      ratingDistribution,
    } as ReviewSummary;
  },
});

interface FinancialSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  completedOrders: number;
  cancelledOrders: number;
}

export const getFinancialSummary = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();

    let totalRevenue = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;

    for (const order of orders) {
      if (order.paymentStatus === "completed" && order.isPaid) {
        totalRevenue += order.finalPrice;
        completedOrders++;
      } else if (order.paymentStatus === "cancelled") {
        cancelledOrders++;
      }
    }

    const totalOrders = orders.length;
    const averageOrderValue =
      completedOrders > 0 ? totalRevenue / completedOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      completedOrders,
      cancelledOrders,
    } as FinancialSummary;
  },
});
