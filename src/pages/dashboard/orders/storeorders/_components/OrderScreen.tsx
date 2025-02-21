"use client";
import { DataTable } from "@/components/dashbaord/GlobalTable/data-table";
import { Heading } from "@/components/dashbaord/Heading";
import PageContainer from "@/components/dashbaord/PageContainer";
import React, { useEffect, useState } from "react";
import { columns, filterFields } from "./columns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OrderScreen = ({ allOrders = [],writeAccess=false }) => {
  const [ordersData, setOrdersData] = useState(
    allOrders.map((order: any) => ({
      id: order.id,
      orderId: order.orderId,
      storeId: order.storeId,
      expectedDeliveryDate: order.expectedDeliveryDate,
      paymentTerms: order.paymentTerms,
      creditPeriodDays: order.creditPeriodDays,
      // Order fields
      orderType: order.order.orderType,
      status: order.order.status,
      totalAmount: order.order.totalAmount,
      notes: order.order.notes,
      createdAt: order.order.createdAt,
      updatedAt: order.order.updatedAt,
      // Store fields
      userId: order.store.userId,
      ownerName: order.store.name,
      email: order.store.email,
      mobile: order.store.mobile,
      storeName: order.store.storeName,
      gstNumber: order.store.gstNumber,
      panNumber: order.store.panNumber,
      aadharLinkedMobile: order.store.aadharLinkedMobile,
      storeCreatedAt: order.store.createdAt,
      storeUpdatedAt: order.store.updatedAt,
    }))
  );

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    console.log('came here ',orderId)
    console.log('newStatus ',newStatus)
    setOrdersData((prevData) =>
      prevData.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading title={"Orders"} description="Manage All Oreders "></Heading>
        </div>
        <Tabs defaultValue={"store"} className="space-y-4 ">
          <TabsList>
            <a href="/dashboard/orders/allorders">
              <TabsTrigger value="customer">Customer Orders</TabsTrigger>
            </a>
            <TabsTrigger value="store">Store Orders</TabsTrigger>
          </TabsList>
        </Tabs>
        <DataTable
          columns={columns(updateOrderStatus,writeAccess)}
          filterFields={filterFields}
          data={ordersData}
          hiddenColumns={writeAccess?['view']:['actions']}
        />
      </div>
    </PageContainer>
  );
};

export default OrderScreen;
