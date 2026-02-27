
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem
} from "@mui/material";

import AddTaskIcon from "@mui/icons-material/AddTask";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Newtask() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("open");
  const [dueDate, setDueDate] = useState("");

  const handleCreateTask = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("User not logged in");
      return;
    }

    if (!title) {
      alert("Task title is required");
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        priority,
        status,
        dueDate,
        userId: user.uid,
         projectId: id ? id : null, 
        createdAt: serverTimestamp()
      });

      alert("Task Created Successfully");

      //  Navigate correctly
      if (id) {
        navigate(`/project/${id}`);
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Error adding task:", error);
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
          height: "570px",
          color: "white",
          bgcolor: "#3f51a02e",
          boxShadow: 6,
          borderRadius: 3
        }}
      >
        <CardContent>
          <Typography sx={{ fontWeight: "bold", color: "white", fontSize: 22 }}>
            Add New Task
          </Typography>

          <br />
          <Divider sx={{ bgcolor: "gray" }} />
          <br />

          <Typography ml={2} fontSize={14}>
            TASK TITLE
          </Typography>

          <TextField
            fullWidth
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Design Q4 Marketing Assets"
            margin="normal"
            InputProps={{ style: { color: "white" } }}
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
    },}}
          />

          <Typography ml={2}>DESCRIPTION</Typography>

          <TextField
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details about your project requirements..."
            margin="normal"
            InputProps={{ style: { color: "white" } }}
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
    },}}
          />

          <Box sx={{ display: "flex", gap: 20 }}>
            <Typography ml={2}>PRIORITY LEVEL</Typography>
            <Typography>STATUS</Typography>
          </Box>

          <br />

          <Box sx={{ display: "flex", gap: 3 }}>
            <Button
              size="small"
              variant={priority === "Low" ? "contained" : "outlined"}
              onClick={() => setPriority("Low")}
            >
              Low
            </Button>

            <Button
              size="small"
              variant={priority === "Medium" ? "contained" : "outlined"}
              onClick={() => setPriority("Medium")}
            >
              Medium
            </Button>

            <Button
              size="small"
              variant={priority === "High" ? "contained" : "outlined"}
              onClick={() => setPriority("High")}
            >
              High
            </Button>

            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: "white" }}>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
                sx={{ color: "white",   "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",   // default border
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",    // hover border
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "sky",   // focused border
      }, }}
              >
                <MenuItem value="open">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Typography ml={2} mt={2}>
            DUE DATE
          </Typography>

          <TextField
            type="date"
            fullWidth
            size="small"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            margin="normal"
            InputProps={{ style: { color: "white" } }}
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
    },}}
          />

          <br />
          <Divider sx={{ bgcolor: "gray" }} />
          <br />

          <Box ml={35} sx={{ display: "flex", gap: 3 }}>
            <Button onClick={() => navigate(-1)}>Cancel</Button>

            <Button
              onClick={handleCreateTask}
              startIcon={<AddTaskIcon />}
              sx={{ bgcolor: "#2563eb", color: "white" }}
            >
              Create Task
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
