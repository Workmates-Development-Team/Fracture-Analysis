import { Button } from "./Components/ui/button"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Signup/Login";
import { AuthGuard } from "./Guards/Authguard";

import { GuestGuard } from "./Guards/Guestguard";
import Dashboard from "./Pages/Dashboard";



function App() {
 

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={
          
          <AuthGuard>
            
            <Dashboard/>
          </AuthGuard>
        }
        >
          
        </Route>
      <Route
          path="/login"
          element={
            <GuestGuard>
              <Login/>
            </GuestGuard>
          }
        />
      </Routes>
     </Router>
     
    </>
  )
}

export default App
