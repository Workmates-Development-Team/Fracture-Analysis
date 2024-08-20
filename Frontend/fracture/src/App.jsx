import Navigation from "./Components/Navigation";
import Home from "./Pages/Home";
import Report from "./Pages/Report";
import Signup from "./Pages/Signup/Signup";
import { GuestGuard } from "./Guards/Guestguard";
import { AuthGuard } from "./Guards/Authguard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Pages/Signup/Register";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<GuestGuard><Signup /></GuestGuard>} />
          <Route path="/register" element={<GuestGuard><Register/></GuestGuard>} />
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <Navigation />
              </AuthGuard>
            }
          >
            {/* Nested routes under the Navigation component */}
            <Route index element={<Home />} />
            <Route path="report" element={<Report />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
