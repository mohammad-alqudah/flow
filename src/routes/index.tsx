import Layout from "@/layout/Layout";
import Invoices from "@/pages/invoice/Invoices";
import LoginPage from "@/pages/LoginPage";
import CreateOrder from "@/pages/order/CreateOrder";
import Orders from "@/pages/order/Orders";
import OrderView from "@/pages/order/OrderView";

import useAuth from "@/store/useAuth";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import InvoiceDetails from "@/pages/invoice/InvoiceDetails";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated && (
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/orders" replace />} />
            <Route path="/orders">
              <Route index element={<Orders />} />
              <Route path=":id">
                <Route path="create" element={<CreateOrder />} />
                <Route path="view" element={<OrderView />} />
              </Route>
            </Route>
            <Route path="/invoices">
              <Route index element={<Invoices />} />
              <Route path=":id">
                <Route path="view" element={<InvoiceDetails />} />
              </Route>
            </Route>
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
          element={
            <Navigate to={isAuthenticated ? "/orders" : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
