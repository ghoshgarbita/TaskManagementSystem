import {app} from "./firebase";
import {getAuth,GoogleAuthProvider,signInWithPopup,GithubAuthProvider,signInWithEmailAndPassword} from "firebase/auth";
import { CssBaseline } from "@mui/material";

import {
  Box,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  Button,
  Divider,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider();
const  githubProvider = new GithubAuthProvider();

const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Logged in user:", userCredential.user);
      alert("Login successful!");
      navigate("/dashboard")
    } catch (error) {
      alert(error.message);
    } 
  };

const signupWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google user:", result.user);
    alert("Login successful!"); 
    navigate("/dashboard");  // ✅ redirect after success
  } catch (error) {
    console.log("Google Error:", error.message);
  }
};


const signupWithGithub = async() => {
  try{
  const result = await signInWithPopup(auth,githubProvider);
  console.log("Github user:",result.user);
  alert("Login successful!");
  navigate("/dashboard")
  }catch(error){
    console.log("Github user: ",error.message)
  }
}
  return (
    <>
    <CssBaseline />

    <Box 
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        
        bgcolor: "#0f172a",
        position: "relative",
        flexDirection:"column"
      }}
    >


      {/* App Title */}
      
      <Typography
        sx={{
          color: "white",
          fontWeight: "bold",
          fontSize: 22,
          position: "absolute",
          top: 30,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        TaskFlow
      </Typography>



      {/* Card */}
      <Card
        sx={{
          width: "380px",
          height: "570px",
          color: "white",
          bgcolor: "#3f51a02e",
          boxShadow: 6,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography fontWeight="bold" align="center" fontSize={22}>
            Welcome back
          </Typography>


          <Typography align="center" fontSize={14} mb={3} color="gray">
            Enter your details to manage your tasks.
          </Typography>

          {/* Email */}
          <Typography fontSize={14} color="white">
            Email address
          </Typography>

          <TextField
          onChange={(e)=>setEmail(e.target.value)}
          value={email}
            fullWidth
            label="Email address"
            variant="outlined"
            margin="normal"
        
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
          {/* Password */}
          <Typography fontSize={14} color="white" mt={2}>
            Password
          </Typography>

          <TextField
            fullWidth
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"

            InputProps={{
              endAdornment: (
                <IconButton edge="end" sx={{ color: "#94a3b8" }}>
                  <VisibilityIcon />
                </IconButton>
              ),
            }}

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

          <Typography
            align="right"
            color="#38bdf8"
            fontSize={13}
            sx={{ cursor: "pointer", mt: 1 }}
          >
            <Button onClick={() => navigate("/forgotpassword")}>
            Forgot?
            </Button>

          </Typography>


          <Button
            onClick={handleLogin}
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#38bdf8",
              color: "black",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#0ea5e9",
              },
            }}
          >
            Sign in
          </Button>

          <Divider sx={{ my: 3, color: "#e2eaf5cf", fontSize: 12 }}>
            OR CONTINUE WITH
          </Divider>

          <Box display="flex" gap={2}>

            <Button
            onClick={(signupWithGoogle)}
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon/>}
              sx={{ color: "white", borderColor: "#334155" }}
            >
              Google
            </Button>

            <Button
            onClick={(signupWithGithub)}
              fullWidth
              variant="outlined"
              startIcon={<GitHubIcon />}
              sx={{ color: "white", borderColor: "#334155" }}
            >
              Github
            </Button>


          </Box>

          <Typography align="center" fontSize={12} mt={3} color="gray">
            New here?{" "}
            <span style={{ color: "#38bdf8", cursor: "pointer" }}>
              <Button onClick={()=>navigate("/createaccount")}>
              Create an account?
              </Button>
            </span>
          </Typography>


        </CardContent>
      </Card>


      {/* Footer */}
      <Box
        sx={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 3,
        }}
      >


        <Typography fontSize={13} color="gray">
          Privacy Policy
        </Typography>

        <Typography fontSize={13} color="gray">
          Terms of Service
        </Typography>
        
        <Typography fontSize={13} color="gray">
          Help Center
        </Typography>

      </Box>


    </Box>
    </>
  );
}
