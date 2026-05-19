import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { authContext } from "../context/AuthContext";
import { chatContext } from "../context/ChatContext";
import api from "../api/axiosInterceptor";
import toast from 'react-hot-toast';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(authContext);
  const { setfetchChatAgain } = useContext(chatContext);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get("/user/profile");
        if (response.status === 200) {
          setUser(response.data);
          setfetchChatAgain(true);
          toast.success("Signed in with Google successfully 🎉");
          navigate("/");
        }
      } catch (e) {
        toast.error("Google sign-in failed. Please try again.");
        navigate("/user/login");
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl font-medium animate-pulse">Signing you in with Google...</p>
    </div>
  );
};

export default GoogleAuthSuccess;