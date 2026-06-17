import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Skeleton from "./pages/Skeleton";

const Home = lazy(() => import("./pages/Home"));
const UserSignup = lazy(() => import("./pages/UserSignup"));
const UserLogin = lazy(() => import("./pages/UserLogin"));
const GoogleAuthSuccess = lazy(() => import("./pages/GoogleAuthSuccess"));
const UserProtectedWrapper = lazy(() => import("./pages/UserProtectedWrapper"));

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#1a1a2e",
              color: "#fff",
              borderRadius: "12px",
              border: "1px solid #4caf50",
            },
            iconTheme: { primary: "#4caf50", secondary: "#fff" },
          },
          error: {
            style: {
              background: "#1a1a2e",
              color: "#fff",
              borderRadius: "12px",
              border: "1px solid #c62828",
            },
            iconTheme: { primary: "#c62828", secondary: "#fff" },
          },
        }}
      />
      
      <Suspense fallback={<Skeleton />}>
        <Routes>
          <Route
            path="/"
            element={
              <UserProtectedWrapper>
                <Home />
              </UserProtectedWrapper>
            }
          />
          <Route path="/user/register" element={<UserSignup />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;