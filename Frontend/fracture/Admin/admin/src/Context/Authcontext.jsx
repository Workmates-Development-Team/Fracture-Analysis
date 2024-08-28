import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../Axioshelper/Axiosinstance.js";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/admin/profile");
      console.log(data?.data);
      setUser(data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem("token");
   
    
  };

  useEffect(() => {
   
    
      getProfile();
    
  }, []);

  return (
    <AuthContext.Provider
      value={{ loading, user, setUser, getProfile, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");

  return context;
};
