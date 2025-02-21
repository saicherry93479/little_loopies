export const protectedAction = <T, R>(
    handler: (data: T, context: any) => Promise<R>
  ) => {
    return async (data: T, context:any) => {
      try {
        // Check if user exists
        if (!context.locals?.user) {
          return {
            success: false,
            message: "Unauthorized access",
          } as const;
        }
  
        // Execute handler with data and user
        return await handler(data, context);
        
      } catch (error: any) {
        console.error("Action error:", error);
        return {
          success: false,
          message: error.message || "An error occurred",
        } as const;
      }
    };
  };