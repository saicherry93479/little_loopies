import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import CopyText from "./CopyText";
import Sound from '@/assets/sound.wav'

type OrderNotification = {
  id: string;
  customerName: string;
  amount: number;
  status: string;
  timestamp: string;
};

export default function OrderNotifications() {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource("/api/order-notifications");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data is in notifications  ", data);
      if (data.type === "new-order") {
        setNotifications((prev) => [data.data, ...prev].slice(0, 10));
        setUnread((prev) => prev + 1);

        console.log("new-order ", data.data);
        // Play notification sound
        const audio = new Audio(Sound);
        audio.play().catch(() => {});
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const markAsRead = () => {
    setUnread(0);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute z-[100] right-6 top-6  ">
        <Bell className="h-6 w-6" />
        {unread > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500">
            {unread}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 ">
        <h3 className="font-semibold">Recent Orders</h3>

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No new orders</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="p-4 hover:bg-gray-50"
            >
              <div>
                <div className="flex justify-between">
                  <span className="font-medium">
                    {notification.customerName}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Amount: ₹{notification.amount}
                </div>
                <CopyText text={notification.id}></CopyText>
                <div className="text-sm">
                  <Badge
                    variant={
                      notification.status === "pending" ? "warning" : "success"
                    }
                  >
                    {notification.status}
                  </Badge>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
