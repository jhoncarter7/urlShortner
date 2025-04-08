import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "./store/slices/authSlice";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Dashboard from "./pages/Dashboard";
import Login from "./components/auth/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import Signup from "./components/auth/Signup";
function App() {
  // Imports needed: React, hooks, dispatch, actions, components
  const { isAuthenticated, authCheckCompleted, authCheckLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
      if (!authCheckCompleted) {
         dispatch(checkAuthStatus());
      }
  });

  if (authCheckLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <LoadingSpinner size={12} />
          </div>
      );
  }

  return (
    <>
    <BrowserRouter>
    
    <Routes>
      <Route path="/"  element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      {/* Add other routes here as needed */}
      <Route path="/login" element={!isAuthenticated? <Login/>: <Navigate to="/"/>} /> {/* Add the Register route */}{/* Add the Dashboard route */}
      <Route path="/register" element={<Signup/>} /> Add the Login route
      {/* <Route path="*" component={NotFound} /> Add a NotFound route for unmatched paths */}
    </Routes>
    </BrowserRouter>
   
    </>
  );
}

export default App;