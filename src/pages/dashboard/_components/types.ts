export interface DashboardTypes {
    revenue: {
      customerRevenue?: number;
      storeRevenue: number;
      todayCustomerRevenue?: number;
      todayStoreRevenue?: number;
      todayRevenue?: number;
    };
    orderStats: {
      customer?: {
        total: number;
        today: number;
        cancelled: number;
      };
      store?: {
        total: number;
        today: number;
        cancelled: number;
      };
      assignedOrders?: number;
      deliveredOrders?: number;
      cancelledAssignedOrders?: number;
      storeOrders?: number;
    };
    dailyOrders: {
      date: string;
      customerOrders?: number;
      storeOrders?: number;
      deliveredOrders?: number;
      totalAmount: number;
    }[];
    recentOrders: {
      customer?: {
        orderId: string;
        customerName: string;
        orderAmount: number;
        status: string;
        shippingAddress: string;
        assignedStore: string;
        productCount: number;
      }[];
      store?: {
        orderId: string;
        storeName: string;
        orderAmount: number;
        status: string;
        expectedDelivery: string;
        productCount: number;
      }[];
      deliveries?: {
        orderId: string;
        orderAmount: number;
        customerName: string;
        status: string;
        shippingAddress: string;
        orderDate: string;
        productCount: number;
      }[];
      storeOrders?: {
        orderId: string;
        orderAmount: number;
        status: string;
        expectedDelivery: string;
        productCount: number;
      }[];
    };
    areaChartData: {
      monthYear: string;
      customerOrders?: number;
      storeOrders?: number;
      deliveredOrders?: number;
      companyOrders?: number;
      activeUsers?: number;
      activeStores?: number;
      products?: number;
    }[];
    userDistribution?: {
      userType: string;
      count: number;
    }[];
  }
  
  export interface Store {
    id: string;
    storeName: string;
  }