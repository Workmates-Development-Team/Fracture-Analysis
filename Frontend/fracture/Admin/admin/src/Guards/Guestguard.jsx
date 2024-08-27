import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const GuestGuard = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading]);

  if (loading) {
    <div>Loading...</div>;
   
  }
  return <div>{children}</div>;
};
