import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import AuthProvider from './Context/Authcontext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
     <ChakraProvider>
    <App />
    </ChakraProvider>
  </AuthProvider>,
)
