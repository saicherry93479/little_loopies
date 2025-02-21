import { db } from "./index";
import { users, permissions, roles, rolePermissions } from "./schema";
import { hashPassword } from "../utils/password";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    await db.transaction(async (tx) => {
      // Create admin role first
      const adminRole = await tx.insert(roles)
        .values({
          name: "Admin",
          description: "Full system access"
        })
        .returning()
        .get();

      console.log("👑 Created admin role");

      // Create admin user
      const hashedPassword = await hashPassword("admin@123");
      const adminUser = await tx.insert(users)
        .values({
          name: "Admin User",
          email: "admin@freshlypacked.in",
          password: hashedPassword,
          userType: "Admin",
          status: "active",
        })
        .returning()
        .get();

      console.log("👤 Created admin user:", adminUser.email);

      // Create permissions
      const permissionsList = [
        { name: "Orders_Read", description: "View access for Orders Page" },
        { name: "Orders_Write", description: "Create/Edit access for Orders Page" },
        { name: "Stores_Write", description: "Create/Edit access for Stores Page" },
        { name: "Stores_Read", description: "View access for Stores Page" },
        { name: "Permissions_Read", description: "View access for Permissions Page" },
        { name: "Permissions_Write", description: "Create/Edit access for Permissions Page" },
        { name: "Categories_Read", description: "View access for Categories Page" },
        { name: "Categories_Write", description: "Create/Edit access for Categories Page" },
        { name: "Users_Read", description: "View access for Users Page" },
        { name: "Users_Write", description: "Create/Edit access for Users Page" },
        { name: "Dashboard_Read", description: "Access to view Dashboard" },
        { name: "Roles_Read", description: "View access for Roles Page" },
        { name: "Roles_Write", description: "Create/Edit access for Roles Page" },
        { name: "Product_Read", description: "View access for Products Page" },
        { name: "Product_Write", description: "Create/Edit access for Products Page" },
        { name: "Stores_Orders_Read", description: "View access for Store Orders" },
        { name: "Stores_Orders_Write", description: "Update status of Store Orders" },
      ];

      for (const perm of permissionsList) {
        const permission = await tx.insert(permissions)
          .values({
            name: perm.name,
            description: perm.description,
            createdBy: adminUser.id,
          })
          .returning()
          .get();

        console.log("🔑 Created permission:", permission.name);

        // Assign permission to admin role
        await tx.insert(rolePermissions)
          .values({
            roleId: adminRole.id,
            permissionId: permission.id,
          });
      }

      console.log("🔑 Created and assigned permissions");
    });

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

// Run the seed function
seed().catch((error) => {
  console.error("Failed to seed database:", error);
  process.exit(1);
}); 