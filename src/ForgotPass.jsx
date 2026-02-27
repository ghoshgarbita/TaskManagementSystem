import { useState } from "react";
import { sendPasswordResetEmail,getAuth } from "firebase/auth";
import { auth } from "./firebase";
import { TextField, Button, Box, Typography, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  
  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset email sent successfully!");
      navigate("/forgotpassword")
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#0f172a",
        position: "relative",
        
      }}>

      <Typography variant="h5" sx={{
          color: "white",
          fontWeight: "bold",
          fontSize: 28,
          position: "absolute",
          top: 120,
          left: "50%",
          transform: "translateX(-50%)",
        }}>Forgot Password</Typography>

        {/* <Typography sx={{color:"white"}}>Enter your email here</Typography> */}

        <Card sx={{bgcolor:"#3f51a02e", width:"350px",height:"300px",borderRadius:"10px"}}>

          <CardContent>
            
            <Typography color="white">Email address</Typography>

            <TextField
                label="Enter your email"
                margin="normal"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": {
                borderColor: "#94a3b8",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#38bdf8",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#94a3b8",
            },
          }}
      /> 
      <br /><br />
      <Box display="flex" gap={3}>

      <Button  variant="contained" onClick={handleReset}>
        Send Reset Link
      </Button>

      <Button sx={{ bgcolor: "#5652525e", color: "white"}} onClick={()=>navigate("/")}>Cancel</Button>
      </Box>
      </CardContent>
      

  </Card>
    </Box>
  );
};

export default ForgotPass;
