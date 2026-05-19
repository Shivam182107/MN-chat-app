import { useContext, useEffect, useState } from "react"
import { authContext } from "../context/AuthContext"
import api from "../api/axiosInterceptor";
import { useNavigate } from "react-router"
import { chatContext } from "../context/ChatContext";

const UserProtectedWrapper = ({ children }) => {
  const { User, setUser } = useContext(authContext);
  const{setfetchChatAgain}=useContext(chatContext);
  const [isLoading, setisLoading] = useState(true)
  const navigate = useNavigate()
  async function fetchUserProfile() {
    try {
      const userDetails = await api.get("/user/profile");
      // if (!userDetails) return;
      if(userDetails.status===200){
        setisLoading(false)
        setUser(userDetails.data);
        setfetchChatAgain(true);
        // localStorage.setItem("userdetails", JSON.stringify(userDetails.data));
      }

    } catch (err) {
      console.log(err)
      console.log(err.message);
      navigate("/user/login")

    }


  }
  useEffect(() => {
    if(!User){
      fetchUserProfile()
    }
    else {
      setisLoading(false);
    }
  }, [])
  if (isLoading) {
  return (
    <div className="inset-0 fixed flex flex-col justify-center items-center text-5xl">Loading........</div>
  );
}
  return (
    <>

      {User && children}
    </>
  )
}

export default UserProtectedWrapper