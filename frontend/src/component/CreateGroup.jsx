import { RxCross2 } from "react-icons/rx";
import { motion } from "framer-motion"
import { FaSearch } from "react-icons/fa";
import { FaArrowRightLong } from 'react-icons/fa6'
import GroupMemberList from "./GroupMemberList";
import { useContext, useState } from "react";
import { chatContext } from "../context/ChatContext";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import api from "../api/axiosInterceptor";

const CreateGroup = ({ removeGroupCreate }) => {
  const { selectedGroupMember,setselectedGroupMember,GroupName,setGroupName,setselectedChat,setfetchChatAgain,setTrackSection } = useContext(chatContext);
  const [isAddMemberClick, setisAddMemberClick] = useState(false);
  const [GroupNameInput,setGroupNameInput]=useState("")
  const [SearchUserInput,setSearchUserInput]=useState("")
  function handleGroupName(e){
    // console.log(GroupNameInput);
    if(GroupNameInput&&GroupNameInput.trim()===""){
      return ;
    }
    setGroupNameInput(e.target.value)
    setGroupName(e.target.value)

  }
  function handleSearchUser(e){
    // console.log(GroupNameInput);
    if(SearchUserInput&&SearchUserInput.trim()===""){
      return ;
    }
    setSearchUserInput(e.target.value)
  }


  async function handleGroupCreation(){
    if(selectedGroupMember.length<2||!GroupName){
      retrun;
    }
    try{
      const createResponse=await api.post("/chat/group",{name:GroupName,users:selectedGroupMember})
      if(createResponse.status===200){
        setselectedChat(createResponse.data);
        setselectedGroupMember([]);
        setGroupName(null);
        setisAddMemberClick(false);
        removeGroupCreate();
        setfetchChatAgain(true);
        
        
      }
    }catch(e){
      console.log(e)
      console.log(e.message);
    }
  } 
//  console.log("create group reddering ......")
  return (
    <>
      {!isAddMemberClick ? <div className="md:w-[410px] flex-shrink-0 w-full bg-[#FFFFFF]  flex flex-col "


      >

        {/* Header */}
        <div className="  flex  justify-between pr-2 items-center py-4 pl-4 relative">
          <div className="flex gap-2 items-center ">

            <RxCross2
              size={20}
              onClick={() => {
                setTrackSection("chat")
                removeGroupCreate()
                if(selectedGroupMember.length>0){
                setselectedGroupMember([]);
                if(GroupName){
                  setGroupName(null)
                }
              }
              }}
              className="cursor-pointer"
            />
            <h1 className="text-base font-medium">Add group members</h1>
          </div>

          <p className="text-base font-medium">Members Selected ({selectedGroupMember?.length})</p>
        </div>

        {/* Search */}
        <div className="mb-4 relative px-4 flex items-center gap-2">

          {/* Input */}
          <div
            className={`transition-all duration-300 ease-in-out
      ${selectedGroupMember?.length > 0 ? "w-[85%]" : "w-full"}
    `}
          >
            <input
              type="text"
              name="Search"
              className="bg-[#eeeeee] w-full py-2 rounded-full pl-10 pr-4 placeholder:text-black outline-none transition-all duration-300"
              placeholder="Search name "
              onChange={handleSearchUser}
              value={SearchUserInput}
            />

            {/* Search Icon */}
            <FaSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          {/* Button */}
          <div
            className={`transition-all duration-300 ease-in-out flex justify-center items-center
      ${selectedGroupMember?.length > 0
                ? "w-10 opacity-100 scale-100"
                : "w-0 opacity-0 scale-75 overflow-hidden"}
    `}
          >
            <button
              className="bg-black text-white h-10 w-10 rounded-full flex items-center justify-center 
      shadow-md active:scale-95 transition"
              onClick={() => {
                setisAddMemberClick(true);
                if(SearchUserInput){
                  setSearchUserInput("")
                }
                
              }}
            >
              <FaArrowRightLong />
            </button>
          </div>

        </div>

        {/*  Scrollable Chat List */}
        <GroupMemberList />

      </div> : <div
        className={`md:w-[410px] flex-shrink-0 w-full bg-[#FFFFFF]  flex flex-col `}
      >
        <div className=" flex gap-2 items-center mb-4 ml-3">

          <MdOutlineKeyboardBackspace
            size={28}
            className="  cursor-pointer"
            onClick={()=>{
              setisAddMemberClick(false);
              setGroupName(null);
              setGroupNameInput("")
            }}

          />
          <h1 className="text-xl font-semibold ">Set Group Name</h1>
        </div>
        {/* name   */}
        <div className="mb-4 relative px-4 flex items-center gap-2">

          {/* Input */}
          <div
            className={`transition-all duration-300 ease-in-out
      ${GroupName? "w-[85%]" : "w-full"}
    `}
          >
            <input
              type="text"
              name="groupName"
              className="bg-[#eeeeee] w-full py-2 rounded-full pl-4 placeholder:text-black outline-none transition-all duration-300"
              placeholder="Enter group name"
              onChange={handleGroupName}
              value={GroupNameInput}
            />

            
          </div>

          {/* Button */}
          <div
            className={`transition-all duration-300 ease-in-out flex justify-center items-center
            ${GroupName
                ? "w-10 opacity-100 scale-100"
                : "w-0 opacity-0 scale-75 overflow-hidden"}
            `}
          >
            <button
              className="bg-black text-white h-10 w-10 rounded-full flex items-center justify-center 
              shadow-md active:scale-95 transition"
              onClick={handleGroupCreation}
            >
              <FaArrowRightLong />
            </button>
          </div>

        </div>
        <p className="mt-4 ml-2 mb-2">Member currently selected({selectedGroupMember.length})</p>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-28 w-full 
grid grid-cols-4 sm:grid-cols-5 gap-x-3 gap-y-4 content-start">

          {selectedGroupMember?.map((val) => (
            <div key={val._id} className="flex flex-col items-center text-center">

              {/* Avatar */}
              <div className="w-14 h-14">
                <img
                  src={val?.pic}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              {/* Name */}
              <p className="text-xs mt-1 max-w-[60px] truncate">
                {val?.fullname?.firstname}
              </p>

            </div>
          ))}

        </div>


      </div>}
    </>
  )
}

export default CreateGroup