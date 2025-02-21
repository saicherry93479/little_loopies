import { db } from "../index";
import {
  orders,
  customerOrders,
  storeOrders,
  users,
  orderItems,
  store,
  assignedOrdersToStore,
  storeProducts,
} from "../schema";
import { sql, desc, between, eq, and, or, count } from "drizzle-orm";

interface AnalyticsParams {
  startDate?: Date;
  endDate?: Date;
  storeId?: string;
}

export async function getMainScreenData({
  startDate,
  endDate,
  storeId,
}: AnalyticsParams = {}) {
  if (storeId) {
    // STORE SPECIFIC ANALYTICS
    // Revenue from store deliveries (assigned orders)
    const revenueQuery = db
      .select({
        // Revenue from store's assigned delivery orders
        deliveryRevenue: sql<number>`COALESCE(SUM(CASE 
        WHEN ${assignedOrdersToStore.storeId} = ${storeId} 
        AND ${orders.status} = 'delivered' 
        THEN ${orders.totalAmount} ELSE 0 END), 0)`,
        // Revenue from store's orders to company
        storeOrderRevenue: sql<number>`COALESCE(SUM(CASE 
        WHEN ${storeOrders.storeId} = ${storeId}
        AND ${orders.status} = 'delivered' 
        THEN ${orders.totalAmount} ELSE 0 END), 0)`,
        // Today's delivery revenue
        todayDeliveryRevenue: sql<number>`COALESCE(SUM(CASE 
        WHEN ${assignedOrdersToStore.storeId} = ${storeId}
        AND ${orders.status} = 'delivered' 
        AND date(${orders.createdAt},'unixepoch') = date('now') 
        THEN ${orders.totalAmount} ELSE 0 END), 0)`,
        // Today's store order revenue
        todayStoreOrderRevenue: sql<number>`COALESCE(SUM(CASE 
        WHEN ${storeOrders.storeId} = ${storeId}
        AND ${orders.status} = 'delivered' 
        AND date(${orders.createdAt},'unixepoch') = date('now') 
        THEN ${orders.totalAmount} ELSE 0 END), 0)`,
      })
      .from(orders)
      .leftJoin(
        assignedOrdersToStore,
        eq(orders.id, assignedOrdersToStore.orderId)
      )
      .leftJoin(storeOrders, eq(orders.id, storeOrders.orderId));

    const orderQuery = db
      .select({
        // Delivery Orders (assigned to store)
        assignedOrders: sql<number>`COUNT(DISTINCT CASE 
          WHEN ${assignedOrdersToStore.storeId} = ${storeId} THEN ${orders.id} END)`,
        deliveredOrders: sql<number>`COUNT(DISTINCT CASE 
          WHEN ${assignedOrdersToStore.storeId} = ${storeId} 
          AND ${orders.status} = 'delivered' THEN ${orders.id} END)`,
        cancelledDeliveries: sql<number>`COUNT(DISTINCT CASE 
          WHEN ${assignedOrdersToStore.storeId} = ${storeId} 
          AND ${orders.status} = 'cancelled' THEN ${orders.id} END)`,
        // Store Orders (store ordering from company)
        totalStoreOrders: sql<number>`COUNT(DISTINCT CASE 
          WHEN ${storeOrders.storeId} = ${storeId} THEN ${orders.id} END)`,
        deliveredStoreOrders: sql<number>`COUNT(DISTINCT CASE 
          WHEN ${storeOrders.storeId} = ${storeId} 
          AND ${orders.status} = 'delivered' THEN ${orders.id} END)`,
        cancelledStoreOrders: sql<number>`COUNT(DISTINCT CASE 
          WHEN ${storeOrders.storeId} = ${storeId} 
          AND ${orders.status} = 'cancelled' THEN ${orders.id} END)`,
      })
      .from(orders)
      .leftJoin(
        assignedOrdersToStore,
        eq(orders.id, assignedOrdersToStore.orderId)
      )
      .leftJoin(storeOrders, eq(orders.id, storeOrders.orderId));

    // Daily delivery orders
    const dailyOrdersQuery = db
      .select({
        date: sql<string>`date(${orders.createdAt},'unixepoch')`,
        deliveredOrders: sql<number>`COUNT(DISTINCT CASE 
        WHEN ${assignedOrdersToStore.storeId} = ${storeId} 
        AND ${orders.status} = 'delivered' THEN ${orders.id} END)`,
        totalAmount: sql<number>`COALESCE(SUM(CASE 
        WHEN ${assignedOrdersToStore.storeId} = ${storeId} 
        AND ${orders.status} = 'delivered' 
        THEN ${orders.totalAmount} ELSE 0 END), 0)`,
      })
      .from(orders)
      .leftJoin(
        assignedOrdersToStore,
        eq(orders.id, assignedOrdersToStore.orderId)
      )
      .groupBy(sql`date(${orders.createdAt},'unixepoch')`)
      .orderBy(desc(orders.createdAt));

    // Recent delivery order history
    const recentDeliveryHistoryQuery = db
      .select({
        orderId: orders.id,
        orderAmount: orders.totalAmount,
        customerName: users.name,
        status: orders.status,
        shippingAddress: customerOrders.shippingAddress,
        orderDate: orders.createdAt,
        productCount: count(orderItems.id),
      })
      .from(orders)
      .leftJoin(
        assignedOrdersToStore,
        eq(orders.id, assignedOrdersToStore.orderId)
      )
      .leftJoin(customerOrders, eq(orders.id, customerOrders.orderId))
      .leftJoin(users, eq(customerOrders.userId, users.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(assignedOrdersToStore.storeId, storeId))
      .groupBy(
        orders.id,
        users.name,
        orders.status,
        customerOrders.shippingAddress
      )
      .orderBy(desc(orders.createdAt))
      .limit(5);

    // Recent store orders history (orders to company)
    const recentStoreOrdersQuery = db
      .select({
        orderId: orders.id,
        orderAmount: orders.totalAmount,
        status: orders.status,
        expectedDelivery: storeOrders.expectedDeliveryDate,
        productCount: count(orderItems.id),
      })
      .from(orders)
      .leftJoin(storeOrders, eq(orders.id, storeOrders.orderId))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(storeOrders.storeId, storeId))
      .groupBy(orders.id, orders.status, storeOrders.expectedDeliveryDate)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    // Store specific area chart
    const areaChartQuery = db
      .select({
        monthYear: sql<string>`strftime('%Y-%m', datetime(${orders.createdAt},'unixepoch'))`,
        storeProducts: sql<number>`COUNT(DISTINCT ${storeProducts.id})`,
        deliveredOrders: sql<number>`COUNT(DISTINCT CASE 
        WHEN ${assignedOrdersToStore.storeId} = ${storeId} 
        AND ${orders.status} = 'delivered' 
        THEN ${orders.id} END)`,
        companyOrders: sql<number>`COUNT(DISTINCT CASE 
        WHEN ${storeOrders.storeId} = ${storeId} 
        THEN ${orders.id} END)`,
        storeOrders: sql<number>`COUNT(DISTINCT CASE 
        WHEN ${assignedOrdersToStore.storeId} = ${storeId} 
        AND ${orders.status} = 'pending' 
        THEN ${orders.id} END)`,
      })
      .from(storeProducts)
      .leftJoin(orders, sql`1=1`)
      .leftJoin(
        assignedOrdersToStore,
        eq(orders.id, assignedOrdersToStore.orderId)
      )
      .leftJoin(storeOrders, eq(orders.id, storeOrders.orderId))
      .where(eq(storeProducts.storeId, storeId))
      .groupBy(
        sql`strftime('%Y-%m', datetime(${orders.createdAt},'unixepoch'))`
      )
      .orderBy(
        desc(sql`strftime('%Y-%m', datetime(${orders.createdAt},'unixepoch'))`)
      );

    // Execute store specific queries
    const [
      revenue,
      orderStats,
      dailyOrders,
      recentDeliveries,
      recentStoreOrders,
      areaChartData,
    ] = await Promise.all([
      applyDateFilter(revenueQuery, startDate, endDate).execute(),
      applyDateFilter(orderQuery, startDate, endDate).execute(),
      applyDateFilter(dailyOrdersQuery, startDate, endDate).execute(),
      recentDeliveryHistoryQuery.execute(),
      recentStoreOrdersQuery.execute(),
      applyDateFilter(areaChartQuery, startDate, endDate).execute(),
    ]);

    return {
      revenue: {
        deliveryRevenue: revenue[0].deliveryRevenue,
        storeOrderRevenue: revenue[0].storeOrderRevenue,
        todayDeliveryRevenue: revenue[0].todayDeliveryRevenue,
        todayStoreOrderRevenue: revenue[0].todayStoreOrderRevenue,
      },
      orderStats: {
        deliveries: {
          total: orderStats[0].assignedOrders,
          delivered: orderStats[0].deliveredOrders,
          cancelled: orderStats[0].cancelledDeliveries,
        },
        storeOrders: {
          total: orderStats[0].totalStoreOrders,
          delivered: orderStats[0].deliveredStoreOrders,
          cancelled: orderStats[0].cancelledStoreOrders,
        },
      },
      dailyOrders,
      recentOrders: {
        deliveries: recentDeliveries,
        storeOrders: recentStoreOrders,
      },
      areaChartData,
    };
  } else {
    // COMPANY WIDE ANALYTICS
    // Overall Revenue
    const revenueQuery = db
      .select({
        // Total revenue from customer orders
        customerRevenue: sql<number>`COALESCE(SUM(CASE 
        WHEN ${orders.orderType} = 'customer' 
        THEN ${orders.totalAmount} ELSE 0 END), 0)`,
        // Total revenue from store orders
        storeRevenue: sql<number>`COALESCE(SUM(CASE 
        WHEN ${orders.orderType} = 'store' 
        THEN ${orders.totalAmount} ELSE 0 END), 0)`,
        // Today's customer revenue
        todayCustomerRevenue: sql<number>`COALESCE(SUM(CASE 
        WHEN ${orders.orderType} = 'customer' 
        AND date(${orders.createdAt},'unixepoch') = date('now') 
        THEN ${orders.totalAmount} ELSE 0 END), 0)`,
        // Today's store revenue
        todayStoreRevenue: sql<number>`COALESCE(SUM(CASE 
        WHEN ${orders.orderType} = 'store' 
        AND date(${orders.createdAt},'unixepoch') = date('now') 
        THEN ${orders.totalAmount} ELSE 0 END), 0)`,
      })
      .from(orders)
      .where(eq(orders.status, "delivered"));

    // Overall Order Stats
    const orderQuery = db
      .select({
        totalCustomerOrders: sql<number>`COUNT(CASE WHEN ${orders.orderType} = 'customer' THEN 1 END)`,
        totalStoreOrders: sql<number>`COUNT(CASE WHEN ${orders.orderType} = 'store' THEN 1 END)`,
        todayCustomerOrders: sql<number>`COUNT(CASE 
        WHEN ${orders.orderType} = 'customer' 
        AND date(${orders.createdAt},'unixepoch') = date('now') THEN 1 END)`,
        todayStoreOrders: sql<number>`COUNT(CASE 
        WHEN ${orders.orderType} = 'store' 
        AND date(${orders.createdAt},'unixepoch') = date('now') THEN 1 END)`,
        cancelledCustomerOrders: sql<number>`COUNT(CASE 
        WHEN ${orders.orderType} = 'customer' 
        AND ${orders.status} = 'cancelled' THEN 1 END)`,
        cancelledStoreOrders: sql<number>`COUNT(CASE 
        WHEN ${orders.orderType} = 'store' 
        AND ${orders.status} = 'cancelled' THEN 1 END)`,
      })
      .from(orders);

    // Daily Orders
    const dailyOrdersQuery = db
      .select({
        date: sql<string>`date(${orders.createdAt},'unixepoch')`,
        customerOrders: sql<number>`COUNT(CASE WHEN ${orders.orderType} = 'customer' THEN 1 END)`,
        storeOrders: sql<number>`COUNT(CASE WHEN ${orders.orderType} = 'store' THEN 1 END)`,
        totalAmount: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)`,
      })
      .from(orders)
      .groupBy(sql`date(${orders.createdAt},'unixepoch')`)
      .orderBy(desc(orders.createdAt));

    // Recent Customer Orders
    const recentCustomerOrdersQuery = db
      .select({
        orderId: orders.id,
        name: customerOrders.name,
        email: customerOrders.email,
        orderAmount: orders.totalAmount,
        status: orders.status,
        shippingAddress: customerOrders.shippingAddress,
        assignedStore: store.storeName,
        productCount: count(orderItems.id),
      })
      .from(orders)
      .leftJoin(customerOrders, eq(orders.id, customerOrders.orderId))
      .leftJoin(
        assignedOrdersToStore,
        eq(orders.id, assignedOrdersToStore.orderId)
      )
      .leftJoin(store, eq(assignedOrdersToStore.storeId, store.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(orders.orderType, "customer"))
      .groupBy(orders.id, store.storeName)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    // Recent Store Orders
    const recentStoreOrdersQuery = db
      .select({
        orderId: orders.id,
        name: store.storeName,
        email: store.email,
        orderAmount: orders.totalAmount,
        status: orders.status,
        expectedDelivery: storeOrders.expectedDeliveryDate,
        productCount: count(orderItems.id),
      })
      .from(orders)
      .leftJoin(storeOrders, eq(orders.id, storeOrders.orderId))
      .leftJoin(store, eq(storeOrders.storeId, store.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(orders.orderType, "store"))
      .groupBy(orders.id, store.storeName)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    // Company Overview Area Chart
    const areaChartQuery = db
      .select({
        monthYear: sql<string>`strftime('%Y-%m', datetime(${orders.createdAt},'unixepoch'))`,
        customerOrders: sql<number>`COUNT(DISTINCT CASE 
        WHEN ${orders.orderType} = 'customer' THEN ${orders.id} END)`,
        storeOrders: sql<number>`COUNT(DISTINCT CASE 
        WHEN ${orders.orderType} = 'store' THEN ${orders.id} END)`,
        activeUsers: sql<number>`COUNT(DISTINCT ${users.id})`,
        activeStores: sql<number>`COUNT(DISTINCT ${store.id})`,
        products: sql<number>`COUNT(DISTINCT ${orderItems.productId})`,
      })
      .from(orders)
      .leftJoin(users, sql`1=1`)
      .leftJoin(store, sql`1=1`)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .groupBy(
        sql`strftime('%Y-%m', datetime(${orders.createdAt},'unixepoch'))`
      )
      .orderBy(
        desc(sql`strftime('%Y-%m', datetime(${orders.createdAt},'unixepoch'))`)
      );

    // User Distribution
    const userDistributionQuery = db
      .select({
        userType: users.userType,
        count: count(users.id),
      })
      .from(users)
      .groupBy(users.userType);

    // Execute all queries
    const [
      revenue,
      orderStats,
      dailyOrders,
      recentCustomerOrders,
      recentStoreOrders,
      areaChartData,
      userDistribution,
    ] = await Promise.all([
      applyDateFilter(revenueQuery, startDate, endDate).execute(),
      applyDateFilter(orderQuery, startDate, endDate).execute(),
      applyDateFilter(dailyOrdersQuery, startDate, endDate).execute(),
      recentCustomerOrdersQuery.execute(),
      recentStoreOrdersQuery.execute(),
      applyDateFilter(areaChartQuery, startDate, endDate).execute(),
      userDistributionQuery.execute(),
    ]);
    // ... [previous code remains the same until the last return statement]

    return {
      revenue: {
        customerRevenue: revenue[0].customerRevenue,
        storeRevenue: revenue[0].storeRevenue,

        todayCustomerRevenue: revenue[0].todayCustomerRevenue,
        todayStoreRevenue: revenue[0].todayStoreRevenue,
      },
      orderStats: {
        customer: {
          total: orderStats[0].totalCustomerOrders,
          today: orderStats[0].todayCustomerOrders,
          cancelled: orderStats[0].cancelledCustomerOrders,
        },
        store: {
          total: orderStats[0].totalStoreOrders,
          today: orderStats[0].todayStoreOrders,
          cancelled: orderStats[0].cancelledStoreOrders,
        },
      },
      dailyOrders,
      recentOrders: {
        customer: recentCustomerOrders,
        store: recentStoreOrders,
      },
      areaChartData,
      userDistribution,
    };
  }
}

// Helper function for date filtering with proper typing
const applyDateFilter = <T extends { where: (condition: any) => T }>(
  query: any,
  startDate: Date | undefined,
  endDate: Date | undefined
) => {
  if (!startDate && !endDate) return query;

  if (startDate && endDate) {
    return query.where(
      and(
        sql`datetime(${orders.createdAt}, 'unixepoch') >= datetime(${startDate.toISOString()})`,
        sql`datetime(${orders.createdAt}, 'unixepoch') <= datetime(${endDate.toISOString()})`
      )
    );
  }

  if (startDate) {
    return query.where(
      sql`datetime(${orders.createdAt}, 'unixepoch') >= datetime(${startDate.toISOString()})`
    );
  }

  if (endDate) {
    return query.where(
      sql`datetime(${orders.createdAt}, 'unixepoch') <= datetime(${endDate.toISOString()})`
    );
  }

  return query;
};
