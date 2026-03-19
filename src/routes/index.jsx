import { createHashRouter } from "react-router";

import FrontendLayout from "@/layout/FrontendLayout";
import Home from "@/views/front/Home";
import About from "@/views/front/About";
import Products from "@/views/front/Products";
import Product from "@/views/front/Product";
import Login from "@/views/front/Login";

import BackendLayout from "@/layout/BackendLayout";
import Dashboard from "@/views/admin/Dashboard";

import NotFound from "@/views/front/NotFound";

import RouteGuade from "../components/RouteGuard";

const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "products",
        element: <Products />
      },
      {
        path: "products/:id",
        element: <Product />
      },
      {
        element: <RouteGuade type="auth" />,
        children: [
          {
            path: "login",
            element: <Login />
          }
        ]
      }
    ]
  },
  {
    path: "/admin",
    element: <BackendLayout />,
    children: [
      {
        element: <RouteGuade type="protected" />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default router;