import { checkTokenValidity, login, logout, sendPasswordSetupEmail, setPassword } from "./auth";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  getActiveCategories,
} from "./category";
import { getStoreData } from "./dashboard";
import { subscribeNewsletter } from "./newsletter";
import { createOrder, getEligibleStoresAction, getOrderStatusHistory, updateOrderStatus } from "./order";
import { createPermission, deletePermission, getPermissions, updatePermission } from "./permissions";
import { checkStock, createProduct, deleteProduct, updateProduct } from "./product";
import { createUserRole, getActiveRoles, updateUserRole } from "./role";
import { createStore, deleteStore, sendStoreEmail, updateStore, updateStoreStatus } from "./store";
import { createUser } from "./user";
import { createReview, getProductReviews, markReviewHelpful, checkReviewHelpful } from "./review";

export const server = {
  createCategory,
  updateCategory,
  deleteCategory,
  getActiveCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createStore,
  updateStore,
  deleteStore,
  sendStoreEmail,
  login,
  logout,
  createOrder,
  updateOrderStatus,
  createPermission,
  updatePermission,
  deletePermission,
  getPermissions,
  createUserRole,
  updateUserRole,
  getActiveRoles,
  sendPasswordSetupEmail,
  setPassword,
  checkTokenValidity,
  getEligibleStoresAction,
  getOrderStatusHistory,
  createUser,
  checkStock,
  getStoreData,
  subscribeNewsletter,
  updateStoreStatus
  createReview,
  getProductReviews,
  markReviewHelpful,
  checkReviewHelpful,
  
};
