// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   InputAdornment,
//   IconButton,
//   Tooltip,
//   Popover,
// } from "@mui/material";
// import { useLocation, useNavigate } from "react-router-dom";

// import SearchIcon from "@mui/icons-material/Search";
// import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
// import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
// import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

// const TOPBAR_H = 52;
// const ACCENT = "#FED200";

// const TITLE_MAP: Record<string, string> = {
//   "/dashboard": "Dashboard",
//   "/faults": "Faults",
//   "/alerts": "Alerts",
//   "/reports": "Reports",
//   "/iam": "IAM",
//   "/users": "Users",
//   "/locations": "Locations",
//   "/profile": "User Profile",
// };

// export default function TopbarShell() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const title = useMemo(() => {
//     if (TITLE_MAP[location.pathname]) return TITLE_MAP[location.pathname];
//     const key = Object.keys(TITLE_MAP).find((k) => location.pathname.startsWith(k));
//     return key ? TITLE_MAP[key] : "Dashboard";
//   }, [location.pathname]);

//   const [helmetSearch, setHelmetSearch] = useState("");

//   const [mode, setMode] = useState<"dark" | "light">(() => {
//     const saved = localStorage.getItem("ui_theme");
//     return saved === "light" ? "light" : "dark";
//   });

//   // which action is highlighted in yellow
//   const [activeAction, setActiveAction] = useState<
//     "add" | "notif" | "theme" | "profile" | null
//   >(null);

//   // notifications popover
//   const [notifAnchor, setNotifAnchor] = useState<HTMLElement | null>(null);
//   const notifOpen = Boolean(notifAnchor);

//   useEffect(() => {
//     localStorage.setItem("ui_theme", mode);
//     document.documentElement.setAttribute("data-theme", mode);
//   }, [mode]);

//   const iconBtnSx = (active?: boolean) => ({
//     ...baseIconBtnSx,
//     color: active ? ACCENT : "#fff",
//     "&:hover": {
//       bgcolor: "rgba(255,255,255,0.08)",
//       borderColor: "rgba(255,255,255,0.18)",
//       color: ACCENT,
//     },
//     outline: "none",
//     boxShadow: "none",
//     "&:focus": { outline: "none", boxShadow: "none" },
//     "&:focus-visible": { outline: "none", boxShadow: "none" },
//     "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
//   });

//   const openNotifications = (e: React.MouseEvent<HTMLElement>) => {
//     setActiveAction("notif");
//     setNotifAnchor(e.currentTarget);
//   };

//   const closeNotifications = () => {
//     setNotifAnchor(null);
//     setActiveAction((a) => (a === "notif" ? null : a));
//   };

//   return (
//     <Box
//       sx={{
//         height: TOPBAR_H,
//         width: "100%",
//         flexShrink: 0,
//         position: "sticky",
//         top: 0,
//         zIndex: 20,

//         display: "flex",
//         alignItems: "center",
//         pl: 2,
//         pr: 3.5, // ✅ right breathing room so last icon never feels clipped

//         bgcolor: "rgba(14,14,14,0.78)",
//         backdropFilter: "blur(12px)",
//         borderBottom: "1px solid rgba(255,255,255,0.10)",

//         minWidth: 0,
//         gap: 2,
//       }}
//     >
//       {/* Left title */}
//       <Typography
//         sx={{
//           color: "#fff",
//           fontWeight: 700,
//           letterSpacing: 0.2,
//           fontSize: 18,
//           whiteSpace: "nowrap",
//           flexShrink: 0,
//         }}
//       >
//         {title}
//       </Typography>

//       {/* Spacer (keeps right group nicely aligned & uses available space) */}
//       <Box sx={{ flex: 1, minWidth: 0 }} />

//       {/* Right group */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           minWidth: 0,
//           gap: 1,
//         }}
//       >
//         {/* Search (flex-based => responsive, never pushes icons out) */}
//         <TextField
//           size="small"
//           placeholder="Search helmets..."
//           value={helmetSearch}
//           onChange={(e) => setHelmetSearch(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               navigate(`/dashboard?search=${encodeURIComponent(helmetSearch)}`);
//             }
//           }}
//           sx={{
//             flex: 1,
//             minWidth: { xs: 140, sm: 220, md: 320 },
//             maxWidth: { xs: 220, sm: 320, md: 420 },

//             "& .MuiOutlinedInput-root": {
//               height: 34,
//               bgcolor: "rgba(255,255,255,0.04)",
//               borderRadius: 2,
//             },
//             "& .MuiOutlinedInput-notchedOutline": {
//               borderColor: "rgba(255,255,255,0.14)",
//             },
//             "&:hover .MuiOutlinedInput-notchedOutline": {
//               borderColor: "rgba(255,255,255,0.22)",
//             },
//             "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
//               borderColor: "rgba(255,255,255,0.22)",
//             },
//             "& .MuiOutlinedInput-input": {
//               color: "#fff",
//               fontSize: 13,
//               py: 0.5,
//             },
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon sx={{ color: "rgba(255,255,255,0.65)", fontSize: 18 }} />
//               </InputAdornment>
//             ),
//           }}
//         />

//         {/* Icons container (never shrink) */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
//           <Tooltip title="Add user">
//             <IconButton
//               disableRipple
//               onClick={() => {
//                 setActiveAction("add");
//                 navigate("/admin/users/new");
//               }}
//               sx={iconBtnSx(activeAction === "add")}
//             >
//               <PersonAddOutlinedIcon />
//             </IconButton>
//           </Tooltip>

//           <Tooltip title="Notifications">
//             <IconButton
//               disableRipple
//               onClick={openNotifications}
//               sx={iconBtnSx(activeAction === "notif" || notifOpen)}
//             >
//               <NotificationsNoneOutlinedIcon />
//             </IconButton>
//           </Tooltip>

//           {/* ✅ Reminders menu like Atlas */}
//           <Popover
//             open={notifOpen}
//             anchorEl={notifAnchor}
//             onClose={closeNotifications}
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//             transformOrigin={{ vertical: "top", horizontal: "right" }}
//             PaperProps={{
//               sx: {
//                 mt: 1,
//                 width: 360,
//                 borderRadius: 2,
//                 bgcolor: "rgba(14,14,14,0.92)",
//                 backdropFilter: "blur(14px)",
//                 border: "1px solid rgba(255,255,255,0.12)",
//                 boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
//                 overflow: "hidden",
//               },
//             }}
//           >
//             <Box sx={{ p: 2 }}>
//               <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
//                   Reminders
//                 </Typography>

//                 <Typography
//                   onClick={() => {
//                     // later: navigate("/reminders")
//                     closeNotifications();
//                     console.log("manage reminders");
//                   }}
//                   sx={{
//                     color: "rgba(255,255,255,0.85)",
//                     fontWeight: 600,
//                     fontSize: 13,
//                     cursor: "pointer",
//                     px: 1.2,
//                     py: 0.6,
//                     borderRadius: 999,
//                     border: "1px solid rgba(255,255,255,0.12)",
//                     bgcolor: "rgba(255,255,255,0.04)",
//                     "&:hover": {
//                       bgcolor: "rgba(255,255,255,0.08)",
//                       borderColor: "rgba(255,255,255,0.18)",
//                     },
//                   }}
//                 >
//                   Manage &gt;
//                 </Typography>
//               </Box>

//               <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
//                 <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>
//                   No reminders for today
//                 </Typography>
//               </Box>
//             </Box>
//           </Popover>

//           <Tooltip title={mode === "dark" ? "Switch to light" : "Switch to dark"}>
//             <IconButton
//               disableRipple
//               onClick={() => {
//                 setActiveAction("theme");
//                 setMode((m) => (m === "dark" ? "light" : "dark"));
//               }}
//               sx={iconBtnSx(activeAction === "theme")}
//             >
//               {mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
//             </IconButton>
//           </Tooltip>

//           <Tooltip title="User profile">
//             <IconButton
//               disableRipple
//               onClick={() => {
//                 setActiveAction("profile");
//                 navigate("/profile");
//               }}
//               // sx={iconBtnSx(activeAction === "profile")}
//               sx={{ ...iconBtnSx(activeAction === "profile"), mr: 3.5 }}
//             >
//               <AccountCircleOutlinedIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// const baseIconBtnSx = {
//   width: 36,
//   height: 36,
//   borderRadius: 2,
//   color: "#fff",
//   bgcolor: "rgba(255,255,255,0.04)",
//   border: "1px solid rgba(255,255,255,0.10)",
// };


import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Popover,
  Avatar,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

const TOPBAR_H = 52;
const ACCENT = "#FED200";

// const TITLE_MAP: Record<string, string> = {
//   "/dashboard": "Dashboard",
//   "/faults": "Faults",
//   "/alerts": "Alerts",
//   "/reports": "Reports",
//   "/iam": "IAM",
//   "/users": "Users",
//   "/locations": "Locations",
//   "/profile": "User Profile",
// };

export default function TopbarShell() {
  // const location = useLocation();
  const navigate = useNavigate();

  // const title = useMemo(() => {
  //   if (TITLE_MAP[location.pathname]) return TITLE_MAP[location.pathname];
  //   const key = Object.keys(TITLE_MAP).find((k) => location.pathname.startsWith(k));
  //   return key ? TITLE_MAP[key] : "Dashboard";
  // }, [location.pathname]);

  const [helmetSearch, setHelmetSearch] = useState("");

  const [mode, setMode] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("ui_theme");
    return saved === "light" ? "light" : "dark";
  });

  // which action is highlighted in yellow
  const [activeAction, setActiveAction] = useState<
    "adduser" | "notif" | "theme" | null
  >(null);

  // notifications popover
  const [notifAnchor, setNotifAnchor] = useState<HTMLElement | null>(null);
  const notifOpen = Boolean(notifAnchor);

  useEffect(() => {
    localStorage.setItem("ui_theme", mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const iconBtnSx = (active?: boolean) => ({
    ...baseIconBtnSx,
    color: active ? ACCENT : "#fff",
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.08)",
      borderColor: "rgba(255,255,255,0.18)",
      color: ACCENT,
    },
    outline: "none",
    boxShadow: "none",
    "&:focus": { outline: "none", boxShadow: "none" },
    "&:focus-visible": { outline: "none", boxShadow: "none" },
    "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
  });

  const openNotifications = (e: React.MouseEvent<HTMLElement>) => {
    setActiveAction("notif");
    setNotifAnchor(e.currentTarget);
  };

  const closeNotifications = () => {
    setNotifAnchor(null);
    setActiveAction((a) => (a === "notif" ? null : a));
  };

  // Mock user data - replace with actual user data from your auth context
  const userName = "Ryan Crawford";
  const userRole = "PRO";

  return (
    <Box
      sx={{
        height: TOPBAR_H,
        width: "100%",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 20,

        display: "flex",
        alignItems: "center",
        pl: 2,
        pr: 3.5,

        bgcolor: "rgba(14,14,14,0.78)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.10)",

        minWidth: 0,
        gap: 2,
      }}
    >
      {/* Left: User Profile Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexShrink: 0,
          cursor: "pointer",
          "&:hover .user-name": {
            color: ACCENT,
          },
        }}
        onClick={() => navigate("/profile")}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <Typography sx={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
            {userName.split(" ").map(n => n[0]).join("")}
          </Typography>
        </Avatar>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Typography
              className="user-name"
              sx={{
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1,
                transition: "color 0.2s",
              }}
            >
              {userName}
            </Typography>
            <Box
              sx={{
                bgcolor: "rgba(254,210,0,0.15)",
                border: "1px solid rgba(254,210,0,0.3)",
                borderRadius: 0.8,
                px: 0.6,
                py: 0.2,
              }}
            >
              <Typography
                sx={{
                  color: ACCENT,
                  fontSize: 9,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: 0.3,
                }}
              >
                {userRole}
              </Typography>
            </Box>
          </Box>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 11,
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            @ryan907
          </Typography>
        </Box>
      </Box>

      {/* Vertical Divider */}
      <Box
        sx={{
          width: "1px",
          height: 32,
          bgcolor: "rgba(255,255,255,0.12)",
          flexShrink: 0,
        }}
      />

      {/* Add User Button */}
      <Tooltip title="Add user">
        <Button
          disableRipple
          onClick={() => {
            setActiveAction("adduser");
            navigate("/admin/users/new");
          }}
          sx={{
            minWidth: "auto",
            height: 36,
            px: 2,
            borderRadius: 2,
            bgcolor: activeAction === "adduser" ? ACCENT : "rgba(254,210,0,0.12)",
            color: activeAction === "adduser" ? "#000" : ACCENT,
            border: `1px solid ${activeAction === "adduser" ? ACCENT : "rgba(254,210,0,0.3)"}`,
            fontWeight: 600,
            fontSize: 13,
            textTransform: "none",
            "&:hover": {
              bgcolor: ACCENT,
              color: "#000",
              borderColor: ACCENT,
            },
            outline: "none",
            boxShadow: "none",
            "&:focus": { outline: "none", boxShadow: "none" },
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            flexShrink: 0,
          }}
        >
          <PersonAddOutlinedIcon sx={{ fontSize: 16 }} />
          Add User
        </Button>
      </Tooltip>

      {/* Spacer */}
      <Box sx={{ flex: 1, minWidth: 0 }} />

      {/* Right group */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minWidth: 0,
          gap: 1,
        }}
      >
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search helmets..."
          value={helmetSearch}
          onChange={(e) => setHelmetSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate(`/dashboard?search=${encodeURIComponent(helmetSearch)}`);
            }
          }}
          sx={{
            flex: 1,
            minWidth: { xs: 140, sm: 220, md: 320 },
            maxWidth: { xs: 220, sm: 320, md: 420 },

            "& .MuiOutlinedInput-root": {
              height: 34,
              bgcolor: "rgba(255,255,255,0.04)",
              borderRadius: 2,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.14)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.22)",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.22)",
            },
            "& .MuiOutlinedInput-input": {
              color: "#fff",
              fontSize: 13,
              py: 0.5,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "rgba(255,255,255,0.65)", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Icons container */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
          <Tooltip title="Notifications">
            <IconButton
              disableRipple
              onClick={openNotifications}
              sx={iconBtnSx(activeAction === "notif" || notifOpen)}
            >
              <NotificationsNoneOutlinedIcon />
            </IconButton>
          </Tooltip>

          {/* Notifications Popover */}
          <Popover
            open={notifOpen}
            anchorEl={notifAnchor}
            onClose={closeNotifications}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1,
                width: 360,
                borderRadius: 2,
                bgcolor: "rgba(14,14,14,0.92)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
                overflow: "hidden",
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
                  Reminders
                </Typography>

                <Typography
                  onClick={() => {
                    closeNotifications();
                    console.log("manage reminders");
                  }}
                  sx={{
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    px: 1.2,
                    py: 0.6,
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.12)",
                    bgcolor: "rgba(255,255,255,0.04)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.18)",
                    },
                  }}
                >
                  Manage &gt;
                </Typography>
              </Box>

              <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>
                  No reminders for today
                </Typography>
              </Box>
            </Box>
          </Popover>

          <Tooltip title={mode === "dark" ? "Switch to light" : "Switch to dark"}>
            <IconButton
              disableRipple
              onClick={() => {
                setActiveAction("theme");
                setMode((m) => (m === "dark" ? "light" : "dark"));
              }}
              sx={{ ...iconBtnSx(activeAction === "theme"),}}
            >
              {mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}

const baseIconBtnSx = {
  width: 36,
  height: 36,
  borderRadius: 2,
  color: "#fff",
  bgcolor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
};