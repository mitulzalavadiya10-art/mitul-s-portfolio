import { Navigate, Outlet } from "react-router-dom"
import { isAdminLoggedIn } from "@/lib/blogStore"

export function AdminGuard() {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }
  return <Outlet />
}
