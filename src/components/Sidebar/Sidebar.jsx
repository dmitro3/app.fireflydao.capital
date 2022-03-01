import { Drawer } from "@material-ui/core";
import NavContent from "./NavContent.jsx";
 
function Sidebar() {
  return (
    <div className="sidebar" id="sidebarContent">
      <Drawer variant="permanent" anchor="left" className="sidebarContainer">
        <NavContent />
      </Drawer>
    </div>
  );
}

export default Sidebar;
