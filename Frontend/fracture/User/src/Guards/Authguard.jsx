import React, { useState, useContext, useEffect } from "react";
import { AuthContext, useAuth } from "../Context/Authcontext";
import { useNavigate } from "react-router-dom";

export const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading){
     if( !user) {
        navigate("/login");
      }
    } 
  }, [user,loading]);

  if (loading) {
    return <div>Loading...</div>;
    
  }

  return <div>{children}</div>;
};
