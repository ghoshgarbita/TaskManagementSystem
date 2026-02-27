import {Box,Typography,Drawer,List,ListItemButton,ListItemIcon,ListItemText,AppBar,Toolbar,Avatar,IconButton,Grid,Card,CardContent} from "@mui/material";

import FolderIcon from "@mui/icons-material/Folder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const drawerWidth = 230;

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [user,setUser]=useState(null);


  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    setUser(user);  

    const q = query(
      collection(db, "projects"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    const userProjects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setProjects(userProjects);
  });

  return () => unsubscribe();
}, []);


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
            borderRight: "1px solid #1e293b"
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
            { text: "Projects", icon: <FolderIcon />, path: "/projects" },
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

      {/* MAIN */}
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

            <Typography sx={{ mx: 2 }}>{user?.displayName || user?.email}</Typography>
            <Avatar sx={{ width: 32, height: 32 }}>{user?.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : user?.email?.charAt(0).toUpperCase()}
            </Avatar>
          </Toolbar>
        </AppBar>

        {/* CONTENT */}
        <Box sx={{ p: 4 }}>
          <Typography
            fontSize={26}
            fontWeight="bold"
            color="white"
            mb={3}
          >
            My Projects
          </Typography>

          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
                <Card
                  onClick={() => navigate(`/project/${project.id}`)}
                  sx={{
                    bgcolor: "#1e293b",
                    color: "white",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent>
                    <Typography fontWeight="bold" fontSize={18}>
                      {project.name}
                    </Typography>

                    <Typography
                      fontSize={14}
                      sx={{ color: "#94a3b8", mt: 1 }}
                    >
                      {project.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {projects.length === 0 && (
            <Typography sx={{ color: "gray", mt: 3 }}>
              No projects created yet.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
