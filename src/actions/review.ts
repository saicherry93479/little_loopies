import { db } from "@/lib/db";
import { reviews, reviewHelpfulVotes } from "@/lib/db/schema";
import { defineAction } from "astro:actions";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { protectedAction } from "./utils";

// Create Review Action
export const createReview = defineAction({
  input: z.object({
    productId: z.string().min(1, "Product ID is required"),
    rating: z.number().min(1).max(5),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Review content is required"),
  }),
  handler: protectedAction(async (data, { locals }) => {
    try {
      // Check if user has already reviewed this product
      const existingReview = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productId, data.productId),
          eq(reviews.userId, locals.user.id)
        ),
      });

      if (existingReview) {
        return {
          success: false,
          message: "You have already reviewed this product",
        };
      }

      await db.insert(reviews).values({
        productId: data.productId,
        userId: locals.user.id,
        rating: data.rating,
        title: data.title,
        content: data.content,
        isVerified: true, // Set to true if the user has purchased the product
      });

      return {
        success: true,
        message: "Review submitted successfully",
      };
    } catch (error: any) {
      console.error("Error creating review:", error.message);
      return {
        success: false,
        message: error.message || "Failed to submit review",
      };
    }
  }),
});

// Get Product Reviews Action
export const getProductReviews = defineAction({
  input: z.object({
    productId: z.string().min(1, "Product ID is required"),
  }),
  handler: async (data) => {
    try {
      const productReviews = await db.query.reviews.findMany({
        where: eq(reviews.productId, data.productId),
        with: {
          user: {
            columns: {
              name: true,
            },
          },
        },
        orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
      });

      return {
        success: true,
        reviews: productReviews.map(review => ({
          ...review,
          userName: review.user.name,
        })),
      };
    } catch (error: any) {
      console.error("Error fetching reviews:", error.message);
      return {
        success: false,
        message: error.message || "Failed to fetch reviews",
        reviews: [],
      };
    }
  },
});

// Mark Review as Helpful Action
export const markReviewHelpful = defineAction({
  input: z.object({
    reviewId: z.string().min(1, "Review ID is required"),
  }),
  handler: protectedAction(async (data, { locals }) => {
    try {
      // Check if user has already marked this review as helpful
      const existingVote = await db.query.reviewHelpfulVotes.findFirst({
        where: and(
          eq(reviewHelpfulVotes.reviewId, data.reviewId),
          eq(reviewHelpfulVotes.userId, locals.user.id)
        ),
      });

      if (existingVote) {
        // Remove the vote if it exists
        await db
          .delete(reviewHelpfulVotes)
          .where(eq(reviewHelpfulVotes.id, existingVote.id));

        // Decrement the helpful count
        await db
          .update(reviews)
          .set({
            helpfulCount: sql`${reviews.helpfulCount} - 1`,
          })
          .where(eq(reviews.id, data.reviewId));

        return {
          success: true,
          message: "Review unmarked as helpful",
          action: "removed",
        };
      } else {
        // Add a new vote
        await db.insert(reviewHelpfulVotes).values({
          reviewId: data.reviewId,
          userId: locals.user.id,
        });

        // Increment the helpful count
        await db
          .update(reviews)
          .set({
            helpfulCount: sql`${reviews.helpfulCount} + 1`,
          })
          .where(eq(reviews.id, data.reviewId));

        return {
          success: true,
          message: "Review marked as helpful",
          action: "added",
        };
      }
    } catch (error: any) {
      console.error("Error marking review as helpful:", error.message);
      return {
        success: false,
        message: error.message || "Failed to mark review as helpful",
      };
    }
  }),
});

// Check if user has marked a review as helpful
export const checkReviewHelpful = defineAction({
  input: z.object({
    reviewId: z.string().min(1, "Review ID is required"),
  }),
  handler: protectedAction(async (data, { locals }) => {
    try {
      const existingVote = await db.query.reviewHelpfulVotes.findFirst({
        where: and(
          eq(reviewHelpfulVotes.reviewId, data.reviewId),
          eq(reviewHelpfulVotes.userId, locals.user.id)
        ),
      });

      return {
        success: true,
        isHelpful: !!existingVote,
      };
    } catch (error: any) {
      console.error("Error checking review helpful status:", error.message);
      return {
        success: false,
        message: error.message || "Failed to check review status",
        isHelpful: false,
      };
    }
  }),
});