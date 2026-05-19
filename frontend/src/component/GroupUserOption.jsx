import React, { useContext } from 'react'
import { FaUserShield } from "react-icons/fa";
import { IoRemoveCircleOutline } from "react-icons/io5";
import api from '../api/axiosInterceptor';
import { chatContext } from '../context/ChatContext';
import { authContext } from '../context/AuthContext';



const GroupUserOption = ({ handleOpenOption, OpenOptionForId }) => {
  const { setselectedChat, selectedChat, setisGroupChatProfileOpen,setfetchChatAgain } = useContext(chatContext);
  const { User } = useContext(authContext);
  async function handleRemoveUserFromGroup(chatId, userId) {
    if (!chatId || !userId) return;
    console.log(chatId)
    console.log(userId)
    const Isadmin = selectedChat.groupAdmin.some(val => val._id == User._id);
    if (Isadmin || userId == User._id) {
      try {
        const removeUser = await api.put("/chat/groupremove", { chatId, userId });
        if (removeUser.status === 200) {
          if (userId == User._id) {
            setisGroupChatProfileOpen(false)
            setselectedChat(null);
            setfetchChatAgain(true);
          } else {
            setselectedChat(removeUser.data);
            setfetchChatAgain(true);
          }

        }

      }
      catch (e) {
        console.log(e)
        console.log(e.message)
      }
    }
  }
  // console.log(OpenOptionForId)
  // console.log(User._id)
  function checkUserIsAdmin(id){
        return selectedChat?.groupAdmin.some(item => item._id == id)
    }
  return (
    <>
      <div className="bg-black text-white w-54 rounded-xl shadow-lg border border-gray-700 py-2 absolute top-[90%] right-4 z-4"  >

        {checkUserIsAdmin(User._id)&&<div className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 cursor-pointer transition">
          <FaUserShield size={20}
            onClick={() => {

              handleOpenOption
            }}
          />
          <span className="text-sm">Make Group Admin</span>
        </div>}

        <div className="flex items-center gap-3 px-4 py-2 hover:bg-red-500/20 cursor-pointer transition"

          onClick={() => {
            console.log("Remove User Button Clicked ")
            handleRemoveUserFromGroup(selectedChat._id, OpenOptionForId)
            handleOpenOption()
          }}>
          <IoRemoveCircleOutline size={20} className="text-red-500" />
          <span className="text-sm text-red-400">{OpenOptionForId == User._id ? "Exit Group" : "Remove"}</span>
        </div>

      </div>
    </>
  )
}

export default GroupUserOption