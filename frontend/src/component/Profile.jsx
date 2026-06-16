import React, { useContext } from 'react'
import { authContext } from '../context/AuthContext'
import { motion } from "framer-motion"
import { LuLogOut } from 'react-icons/lu'
import { NavLink } from 'react-router'
import ChatWindow from './ChatWindow'

const Profile = () => {
    const { User } = useContext(authContext);
    return (
        <>
            <div className="md:w-[410px] flex-shrink-0 w-full bg-[#161717]  flex flex-col items-center"
            >
                <div className="pl-4 w-full">
                    <h1 className="text-3xl font-medium text-left mb-8 mt-4"> Your Profile</h1>

                </div>
                <div className="w-[300px]">
                    <img src={User.pic} alt="" className='w-[350px]' />
                </div>
                <div className='w-full px-4 mt-4'>
                    <button className='py-3 hover:cursor-pointer hover:bg-black/90 rounded  w-full bg-black text-white'>Theme</button>
                </div>
                <div className='w-full px-4 mt-4 '>
                    <NavLink
                        to={"/user/logout"}
                        className="py-3 w-full rounded border-1 hover:bg-red-600/10  flex justify-center  border-red-600 gap-4 items-center pl-4"
                    >
                        Logout <LuLogOut className='text-red-500' />
                    </NavLink>               
                    
                     </div>



            </div>

            {/* ⬜ Chat Window */}
           <ChatWindow/>
        </>
    )
}

export default Profile