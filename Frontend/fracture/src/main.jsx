import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import AuthProvider from "../src/Context/Authcontext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(

    <AuthProvider>
    <ChakraProvider> 
      <App />
    </ChakraProvider>
    </AuthProvider>
   
  
)
