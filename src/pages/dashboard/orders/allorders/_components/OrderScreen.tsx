import { DataTable } from "@/components/dashbaord/GlobalTable/data-table";
import { Heading } from "@/components/dashbaord/Heading";
import PageContainer from "@/components/dashbaord/PageContainer";
import React from "react";
import { columns, filterFields } from "./columns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OrderScreen = ({ allOrders = [], writeAccess = false }) => {
  console.log("allOrders ", allOrders);

  const [orders, setOrders] = React.useState(allOrders);

  const updateOrderStatus = async (orderId: string, status: string) => {
    console.log("orderId ", orderId);
    console.log("status ", status);
    setOrders(
      orders.map((order) => {
        if (order.orderId === orderId) {
          order.orderStatus = status;
        }
        return order;
      })
    );
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading title={"Orders"} description="Manage All Oreders "></Heading>
        </div>
        <Tabs defaultValue={"customer"} className="space-y-4 ">
          <TabsList>
            <TabsTrigger value="customer">Customer Orders</TabsTrigger>
            <a href="/dashboard/orders/storeorders">
              <TabsTrigger value="store">Store Orders</TabsTrigger>
            </a>
          </TabsList>
        </Tabs>
        <DataTable
          columns={columns(writeAccess, updateOrderStatus)}
          filterFields={filterFields}
          data={orders}
          hiddenColumns={writeAccess ? ["view"] : ["actions"]}
        />
      </div>
    </PageContainer>
  );
};

export default OrderScreen;
