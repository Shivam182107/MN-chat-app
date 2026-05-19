import React, { useEffect, useMemo, useRef } from 'react'
import { getSenderDetails } from '../config/ChatLogic'
import { useContext } from 'react'
import { chatContext } from '../context/ChatContext'
import { authContext } from '../context/AuthContext'
import { FaArrowRightLong } from 'react-icons/fa6'


export function handelSelectGroupMember(sender, setselectedGroupMember) {
  // console.log(sender, "s.............")
  setselectedGroupMember((prev) => {

    let arr = [...prev];
    if (arr.some(val => val._id === sender._id)) {
      arr = arr.filter(item => item._id != sender._id)
    }
    else {
      arr.push(sender);
    }
    return arr;
  })

}
const GroupMemberList = () => {
  const { chatDetails, groupMemberList, setgroupMemberList, groupMemberArray, selectedGroupMember, setselectedGroupMember } = useContext(chatContext)
  const { User } = useContext(authContext);





  // console.log(selectedGroupMember,"....................>")
  return (
    <>
      <div className="flex-1  overflow-y-auto space-y-2 pr-2 custom-scrollbar pl-2 pb-28 w-full   ">
        <p className='text-gray-500 ml-3'>Frequently contacted </p>
        {chatDetails && chatDetails.map((val, idx) => {
          if (val.isGroupChat) return null;
          let sender = getSenderDetails(User, val.users, val.isGroupChat);
          let isSelected = selectedGroupMember.some(item => item._id === sender?._id)
          return (

            <div
              key={idx}
              className={`p-3  flex rounded items-center hover:bg-gray-100 cursor-pointer transition ${val.isGroupChat ? "hidden" : ""}
              ${isSelected ? "bg-green-300 hover:bg-green-300/20" : "bg-white"}
              `}
              onClick={() => { handelSelectGroupMember(sender, setselectedGroupMember) }}

            >

              <div className={`rounded-[50%] w-12 flex items-center`}

              >
                <img src={sender?.pic} alt="" className='w-full rounded-[50%] ' />
              </div>
              <div className=" w-full pl-2 flex flex-col justify-center ">
                <p>{sender.fullname?.firstname}</p>
                {/* <p>{val.fullname?.firstname}</p> */}
              </div>

              <input
                type="checkbox"
                className="w-5 h-5  border-2 border-gray-400 rounded cursor-pointer "
                checked={isSelected}
                onClick={(e) => e.stopPropagation()}
                onChange={() => handelSelectGroupMember(sender, setselectedGroupMember)}
              />
            </div>
          )
        })

        }
        <p className='text-gray-500 ml-3'>Contacts you know</p>
        {
          groupMemberArray && groupMemberArray.map((val, idx) => {
            if (val.isGroupChat) return null;
            let isSelected = selectedGroupMember.some(item => item._id === val?._id)
            return (
              <div
                key={idx}
                className={`p-3  flex rounded items-center hover:bg-gray-100 cursor-pointer transition ${val.isGroupChat ? "hidden" : ""} 
                ${isSelected ? "bg-green-300 hover:bg-green-300/20" : "bg-white"}
                `}
                onClick={() => { handelSelectGroupMember(val, setselectedGroupMember) }}
              >

                <div className={`rounded-[50%] w-12 flex items-center`}

                >
                  <img src={
                    val.pic

                  } alt="" className='w-full rounded-[50%] ' />
                </div>
                <div className=" w-full pl-2 flex flex-col justify-center ">
                  <p>{val?.fullname?.firstname}</p>
                  {/* <p>{val.fullname?.firstname}</p> */}
                </div>

                <input
                  type="checkbox"
                  className="w-5 h-5 appearance-none border-2 border-gray-400 rounded cursor-pointer 
             checked:bg-blue-200 checked:border-green-800"
                  checked={isSelected}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handelSelectGroupMember(val, setselectedGroupMember)}
                />
              </div>
            )
          })
        }

      </div>
    </>
  )
}

export default GroupMemberList


