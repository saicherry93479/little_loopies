export function checkPermission(user: { userType: string } | undefined, permissions: string[] | undefined, requiredPermission: string) {
  if (!user) return false;
  if (user.userType === "admin") return true;
  return permissions?.includes(requiredPermission) ?? false;
}

export function hasWriteAccess(user: { userType: string } | undefined, permissions: string[] | undefined, module: string) {
  return checkPermission(user, permissions, `${module}_Write`);
}

export function hasReadAccess(user: { userType: string } | undefined, permissions: string[] | undefined, module: string) {
  return checkPermission(user, permissions, `${module}_Read`);
} 