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
import { useEffect, useState } from "react";

import { db } from "./firebase"; // adjust path
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams(); // get task id

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("open");
  const [dueDate, setDueDate] = useState("");

  //  FETCH EXISTING TASK DATA
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const docRef = doc(db, "tasks", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setTitle(data.title || "");
          setDescription(data.description || "");
          setPriority(data.priority || "Low");
          setStatus(data.status || "open");
          setDueDate(data.dueDate || "");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    if (id) fetchTask();
  }, [id]);

  // UPDATE TASK FUNCTION
  const handleUpdateTask = async () => {
    if (!id) {
      alert("Task ID not found");
      return;
    }

    try {
      const docRef = doc(db, "tasks", id);

      await updateDoc(docRef, {
        title,
        description,
        priority,
        status,
        dueDate
      });

      alert("Task Updated Successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };


  return (
    <Box bgcolor="gray"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
       minHeight:"100vh",
        // minWidth: "100vw",
        bgcolor: "#0f172a",
        overflowX: "hidden"
      }}
    >
      <Card
        sx={{

          width: "100%",
          maxWidth: "550px",
          height: "600px",
          color: "white",
          bgcolor: "#3f51a02e",
          boxShadow: 6,
          borderRadius: 3
        }}
      >
        <CardContent>
          <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
            Edit Task
          </Typography>

          <br />
          <Divider sx={{ bgcolor: "gray" }} />
          <br />

          {/* TITLE */}
          <Typography ml={2} fontSize={14}>
            TASK TITLE
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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

          {/* DESCRIPTION */}
          <Typography ml={2}>DESCRIPTION</Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

          {/* PRIORITY + STATUS */}
          <Box sx={{ display: "flex", gap: 20 }}>
            <Typography ml={2}>PRIORITY LEVEL</Typography>
            <Typography>STATUS</Typography>
          </Box>

          <br />

          <Box sx={{ display: "flex", gap: 3 }}>
            <Button
              variant={priority === "Low" ? "contained" : "outlined"}
              onClick={() => setPriority("Low")}
            >
              Low
            </Button>

            <Button
              variant={priority === "Medium" ? "contained" : "outlined"}
              onClick={() => setPriority("Medium")}
            >
              Medium
            </Button>

            <Button
              variant={priority === "High" ? "contained" : "outlined"}
              onClick={() => setPriority("High")}
            >
              High
            </Button>

            <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
                sx={{
                  color: "white", "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",   // default border
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",    // hover border
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "sky",   // focused border
                  },
                }}

              >
                <MenuItem value="open">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* DUE DATE */}
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
          <Divider sx={{ bgcolor: "gray" }} />
          <br />

          <Box ml={35} sx={{ display: "flex", gap: 3 }}>
            <Button onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>

            <Button
              onClick={handleUpdateTask}
              startIcon={<AddTaskIcon />}
              sx={{ bgcolor: "blue", color: "white" }}
            >
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
