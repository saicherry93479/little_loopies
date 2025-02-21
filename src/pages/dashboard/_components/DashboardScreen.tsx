import { AreaGraph } from "@/components/dashbaord/Graphs/AreaGraph";
import { BarGraph } from "@/components/dashbaord/Graphs/BarGraph";
import { PieGraph } from "@/components/dashbaord/Graphs/PieGraph";
import PageContainer from "@/components/dashbaord/PageContainer";
import { RecentSales } from "./RecentSales";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import {
  IndianRupee,
  SendToBack,
  Store,
} from "lucide-react";
import { actions } from "astro:actions";

const chartConfig = {
  date: {
    label: "Date",
  },
  count: {
    label: "Orders",
    color: "hsl(var(--chart-1))",
  },
};

export default function DashboardScreen({ data=[], storeView=false, stores=[], defaultStoreId = null }) {

  
  const [selectedStore, setSelectedStore] = React.useState(defaultStoreId);
  const [activeTab, setActiveTab] = React.useState(defaultStoreId ? "store" : "overview");
  const [dashboardData, setDashboardData] = React.useState(data);
  const [isLoading, setIsLoading] = React.useState(false);
  const isStoreView = storeView || activeTab === "store";

  React.useEffect(() => {
    if (defaultStoreId) {
      fetchStoreData(defaultStoreId);
    }
  }, [defaultStoreId]);

  // Function to fetch store data
  const fetchStoreData = async (storeId) => {
    setIsLoading(true);
    try {
      const response = await actions.getStoreData({
        storeId,
      });
      const resp = response.data;
      if (resp.success) {
        console.log("resp.data ", resp.data);
        setDashboardData(resp.data);
      }
    } catch (error) {
      console.error("Error fetching store data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle store selection
  const handleStoreChange = (value) => {
    setSelectedStore(value);
    if (value) {
      fetchStoreData(value);
    }
  };

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === "overview") {
      setDashboardData(data);
      setSelectedStore("");
    }
  };

  // Format metrics based on view type
  const metrics = isStoreView
    ? {
        totalRevenue: 0,
        todayRevenue: 0,
        totalOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        storeOrders: 0,
      }
    : {
        totalRevenue: 0,
        todayRevenue: 0,
        customerOrders: 0,
        storeOrders: 0,
        todayOrders: 0,
        cancelledOrders: 0
      };

  const renderMetricCards = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <IndianRupee className="size-4 stroke-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{metrics.totalRevenue}</div>
          <p className="text-xs text-muted-foreground">Overall Revenue</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
          <IndianRupee className="size-4 stroke-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{metrics.todayRevenue}</div>
          <p className="text-xs text-muted-foreground">Today's Earnings</p>
        </CardContent>
      </Card>

      {isStoreView ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Store Performance
            </CardTitle>
            <Store className="size-4" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xl font-bold">{metrics.deliveredOrders}</div>
              <p className="text-xs text-muted-foreground">Delivered</p>
            </div>
            <div>
              <div className="text-xl font-bold">{metrics.storeOrders}</div>
              <p className="text-xs text-muted-foreground">Store Orders</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Order Distribution
            </CardTitle>
            <SendToBack className="size-4" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xl font-bold">{metrics.customerOrders}</div>
              <p className="text-xs text-muted-foreground">Customer Orders</p>
            </div>
            <div>
              <div className="text-xl font-bold">{metrics.storeOrders}</div>
              <p className="text-xs text-muted-foreground">Store Orders</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Order Status</CardTitle>
          <SendToBack className="size-4" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xl font-bold">
              {metrics.todayOrders || metrics.deliveredOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              {isStoreView ? "Delivered" : "Today"}
            </p>
          </div>
          <div>
            <div className="text-xl font-bold">{metrics.cancelledOrders}</div>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStoreMetricCards = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivery Revenue</CardTitle>
          <IndianRupee className="size-4 stroke-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{dashboardData.revenue.deliveryRevenue}</div>
          <p className="text-xs text-muted-foreground">Today: ₹{dashboardData.revenue.todayDeliveryRevenue}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Store Orders Revenue</CardTitle>
          <IndianRupee className="size-4 stroke-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{dashboardData.revenue.storeOrderRevenue}</div>
          <p className="text-xs text-muted-foreground">Today: ₹{dashboardData.revenue.todayStoreOrderRevenue}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivery Orders</CardTitle>
          <Store className="size-4" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xl font-bold">{dashboardData.orderStats.deliveries.total}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div>
            <div className="text-xl font-bold">{dashboardData.orderStats.deliveries.delivered}</div>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Store Ordered From Company</CardTitle>
          <SendToBack className="size-4" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xl font-bold">{dashboardData.orderStats.storeOrders.total}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div>
            <div className="text-xl font-bold">{dashboardData.orderStats.storeOrders.delivered}</div>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );


  const renderCharts = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Orders Timeline</CardTitle>
            <CardDescription>
              {isStoreView
                ? "Store orders and deliveries"
                : "Customer and store orders"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <BarGraph
              data={[]}
              chartConfig={chartConfig}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4 md:col-span-3">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentSales
            data={[]
            }
          />
        </CardContent>
      </Card>

      <div className="col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>
              {isStoreView ? "Store Performance" : "Business Overview"}
            </CardTitle>
            <CardDescription>
              {isStoreView
                ? "Monthly store orders and deliveries"
                : "Monthly orders and user activity"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaGraph
              data={
                []
              }
            />
          </CardContent>
        </Card>
      </div>

      {!isStoreView && (
        <>
          <div className="col-span-4 md:col-span-3">
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>By User Type</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <PieGraph
                  data={[]}
                  dataKey="count"
                  nameKey="userType"
                />
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Store Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentSales data={[]} />
            </CardContent>
          </Card>
        </>
      )}

      {isStoreView && (
        <div className="col-span-4 md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Store Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentSales data={[]} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            {isStoreView ? "Store Dashboard" : "Company Dashboard"} 👋
          </h2>
          <div className="flex items-center space-x-4">
            <Button>Download Report</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          {!defaultStoreId && (
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="store">Store</TabsTrigger>
            </TabsList>
          )}

          {activeTab === "store" && !defaultStoreId && (
            <div className="mb-4">
              <Select value={selectedStore} onValueChange={handleStoreChange}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.storeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <TabsContent value="overview" className="space-y-4">
            {renderMetricCards()}
            {renderCharts()}
          </TabsContent>

          <TabsContent value="store" className="space-y-4">
            {selectedStore ? (
              isLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                  <p className="text-lg text-muted-foreground">Loading...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {renderStoreMetricCards()}
                  {renderCharts()}
                </div>
              )
            ) : (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-lg text-muted-foreground">
                  Please select a store to view its dashboard
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
