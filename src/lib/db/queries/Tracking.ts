// lib/tracking.ts

import { db } from "..";
import { orders, orderTrackingLinks, orderStatusHistory } from "../schema";
import { and, eq, gt } from "drizzle-orm";

export class TrackingError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export const createTrackingLink = async ({
  orderId,
  issuedTo,
  issuedBy,
  expiryDays = 30,
  maxAccess = 100,
}: {
  orderId: string;
  issuedTo: string;
  issuedBy: string;
  expiryDays?: number;
  maxAccess?: number;
}) => {
  try {
    const [link] = await db
      .insert(orderTrackingLinks)
      .values({
        orderId,
        issuedTo,
        issuedBy,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000),
        maxAccess,
      })
      .returning();

    return link;
  } catch (error) {
    console.error("Error creating tracking link:", error);
    throw new TrackingError("Failed to create tracking link");
  }
};

export const validateTrackingLink = async (
  token: string,
  issuedTo?: string
) => {
  try {
    const [link] = await db
      .select()
      .from(orderTrackingLinks)
      .where(
        and(
          eq(orderTrackingLinks.token, token),
          eq(orderTrackingLinks.isActive, true),
          gt(orderTrackingLinks.expiresAt, new Date())
        )
      );

    if (!link) {
      throw new TrackingError("Invalid or expired tracking link", 403);
    }

    if (issuedTo && link.issuedTo !== issuedTo) {
      console.log("issuedTo ", issuedTo);
      console.log("link.issuedTo ", link.issuedTo);
      throw new TrackingError("Unauthorized access", 403);
    }

    if (link.accessCount >= link.maxAccess) {
      await db
        .update(orderTrackingLinks)
        .set({ isActive: false })
        .where(eq(orderTrackingLinks.id, link.id));
      throw new TrackingError("Maximum views exceeded", 403);
    }

    await db
      .update(orderTrackingLinks)
      .set({ accessCount: link.accessCount + 1 })
      .where(eq(orderTrackingLinks.id, link.id));

    return link;
  } catch (error) {
    if (error instanceof TrackingError) throw error;
    throw new TrackingError("Failed to validate tracking link");
  }
};

export const getOrderDetails = async (orderId: string) => {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        customerOrder: true,
        items: true,
        statusHistory: {
          orderBy: (statusHistory, { desc }) => [desc(statusHistory.createdAt)],
        },
      },
    });
    console.log("order in tracking.ts ", order);
    if (!order) {
      throw new TrackingError("Order not found", 404);
    }

    return order;
  } catch (error) {
    if (error instanceof TrackingError) throw error;
    console.log("error in tracking.ts ", error);
    throw new TrackingError("Failed to fetch order details");
  }
};
