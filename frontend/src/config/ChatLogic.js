import api from "../api/axiosInterceptor";

export function getSenderDetails(LoggedUser,UsersArray,isGroupChat){
    if(!LoggedUser||isGroupChat||!UsersArray) return;
    return UsersArray[0].fullname.firstname==LoggedUser.fullname.firstname?UsersArray[1]:UsersArray[0]
}
export async function getOrMakeChat(userId,isGroupChat,chat,setselectedChat){
    // console.log(userId);
    try{
      if(userId && !isGroupChat ){
        const response= await api.post("/chat",{userId});
        if(response.status===200){
          setselectedChat(response.data)
        }
        // console.log("1to1 chat created state upadted ")
      }else{
        setselectedChat(chat)
      }
      console.log("1to1 chat created ")
      
    }catch(e){
      console.log(e)
      console.log(e.message)
    }
  }
export async function SearchUserChat(userId,setselectedChat){
    // console.log(userId);
    try{
      if(userId){
        const response= await api.post("/chat",{userId});
        if(response.status===200){
          setselectedChat(response.data)
        }
        // console.log("1to1 chat created state upadted ")
      }
      console.log("1to1 chat created ")
      
    }catch(e){
      console.log(e)
      console.log(e.message)
    }
  }

  