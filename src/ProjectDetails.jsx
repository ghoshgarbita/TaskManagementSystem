import { Box,Typography,Drawer,List,ListItemButton,ListItemIcon,ListItemText,AppBar,Toolbar,Avatar,IconButton,Button,Table,TableBody,TableCell,TableContainer,
TableHead,
  TableRow,
  Paper,
  Chip} from "@mui/material";

import FolderIcon from "@mui/icons-material/Folder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const drawerWidth = 230;

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); // projectId
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      // Fetch project details
      const projectRef = doc(db, "projects", id);
      const projectSnap = await getDoc(projectRef);
      if (projectSnap.exists()) {
        setProject(projectSnap.data());
      }
      // Fetch tasks under this project
      const q = query(
        collection(db, "tasks"),
        where("projectId", "==", id)
      );
      const snapshot = await getDocs(q);
      const projectTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setTasks(projectTasks);
    });

    return () => unsubscribe();
  }, [id]);

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
            borderRight: "1px solid #1b1f25a6"
          }
        }}
      >
        <Typography fontSize={20} fontWeight="bold" sx={{ pl: 2, pt: 2 }}>
          TaskFlow
        </Typography>

        <Typography sx={{ color: "gray", pl: 2 }}>
          Professional suite
        </Typography>

        <List>
          {[
            { text: "My Tasks", icon: <CheckCircleIcon />, path: "/dashboard" },
            { text: "Projects", icon: <FolderIcon />, path: "/projectlist" },
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
        
        


      </Drawer>

      {/* MAIN CONTENT */}
      <Box sx={{ flexGrow: 1 }}>

        {/* TOP BAR */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "#020617",
            borderBottom: "1px solid #1e293b"
          }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton>
              <NotificationsIcon sx={{ color: "white" }} />
            </IconButton>
            <Typography sx={{ mx: 2 }}>Garbita Ghosh</Typography>
            <Avatar sx={{ width: 32, height: 32 }}>G</Avatar>
          </Toolbar>
        </AppBar>

        {/* PROJECT CONTENT */}
        <Box sx={{ p: 4 }}>

          {project && (
            <>
              <Typography
                fontSize={26}
                fontWeight="bold"
                color="white"
              >
                {project.name}
              </Typography>

              <Typography
                color="#94a3b8"
                sx={{ mb: 3 }}
              >
                {project.description}
              </Typography>
            </>
          )}

          <Button
            variant="contained"
            sx={{ bgcolor: "#2563eb", mb: 3 }}
            onClick={() => navigate(`/newTask/${id}`)}
          >
            + Add Task
          </Button>

          <Button
  variant="outlined"
  sx={{ ml: 2 , bgcolor:"#2563eb", color:"white",mb:3}}
  onClick={() => navigate(`/team/${id}`)}
>
  View Team
</Button>
          

          {/* TASK TABLE */}
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
                  {["TASK NAME", "PRIORITY", "STATUS"].map((head) => (
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
                {tasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell sx={{ color: "white" }}>
                      {task.title}
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

                    <TableCell>
                      <Chip
                        label={task.status}
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

            {tasks.length === 0 && (
              <Box textAlign="center" py={2}>
                <Typography sx={{ color: "gray" }}>
                  No tasks added to this project yet.
                </Typography>
              </Box>
            )}
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}
