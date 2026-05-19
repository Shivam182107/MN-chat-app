import React, { useContext, useEffect, useRef, useState } from 'react'
import { chatContext } from '../context/ChatContext'
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEdit } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { authContext } from '../context/AuthContext';
import { MdOutlineDone } from "react-icons/md";
import api from '../api/axiosInterceptor';
import { RiArrowDropDownLine } from "react-icons/ri";
import GroupUserOption from './GroupUserOption';
import AddUserInGroup from './AddUserInGroup';

const GroupChatProfile = () => {
    const { selectedChat, setGroupName, setselectedChat, setfetchChatAgain, setisGroupChatProfileOpen } = useContext(chatContext);
    const { User } = useContext(authContext);
    const [IsEditClick, setIsEditClick] = useState(false);
    const [OpenOptionForId, setOpenOptionForId] = useState(null);
    const[IsAddUserOpen,setIsAddUserOpen]=useState(false);
    const EditInputRef = useRef()
    useEffect(() => {
        if (!IsEditClick) return;
        EditInputRef.current.focus();
    }, [IsEditClick])
    async function handleGroupRename(updatedName) {
        if (!updatedName) {
            return;
        }
        try {
            const renameResponse = await api.put("/chat/group/rename", { name: updatedName, chatId: selectedChat._id })
            if (renameResponse.status === 200) {
                setselectedChat((prev) => {
                    return { ...prev, chatName: updatedName }
                })
                setGroupName(null);
                setIsEditClick(false);
                setfetchChatAgain(true);
            }
        } catch (e) {
            console.log(e)
            console.log(e.message)
        }

    }
    function handleOpenOption(){
        setOpenOptionForId(null)
    }
    function handleAddMemberInGroup(){
        setIsAddUserOpen(false)
    }
    function checkUserIsAdmin(id){
        return selectedChat?.groupAdmin.some(item => item._id == id)
    }
    
    return (
        <>
            <div className={`md:w-[410px] flex flex-shrink-0 w-full overflow-y-auto custom-scrollbar border-r border-black flex flex-col `}>

                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3">
                    <RxCross2 size={20} className="cursor-pointer"
                        onClick={() => {
                            setisGroupChatProfileOpen(false);
                        }}
                    />
                    <h1 className="text-base font-medium">Group Info</h1>
                </div>

                {/* Group Image */}
                <div className="flex justify-center mt-2">
                    <div className="w-[100px] h-[100px] border border-black rounded-full overflow-hidden">
                        <img
                            src={selectedChat?.groupPic || "/GroupDefaultImage.png"}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Group Details */}
                <div className="flex flex-col items-center mt-3 px-4 text-center">
                    {!IsEditClick ? <p className="flex items-center gap-2 text-lg font-medium">
                        {selectedChat?.chatName}
                        <MdOutlineEdit size={20} className="cursor-pointer"
                            onClick={() => setIsEditClick(true)}
                        />
                    </p> : <div className='flex items-center gap-2'><input type='text' defaultValue={selectedChat.chatName}
                        ref={EditInputRef}
                        className='outline-none  text-center'
                    />
                        <MdOutlineDone
                            size={24}
                            onClick={() => {
                                console.log("Button is Clicked")
                                // console.log(EditInputRef.current.value)
                                handleGroupRename(EditInputRef.current.value)
                            }}
                        />
                    </div>
                    }
                    <p className="text-sm mt-1">
                        Group ·{" "}
                        <span className="text-green-700">
                            {selectedChat?.users.length} members
                        </span>
                    </p>
                </div>

                {/* Add Button */}
                <div className="px-4 mt-4">
                    <button className="w-full py-2 border border-black rounded-lg hover:bg-black hover:text-white cursor-pointer flex flex-col justify-center items-center"
                    onClick={()=>{
                        setIsAddUserOpen(true)
                    }}
                    
                    >
                        <IoPersonAddSharp size={24} />
                        Add
                    </button>
                </div>

                {/* Members Count */}
                <p className="px-4 mt-4 text-sm font-medium">
                    {selectedChat?.users.length} members
                </p>

                {/* Members List */}
                <div className="mt-2 flex flex-col gap-1 px-2 pb-4">

                    {/* Logged user */}
                    <div
                        key={User._id}
                        className="p-3 bg-white flex items-center rounded hover:bg-gray-100 cursor-pointer transition"
                    >
                        <div className="w-12 h-12">
                            <img src={User.pic} alt="" className="w-full h-full rounded-full object-cover" />
                        </div>

                        <div className="w-full pl-3 flex flex-col justify-center relative">
                            <p className="flex justify-between items-start pr-2 text-sm font-medium relative">
                                {User.fullname?.firstname}

                                <span className="flex flex-col items-end relative">
                                    <span
                                        className={`${checkUserIsAdmin(User._id)
                                            ? "inline-flex items-center rounded-md bg-[#D9FDD3] px-2 py-1 text-xs font-medium text-[#376F4C]"
                                            : "hidden"
                                            }`}
                                    >
                                        Group admin
                                    </span>

                                   { <RiArrowDropDownLine className="text-2xl cursor-pointer -mt-1"
                                        onClick={() => {
                                            console.log("Buttone is clicked")
                                            if (OpenOptionForId ) {
                                                        if(OpenOptionForId==User._id){
                                                            setOpenOptionForId(null)
                                                        }else{
                                                             setOpenOptionForId(User._id)
                                                        }
                                                    } else {
                                                        setOpenOptionForId(User._id)
                                                    }
                                        }}
                                    />}
                                </span>
                            </p>
                                    {User._id == OpenOptionForId && <GroupUserOption
                                        handleOpenOption={handleOpenOption}
                                        OpenOptionForId={OpenOptionForId}
                                    />}
                        </div>
                    </div>

                    {/* Other members */}
                    {selectedChat?.users
                        .filter(val => val._id != User._id)
                        .map((val, idx) => (
                            <div
                                key={idx}
                                className="p-3 bg-white flex items-center rounded hover:bg-gray-100 cursor-pointer transition"
                            >
                                <div className="w-12 h-12">
                                    <img
                                        src={val.pic}
                                        alt=""
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>

                                <div className="w-full pl-3 flex flex-col justify-center relative">
                                    <p className="flex justify-between items-start pr-2 text-sm font-medium relative">
                                        {val.fullname?.firstname}

                                        <span className="flex flex-col items-end relative">
                                            <span
                                                className={`${checkUserIsAdmin(val._id)
                                                    ? "inline-flex items-center rounded-md bg-[#D9FDD3] px-2 py-1 text-xs font-medium text-[#376F4C]"
                                                    : "hidden"
                                                    }`}
                                            >
                                                Group admin
                                            </span>

                                           { checkUserIsAdmin(User._id)&&<RiArrowDropDownLine className="text-2xl cursor-pointer -mt-1"
                                                onClick={() => {
                                                    if (OpenOptionForId ) {
                                                        if(OpenOptionForId==val._id){
                                                            setOpenOptionForId(null)
                                                        }else{
                                                             setOpenOptionForId(val._id)
                                                        }
                                                    } else {
                                                        setOpenOptionForId(val._id)
                                                    }
                                                }}
                                            />}
                                        </span>
                                    </p>
                                            {val._id == OpenOptionForId && <GroupUserOption
                                            handleOpenOption={handleOpenOption}
                                             OpenOptionForId={OpenOptionForId}
                                            />}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            {IsAddUserOpen&&<AddUserInGroup handleAddMemberInGroup={handleAddMemberInGroup}/>}
        </>
    )
}

export default GroupChatProfile