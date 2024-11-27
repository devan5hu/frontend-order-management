import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { clearAuthToken } from "../utils/auth";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate("/"); // Redirect to login page
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default Logout;
