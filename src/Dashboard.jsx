import {Typography,Box,Drawer,List,ListItemIcon,ListItemText,AppBar,Toolbar,TextField,Chip,Avatar,Checkbox,Button,ListItemButton,TableContainer,Paper,Table,TableHead,TableRow,TableCell,TableBody,IconButton,Divider,Popover,MenuItem,Select,FormControl,InputLabel,Menu
} from "@mui/material";

import FolderIcon from "@mui/icons-material/Folder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FilterListIcon from "@mui/icons-material/FilterList";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { db, auth } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const drawerWidth = 230;

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [sortAnchor, setSortAnchor] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [sortType, setSortType] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      setUser(user);

      const q = query(
        collection(db, "tasks"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const userTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setTasks(userTasks);
    });

    return () => unsubscribe();
  }, []);


  // PROCESSING LOGIC
  let processedTasks = [...tasks];

  // FILTER
  if (selectedPriority !== "All") {
    processedTasks = processedTasks.filter(
      (task) => task.priority === selectedPriority
    );
  }

  if (selectedStatus !== "All") {
    processedTasks = processedTasks.filter(
      (task) => task.status === selectedStatus
    );
  }

  // SEARCH
  if (searchTerm) {
    processedTasks = processedTasks.filter((task) =>
      task.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // SORT
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  if (sortType === "dueAsc") {
    processedTasks.sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    );
  }

  if (sortType === "dueDesc") {
    processedTasks.sort(
      (a, b) => new Date(b.dueDate) - new Date(a.dueDate)
    );
  }

  if (sortType === "priority") {
    processedTasks.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }

  const tasksToShow = showAll
    ? processedTasks
    : processedTasks.slice(0, 5);

  const remainingTasks = tasks.filter(
    (task) => task.status !== "done"
  ).length;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#020617" }}>
      
      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#020617",
            color: "white",
            borderRight: "1px solid #1e293b",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }
        }}
      >
        <Box>
          <Typography fontSize={20} fontWeight="bold" sx={{ pl: 2, pt: 2 }}>
            TaskFlow
          </Typography>

          <Typography sx={{ color: "gray", pl: 2 }}>
            Professional suite
          </Typography>

          <List>
            {[
              { text: "My Tasks", icon: <CheckCircleIcon />, path: "/dashboard" },
              { text: "Projects", icon: <FolderIcon />, path:"/projectlist" },
              { text: "Schedule", icon: <CalendarMonthIcon /> },
              { text: "Settings", icon: <SettingsIcon /> }
            ].map((item) => (
              <ListItemButton
                key={item.text}
                component={NavLink}
                to={item.path}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#1e293b" }
                }}
              >
                <ListItemIcon sx={{ color: "#94a3b8" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>

          {/* ORIGINAL BUTTONS PRESERVED */}
          <Button
            onClick={() => navigate("/newtask")}
            variant="contained"
            sx={{
              bgcolor: "#2563eb",
              textTransform: "none",
              p: 1,
              width: "200px",
              marginLeft: "15px",
              marginBottom: "10px",
              height: "35px"
            }}
          >
            + New Task
          </Button>

          <Button
            onClick={() => navigate("/")}
            variant="contained"
            sx={{
              bgcolor: "#2563eb",
              textTransform: "none",
              p: 1,
              width: "200px",
              marginLeft: "15px",
              marginBottom: "10px",
              height: "35px"
            }}
          >
            Login Page
          </Button>

          <Button
            onClick={() => {
              if (!selectedTaskId) {
                alert("Please select a task first");
                return;
              }
              navigate(`/edittask/${selectedTaskId}`);
            }}
            variant="contained"
            sx={{
              bgcolor: "#2563eb",
              textTransform: "none",
              p: 1,
              width: "200px",
              marginLeft: "15px",
              height: "35px"
            }}
          >
            + Edit task
          </Button>

          <Button
            onClick={() => navigate("/projects")}
            variant="contained"
            sx={{
              bgcolor: "#2563eb",
              textTransform: "none",
              p: 1,
              width: "200px",
              marginLeft: "15px",
              height: "35px",
              marginTop: "12px"
            }}
          >
            + Create Project
          </Button>
        </Box>

        {/* PROFILE */}
        <Box sx={{ p: 2 }}>
          <Divider sx={{ bgcolor: "#1e293b", mb: 2 }} />
          <Box display="flex" alignItems="center" gap={1}>

            <Avatar>
              {user?.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : user?.email?.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography fontSize={14}>
                {user?.displayName || user?.email}
              </Typography>
              <Typography fontSize={12} color="gray">
                Admin
              </Typography>
            </Box>

          </Box>
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "#020617",
            borderBottom: "1px solid #1e293b"
          }}
        >
          <Toolbar>
            <SearchIcon sx={{ color: "#94a3b8", mr: 1 }} />
            <TextField
              placeholder="Search tasks..."
              variant="standard"
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: { color: "white", width: 300 }
              }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <IconButton>
              <NotificationsIcon sx={{ color: "white" }} />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4 }}>
          <Typography fontSize={26} fontWeight="bold" color="white">
            My Tasks
          </Typography>

          <Typography
            color="#94a3b8"
            mb={3}
            sx={{ display: "flex", alignItems: "center" }}
          >
            You have{" "}
            <span style={{ color: "#38bdf8" }}>
              {remainingTasks}
            </span>{" "}
            tasks remaining this week.

            <Button
              variant="contained"
              sx={{ ml: "auto", bgcolor: "#5652525e", color: "white" }}
              startIcon={<FilterListIcon />}
              onClick={(e) => setFilterAnchor(e.currentTarget)}
            >
              Filter
            </Button>

            <Button
              variant="contained"
              sx={{ ml: 2, bgcolor: "#5652525e", color: "white" }}
              startIcon={<SwapVertIcon />}
              onClick={(e) => setSortAnchor(e.currentTarget)}
            >
              Sort
            </Button>
          </Typography>

          {/* FILTER POPOVER */}
          <Popover
            open={Boolean(filterAnchor)}
            anchorEl={filterAnchor}
            onClose={() => setFilterAnchor(null)}
          >
            <Box p={2} width={200}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={selectedPriority}
                  label="Priority"
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Popover>


          {/* SORT MENU */}
          <Menu
            anchorEl={sortAnchor}
            open={Boolean(sortAnchor)}
            onClose={() => setSortAnchor(null)}
          >
            <MenuItem onClick={() => setSortType("dueAsc")}>
              Due Date (Nearest)
            </MenuItem>
            <MenuItem onClick={() => setSortType("dueDesc")}>
              Due Date (Latest)
            </MenuItem>
            <MenuItem onClick={() => setSortType("priority")}>
              Priority
            </MenuItem>
          </Menu>

          {/* TABLE */}
          <TableContainer
            component={Paper}
            sx={{
              bgcolor: "#020617",
              border: "1px solid #1e293b",
              borderRadius: 2
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["TASK NAME", "PRIORITY", "DUE DATE", "STATUS"].map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        color: "#94a3b8",
                        fontSize: 12,
                        borderBottom: "1px solid #1e293b"
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tasksToShow.map((task) => (
                  <TableRow
                    key={task.id}
                    hover
                    onClick={() => setSelectedTaskId(task.id)}
                    sx={{
                      cursor: "pointer",
                      bgcolor:
                        selectedTaskId === task.id
                          ? "#1e293b"
                          : "transparent"
                    }}
                  >
                    <TableCell sx={{ color: "white" }}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Checkbox sx={{ color: "white" }} size="small" />
                        {task.title}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={task.priority}
                        size="small"
                        color={
                          task.priority === "High"
                            ? "error"
                            : task.priority === "Medium"
                            ? "info"
                            : "success"
                        }
                      />
                    </TableCell>

                    <TableCell sx={{ color: "#cbd5f5" }}>
                      {task.dueDate || "No date"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          task.status === "open"
                            ? "To Do"
                            : task.status === "in-progress"
                            ? "In Progress"
                            : "Done"
                        }
                        size="small"
                        variant="outlined"
                        color={
                          task.status === "done"
                            ? "success"
                            : task.status === "open"
                            ? "primary"
                            : "warning"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box textAlign="center" py={1}>
              <Button
                size="small"
                color="info"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : "View All Tasks"}
              </Button>
            </Box>

          </TableContainer>

        </Box>
      </Box>
    </Box>
  );
}