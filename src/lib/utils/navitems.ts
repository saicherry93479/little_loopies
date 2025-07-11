export interface NavItem {
    title: string;
    url: string;
    disabled?: boolean;
    external?: boolean;
    icon?: any;
    label?: string;
    description?: string;
    isActive?: boolean;
    items?: NavItem[];
    allowedRoles?: any[]; // New property for role-based access
    badge?: string; // New property for showing badges
  }
  
  export type Product = {
    photo_url: string;
    name: string;
    description: string;
    created_at: string;
    price: number;
    id: number;
    category: string;
    updated_at: string;
  };
  export const navItems: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "dashboard",
      isActive: false,
      allowedRoles: ["admin", "manager", "employee", "store"],
    },
    {
      title: "Permissions",
      url: "/dashboard/permissions",
      icon: "user",
      isActive: false,
      allowedRoles: ["admin", "manager"], // Only admin and manager can access
      badge: "", // Shows number of employees
      items: [],
    },
    {
      title: "Roles",
      url: "/dashboard/roles",
      icon: "user",
      isActive: false,
      allowedRoles: ["admin", "manager"], // Only admin and manager can access
      badge: "", // Shows number of employees
      items: [],
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: "user",
      isActive: false,
      allowedRoles: ["admin", "manager"], // Only admin and manager can access
      badge: "", // Shows number of employees
      items: [],
    },
  
   
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: "categories",
      isActive: false,
      allowedRoles: ["admin", "manager", "employee"],
    },
    {
      title: "Product",
      url: "/dashboard/product",
      icon: "product",
      isActive: false,
      allowedRoles: ["admin", "manager", "store"],
      badge: "", 
      items: [],
    },
    {
      title: "Buy",
      url: "/dashboard/buy",
      icon: "product",
      isActive: false,
      allowedRoles: ["store"],
      badge: "New",
      items: [],
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: "product",
      isActive: false,
      allowedRoles: ["admin", "manager", "store"],
      badge: "",
      items: [],
    },
    {
      title: "Stores",
      url: "/dashboard/stores",
      icon: "product",
      isActive: false,
      allowedRoles: ["admin", "manager"],
      badge: "",
      items: [],
    },
    {
      title: "Invoices",
      url: "/dashboard/invoices",
      icon: "product",
      isActive: false,
      allowedRoles: ["admin"],
      badge: "",
      items: [],
    },
    
    
  ];
  
export function getFilteredNavItems(userType: string, permissions: string[]) {
  console.log('usertype is ',userType)
  console.log('permissions are ',permissions)
  if (userType === "admin") {
    // Admin can see all nav items
    return navItems.map(item => ({
      ...item,
      show: true
    }));
  }
  console.log(
    navItems.map(item => ({
      ...item,
      show: permissions.includes(`${item}_Read`) ?? false
    }))
  )
  // For other users, check specific permissions
  return navItems.map(item => ({
    ...item,
    show: permissions.includes(`${item.title}_Read`) ?? false
  }));
}
  