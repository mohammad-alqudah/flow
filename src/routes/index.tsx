import Layout from "@/layout/Layout";
import Home from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import CreateOrder from "@/pages/order/CreateOrder";
// import OrderDetails from "@/pages/order/OrderDetails";
import Orders from "@/pages/order/Orders";
import OrderView from "@/pages/order/OrderView";

import useAuth from "@/store/useAuth";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated && (
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="orders">
              <Route index element={<Orders />} />
              <Route path=":id">
                {/* <Route index element={<OrderDetails />} /> */}
                <Route path="create" element={<CreateOrder />} />
                <Route path="view" element={<OrderView />} />
              </Route>
            </Route>
            {/* <Route path="inventory">
              <Route index element={<Inventory />} />
              <Route
                path=":id/performance"
                element={<InventoryPerformance />}
              />
            </Route>

            <Route path="assets" element={<Assets />} />
            <Route path="assets-inventory" element={<AssetsInventory />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} /> */}
          </Route>
        )}

        {!isAuthenticated && (
          <>
            <Route path="login" element={<LoginPage />} />
          </>
        )}

        {isAuthenticated && (
          <Route path="login" element={<Navigate to="/" replace />} />
        )}

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
