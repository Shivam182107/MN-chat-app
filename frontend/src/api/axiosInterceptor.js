import axios from "axios";
const api=axios.create({
    baseURL:import.meta.env.VITE_BASE_URL,//"http://localhost:3000",//import.meta.env.VITE_BASE_URL
    withCredentials:true
})
api.interceptors.response.use(
    (res)=>res,
    async(error)=>{
        const orignalRequest=error.config;
        try{

            if(error.response.status===401&&!orignalRequest._retry){
                orignalRequest._retry=true;
                const {data}=await api.post("/user/refresh");
                return api(orignalRequest)
            }
        }catch(e){
            return Promise.reject(error)
        }
    }
)
export default api;