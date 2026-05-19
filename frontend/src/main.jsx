import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import AuthContext from './context/AuthContext.jsx'
import ChatContext from './context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* <StrictMode> */}
      <AuthContext>   {/*  userContext */}
        <ChatContext>     
        <App />
        </ChatContext>
      </AuthContext>
    {/* </StrictMode> */}
  </BrowserRouter>,
)
