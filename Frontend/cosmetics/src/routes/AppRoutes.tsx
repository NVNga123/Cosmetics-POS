
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthLayout } from '../layouts/AuthLayout';
import { UserLayout } from '../layouts/UserLayout';

// Auth components
import { Login } from '../features/auth/Login';
import { Register } from '../features/auth/Register';

// User routes
import { UserRoutes } from './userRoutes';

export const AppRoutes = () => {


    return (
        <BrowserRouter>
            <Routes>
                {/* Auth Routes */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>

                {/* Admin Routes - Commented out for demo */}
                {/* <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              {isAdmin() ? (
                <AdminLayout>
                  <AdminRoutes />
                </AdminLayout>
              ) : (
                <Navigate to="/user/home" replace />
              )}
            </ProtectedRoute>
          }
        /> */}

                {/* User Routes - No authentication required */}
                <Route
                    path="/user/*"
                    element={
                        <UserLayout>
                            <UserRoutes />
                        </UserLayout>
                    }
                />

                {/* Root Route - Redirect to home without auth */}
                <Route
                    path="/"
                    element={<Navigate to="/user/home" replace />}
                />

                {/* Catch all route */}
                <Route
                    path="*"
                    element={<Navigate to="/user/home" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
};