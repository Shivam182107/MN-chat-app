import React, { useEffect } from 'react'
import api from '../api/axiosInterceptor';
import { useState } from 'react';
import { getOrMakeChat, getSenderDetails, SearchUserChat } from '../config/ChatLogic';
import { authContext } from '../context/AuthContext';
import { useContext } from 'react';
import { chatContext } from '../context/ChatContext';

const SearchUserModal = ({ SearchValue,handleInput }) => {
    const [SearchData, setSearchData] = useState(null)
    const { setselectedChat,setfetchChatAgain } = useContext(chatContext);
    const [LastSearhValue, setLastSearhValue] = useState("");
    const [isLoading, setisLoading] = useState(true);
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
            if (SearchValue == LastSearhValue) return;           
            setLastSearhValue(SearchValue)
            FetcchUserBySearch(SearchValue)
        }, 1000)
        return () => clearTimeout(delaySearch)
    }, [SearchValue])
    if (SearchData && SearchData.length == 0) {
        return (<div className='bg-black w-80 max-h-96 h-40 overflow-y-auto rounded-lg shadow-xl absolute right-10 top-14 z-50 flex flex-col justify-center items-center'>
            <h1 className='text-xl text-white'>No User Found </h1>
        </div>)
    }
    if (isLoading) {
        return (<div className='bg-black w-80 max-h-96 rounded-lg shadow-xl absolute right-10 top-14 z-50 py-4 flex flex-col justify-start items-center overflow-y-auto'>

            {[...Array(3)].map((_, idx) => (
                <div
                    key={idx}
                    className="w-full px-4 mb-4 flex items-center gap-3"
                >
                    {/* Avatar Skeleton */}
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex-shrink-0 animate-pulse"></div>

                    {/* Text Skeleton */}
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-[95%] animate-pulse"></div>
                        <div className="h-3 bg-gray-700 rounded w-[70%] animate-pulse"></div>
                    </div>
                </div>
            ))}

        </div>)
    }
    // console.log(SearchValue)
    // console.log("search reddering ......")
    return (
        <>
            <div className='bg-black w-80 max-h-96 overflow-y-auto rounded-lg shadow-xl absolute right-10 top-14 z-50'>
                {SearchData && SearchValue && SearchData.map((val, idx) => (
                    <div
                        key={idx}
                        className="p-3 flex items-center gap-3 hover:bg-white/10 cursor-pointer text-white transition-colors duration-200"
                        onClick={async () =>{
                            await SearchUserChat(val._id,setselectedChat)
                            // console.log("1to1 chat created ")
                            setfetchChatAgain(true);
                            setSearchData(null);
                            setLastSearhValue(null);
                            handleInput()
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