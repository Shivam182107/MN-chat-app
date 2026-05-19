import React, { useContext } from 'react'
import { FaArrowRightLong } from 'react-icons/fa6'
import { authContext } from '../context/AuthContext'
import { motion } from "framer-motion"
import { LuLogOut } from 'react-icons/lu'
import { NavLink } from 'react-router'

const Profile = () => {
    const { User } = useContext(authContext);
    return (
        <>
            <div className="md:w-[410px] flex-shrink-0 w-full bg-[#FFFFFF]  flex flex-col items-center"
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
            <div className="hidden md:flex flex-1 bg-gray-100 items-center justify-center">
                <motion.h1
                    className="text-3xl lg:text-5xl font-medium text-center px-4"

                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Your Chats are waiting
                </motion.h1>
                <button>Chats <FaArrowRightLong /></button>
            </div>
        </>
    )
}

export default Profile