import { RxCross2 } from "react-icons/rx";
import { FaSearch } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import GroupMemberList from "./GroupMemberList";
import { useContext, useEffect, useState } from "react";
import { chatContext } from "../context/ChatContext";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import api from "../api/axiosInterceptor";

const CreateGroup = ({ removeGroupCreate }) => {
  const {
    selectedGroupMember,
    setselectedGroupMember,
    GroupName,
    setGroupName,
    setselectedChat,
    setfetchChatAgain,
    setTrackSection,
    groupMemberList,
  } = useContext(chatContext);
  const [isAddMemberClick, setisAddMemberClick] = useState(false);
  const [GroupNameInput, setGroupNameInput] = useState("");
  const [SearchUserInput, setSearchUserInput] = useState("");
  const [FillterUsersBySearch, setFillterUsersBySearch] = useState(null);
  function handleGroupName(e) {
    const value = e.target.value;
    setGroupNameInput(value);
    setGroupName(value.trim() === "" ? null : value);
  }

  function handleSearchUser(e) {
    setSearchUserInput(e.target.value);
  }

  async function handleGroupCreation() {
    if (selectedGroupMember.length < 2 || !GroupName) {
      return;
    }
    try {
      const createResponse = await api.post("/chat/group", {
        name: GroupName,
        users: selectedGroupMember,
      });
      if (createResponse.status === 200) {
        setselectedChat(createResponse.data);
        setselectedGroupMember([]);
        setGroupName(null);
        setisAddMemberClick(false);
        removeGroupCreate();
        setfetchChatAgain(true);
        setTrackSection("chat")
      }
    } catch (e) {
      console.log(e);
      console.log(e.message);
    }
  }
  //  console.log("create group reddering ......")

  useEffect(() => {
    if (!SearchUserInput.trim()) {
      setFillterUsersBySearch(null);
      return;
    }
    const DebounceSearch = setTimeout(() => {
      const query = SearchUserInput.trim().toLowerCase();
      const filtered = (groupMemberList || []).filter((val) =>
        val.fullname?.firstname?.toLowerCase().includes(query),
      );
      setFillterUsersBySearch(filtered);
    }, 500);
    return () => clearTimeout(DebounceSearch);
  }, [SearchUserInput,groupMemberList]);
  return (
    <>
      {!isAddMemberClick ? (
        <div className="md:w-[410px] flex-shrink-0 w-full bg-[#161717] flex flex-col ">
          {/* Header */}
          <div className="  flex  justify-between pr-2 items-center py-4 px-4 relative">
            <div className="flex gap-1 items-center ">
              <RxCross2
                size={20}
                onClick={() => {
                  setTrackSection("chat");
                  removeGroupCreate();
                  if (selectedGroupMember.length > 0) {
                    setselectedGroupMember([]);
                    if (GroupName) {
                      setGroupName(null);
                    }
                  }
                }}
                className="cursor-pointer text-white"
              />
              <h1 className="text-base font-medium text-white">
                Add group members
              </h1>
            </div>

            <p className="text-base font-medium text-white pr-4">
              Members Selected ({selectedGroupMember?.length})
            </p>
          </div>

          {/* Search */}
          <div className="mb-4 ml-1 relative px-3 flex items-center gap-2">
            {/* Input */}
            <div
              className={`transition-all duration-300 ease-in-out
      ${selectedGroupMember?.length > 0 ? "w-[85%]" : "w-full"}
    `}
            >
              <input
                type="text"
                name="Search"
                className="bg-[#2E2F2F] w-full py-2 rounded-full pl-10 pr-4 placeholder:text-[#9FACAC] outline-none transition-all text-white duration-300"
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
      ${
        selectedGroupMember?.length > 0
          ? "w-10 opacity-100 scale-100"
          : "w-0 opacity-0 scale-75 overflow-hidden"
      }
    `}
            >
              <button
                className="bg-green-300 text-black h-10 w-10 rounded-full  flex items-center justify-center 
      shadow-md active:scale-95 transition cursor-pointer"
                onClick={() => {
                  setisAddMemberClick(true);
                  if (SearchUserInput) {
                    setSearchUserInput("");
                  }
                }}
              >
                <FaArrowRightLong />
              </button>
            </div>
          </div>

          {/*  Scrollable Chat List */}
          <GroupMemberList FillterUsersBySearch={FillterUsersBySearch} />
        </div>
      ) : (
        <div
          className={`md:w-[410px] flex-shrink-0 w-full bg-[#161717]  flex flex-col  pt-4`}
        >
          <div className=" flex gap-2 items-center mb-4 ml-3">
            <MdOutlineKeyboardBackspace
              size={28}
              className="  cursor-pointer text-white"
              onClick={() => {
                setisAddMemberClick(false);
                setGroupName(null);
                setGroupNameInput("");
              }}
            />
            <h1 className="text-xl font-semibold text-white">Set Group Name</h1>
          </div>
          {/* name   */}
          <div className="mb-4 relative px-4 flex items-center gap-2">
            {/* Input */}
            <div
              className={`transition-all duration-300 ease-in-out
      ${GroupName ? "w-[85%]" : "w-full"}
    `}
            >
              <input
                type="text"
                name="groupName"
                className="bg-[#2E2F2F] placeholder:text-[#9FACAC] w-full py-2 rounded-full pl-4 outline-none transition-all text-white duration-300"
                placeholder="Enter group name"
                onChange={handleGroupName}
                value={GroupNameInput}
              />
            </div>

            {/* Button */}
            <div
              className={`transition-all duration-300 ease-in-out flex justify-center items-center
            ${
              GroupName
                ? "w-10 opacity-100 scale-100"
                : "w-0 opacity-0 scale-75 overflow-hidden"
            }
            `}
            >
              <button
                className="bg-green-300 text-black h-10 w-10 rounded-full flex items-center justify-center 
              shadow-md active:scale-95 transition cursor-pointer"
                onClick={handleGroupCreation}
              >
                <FaArrowRightLong />
              </button>
            </div>
          </div>
          <p className="mt-4 ml-2 mb-2 text-white">
            Member currently selected({selectedGroupMember.length})
          </p>
          <div
            className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-28 w-full 
grid grid-cols-4 sm:grid-cols-5 gap-x-3 gap-y-4 content-start"
          >
            {selectedGroupMember?.map((val) => (
              <div
                key={val._id}
                className="flex flex-col items-center text-center"
              >
                {/* Avatar */}
                <div className="w-14 h-14">
                  <img
                    src={val?.pic}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                {/* Name */}
                <p className="text-xs mt-1 max-w-[60px] truncate text-white">
                  {val?.fullname?.firstname}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CreateGroup;
