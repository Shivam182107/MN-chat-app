import React, { useContext } from 'react'
import { chatContext } from '../context/ChatContext'
import { RxCross2 } from 'react-icons/rx';
import { handelSelectGroupMember } from './GroupMemberList';
import api from '../api/axiosInterceptor';
import { authContext } from '../context/AuthContext';

const AddUserInGroup = ({ handleAddMemberInGroup }) => {
    const { groupMemberList, selectedChat,setselectedChat, setselectedGroupMember, selectedGroupMember,setfetchChatAgain } = useContext(chatContext);
    const {User}=useContext(authContext);
    // const [isUserSelected,setisUserSelected]=useState(null)
    // console.log(groupMemberList)
    const UsersSet = new Set(selectedChat.users.map(val => val._id));
    async function handleAddMemeberInGroup(chatId,addUser){
        if(!User||!chatId||!addUser)return;
        try{
            const addResponse=await api.put("/chat/groupadd",{chatId,addUser,adminId:User._id})
            if(addResponse.status===200){
                setselectedGroupMember([]);
                setfetchChatAgain(true);
                setselectedChat(addResponse.data);
                handleAddMemberInGroup();
                
            }
        }
        catch(e){
            console.log(e);
            console.log(e.message);
        }


    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

                {/* Modal Box */}
                <div className="w-[90%] max-w-md bg-white rounded-xl shadow-xl p-4 ">

                    {/* Header */}
                    <div className="flex gap-3 items-center mb-3">
                        <RxCross2
                            size={22}
                            className="cursor-pointer"
                            onClick={handleAddMemberInGroup} // adjust your state
                        />
                        <h1 className="text-lg font-semibold">Add group members</h1>
                    </div>

                    
                    <input
                        type="text"
                        placeholder="Search name or email"
                        className="w-full mb-3 px-4 py-2 rounded-full bg-gray-100 outline-none"
                    />

                    {/* Contacts Title */}
                    <p className="text-sm text-gray-500 mb-2">Contacts</p>

                    {/* Scrollable List */}
                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">

                        {groupMemberList && groupMemberList.filter(item => !UsersSet.has(item._id)).map(val => (
                            <div
                                key={val._id}
                                className="p-2 flex items-center rounded hover:bg-gray-100 cursor-pointer transition"
                            >

                                {/* Profile Pic */}
                                <div className="w-10 h-10">
                                    <img
                                        src={val.pic}
                                        alt=""
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>

                                {/* Name */}
                                <div className="flex-1 pl-3">
                                    <p className="text-sm font-medium">
                                        {val.fullname?.firstname}
                                    </p>
                                </div>

                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-green-500 cursor-pointer"

                                    onChange={() => handelSelectGroupMember(val, setselectedGroupMember)}

                                />

                            </div>
                        ))}

                    </div>
                    <div className="flex justify-end mt-4">
                        {selectedGroupMember.length > 0 && (
                            <button className="bg-black text-white py-2 px-6 rounded-lg"
                            onClick={()=>handleAddMemeberInGroup(selectedChat._id,selectedGroupMember)}
                            >
                                Add
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddUserInGroup