import { Link, useNavigate } from "react-router";
import { FaGoogle } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import api from "../api/axiosInterceptor";
import { useContext } from "react";
import { authContext } from "../context/AuthContext";
import { chatContext } from "../context/ChatContext";
import toast from "react-hot-toast";

const UserSignup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { setUser } = useContext(authContext);
  const { setfetchChatAgain } = useContext(chatContext);
  const navigate = useNavigate();

  async function FormSubmit(formData) {
    try {
      const signupResponse = await api.post("/user/register", formData);
      if (signupResponse.status === 201) {
        setUser(signupResponse.data);
        setfetchChatAgain(true);
        toast.success("Account created successfully! Welcome 🎉");
        navigate("/");
      }
      reset();
    } catch (e) {
      const msg =
        e.response?.data?.message || "Signup failed. Please try again.";
      toast.error(msg);
      console.log(e.message);
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/user/auth/google`;
  }

  return (
    <>
      <div
        className="min-h-screen w-full flex items-center bg-black text-white"
      >
        <motion.div className="max-w-7xl mx-auto w-full flex md:flex-row flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        >
          {/* LEFT IMAGE */}
          <motion.div
            className="flex-1 flex justify-center items-center p-6"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative w-full max-w-[500px]">
              <img
                // src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=576/height=576/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NjRkZDNkMS05NGU3LTQ4MWUtYjI4Yy0wOGQ1OTM1M2I5ZTAucG5n"
                src="/ChatauthImagecompressed.png"
                alt="signup"
                className="w-full rounded-lg border-1 border-black"
                
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/2 to-transparent rounded-lg"></div>
              <div className="absolute bottom-0 text-white p-6">
                <h1 className="text-xl sm:text-2xl font-semibold leading-snug">
                  Welcome User One Step to join 80M family
                  <FaArrowRightLong size={24} className="inline-block ml-3" />
                </h1>
              </div>
            </div>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            className="flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-12 py-6"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-3xl sm:text-4xl font-medium text-center mb-10">
              Sign Up
            </h3>

            <form
              className="flex flex-col max-w-md mx-auto w-full"
              onSubmit={handleSubmit(FormSubmit)}
            >
              <div className="flex flex-col md:flex-row gap-4 mb-5">
                <div className="flex-1">
                  <label className="font-medium">Enter your firstname:</label>
                  <input
                    type="text"
                    className="mt-2 h-12 w-full bg-white/10 px-3 rounded-lg"
                    {...register("fullname.firstname", {
                      required: "This field is required",
                    })}
                  />
                  <p className="text-red-600">
                    {errors.fullname?.firstname?.message}
                  </p>
                </div>
                <div className="flex-1">
                  <label className="font-medium">Enter your lastname:</label>
                  <input
                    type="text"
                    className="mt-2 h-12 w-full bg-white/10 px-3 rounded-lg"
                    {...register("fullname.lastname", {
                      required: "This field is required",
                    })}
                  />
                  <p className="text-red-600">
                    {errors.fullname?.lastname?.message}
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="email" className="font-medium">
                  Enter your email:
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-2 h-12 w-full bg-white/10 px-3 rounded-lg"
                  {...register("email", { required: "This field is required" })}
                />
                <p className="text-red-600">{errors.email?.message}</p>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="font-medium">
                  Enter your password:
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-2 h-12 w-full bg-white/10 px-3 rounded-lg"
                  {...register("password", {
                    required: "This field is required",
                    minLength: {
                      value: 8,
                      message: "Password must be 8 characters long",
                    },
                  })}
                />
                <p className="text-red-600">{errors.password?.message}</p>
              </div>

              <button className="hover:cursor-pointer w-full py-3 rounded-lg bg-white text-black font-medium hover:opacity-90 transition">
                Sign up
              </button>

              <p className="text-center flex justify-center gap-2 mt-4 mb-6 flex-wrap text-white">
                Already have an account?
                <Link to="/user/login" className="text-blue-600">
                  Login here
                </Link>
              </p>

              <div className="border border-[#282828] mb-6 relative after:content-['or'] after:absolute after:bg-black after:px-2 after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2"></div>

              {/* Google Signup */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full hover:cursor-pointer py-3 rounded-lg border-1 border-[#282828] flex justify-center items-center gap-2 hover:bg-white hover:text-black transition"
              >
                <FaGoogle size={16} />
                Continue with Google
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default UserSignup;
