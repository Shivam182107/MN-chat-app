import React from "react";
import { getSenderDetails } from "../config/ChatLogic";
import { useContext } from "react";
import { chatContext } from "../context/ChatContext";
import { authContext } from "../context/AuthContext";


export function handelSelectGroupMember(sender, setselectedGroupMember) {
  // console.log(sender, "s.............")
  setselectedGroupMember((prev) => {
    let arr = [...prev];
    if (arr.some((val) => val._id === sender._id)) {
      arr = arr.filter((item) => item._id != sender._id);
    } else {
      arr.push(sender);
    }
    return arr;
  });
}
const MemberRow = React.memo(function MembersRow({
  member,
  isSelected,
  onSelect,
  sender,
  setselectedGroupMember,
}) {
  if (!member||!sender) return null;
  return (
    <>
      <div
        
        className={`p-3  flex rounded items-center hover:bg-[#2E2F2F] rounded-2xl animate-fade-in-up cursor-pointer transition ${member.isGroupChat ? "hidden" : ""}
              ${isSelected ? "bg-green-300 hover:bg-green-300" : "bg-[#161717] text-white"}
              `}
        onClick={() => {
          onSelect(sender, setselectedGroupMember);
        }}
      >
        <div className={`rounded-[50%] w-12 flex items-center`}>
          <img src={sender?.pic} alt="" className="w-full rounded-[50%] " />
        </div>
        <div className=" w-full pl-2 flex flex-col justify-center ">
          <p>{sender?.fullname?.firstname}</p>
          {/* <p>{val.fullname?.firstname}</p> */}
        </div>

        <input
          type="checkbox"
          className="w-5 h-5  border-2 border-gray-400 rounded cursor-pointer "
          checked={isSelected}
          onClick={(e) => e.stopPropagation()}
          onChange={() => onSelect(sender, setselectedGroupMember)}
        />
      </div>
    </>
  );
});
const GroupMemberList = ({ FillterUsersBySearch }) => {
  const {
    chatDetails,
    groupMemberArray,
    selectedGroupMember,
    setselectedGroupMember,
  } = useContext(chatContext);
  const { User } = useContext(authContext);

  return (
    <>
      <div className="flex-1  overflow-y-auto space-y-2 pr-2 custom-scrollbar pl-2 pb-28 w-full   ">
        
        {FillterUsersBySearch ? (
          <>
            {FillterUsersBySearch.map((val) => {
              if (val.isGroupChat) return null;
              let isSelected = selectedGroupMember.some(
                (item) => item._id === val?._id,
              );
              return (
                <MemberRow
                  member={val}
                  isSelected={isSelected}
                  sender={val}
                  onSelect={handelSelectGroupMember}
                  setselectedGroupMember={setselectedGroupMember}
                  key={val._id}
                />
              );
            })}
           {FillterUsersBySearch.length === 0 && (
            <p className="text-gray-500 ml-3 text-sm">No matches found</p>
          )}
          </>
        ) : (
          <>
          {chatDetails &&chatDetails.length>0&&<p className="text-gray-500 ml-3">Frequently contacted </p>}
            {chatDetails &&
              chatDetails.map((val, idx) => {
                if (val.isGroupChat) return null;
                let sender = getSenderDetails(User, val.users, val.isGroupChat);
                let isSelected = selectedGroupMember.some(
                  (item) => item._id === sender?._id,
                );
                return (
                  <MemberRow
                    member={val}
                    isSelected={isSelected}
                    sender={sender}
                    onSelect={handelSelectGroupMember}
                    setselectedGroupMember={setselectedGroupMember}
                    key={val._id}
                  />
                );
              })}

            <p className="text-gray-500 ml-3">Contacts you know</p>

            {groupMemberArray &&
              groupMemberArray.map((val, idx) => {
                if (val.isGroupChat) return null;
                let isSelected = selectedGroupMember.some(
                  (item) => item._id === val?._id,
                );
                return (
                  <MemberRow
                    member={val}
                    isSelected={isSelected}
                    sender={val}
                    onSelect={handelSelectGroupMember}
                    setselectedGroupMember={setselectedGroupMember}
                    key={val._id}
                  />
                );
              })}
          </>
        )}
      </div>
    </>
  );
};

export default GroupMemberList;
