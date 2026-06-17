import { useContext, useEffect, useState } from "react";
import { authContext } from "../context/AuthContext";
import api from "../api/axiosInterceptor";
import { useNavigate } from "react-router";
import { chatContext } from "../context/ChatContext";
import Skeleton from "./Skeleton";

const UserProtectedWrapper = ({ children }) => {
  const { User, setUser } = useContext(authContext);
  const { setchatDetails, setNotification } = useContext(chatContext);

  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchUserProfile() {
    const { data } = await api.get("/user/profile");
    return data;
  }

  async function fetchChatList() {
    const { data } = await api.get("/chat");
    return data;
  }

  async function getNotification() {
    const { data } = await api.get("/notification");
    return data.notification;
  }

  async function fetchUserData() {
    try {
      const [profile, chat, notification] = await Promise.allSettled([
        fetchUserProfile(),
        fetchChatList(),
        getNotification(),
      ]);

      
      if (profile.status === "fulfilled") {
        setUser(profile.value);
      } else {
        navigate("/user/login");
        return;
      }

      
      if (chat.status === "fulfilled") {
        setchatDetails(chat.value);
      }

      
      if (notification.status === "fulfilled") {
        setNotification(
          notification.value.map((item) => item.messageid)
        );
      }

      setisLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/user/login");
    }
  }

  useEffect(() => {
    if (!User) {
      fetchUserData();
    } else {
      setisLoading(false);
    }
  }, []);

  if (isLoading) {
    return <Skeleton />;
  }

  return <>{User && children}</>;
};

export default UserProtectedWrapper;