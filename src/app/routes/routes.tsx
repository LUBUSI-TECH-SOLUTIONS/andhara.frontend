import { createBrowserRouter } from 'react-router-dom'

import DashboardPage from "@/features/dashboard/DashboardPage.tsx";
import Page404 from '@/features/notFound/NotFoundPage.tsx';
import AuthPage from "@/features/auth/AuthPage.tsx";

import { ProtectedRoute } from "@/shared/protectedRoute";
import MainLayout from "@/app/layout/MainLayout.tsx";
import CustomerPage from '@/features/customer/customerPage.tsx'; 
import ProductsPage from '@/features/products/ProductsPage.tsx';
import { PurchasePage } from '@/features/newPurchase/PurchasePage';
import RegisterForm from '@/features/auth/components/RegisterForm';


const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/clientes", element: <CustomerPage /> },
          { path: "/productos", element: <ProductsPage /> },
          { path: "/usuarios", element: <RegisterForm /> },
          { path: "/nueva-compra/:customer_document", element: <PurchasePage />},
          { path: "/nueva-compra/", element: <PurchasePage />},
        ]
      }
    ]
  },
  { path: "/login", element: <AuthPage /> },
  { path: "*", element: <Page404 /> },
])

export default router
