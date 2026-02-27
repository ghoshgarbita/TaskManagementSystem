import { Box, Typography, Card, CardContent, TextField, Button, IconButton } from "@mui/material";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase"; 
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function CreateAccount(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const createUser = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            //  CREATE USER DOCUMENT IN FIRESTORE
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                name: email.split("@")[0], // simple default name
                role: "Team Member",
                createdAt: serverTimestamp()
            });

            console.log("User created:", user);
            alert("Account created successfully!");
            navigate("/dashboard");
            } catch (error) {
            alert(error.message);
            }
    };
    
    return(
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            bgcolor: "#0f172a",
            position: "relative",
        }}>

        <Typography
        sx={{
          color: "white",
          fontWeight: "bold",
          fontSize: 22,
          position: "absolute",
          top: 50,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        TaskFlow
      </Typography>

      <Card sx={{
          width: "380px",
          height: "380px",
          color: "white",
          bgcolor: "#3f51a02e",
          boxShadow: 6,
          borderRadius: 3,
        }}>

        <CardContent>

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

          <Button
            onClick={createUser}
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
            Sign up
          </Button>

        </CardContent>

      </Card>

    </Box>
    )
}
