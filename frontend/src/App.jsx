import { Route, Routes } from "react-router";
import "./App.css";
import UserSignup from "./pages/UserSignup";
import UserLogin from "./pages/UserLogin";
import Home from "./pages/Home";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import { Toaster } from "react-hot-toast";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";

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
        <Route path="/auth/google/success" element={<GoogleAuthSuccess/>} />
      </Routes>
    </>
  );
}

export default App;
