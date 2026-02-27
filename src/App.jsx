import { app } from "./firebase";
import { getFirestore,collection,addDoc } from "firebase/firestore";

import { Routes,Route } from "react-router-dom";
import Login from "./Login";
import Dasboard from "./Dashboard";
import Newtask from "./NewTask";
// import Tasks from "./Tasks";
import EditTask from "./EditTask"
import Team from "./Team";
// import Dasboard2 from "./Dashboard2";
import ForgotPass from "./ForgotPass";
import CreateAccount from "./CreateAccount";
import Projects from "./Projects";
import ProjectList from "./ProjectList";
import ProjectDetails from "./ProjectDetails"


const firestore = getFirestore(app);

export default function App(){
  
  return(
    <div>
      <Routes>

        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dasboard/>}/>
        <Route path="/newTask"element={<Newtask/>}/>
        <Route path="/newTask/:id" element={<Newtask/>}/>

        {/* <Route path="/tasks" element={<Tasks/>}/> */}
        <Route path="/edittask/:id" element={<EditTask/>}/>

        {/* <Route path="/team" element={<Team/>}/> */}
        <Route path="/team/:id" element={<Team/>}/>

        {/* <Route path="/dashboard2" element={<Dasboard2/>}/> */}
        <Route path="/forgotpassword" element={<ForgotPass/>}/>
        <Route path="/createaccount" element={<CreateAccount/>}/>
        <Route path="/projects" element={<Projects/>}/>  
        <Route path="/projectlist" element={<ProjectList/>}/>
        <Route path="/project/:id" element={<ProjectDetails />}/>
        

        
      </Routes>
    </div>
  )
}