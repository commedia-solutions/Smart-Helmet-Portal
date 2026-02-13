// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   IconButton,
// } from "@mui/material";

// import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
// import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";

// const TOPBAR_H = 122;
// const ACCENT = "#FED200";

// function Field({
//   label,
//   value,
//   onChange,
//   disabled,
// }: {
//   label: string;
//   value: string;
//   onChange?: (v: string) => void;
//   disabled?: boolean;
// }) {
//   return (
//     <Box>
//       <Typography
//         sx={{
//           color: "rgba(255,255,255,0.60)",
//           fontSize: 12,
//           mb: 0.6,
//           letterSpacing: 0.2,
//         }}
//       >
//         {label}
//       </Typography>

//       <TextField
//         fullWidth
//         value={value}
//         disabled={disabled}
//         onChange={(e) => onChange?.(e.target.value)}
//         placeholder={label}
//         size="small"
//         sx={{
//           "& .MuiOutlinedInput-root": {
//             height: 48,
//             bgcolor: "rgba(255,255,255,0.04)",
//             borderRadius: 2.2, // not too pill-y
//             backdropFilter: "blur(10px)",
//           },
//           "& .MuiOutlinedInput-notchedOutline": {
//             borderColor: "rgba(255,255,255,0.10)",
//           },
//           "&:hover .MuiOutlinedInput-notchedOutline": {
//             borderColor: "rgba(255,255,255,0.18)",
//           },
//           "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
//             {
//               borderColor: "rgba(255,255,255,0.22)", // no yellow focus ring
//             },
//           "& .MuiInputBase-input": {
//             color: "#fff",
//             fontSize: 14,
//           },
//           "& .Mui-disabled": {
//             WebkitTextFillColor: "rgba(255,255,255,0.82)",
//           },
//         }}
//       />
//     </Box>
//   );
// }

// export default function UserProfile() {
//   // mock defaults (later you’ll populate from API)
//   const [name, setName] = useState("Amey Admin");
//   const [username, setUsername] = useState("CSPLAdmin");
//   const [contact, setContact] = useState("9082899981");
//   const [designation, setDesignation] = useState("Project Manager");
//   const [email] = useState("commedia9900@gmail.com");

//   const fileRef = useRef<HTMLInputElement | null>(null);
//   const [photoUrl, setPhotoUrl] = useState<string | null>(null);

//   // keep it stable + cleanup object url
//   const prevUrl = useRef<string | null>(null);
//   useEffect(() => {
//     return () => {
//       if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
//     };
//   }, []);

//   const pickPhoto = () => fileRef.current?.click();

//   const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const url = URL.createObjectURL(file);
//     if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
//     prevUrl.current = url;
//     setPhotoUrl(url);
//   };

//   const canSave = useMemo(() => {
//     return (
//       name.trim().length > 0 &&
//       username.trim().length > 0 &&
//       contact.trim().length > 0 &&
//       designation.trim().length > 0
//     );
//   }, [name, username, contact, designation]);

//   const onSave = () => {
//     // hook API later
//     console.log("save profile", { name, username, contact, designation, email, photoUrl });
//   };

//   return (
//     <Box
//       sx={{
//         // ✅ Fit exactly under topbar => avoids unnecessary page scroll
//         height: `calc(100vh - ${TOPBAR_H}px)`,
//         overflow: "hidden",
//         px: { xs: 2, md: 3 },
//         py: { xs: 2, md: 3 },

//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       {/* Main card */}
//       <Box
//         sx={{
//           width: "100%",
//           maxWidth: 1180,

//           borderRadius: 3,
//           border: "1px solid rgba(255,255,255,0.10)",
//           bgcolor: "rgba(255,255,255,0.02)",
//           backdropFilter: "blur(14px)",
//           boxShadow: "0 18px 70px rgba(0,0,0,0.55)",

//           // ✅ use only required space (no tall minHeight that causes overflow)
//           p: { xs: 2.5, md: 4 },

//           display: "flex",
//           gap: { xs: 3, md: 5 },
//           flexDirection: { xs: "column", md: "row" },
//           alignItems: { xs: "center", md: "stretch" },
//         }}
//       >
//         {/* Left: Avatar block */}
//         <Box
//           sx={{
//             width: { xs: "100%", md: 280 },
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "flex-start",
//             pt: { xs: 0, md: 1 },
//           }}
//         >
//           <Box
//             sx={{
//               position: "relative",
//               width: 190,
//               height: 190,
//               borderRadius: "50%",
//               border: "2px solid rgba(255,255,255,0.12)",
//               bgcolor: "rgba(255,255,255,0.03)",
//               display: "grid",
//               placeItems: "center",
//               boxShadow:
//                 "inset 0 0 0 1px rgba(255,255,255,0.06), 0 18px 50px rgba(0,0,0,0.45)",
//             }}
//           >
//             {photoUrl ? (
//               <Box
//                 component="img"
//                 src={photoUrl}
//                 alt="Profile"
//                 sx={{
//                   width: "100%",
//                   height: "100%",
//                   borderRadius: "50%",
//                   objectFit: "cover",
//                 }}
//               />
//             ) : (
//               <PersonOutlineRoundedIcon
//                 sx={{ fontSize: 86, color: "rgba(255,255,255,0.55)" }}
//               />
//             )}

//             {/* camera button */}
//             <IconButton
//               disableRipple
//               onClick={pickPhoto}
//               sx={{
//                 position: "absolute",
//                 right: 10,
//                 bottom: 10,
//                 width: 36,
//                 height: 36,
//                 borderRadius: 2,
//                 bgcolor: "rgba(0,0,0,0.40)",
//                 border: "1px solid rgba(255,255,255,0.14)",
//                 color: "#fff",
//                 "&:hover": {
//                   bgcolor: "rgba(0,0,0,0.55)",
//                   borderColor: "rgba(255,255,255,0.22)",
//                 },
//                 outline: "none",
//                 boxShadow: "none",
//                 "&:focus": { outline: "none", boxShadow: "none" },
//                 "&:focus-visible": { outline: "none", boxShadow: "none" },
//               }}
//             >
//               <PhotoCameraOutlinedIcon sx={{ fontSize: 18 }} />
//             </IconButton>

//             <input
//               ref={fileRef}
//               type="file"
//               accept="image/*"
//               onChange={onPhotoChange}
//               style={{ display: "none" }}
//             />
//           </Box>
//         </Box>

//         {/* Right: Fields */}
//         <Box
//           sx={{
//             flex: 1,
//             width: "100%",
//             display: "grid",
//             gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//             gap: { xs: 2, md: 2.4 },
//             alignContent: "center",
//           }}
//         >
//           <Field label="Name" value={name} onChange={setName} />
//           <Field label="Contact No" value={contact} onChange={setContact} />
//           <Field label="Username" value={username} onChange={setUsername} />
//           <Field label="Designation" value={designation} onChange={setDesignation} />

//           {/* Email spans full width like your raw layout */}
//           <Box sx={{ gridColumn: { xs: "auto", md: "1 / span 2" } }}>
//             <Field label="Email" value={email} disabled />
//           </Box>

//           {/* Save (bottom-right inside card) */}
//           <Box
//             sx={{
//               gridColumn: { xs: "auto", md: "1 / span 2" },
//               display: "flex",
//               justifyContent: "flex-end",
//               pt: { xs: 0.5, md: 1 },
//             }}
//           >
//             <Button
//               onClick={onSave}
//               disabled={!canSave}
//               sx={{
//                 height: 44,
//                 minWidth: 140,
//                 borderRadius: 2, // ✅ reduced radius
//                 fontWeight: 600, // ✅ reduced from bold-heavy look
//                 letterSpacing: 0.4,
//                 bgcolor: ACCENT,
//                 color: "#111",
//                 boxShadow: "0 14px 34px rgba(254,210,0,0.22)",
//                 "&:hover": { bgcolor: "#ffd84a" },
//                 "&.Mui-disabled": {
//                   bgcolor: "rgba(254,210,0,0.25)",
//                   color: "rgba(0,0,0,0.55)",
//                 },
//               }}
//             >
//               Save
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }



import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";

const TOPBAR_H = 122; // keep as you changed
const ACCENT = "#FED200";

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <Box>
      <Typography
        sx={{
          color: "rgba(255,255,255,0.60)",
          fontSize: 12,
          mb: 0.6,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Typography>

      <TextField
        fullWidth
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={label}
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            height: 48,
            bgcolor: "rgba(255,255,255,0.04)",
            borderRadius: 2.2,
            backdropFilter: "blur(10px)",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.10)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.18)",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "rgba(255,255,255,0.22)",
            },
          "& .MuiInputBase-input": {
            color: "#fff",
            fontSize: 14,
          },
          "& .Mui-disabled": {
            WebkitTextFillColor: "rgba(255,255,255,0.82)",
          },
        }}
      />
    </Box>
  );
}

export default function UserProfile() {
  const [name, setName] = useState("Amey Admin");
  const [username, setUsername] = useState("CSPLAdmin");
  const [contact, setContact] = useState("9082899981");
  const [designation, setDesignation] = useState("Project Manager");
  const [email] = useState("commedia9900@gmail.com");

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // ✅ Remove forced scrollbar for this page (even if parent uses overflowY:"scroll")
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  // cleanup object urls
  const prevUrl = useRef<string | null>(null);
  useEffect(() => {
    return () => {
      if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
    };
  }, []);

  const pickPhoto = () => fileRef.current?.click();

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
    prevUrl.current = url;
    setPhotoUrl(url);
  };

  const canSave = useMemo(() => {
    return (
      name.trim().length > 0 &&
      username.trim().length > 0 &&
      contact.trim().length > 0 &&
      designation.trim().length > 0
    );
  }, [name, username, contact, designation]);

  const onSave = () => {
    console.log("save profile", {
      name,
      username,
      contact,
      designation,
      email,
      photoUrl,
    });
  };

  return (
    <Box
      sx={{
        height: `calc(100vh - ${TOPBAR_H}px)`,
        overflow: "hidden", // keep
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1180,
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.10)",
          bgcolor: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 18px 70px rgba(0,0,0,0.55)",
          p: { xs: 2.5, md: 4 },

          display: "flex",
          gap: { xs: 3, md: 5 },
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "stretch" },
        }}
      >
        {/* Left: Avatar */}
        <Box
          sx={{
            width: { xs: "100%", md: 280 },
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            pt: { xs: 0, md: 1 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 190,
              height: 190,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.12)",
              bgcolor: "rgba(255,255,255,0.03)",
              display: "grid",
              placeItems: "center",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.06), 0 18px 50px rgba(0,0,0,0.45)",
            }}
          >
            {photoUrl ? (
              <Box
                component="img"
                src={photoUrl}
                alt="Profile"
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <PersonOutlineRoundedIcon
                sx={{ fontSize: 86, color: "rgba(255,255,255,0.55)" }}
              />
            )}

            <IconButton
              disableRipple
              onClick={pickPhoto}
              sx={{
                position: "absolute",
                right: 10,
                bottom: 10,
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.40)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#fff",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.55)",
                  borderColor: "rgba(255,255,255,0.22)",
                },
                outline: "none",
                boxShadow: "none",
                "&:focus": { outline: "none", boxShadow: "none" },
                "&:focus-visible": { outline: "none", boxShadow: "none" },
              }}
            >
              <PhotoCameraOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPhotoChange}
              style={{ display: "none" }}
            />
          </Box>
        </Box>

        {/* Right: Fields */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 2, md: 2.4 },
            alignContent: "center",
          }}
        >
          <Field label="Name" value={name} onChange={setName} />
          <Field label="Contact No" value={contact} onChange={setContact} />
          <Field label="Username" value={username} onChange={setUsername} />
          <Field
            label="Designation"
            value={designation}
            onChange={setDesignation}
          />

          <Box sx={{ gridColumn: { xs: "auto", md: "1 / span 2" } }}>
            <Field label="Email" value={email} disabled />
          </Box>

          <Box
            sx={{
              gridColumn: { xs: "auto", md: "1 / span 2" },
              display: "flex",
              justifyContent: "flex-end",
              pt: { xs: 0.5, md: 1 },
            }}
          >
            <Button
              onClick={onSave}
              disabled={!canSave}
              sx={{
                height: 44,
                minWidth: 140,
                borderRadius: 2,
                fontWeight: 600,
                letterSpacing: 0.4,
                bgcolor: ACCENT,
                color: "#111",
                boxShadow: "0 14px 34px rgba(254,210,0,0.22)",
                "&:hover": { bgcolor: "#ffd84a" },
                "&.Mui-disabled": {
                  bgcolor: "rgba(254,210,0,0.25)",
                  color: "rgba(0,0,0,0.55)",
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
