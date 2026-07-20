import React, { useEffect, useRef } from 'react'
import api from '../api/axiosInterceptor';
import { useState } from 'react';
import { getOrMakeChat, getSenderDetails, SearchUserChat } from '../config/ChatLogic';
import { authContext } from '../context/AuthContext';
import { useContext } from 'react';
import { chatContext } from '../context/ChatContext';

const SearchUserModal = ({ SearchValue,handleInput }) => {
    const [SearchData, setSearchData] = useState(null)
    const { setselectedChat,setfetchChatAgain,groupMemberList,notificationMap,handleDeleteNotification } = useContext(chatContext); 
    let LastSearhValue=useRef("")
    const [isLoading, setisLoading] = useState(false);
    let ClickedUser=useRef(null)
    const { User } = useContext(authContext);
   
    async function FetcchUserBySearch(SearchValue) {
        try {

            const { data } = await api.get(`/user?search=${SearchValue}`)
            // console.log(data);
            console.log("Fetching Search Data")
            setisLoading(false)
            setSearchData(data)


        } catch (e) {
            console.log(e)
            console.log(e.message);
        }
    }

    useEffect(() => {
        if (!SearchValue || SearchValue.trim() == "") {
            setSearchData(null);
             setisLoading(false);
            return;
        }
        if(SearchValue||SearchData?.length>=0){
             setisLoading(true);
        }
        const delaySearch = setTimeout(() => {
            if (SearchValue == LastSearhValue.current) return;           
            LastSearhValue.current=SearchValue
            FetcchUserBySearch(SearchValue)
        }, 1000)
        return () => clearTimeout(delaySearch)
    }, [SearchValue])


   
    if (isLoading && !SearchData) {
        return (<div className="flex-1 overflow-hidden px-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="p-3 flex items-center gap-3 rounded"
            >
              <div className="w-12 h-12 rounded-full skeleton"></div>

              <div className="flex-1">
                <div className="h-4 w-32 skeleton rounded mb-2"></div>
                <div className="h-3 w-48 skeleton rounded"></div>
              </div>

              <div className="h-3 w-10 skeleton rounded"></div>
            </div>
          ))}
        </div>)
    }
     if (SearchData && SearchData.length == 0) {
        return (<div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar pb-28 pl-2 w-full">
            <h1 className='text-xl text-white'>No User Found </h1>
        </div>)
    }
    return (
        <>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar pb-28 pl-2 w-full">
                {/* display the all register users here when SearchData not exit  */}
                {
                    groupMemberList&&!SearchData && groupMemberList.map(val=>(
                         <div
                        key={val._id}
                        className="p-3 flex items-center rounded-2xl gap-3 hover:bg-white/10 cursor-pointer text-white transition-colors duration-200 animate-fade-in-up"
                        onClick={async () =>{
                            if(ClickedUser.current)return;
                            ClickedUser.current=val._id;
                            const success=await SearchUserChat(val._id,setselectedChat,notificationMap,handleDeleteNotification)
                            ClickedUser.current=null;
                            if(success){
                                setfetchChatAgain(true);
                                setSearchData(null);
                                LastSearhValue.current=null
                                handleInput()
                            }
                        }}
                    >
                        <div className="w-12 h-12 flex-shrink-0">
                            <img
                                src={
                                    val.isGroupChat ? val.groupPic || "/GroupDefaultImage.png" :
                                        val.pic
                                }
                                alt=""
                                className='w-full h-full rounded-full object-cover'
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                                {val.isGroupChat ? val.chatName : val.fullname.firstname}
                            </p>
                        </div>
                    </div>
                    ))
                }
                {/* display serched user values  */}
                {SearchData && SearchValue && SearchData.map((val) => (
                    <div
                        key={val._id}
                        className="p-3 flex items-center rounded-2xl gap-3 hover:bg-white/10 cursor-pointer text-white transition-colors duration-200 animate-fade-in-up"
                        onClick={async () =>{
                            if(ClickedUser.current)return;
                            ClickedUser.current=val._id;
                            const success=await SearchUserChat(val._id,setselectedChat,notificationMap,handleDeleteNotification)
                            ClickedUser.current=null;
                            if(success){
                                setfetchChatAgain(true);
                                setSearchData(null);
                                LastSearhValue.current=null
                                handleInput()
                            }
                        }}
                    >
                        <div className="w-12 h-12 flex-shrink-0">
                            <img
                                src={

                                    val.isGroupChat ? val.groupPic || "/GroupDefaultImage.png" :
                                        val.pic

                                }
                                alt=""
                                className='w-full h-full rounded-full object-cover'
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                                {val.isGroupChat ? val.chatName : val.fullname.firstname}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default SearchUserModal