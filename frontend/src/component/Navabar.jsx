import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { FaUser } from "react-icons/fa";
import { RiMenu3Fill } from "react-icons/ri";
import { LuLogOut } from "react-icons/lu";
import { authContext } from '../context/AuthContext';
import api from '../api/axiosInterceptor';
import { chatContext } from '../context/ChatContext';
const Navabar = ({profileActivate}) => {
  const [isOpen, setisOpen] = useState(false);
  const { User,setUser } = useContext(authContext);
  const {setchatDetails,setselectedChat}=useContext(chatContext)
  const navigate=useNavigate()
  async function handleLogout(){
    try{
      const response=await api.get("/user/logout");
      // console.log("inside logout");
      // console.log(response);
      if(response.status===200){

        localStorage.removeItem("userdetails");
        setUser("");
        setchatDetails(null);
        setselectedChat(null)
        navigate("/user/login");
      }
      }catch(e){
      console.log(e)
      console.log(e.message)
    }
  }                                                                                                                                                              
  return (
    <>
      <nav>
        <div className='bg-black text-white py-4 px-6 flex items-center justify-between relative'>
          <h1>Chat App</h1>
          <div className='md:hidden hover:cursor-pointer'>
            <RiMenu3Fill
              onClick={() => {
                setisOpen(prev => !prev);
              }}
            />
          </div>
          {/* mobile responsive */}
          {isOpen && <div className='absolute md:hidden  top-[100%] bg-black w-full z-4 left-0 flex flex-col '>


            {!User ? <div className='flex flex-col'><NavLink
              to={"/user/register"}
              className="py-2 px-4 rounded hover:cursor-pointer hover:bg-white/10 hover:text-white "
              onClick={() => {
                setisOpen(prev => !prev);
              }}
            >
              Signup
            </NavLink>

              <NavLink
                to={"/user/login"}
                className="py-2 px-4 rounded hover:cursor-pointer  hover:bg-white/10 hover:text-white"
                onClick={() => {
                setisOpen(prev => !prev);
              }}
              >
                Login
              </NavLink></div> : <div className='flex flex-col'>

              <div
                className="py-4 w-full rounded hover:cursor-pointer flex items-center gap-4  hover:bg-white/10 hover:text-white pl-4"
                onClick={() => {
                setisOpen(prev => !prev);
                profileActivate()
              }}
              >
                Profile<FaUser />
              </div>

              <button
                
                className="py-4 w-full rounded hover:cursor-pointer hover:bg-white/10 hover:text-white flex gap-4 items-center pl-4"
                
                onClick={() => {
                setisOpen(prev => !prev);
                handleLogout()
              }}
              >
                Logout <LuLogOut className='text-red-500' />
              </button>
            </div>
            }

          </div>}






          <div className='md:flex gap-4 hidden  '>


            {!User ? <div className='flex gap-4'><NavLink
              to={"/user/register"}
              className="py-2 px-4 rounded hover:cursor-pointer hover:bg-white/10 hover:text-white "
            >
              Signup
            </NavLink>

              <NavLink
                to={"/user/login"}
                className="py-2 px-4 rounded hover:cursor-pointer hover:bg-white/10 hover:text-white"
              >
                Login
              </NavLink></div> : <div className='flex gap-4'>

              <div
                className="w-8 hover:cursor-pointer  rounded-[50%]  flex items-center gap-4  hover:bg-white/10 hover:text-white"
              >
                <img src={User.pic} alt="" 
                className='w-full rounded-[50%]'
                onClick={profileActivate}
                />
              </div>

              <button
                
                className="py-2 px-4 rounded hover:bg-white/10 hover:text-white"
                onClick={  handleLogout
                }
              >
                Logout
              </button>
            </div>

            }

          </div>
        </div>
      </nav>
    </>
  )
}

export default Navabar