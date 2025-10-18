/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as categories from "../categories.js";
import type * as coupons from "../coupons.js";
import type * as dashboard from "../dashboard.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as orders from "../orders.js";
import type * as payments from "../payments.js";
import type * as products from "../products.js";
import type * as reviews from "../reviews.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  categories: typeof categories;
  coupons: typeof coupons;
  dashboard: typeof dashboard;
  files: typeof files;
  http: typeof http;
  orders: typeof orders;
  payments: typeof payments;
  products: typeof products;
  reviews: typeof reviews;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
