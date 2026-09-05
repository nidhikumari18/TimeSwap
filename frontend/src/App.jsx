import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import MySwaps from "./pages/MySwaps";
import Messages from "./pages/Messages";

import { useAuth } from "./context/AuthContext";


function App() {
  const { user, loading } = useAuth();

  // Wait until we know whether the user is logged in
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ee]">

        <div className="flex flex-col items-center">

          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#292722] text-white">
            ✦
          </div>

          <p className="mt-4 text-[11px] font-medium text-[#8e887f]">
            Loading SkillSwap...
          </p>

        </div>

      </div>
    );
  }

  return (
    <BrowserRouter>

      <Routes>

        {/* DEFAULT */}

        <Route
          path="/"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />


        {/* AUTH */}

        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Login />
          }
        />

        <Route
          path="/register"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Register />
          }
        />


        {/* APP */}

        <Route
          path="/dashboard"
          element={
            user
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/explore"
          element={
            user
              ? <Explore />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/swaps"
          element={
            user
              ? <MySwaps />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/messages"
          element={
            user
              ? <Messages />
              : <Navigate to="/login" replace />
          }
        />


        {/* UNKNOWN URL */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                user
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;