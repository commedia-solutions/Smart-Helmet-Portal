// import React, { useMemo } from "react";
// import { Box, IconButton, Tooltip } from "@mui/material";
// import { useLocation, useNavigate } from "react-router-dom";

// import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
// import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
// import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
// import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
// import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
// import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
// import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

// import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
// import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

// import Logo from "../assets/icons/Logo.png"; // adjust path/case if needed

// const SIDEBAR_W = 60;
// const ACTIVE_YELLOW = "#FED200";

// // ✅ CONTROL THESE (size + spacing)
// const BTN = 35; // button box size
// const ICON = 20; // icon size
// const NAV_GAP = 1.15; // spacing between icons
// const NAV_TOP_OFFSET = 1.8; // space above first icon (push icons down)

// const ROUTES = [
//   { path: "/dashboard", label: "Dashboard", icon: <DashboardOutlinedIcon sx={{ fontSize: ICON }} /> },
//   { path: "/faults", label: "Faults", icon: <ReportProblemOutlinedIcon sx={{ fontSize: ICON }} /> },
//   { path: "/alerts", label: "Alerts", icon: <NotificationsActiveOutlinedIcon sx={{ fontSize: ICON }} /> },

//   { path: "/reports", label: "Reports", icon: <AssessmentOutlinedIcon sx={{ fontSize: ICON }} /> },
//   { path: "/iam", label: "IAM", icon: <AdminPanelSettingsOutlinedIcon sx={{ fontSize: ICON }} /> },
//   { path: "/users", label: "Users", icon: <PeopleOutlineOutlinedIcon sx={{ fontSize: ICON }} /> },

//   { path: "/locations", label: "Locations", icon: <PlaceOutlinedIcon sx={{ fontSize: ICON }} /> },
// ] as const;

// export default function SidebarShell() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const activePath = useMemo(() => {
//     const found = ROUTES.find((r) => location.pathname.startsWith(r.path));
//     return found?.path ?? "/dashboard";
//   }, [location.pathname]);

//   const logout = () => {
//     localStorage.removeItem("idToken");
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     navigate("/login", { replace: true });
//   };

//   const divider = (
//     <Box
//       sx={{
//         width: "62%",
//         height: "1px",
//         bgcolor: "rgba(255,255,255,0.10)",
//         my: 0.75,
//         mx: "auto",
//       }}
//     />
//   );

//   const navBtnSx = (active: boolean) => ({
//     width: BTN,
//     height: BTN,
//     borderRadius: 2,
//     color: active ? ACTIVE_YELLOW : "rgba(255,255,255,0.75)",
//     bgcolor: active ? "rgba(255,255,255,0.10)" : "transparent",
//     border: active ? "1px solid rgba(255,255,255,0.16)" : "1px solid transparent",
//     "&:hover": {
//       bgcolor: "rgba(255,255,255,0.08)",
//       borderColor: "rgba(255,255,255,0.14)",
//       color: ACTIVE_YELLOW,
//     },
//     outline: "none",
//     "&:focus": { outline: "none" },
//     "&:focus-visible": { outline: "none" },
//     "&.Mui-focusVisible": { outline: "none" },
//   });

//   return (
//     <Box
//       sx={{
//         width: SIDEBAR_W,
//         height: "100vh",
//         flexShrink: 0,
//         position: "sticky",
//         top: 0,
//         zIndex: 25,

//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         py: 1.2,

//         bgcolor: "rgba(14,14,14,0.78)",
//         backdropFilter: "blur(12px)",
//         borderRight: "1px solid rgba(255,255,255,0.10)",
//       }}
//     >
//       {/* Logo (no card/box look) */}
//       <Box
//         component="img"
//         src={Logo}
//         alt="C-smart"
//         sx={{
//           width: 44,
//           height: 44,
//           objectFit: "contain",
//           mb: 0.5,
//           userSelect: "none",
//           pointerEvents: "none",
//         }}
//       />

//       {/* Nav items */}
//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           gap: NAV_GAP,
//           mt: NAV_TOP_OFFSET,
//           width: "100%",
//           alignItems: "center",
//         }}
//       >
//         {ROUTES.map((item) => {
//           const active = item.path === activePath;

//           return (
//             <React.Fragment key={item.path}>
//               <Tooltip title={item.label} placement="right">
//                 <IconButton disableRipple onClick={() => navigate(item.path)} sx={navBtnSx(active)}>
//                   {item.icon}
//                 </IconButton>
//               </Tooltip>

//               {/* dividers like Atlas */}
//               {item.path === "/alerts" ? divider : null}
//               {item.path === "/users" ? divider : null}

//               {/* ✅ Report Issue AFTER locations (and no divider above it) */}
//               {item.path === "/locations" ? (
//                 <Tooltip title="Report issue" placement="right">
//                   <IconButton
//                     disableRipple
//                     onClick={() => console.log("report issue")}
//                     sx={navBtnSx(false)}
//                   >
//                     <HelpOutlineOutlinedIcon sx={{ fontSize: ICON }} />
//                   </IconButton>
//                 </Tooltip>
//               ) : null}
//             </React.Fragment>
//           );
//         })}
//       </Box>

//       {/* Bottom logout (icon only, yellow, NO box) */}
//       <Box sx={{ pb: 4.1, width: "100%", display: "flex", justifyContent: "center" }}>
//         <Tooltip title="Logout" placement="right">
//           <IconButton
//             disableRipple
//             onClick={logout}
//             sx={{
//               width: BTN,
//               height: BTN,
//               borderRadius: 2,
//               color: ACTIVE_YELLOW,
//               bgcolor: "transparent",
//               border: "1px solid transparent",
//               "&:hover": {
//                 bgcolor: "rgba(254,210,0,0.10)",
//                 borderColor: "rgba(254,210,0,0.28)",
//               },
//               outline: "none",
//               "&:focus": { outline: "none" },
//               "&:focus-visible": { outline: "none" },
//               "&.Mui-focusVisible": { outline: "none" },
//             }}
//           >
//             <LogoutOutlinedIcon sx={{ fontSize: ICON }} />
//           </IconButton>
//         </Tooltip>
//       </Box>
//     </Box>
//   );
// }

// src/Components/SidebarShell.tsx
import React, { useMemo } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import Logo from "../assets/icons/Logo.png"; // adjust path/case if needed

const SIDEBAR_W = 60;
const ACTIVE_YELLOW = "#FED200";

// ✅ CONTROL THESE (size + spacing)
const BTN = 35; // button box size
const ICON = 20; // icon size
const NAV_GAP = 1.15; // spacing between icons
const NAV_TOP_OFFSET = 1.8; // space above first icon (push icons down)

const ROUTES = [
  { path: "/dashboard", label: "Dashboard", icon: <DashboardOutlinedIcon sx={{ fontSize: ICON }} /> },
  { path: "/faults", label: "Faults", icon: <ReportProblemOutlinedIcon sx={{ fontSize: ICON }} /> },
  { path: "/alerts", label: "Alerts", icon: <NotificationsActiveOutlinedIcon sx={{ fontSize: ICON }} /> },
  { path: "/reports", label: "Reports", icon: <AssessmentOutlinedIcon sx={{ fontSize: ICON }} /> },
  { path: "/iam", label: "IAM", icon: <AdminPanelSettingsOutlinedIcon sx={{ fontSize: ICON }} /> },
  { path: "/users", label: "Users", icon: <PeopleOutlineOutlinedIcon sx={{ fontSize: ICON }} /> },
  { path: "/locations", label: "Locations", icon: <PlaceOutlinedIcon sx={{ fontSize: ICON }} /> },
] as const;

export default function SidebarShell() {
  const location = useLocation();
  const navigate = useNavigate();

  const activePath = useMemo(() => {
    const found = ROUTES.find((r) => location.pathname.startsWith(r.path));
    return found?.path ?? "/dashboard";
  }, [location.pathname]);

  const logout = () => {
    // clear everything auth-related
    ["idToken", "accessToken", "refreshToken"].forEach((k) => localStorage.removeItem(k));

    // ✅ go to Landing page (hard redirect = no SPA loop)
    window.location.replace("/");
  };

  const divider = (
    <Box
      sx={{
        width: "62%",
        height: "1px",
        bgcolor: "rgba(255,255,255,0.10)",
        my: 0.75,
        mx: "auto",
      }}
    />
  );

  const navBtnSx = (active: boolean) => ({
    width: BTN,
    height: BTN,
    borderRadius: 2,
    color: active ? ACTIVE_YELLOW : "rgba(255,255,255,0.75)",
    bgcolor: active ? "rgba(255,255,255,0.10)" : "transparent",
    border: active ? "1px solid rgba(255,255,255,0.16)" : "1px solid transparent",
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.08)",
      borderColor: "rgba(255,255,255,0.14)",
      color: ACTIVE_YELLOW,
    },
    outline: "none",
    "&:focus": { outline: "none" },
    "&:focus-visible": { outline: "none" },
    "&.Mui-focusVisible": { outline: "none" },
  });

  return (
    <Box
      sx={{
        width: SIDEBAR_W,
        height: "100vh",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 25,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 1.2,
        bgcolor: "rgba(14,14,14,0.78)",
        backdropFilter: "blur(12px)",
        borderRight: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src={Logo}
        alt="C-smart"
        sx={{
          width: 44,
          height: 44,
          objectFit: "contain",
          mb: 0.5,
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* Nav */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: NAV_GAP,
          mt: NAV_TOP_OFFSET,
          width: "100%",
          alignItems: "center",
        }}
      >
        {ROUTES.map((item) => {
          const active = item.path === activePath;

          return (
            <React.Fragment key={item.path}>
              <Tooltip title={item.label} placement="right">
                <IconButton disableRipple onClick={() => navigate(item.path)} sx={navBtnSx(active)}>
                  {item.icon}
                </IconButton>
              </Tooltip>

              {item.path === "/alerts" ? divider : null}
              {item.path === "/users" ? divider : null}

              {item.path === "/locations" ? (
                <Tooltip title="Report issue" placement="right">
                  <IconButton disableRipple onClick={() => console.log("report issue")} sx={navBtnSx(false)}>
                    <HelpOutlineOutlinedIcon sx={{ fontSize: ICON }} />
                  </IconButton>
                </Tooltip>
              ) : null}
            </React.Fragment>
          );
        })}
      </Box>

      {/* Logout */}
      <Box sx={{ pb: 4.1, width: "100%", display: "flex", justifyContent: "center" }}>
        <Tooltip title="Logout" placement="right">
          <IconButton
            disableRipple
            onClick={logout}
            sx={{
              width: BTN,
              height: BTN,
              borderRadius: 2,
              color: ACTIVE_YELLOW,
              bgcolor: "transparent",
              border: "1px solid transparent",
              "&:hover": {
                bgcolor: "rgba(254,210,0,0.10)",
                borderColor: "rgba(254,210,0,0.28)",
              },
              outline: "none",
              "&:focus": { outline: "none" },
              "&:focus-visible": { outline: "none" },
              "&.Mui-focusVisible": { outline: "none" },
            }}
          >
            <LogoutOutlinedIcon sx={{ fontSize: ICON }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

