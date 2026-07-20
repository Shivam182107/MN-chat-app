import api from "../api/axiosInterceptor";

export function getSenderDetails(LoggedUser, UsersArray, isGroupChat) {
  if (!LoggedUser || isGroupChat || !UsersArray) return;
  return UsersArray[0].fullname.firstname == LoggedUser.fullname.firstname
    ? UsersArray[1]
    : UsersArray[0];
}
export async function getOrMakeChat(
  userId,
  isGroupChat,
  chat,
  setselectedChat,
  chatDetails,
) {
  // console.log(userId);
  try {
    if (isGroupChat) {
      setselectedChat(chat);
      return;
    }
    const isChatExist = chatDetails.find(
      (val) => !val.isGroupChat && val._id === chat._id,
    );
    if (isChatExist) {
      setselectedChat(isChatExist);
      return;
    }

    if (userId && userId != " ") {
      const response = await api.post("/chat", { userId });
      if (response.status === 200) {
        setselectedChat(response.data);
      }
      // console.log("1to1 chat created state upadted ")
    } else {
      setselectedChat(chat);
    }
    console.log("1to1 chat created ");
  } catch (e) {
    console.log(e);
    console.log(e.message);
  }
}
export async function SearchUserChat(
  userId,
  setselectedChat,
  notificationMap,
  handleDeleteNotification,
  
) {
  // console.log(userId);
  try {
    if (!userId) return false;
    const response = await api.post("/chat", { userId });
    if (response.status === 200) {
      if (notificationMap[response.data._id]) {
        handleDeleteNotification(response.data._id);
      }
      setselectedChat(response.data);
      return true;
    }
    return false ;
  } catch (e) {
    console.log(e);
    console.log(e.message);
    return false;
  }
}

export function formatDuration(sec) {
  if (!sec) return null;
  if (sec < 60) return `${sec}s`;

  const mins = Math.floor(sec / 60);
  const secs = sec % 60;

  return `${mins}m ${secs}s`;
}

export function formatDateLabel(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  const isToday = date.toDateString() === today.toDateString();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";

  if (isYesterday) return "Yesterday";

  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  }

  return date.toLocaleDateString("en-GB");
}
