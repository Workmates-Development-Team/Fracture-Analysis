import { Button } from "./Components/ui/button"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Signup/Login";
import { AuthGuard } from "./Guards/Authguard";
import Home from "./Pages/Dashboard/Home";


function App() {
 

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={
          <AuthGuard>
            <Home/>
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
