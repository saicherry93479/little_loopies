import { relations, type InferSelectModel } from "drizzle-orm";
import { text, integer, real, sqliteTable } from "drizzle-orm/sqlite-core";

// users table
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),

  userType: text("user_type"),
  status: text("status", {
    enum: ["pending", "active", "suspended"],
  }),
  password: text("password").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const tempUsers = sqliteTable("temp_users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  token: text("token")
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  type: text("type", {
    enum: ["new_signup", "password_reset"],
  }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date(Date.now() + 24 * 60 * 60 * 1000)), // 24 hours from now
  used: integer("used", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// session table
export const sessions = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),

  accessToken: text("access_token").notNull(),

  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  lastUsedAt: integer("last_used_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
});
export const permissions = sqliteTable("permissions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Add cascade here
});

export const permissionsRelations = relations(permissions, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [permissions.createdBy],
    references: [users.id],
  }),
  rolePermissions: many(rolePermissions),
}));

export const roles = sqliteTable("roles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const rolePermissions = sqliteTable("role_permissions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  roleId: text("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  permissionId: text("permission_id")
    .notNull()
    .references(() => permissions.id, { onDelete: "cascade" }),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  })
);
export const categories = sqliteTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  description: text("description"),
  active: text("active").default("InActive"),
  images: text("images", { mode: "json" }).$type<string[]>(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const products = sqliteTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  images: text("images", { mode: "json" }).$type<string[]>(),
  productQuantity: integer("quantity").notNull().default(5),
  // Retail pricing
  userPrice: real("user_price").notNull(),
  userDiscountPercentage: real("user_discount_percentage").default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  // Wholesale configuration
  isWholesaleEnabled: text("is_wholesale_enabled").default("No"),
  activeForUsers: text("active_For_Users").default("No"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const wholesalePriceTiers = sqliteTable("wholesale_price_tiers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  pricePerUnit: real("price_per_unit").notNull(),
});

export const productReviews = sqliteTable("product_reviews", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  review: text("review").notNull(),
  rating: integer("rating").notNull(),
});

export const productCategories = sqliteTable("product_categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  categoryId: text("category_name")
    .notNull()
    .references(() => categories.name),
});

export const store = sqliteTable("store", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").unique(),
  mobile: text("mobile").notNull().unique(),
  storeName: text("business_name").notNull(),
  gstNumber: text("gst_number", { length: 15 }),
  panNumber: text("pan_number", { length: 10 }),
  aadharLinkedMobile: text("aadhar_linked_mobile", { length: 15 }).unique(),
  storeAddress: text("store_address", { mode: "json" }).$type<{
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    country?: string;
  }>(),
  status: text("status", {
    enum: ["pending", "active", "suspended", "inactive"],
  })
    .default("pending")
    .notNull(),
  storeTimings: text("store_timings", { mode: "json" }).$type<{
    openTime: string;
    closeTime: string;
    weeklyOff: string[];
  }>(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});
export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
}));

export const storeProducts = sqliteTable("store_products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeId: text("store_id")
    .notNull()
    .references(() => store.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  price: integer("price").notNull(),
  stock: integer("stock").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  storeQuantity: integer("store_quantity").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const orders = sqliteTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderType: text("order_type", {
    enum: ["customer", "store"],
  }).notNull(),
  status: text(
    "status"
    //   {
    //   enum: [
    //     "pending",
    //     "confirmed",
    //     "processing",
    //     "shipped",
    //     "delivered",
    //     "cancelled",
    //   ],
    // }
  )
    .notNull()
    .default("pending"),
  totalAmount: real("total_amount").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  assignedTo: text("assigned_to", {
    enum: ["company", "store"],
  }).default("company"),
});

// Customer-specific order details
export const customerOrders = sqliteTable("customer_orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  shippingAddress: text("shipping_address", { mode: "json" }).$type<{
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    landmark?: string;
  }>(),
  paymentStatus: text("payment_status", {
    enum: ["pending", "paid", "failed", "refunded"],
  })
    .notNull()
    .default("pending"),
  paymentMethod: text("payment_method", {
    enum: ["cod", "online", "upi"],
  }),
});

// Store-specific order details
export const storeOrders = sqliteTable("store_orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  storeId: text("store_id")
    .notNull()
    .references(() => store.id),
  expectedDeliveryDate: integer("expected_delivery_date", {
    mode: "timestamp",
  }).$defaultFn(() => new Date()),
  paymentTerms: text("payment_terms"),
  creditPeriodDays: integer("credit_period_days"),
});

export const assignedOrdersToStore = sqliteTable("assigned_orders_to_stores", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  storeId: text("store_id")
    .notNull()
    .references(() => store.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Unified order items table
export const orderItems = sqliteTable("order_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  name: text("name").default('product').notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  totalPrice: real("total_price").notNull(),
  discount: real("discount").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Order status history for tracking changes
export const orderStatusHistory = sqliteTable("order_status_history", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  status: text("status").notNull(),
  notes: text("notes"),
  updatedBy: text("updated_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  location: text("location"),
  trackingNumber: text("tracking_number"),
  expectedDeliveryDate: integer("expected_delivery_date", {
    mode: "timestamp",
  }),
});

export const orderTrackingLinks = sqliteTable("order_tracking_links", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  token: text("token")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  expiresAt: integer("expires_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
  issuedTo: text("issued_to").notNull(),
  issuedBy: text("issued_by").references(() => users.id),
  accessCount: integer("access_count").notNull().default(0),
  maxAccess: integer("max_access").notNull().default(100),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  customerOrder: one(customerOrders, {
    fields: [orders.id],
    references: [customerOrders.orderId],
  }),
  storeOrder: one(storeOrders, {
    fields: [orders.id],
    references: [storeOrders.orderId],
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory, {
    fields: [orders.id],
    references: [orderStatusHistory.orderId],
  }),
  invoice: one(invoices, {
    fields: [orders.id],
    references: [invoices.orderId],
  }),
  trackingLinks: many(orderTrackingLinks),
}));

export const orderStatusHistoryRelations = relations(
  orderStatusHistory,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderStatusHistory.orderId],
      references: [orders.id],
    }),
  })
);

export const orderTrackingLinksRelations = relations(
  orderTrackingLinks,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderTrackingLinks.orderId],
      references: [orders.id],
    }),
  })
);

// export const storeRelations = relations(store,{
//   products : man
// })

export const customerOrdersRelations = relations(customerOrders, ({ one }) => ({
  order: one(orders, {
    fields: [customerOrders.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [customerOrders.userId],
    references: [users.id],
  }),
}));

export const storeRelatiosn = relations(store, ({ many }) => ({
  orders: many(storeOrders),
}));

export const storeOrdersRelations = relations(storeOrders, ({ one }) => ({
  order: one(orders, {
    fields: [storeOrders.orderId],
    references: [orders.id],
  }),
  store: one(store, {
    fields: [storeOrders.storeId],
    references: [store.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// Types

// Rest of your existing tables with updated references

export const invoices = sqliteTable("invoices", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  paymentMethod: text("payment_method", {
    enum: ["cod", "online"],
  }).notNull(),
  // invoiceNumber: text("invoice_number").notNull(),
  amount: real("amount").notNull(),
  status: text("status", {
    enum: ["pending", "paid"],
  })
    .notNull()
    .default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// reltaions

export const usersRelations = relations(users, ({ one, many }) => ({
  store: one(store, {
    fields: [users.id],
    references: [store.userId],
  }),
  // orders: many(orders),
  // sessions: many(sessions),
}));

export const storeOrderRelations = relations(storeOrders, ({ many, one }) => ({
  store: one(store, {
    fields: [storeOrders.storeId],
    references: [store.id],
  }),
  orders: many(orders),
}));

export const wholesalePriceTiersRelations = relations(
  wholesalePriceTiers,
  ({ one }) => ({
    product: one(products, {
      fields: [wholesalePriceTiers.productId],
      references: [products.id],
    }),
  })
);

// Relations
export const productsRelations = relations(products, ({ many }) => ({
  categories: many(productCategories),
  wholesalePriceTiers: many(wholesalePriceTiers),
  items: many(orderItems),
  reviews: many(productReviews),
  // ratings: many(productRatings),
}));

export const productCategoriesRelations = relations(
  productCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productCategories.productId],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [productCategories.categoryId],
      references: [categories.name],
    }),
  })
);

// Add categories relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(productCategories),
}));

export const newsletterSubscriptions = sqliteTable("newsletter_subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").unique().notNull(),
  status: text("status", {
    enum: ["active", "unsubscribed"]
  }).default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Reviews schema
export const reviews = sqliteTable("reviews", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  helpfulCount: integer("helpful_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Helpful votes for reviews
export const reviewHelpfulVotes = sqliteTable("review_helpful_votes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  reviewId: text("review_id")
    .notNull()
    .references(() => reviews.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Coupons schema
export const coupons = sqliteTable("coupons", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(),
  description: text("description"),
  discount: real("discount").notNull(),
  type: text("type", { enum: ["percentage", "fixed", "shipping"] }).notNull(),
  minPurchase: real("min_purchase"),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
  category: text("category"),
  status: text("status", { enum: ["active", "expired", "scheduled"] }).notNull().default("active"),
  expiryDate: integer("expiry_date", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Product variants for different colors and sizes
export const productVariants = sqliteTable("product_variants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  color: text("color").notNull(),
  size: text("size").notNull(),
  price: real("price").notNull(),
  discountPercentage: real("discount_percentage").default(0),
  stock: integer("stock").notNull().default(0),
  images: text("images", { mode: "json" }).$type<string[]>(),
  sku: text("sku"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export type User = InferSelectModel<typeof users>;
export type StoreUser = InferSelectModel<typeof store>;
export type Role = InferSelectModel<typeof roles>;
export type Permission = InferSelectModel<typeof permissions>;
export type RolePermission = InferSelectModel<typeof rolePermissions>;
export type Category = InferSelectModel<typeof categories>;
export type Order = InferSelectModel<typeof orders>;
export type CustomerOrder = InferSelectModel<typeof customerOrders>;
export type StoreOrder = InferSelectModel<typeof storeOrders>;
export type OrderItem = InferSelectModel<typeof orderItems>;
export type OrderStatusHistoryEntry = InferSelectModel<
  typeof orderStatusHistory
>;
export type Review = InferSelectModel<typeof reviews>;
export type ReviewHelpfulVote = InferSelectModel<typeof reviewHelpfulVotes>;
export type Coupon = InferSelectModel<typeof coupons>;
export type ProductVariant = InferSelectModel<typeof productVariants>;