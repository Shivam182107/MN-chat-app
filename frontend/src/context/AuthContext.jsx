import React, { createContext, useRef, useState } from "react";

export const authContext = createContext();
const AuthContext = ({ children }) => {
  const [User, setUser] = useState("");
  const [isScoketConnected, setisScoketConnected] = useState(false);
  let socketRef = useRef();
  return (
    <>
      <authContext.Provider
        value={{
          User,
          setUser,
          isScoketConnected, 
          setisScoketConnected,
          socketRef
        }}
      >
        {children}
      </authContext.Provider>
    </>
  );
};

export default AuthContext;
