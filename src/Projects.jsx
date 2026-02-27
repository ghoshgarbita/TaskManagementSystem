import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Button,
  TextField
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { db, auth } from "./firebase"; // adjust path if needed
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Projects() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleCreateProject = async () => {
    if (!title.trim()) {
      alert("Project title is required");
      return;
    }
    try {
      await addDoc(collection(db, "projects"), {
        name: title,
        description: description,
        userId: auth.currentUser.uid,
        members: [auth.currentUser.uid], // 🔥 VERY IMPORTANT
        createdAt: serverTimestamp()
      });
        // Reset fields
      setTitle("");
      setDescription("");
      // Go back to dashboard
      navigate("/projectlist");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#0f172a",
        position: "relative"
      }}
    >
      <Card
        sx={{
          width: "550px",
          height: "400px",
          color: "white",
          bgcolor: "#3f51a02e",
          boxShadow: 6,
          borderRadius: 3
        }}
      >
        <CardContent>
          <Typography
            sx={{ fontWeight: "bold", color: "white", fontSize: 22 }}
          >
            Add Project
          </Typography>

          <br />
          <Divider sx={{ bgcolor: "gray" }} />
          <br />

          <Typography ml={2} fontSize={14}>
            PROJECT TITLE
          </Typography>

          <TextField
            fullWidth
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="add your project title"
            margin="normal"
            InputProps={{ style: { color: "white" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
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

          <Typography ml={3}>Description</Typography>

          <TextField
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details about your project requirements..."
            margin="normal"
            InputProps={{ style: { color: "white" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
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

          <br />
          <br />

          <Box ml={35} sx={{ display: "flex", gap: 3 }}>
            <Button onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>

            <Button
              onClick={handleCreateProject}
              sx={{ bgcolor: "#2563eb", color: "white" }}
            >
              Create Project
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
