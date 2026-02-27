import {Box,Drawer,Typography,List,ListItemButton,ListItemIcon,ListItemText,TextField,Button,Divider,Card,CardContent,Avatar,InputAdornment
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { db } from "./firebase";
import {doc,getDoc,updateDoc,arrayUnion,collection,query,where,getDocs} from "firebase/firestore";

const drawerWidth = 240;

export default function Team() {
  const { id } = useParams();

  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");

  //  FETCH PROJECT MEMBERS
  useEffect(() => {
  if (!id) return;

  const fetchMembers = async () => {
      const projectSnap = await getDoc(doc(db, "projects", id));
      if (!projectSnap.exists()) return;
      const projectData = projectSnap.data();
      const memberIds = projectData.members || [];
      if (memberIds.length === 0) return;
      const q = query(
        collection(db, "users"),
        where("uid", "in", memberIds)
      );
      const querySnap = await getDocs(q);
      const users = querySnap.docs.map((doc) => doc.data());
      setMembers(users);
    };
    fetchMembers();
  }, [id]);

  //  INVITE MEMBER BY EMAIL
  const handleInvite = async () => {
  if (!id) {
    alert("Project ID missing");
    return;
  }
  if (!inviteEmail) {
    alert("Enter email");
    return;
  }
  console.log("Project ID:", id);
  const q = query(
    collection(db, "users"),
    where("email", "==", inviteEmail)
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    alert("User not found");
    return;
  }
  const userData = snap.docs[0].data();
  const projectRef = doc(db, "projects", id);
  const projectSnap = await getDoc(projectRef);
  if (!projectSnap.exists()) {
    alert("Project does not exist!");
    return;
  }
  await updateDoc(projectRef, {
    members: arrayUnion(userData.uid)
  });
  setMembers(prev => [...prev, userData]);
  alert("Member added!");
  setInviteEmail(""); 
};


  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#020617" }}>

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#020617",
            color: "#e5e7eb",
            borderRight: "1px solid #1e293b",
          }
        }}
      >
        <List>
          <ListItemButton component={NavLink} to="/dashboard">
            <ListItemIcon sx={{ color: "#94a3b8" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon sx={{ color: "#94a3b8" }}>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Team" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* MAIN */}
      <Box sx={{ flexGrow: 1, p: 4, color: "white" }}>
        <Typography fontSize={22} fontWeight="bold">
          Project Team
        </Typography>

        <Divider sx={{ my: 2, borderColor: "#1e293b" }} />

        {/* INVITE SECTION */}
        <Box display="flex" gap={2} mb={3}>
          <TextField
            size="small"
            placeholder="Invite by email..."
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            sx={{ width: 250 }}
            InputProps={{
              sx: { color: "white" },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "gray" }} />
                </InputAdornment>
              )
            }}
          />

          <Button
            variant="contained"
            startIcon={<PersonAddAltIcon />}
            onClick={handleInvite}
            sx={{ bgcolor: "#2563eb" }}
          >
            Invite
          </Button>
        </Box>

        {/* MEMBERS LIST */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 3
          }}
        >
          {members.map((m) => (
            <Card
              key={m.uid}
              sx={{
                bgcolor: "#020617",
                border: "1px solid #1e293b",
                color: "white",
                borderRadius: 3
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar>
                    {m.name?.charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography fontWeight="bold">
                      {m.name}
                    </Typography>
                    <Typography fontSize={12} color="gray">
                      {m.role}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
