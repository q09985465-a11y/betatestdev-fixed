import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";

import Login from "../pages/admin/Login";

import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import ProductEditor from "../pages/admin/ProductEditor";

import AdminCategories from "../pages/admin/AdminCategories";
import CategoryEditor from "../pages/admin/CategoryEditor";

import AdminLayout from "../layouts/AdminLayout";

import PrivateRoute from "./PrivateRoute";


export default function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ======================
            PUBLIC ROUTES
        ====================== */}

        <Route 
          path="/" 
          element={<Home />} 
        />

        <Route 
          path="/products" 
          element={<Products />} 
        />


        {/* LOGIN ADMIN */}

        <Route 
          path="/login" 
          element={<Login />} 
        />



        {/* ======================
            PRIVATE ADMIN ROUTES
        ====================== */}

        <Route

          element={

            <PrivateRoute>

              <AdminLayout />

            </PrivateRoute>

          }

        >


          {/* DASHBOARD */}

          <Route 
            path="/admin" 
            element={<Dashboard />} 
          />



          {/* PRODUCTS */}

          <Route 
            path="/admin/products" 
            element={<AdminProducts />} 
          />


          <Route 
            path="/admin/products/new" 
            element={<ProductEditor />} 
          />


          <Route 
            path="/admin/products/:id" 
            element={<ProductEditor />} 
          />



          {/* CATEGORIES */}

          <Route 
            path="/admin/categories" 
            element={<AdminCategories />} 
          />


          <Route 
            path="/admin/categories/new" 
            element={<CategoryEditor />} 
          />


          <Route 
            path="/admin/categories/:id" 
            element={<CategoryEditor />} 
          />


        </Route>


      </Routes>

    </BrowserRouter>

  );

}