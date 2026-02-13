// // src/pages/Signup.tsx
// import { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   IconButton,
//   InputAdornment,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Checkbox,
//   FormControlLabel,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// import ComLogo from "../assets/light_logo.png";
// import slide1 from "../assets/Image1.jpg";
// import slide2 from "../assets/Image2.jpg";
// import slide3 from "../assets/Image3.jpg";

// import {
//   signUp,
//   confirmSignUp,
//   signIn,
//   forgotPassword,
//   resetPassword,
// } from "../services/auth";

// type AuthMode = "signup" | "confirm" | "login" | "forgot" | "reset";

// const getInitialVariant = (mode: AuthMode) => ({
//   x: mode === "signup" ? 100 : -100,
//   opacity: 0,
//   position: "absolute" as const,
// });
// const animateVariant = {
//   x: 0,
//   opacity: 1,
//   position: "relative" as const,
//   transition: { duration: 0.5 },
// };
// const getExitVariant = (mode: AuthMode) => ({
//   x: mode === "signup" ? -100 : 100,
//   opacity: 0,
//   position: "absolute" as const,
//   transition: { duration: 0.5 },
// });

// interface SignupProps {
//   initialMode: AuthMode;
// }

// const YELLOW = "#ffea00";

// export default function Signup({ initialMode }: SignupProps) {
//   const navigate = useNavigate();
//   const [mode, setMode] = useState<AuthMode>(initialMode);

//   // ✅ Stop page scrollbars on login screen (restore on unmount)
//   useEffect(() => {
//     const prevBody = document.body.style.overflow;
//     const prevHtml = document.documentElement.style.overflow;
//     document.body.style.overflow = "hidden";
//     document.documentElement.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prevBody;
//       document.documentElement.style.overflow = prevHtml;
//     };
//   }, []);

//   // Carousel
//   const images = [slide1, slide2, slide3];
//   const [currentSlide, setCurrentSlide] = useState(0);
//   useEffect(() => {
//     const iv = setInterval(
//       () => setCurrentSlide((s) => (s + 1) % images.length),
//       4000
//     );
//     return () => clearInterval(iv);
//   }, []);

//   // Form state
//   const [showPassword, setShowPassword] = useState(false);
//   const toggleShow = () => setShowPassword((v) => !v);

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [agree, setAgree] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [newPass, setNewPass] = useState("");

//   // Snackbar state
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
//     "success"
//   );
//   const [snackbarDuration, setSnackbarDuration] = useState(3000);

//   const showToast = (
//     message: string,
//     severity: "success" | "error",
//     duration: number = 3000
//   ) => {
//     setSnackbarMessage(message);
//     setSnackbarSeverity(severity);
//     setSnackbarDuration(duration);
//     setSnackbarOpen(true);
//   };

//   const handleCloseSnackbar = (_: any, reason?: string) => {
//     if (reason === "clickaway") return;
//     setSnackbarOpen(false);
//   };

//   // Common "dark input" styling (filled variant, yellow focus)
//   const filledSx = {
//     mb: 2,
//     "& .MuiFilledInput-root": {
//       borderRadius: "12px",
//       backgroundColor: "rgba(255,255,255,0.06)",
//       border: "1px solid rgba(255,255,255,0.10)",
//       overflow: "hidden",
//     },
//     "& .MuiFilledInput-root:hover": {
//       backgroundColor: "rgba(255,255,255,0.07)",
//       borderColor: "rgba(255,255,255,0.14)",
//     },
//     "& .MuiFilledInput-root.Mui-focused": {
//       borderColor: "rgba(255,234,0,0.55)",
//       boxShadow: "0 0 0 3px rgba(255,234,0,0.10)",
//     },
//     "& .MuiFilledInput-input": {
//       color: "rgba(255,255,255,0.92)",
//       paddingTop: "18px",
//     },
//     "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.55)" },
//     "& .MuiInputLabel-root.Mui-focused": { color: "rgba(255,234,0,0.85)" },
//     // remove underline
//     "& .MuiFilledInput-underline:before": { borderBottom: "none" },
//     "& .MuiFilledInput-underline:after": { borderBottom: "none" },
//   } as const;

//   const selectSx = {
//     "& .MuiFilledInput-root": {
//       borderRadius: "12px",
//       backgroundColor: "rgba(255,255,255,0.06)",
//       border: "1px solid rgba(255,255,255,0.10)",
//     },
//     "& .MuiFilledInput-root.Mui-focused": {
//       borderColor: "rgba(255,234,0,0.55)",
//       boxShadow: "0 0 0 3px rgba(255,234,0,0.10)",
//     },
//     "& .MuiSelect-select": { color: "rgba(255,255,255,0.92)" },
//     "& .MuiSelect-icon": { color: "rgba(255,255,255,0.65)" },
//     "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.55)" },
//     "& .MuiInputLabel-root.Mui-focused": { color: "rgba(255,234,0,0.85)" },
//     "& .MuiFilledInput-underline:before": { borderBottom: "none" },
//     "& .MuiFilledInput-underline:after": { borderBottom: "none" },
//   } as const;

//   // Shared input fields for signup
//   const renderFields = (roles: string[]) => (
//     <>
//       <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
//         <TextField
//           fullWidth
//           label="Username"
//           variant="filled"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           sx={{
//             ...filledSx,
//             mb: 0,
//           }}
//         />

//         <FormControl fullWidth variant="filled" sx={{ ...selectSx }}>
//           <InputLabel>Role</InputLabel>
//           <Select
//             value={role}
//             onChange={(e) => setRole(e.target.value as string)}
//           >
//             {roles.map((r) => (
//               <MenuItem key={r} value={r}>
//                 {r}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       <TextField
//         fullWidth
//         label="Email"
//         variant="filled"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         sx={filledSx}
//       />

//       <TextField
//         fullWidth
//         label="Password"
//         variant="filled"
//         type={showPassword ? "text" : "password"}
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         sx={filledSx}
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <IconButton onClick={toggleShow} sx={{ color: "rgba(255,255,255,0.75)" }}>
//                 {showPassword ? <VisibilityOff /> : <Visibility />}
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//       />
//     </>
//   );

//   const signupUser = async () => {
//     if (!email || !password || !username || !role) {
//       showToast("Fill all details carefully!", "error");
//       return;
//     }
//     if (!agree) {
//       showToast("You must agree to the Terms & Conditions.", "error");
//       return;
//     }
//     try {
//       await signUp(email, password, username);
//       showToast("Confirmation code sent to your email.", "success");
//       setMode("confirm");
//     } catch (e: any) {
//       if (e.code === "UsernameExistsException") showToast("User already exists !", "error");
//       else showToast(e.message || "Sign-up failed.", "error");
//     }
//   };

//   const confirmUser = async () => {
//     try {
//       await confirmSignUp(email, otp);
//       showToast("Email confirmed! You can now log in.", "success");
//       setMode("login");
//     } catch {
//       showToast("Code entered is incorrect or invalid.", "error", 3000);
//     }
//   };

//   const login = async () => {
//     if (!email || !password) {
//       showToast("Please fill login details", "error");
//       return;
//     }
//     try {
//       const { idToken, accessToken, refreshToken } = await signIn(email, password);
//       localStorage.setItem("idToken", idToken);
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);

//       showToast("Login successful! redirecting..", "success");
//       setTimeout(() => navigate("/dashboard", { replace: true }), 900);
//     } catch {
//       showToast("Invalid credentials", "error");
//     }
//   };

//   const sendCode = async () => {
//     try {
//       await forgotPassword(email);
//       showToast("Password reset code sent.", "success");
//       setMode("reset");
//     } catch (e: any) {
//       showToast(e.message || "Could not send reset code.", "error");
//     }
//   };

//   const resetPass = async () => {
//     if (newPass !== confirmPassword) {
//       showToast("Passwords don't match.", "error");
//       return;
//     }
//     try {
//       await resetPassword(email, otp, newPass);
//       showToast("Password reset! You can now log in.", "success");
//       setMode("login");
//     } catch {
//       showToast("Code entered is incorrect or invalid.", "error", 3000);
//     }
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           height: "100vh",
//           width: "100%",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           bgcolor: "#0b0b0d",
//           overflow: "hidden",
//           fontFamily:
//             "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             width: "96vw",
//             maxWidth: 1400,
//             height: "85vh",
//             borderRadius: 3,
//             overflow: "hidden",
//             boxShadow: 10,
//             bgcolor: "#090A0E",
//           }}
//         >
//           {/* Left carousel */}
//           <Box sx={{ flex: 1, position: "relative" }}>
//             <Box
//               sx={{
//                 width: "100%",
//                 height: "100%",
//                 backgroundImage: `url(${images[currentSlide]})`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//               }}
//             />
//             {/* subtle dark overlay to match site */}
//             <Box
//               sx={{
//                 position: "absolute",
//                 inset: 0,
//                 background:
//                   "linear-gradient(90deg, rgba(0,0,0,0.25), rgba(0,0,0,0.55))",
//               }}
//             />
//             <Box
//               component="img"
//               src={ComLogo}
//               alt="logo"
//               sx={{
//                 position: "absolute",
//                 top: 16,
//                 left: 16,
//                 width: 110,
//                 zIndex: 2,
//               }}
//             />
//             <Box
//               sx={{
//                 position: "absolute",
//                 bottom: 16,
//                 left: "50%",
//                 transform: "translateX(-50%)",
//                 display: "flex",
//                 gap: 1,
//                 zIndex: 2,
//               }}
//             >
//               {images.map((_, i) => (
//                 <Box
//                   key={i}
//                   sx={{
//                     width: currentSlide === i ? 20 : 12,
//                     height: 4,
//                     bgcolor: currentSlide === i ? YELLOW : "rgba(255,255,255,0.30)",
//                     borderRadius: 2,
//                     transition: "width .3s",
//                   }}
//                 />
//               ))}
//             </Box>
//           </Box>

//           {/* Right forms (same sizing, just themed) */}
//           <Box
//             sx={{
//               flex: 1,
//               p: 6,
//               bgcolor: "#15181C",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Box sx={{ width: "100%", maxWidth: 560 }}>
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={mode}
//                   initial={getInitialVariant(mode)}
//                   animate={animateVariant}
//                   exit={getExitVariant(mode)}
//                 >
//                   {mode === "signup" && (
//                     <>
//                       <Typography variant="h4" sx={{ color: "#fff", mb: 2, fontWeight: 800 }}>
//                         Create an account
//                       </Typography>

//                       {renderFields(["Admin", "User"])}

//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={agree}
//                             onChange={(e) => setAgree(e.target.checked)}
//                             sx={{
//                               color: "rgba(255,255,255,0.55)",
//                               "&.Mui-checked": { color: YELLOW },
//                             }}
//                           />
//                         }
//                         label={
//                           <Typography sx={{ color: "rgba(255,255,255,0.82)" }}>
//                             I agree to the{" "}
//                             <Box component="span" sx={{ color: YELLOW, textDecoration: "underline" }}>
//                               Terms & Conditions
//                             </Box>
//                           </Typography>
//                         }
//                         sx={{ mb: 3 }}
//                       />

//                       <Button
//                         fullWidth
//                         variant="contained"
//                         onClick={signupUser}
//                         sx={{
//                           bgcolor: YELLOW,
//                           color: "#0b0b0d",
//                           fontWeight: 900,
//                           borderRadius: "12px",
//                           py: 1.4,
//                           boxShadow: "0 10px 24px rgba(255,234,0,0.14)",
//                           "&:hover": { bgcolor: "#ffe100", transform: "translateY(-1px)" },
//                         }}
//                       >
//                         Sign Up
//                       </Button>
//                     </>
//                   )}

//                   {mode === "confirm" && (
//                     <>
//                       <Typography variant="h4" sx={{ color: "#fff", mb: 2, fontWeight: 800 }}>
//                         Confirm Your Email
//                       </Typography>

//                       <TextField
//                         fullWidth
//                         label="Confirmation Code"
//                         variant="filled"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         sx={filledSx}
//                       />

//                       <Button
//                         fullWidth
//                         variant="contained"
//                         onClick={confirmUser}
//                         sx={{
//                           bgcolor: YELLOW,
//                           color: "#0b0b0d",
//                           fontWeight: 900,
//                           borderRadius: "12px",
//                           py: 1.4,
//                           boxShadow: "0 10px 24px rgba(255,234,0,0.14)",
//                           "&:hover": { bgcolor: "#ffe100", transform: "translateY(-1px)" },
//                         }}
//                       >
//                         Confirm & Continue
//                       </Button>
//                     </>
//                   )}

//                   {mode === "login" && (
//                     <>
//                       <Typography variant="h3" sx={{ color: "#fff", mb: 2.5, fontWeight: 900 }}>
//                         Welcome Back
//                       </Typography>

//                       <TextField
//                         fullWidth
//                         label="Email"
//                         variant="filled"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         sx={filledSx}
//                       />

//                       <TextField
//                         fullWidth
//                         label="Password"
//                         variant="filled"
//                         type={showPassword ? "text" : "password"}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         sx={filledSx}
//                         InputProps={{
//                           endAdornment: (
//                             <InputAdornment position="end">
//                               <IconButton onClick={toggleShow} sx={{ color: "rgba(255,255,255,0.75)" }}>
//                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                               </IconButton>
//                             </InputAdornment>
//                           ),
//                         }}
//                       />

//                       <Box textAlign="right" mb={3}>
//                         <Typography
//                           variant="body2"
//                           sx={{ color: YELLOW, cursor: "pointer", fontWeight: 800 }}
//                           onClick={() => setMode("forgot")}
//                         >
//                           Forgot password?
//                         </Typography>
//                       </Box>

//                       <Button
//                         fullWidth
//                         variant="contained"
//                         onClick={login}
//                         sx={{
//                           bgcolor: YELLOW,
//                           color: "#0b0b0d",
//                           fontWeight: 900,
//                           borderRadius: "12px",
//                           py: 1.6,
//                           boxShadow: "0 10px 24px rgba(255,234,0,0.14)",
//                           "&:hover": { bgcolor: "#ffe100", transform: "translateY(-1px)" },
//                         }}
//                       >
//                         LOG IN
//                       </Button>

//                       <Typography
//                         sx={{
//                           mt: 2,
//                           color: "rgba(255,255,255,0.55)",
//                           fontSize: 13,
//                         }}
//                       >
//                         Use your credentials to access the dashboard.
//                       </Typography>
//                     </>
//                   )}

//                   {mode === "forgot" && (
//                     <>
//                       <Typography variant="h4" sx={{ color: "#fff", mb: 2, fontWeight: 800 }}>
//                         Recover Password
//                       </Typography>

//                       <TextField
//                         fullWidth
//                         label="Email"
//                         variant="filled"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         sx={filledSx}
//                       />

//                       <Button
//                         fullWidth
//                         variant="contained"
//                         onClick={sendCode}
//                         sx={{
//                           bgcolor: YELLOW,
//                           color: "#0b0b0d",
//                           fontWeight: 900,
//                           borderRadius: "12px",
//                           py: 1.4,
//                           boxShadow: "0 10px 24px rgba(255,234,0,0.14)",
//                           "&:hover": { bgcolor: "#ffe100", transform: "translateY(-1px)" },
//                         }}
//                       >
//                         Send Reset Code
//                       </Button>

//                       <Typography
//                         variant="body2"
//                         sx={{ color: "rgba(255,255,255,0.65)", mt: 2, cursor: "pointer", fontWeight: 800 }}
//                         onClick={() => setMode("login")}
//                       >
//                         Back to Login
//                       </Typography>
//                     </>
//                   )}

//                   {mode === "reset" && (
//                     <>
//                       <Typography variant="h4" sx={{ color: "#fff", mb: 2, fontWeight: 800 }}>
//                         Reset Password
//                       </Typography>

//                       <TextField
//                         fullWidth
//                         label="Reset Code"
//                         variant="filled"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         sx={filledSx}
//                       />

//                       <TextField
//                         fullWidth
//                         label="New Password"
//                         variant="filled"
//                         type={showPassword ? "text" : "password"}
//                         value={newPass}
//                         onChange={(e) => setNewPass(e.target.value)}
//                         sx={filledSx}
//                         InputProps={{
//                           endAdornment: (
//                             <InputAdornment position="end">
//                               <IconButton onClick={toggleShow} sx={{ color: "rgba(255,255,255,0.75)" }}>
//                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                               </IconButton>
//                             </InputAdornment>
//                           ),
//                         }}
//                       />

//                       <TextField
//                         fullWidth
//                         label="Confirm Password"
//                         variant="filled"
//                         type={showPassword ? "text" : "password"}
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         sx={filledSx}
//                       />

//                       <Button
//                         fullWidth
//                         variant="contained"
//                         onClick={resetPass}
//                         sx={{
//                           bgcolor: YELLOW,
//                           color: "#0b0b0d",
//                           fontWeight: 900,
//                           borderRadius: "12px",
//                           py: 1.4,
//                           boxShadow: "0 10px 24px rgba(255,234,0,0.14)",
//                           "&:hover": { bgcolor: "#ffe100", transform: "translateY(-1px)" },
//                         }}
//                       >
//                         Reset Password
//                       </Button>

//                       <Typography
//                         variant="body2"
//                         sx={{ color: "rgba(255,255,255,0.65)", mt: 2, cursor: "pointer", fontWeight: 800 }}
//                         onClick={() => setMode("login")}
//                       >
//                         Back to Login
//                       </Typography>
//                     </>
//                   )}
//                 </motion.div>
//               </AnimatePresence>
//             </Box>
//           </Box>
//         </Box>
//       </Box>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={snackbarDuration}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }



// src/pages/Signup.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import ComLogo from "../assets/light_logo.png";
import slide1 from "../assets/Image1.jpg";
import slide2 from "../assets/Image2.jpg";
import slide3 from "../assets/Image3.jpg";

import {
  signUp,
  confirmSignUp,
  signIn,
  forgotPassword,
  resetPassword,
} from "../services/auth";

type AuthMode = "signup" | "confirm" | "login" | "forgot" | "reset";

const getInitialVariant = (mode: AuthMode) => ({
  x: mode === "signup" ? 100 : -100,
  opacity: 0,
  position: "absolute" as const,
});
const animateVariant = {
  x: 0,
  opacity: 1,
  position: "relative" as const,
  transition: { duration: 0.5 },
};
const getExitVariant = (mode: AuthMode) => ({
  x: mode === "signup" ? -100 : 100,
  opacity: 0,
  position: "absolute" as const,
  transition: { duration: 0.5 },
});

interface SignupProps {
  initialMode: AuthMode;
}

const YELLOW = "#ffea00";

/** ✅ Subtle typography (no heavy bold) */
const H1_SX = {
  color: "rgba(255,255,255,0.92)",
  fontWeight: 650,
  letterSpacing: "-0.02em",
} as const;

const H2_SX = {
  color: "rgba(255,255,255,0.92)",
  fontWeight: 620,
  letterSpacing: "-0.018em",
} as const;

const LINK_SX = {
  color: YELLOW,
  cursor: "pointer",
  fontWeight: 600,
} as const;

export default function Signup({ initialMode }: SignupProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // ✅ Stop page scrollbars on login screen (restore on unmount)
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  // Carousel
  const images = [slide1, slide2, slide3];
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const iv = setInterval(
      () => setCurrentSlide((s) => (s + 1) % images.length),
      4000
    );
    return () => clearInterval(iv);
  }, []);

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const toggleShow = () => setShowPassword((v) => !v);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [agree, setAgree] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarDuration, setSnackbarDuration] = useState(3000);

  const showToast = (
    message: string,
    severity: "success" | "error",
    duration: number = 3000
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarDuration(duration);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (_: any, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // Common "dark input" styling (filled variant, yellow focus)
  const filledSx = {
    mb: 2,
    "& .MuiFilledInput-root": {
      borderRadius: "12px",
      backgroundColor: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
      overflow: "hidden",
    },
    "& .MuiFilledInput-root:hover": {
      backgroundColor: "rgba(255,255,255,0.07)",
      borderColor: "rgba(255,255,255,0.14)",
    },
    "& .MuiFilledInput-root.Mui-focused": {
      borderColor: "rgba(255,234,0,0.55)",
      boxShadow: "0 0 0 3px rgba(255,234,0,0.10)",
    },
    "& .MuiFilledInput-input": {
      color: "rgba(255,255,255,0.92)",
      paddingTop: "18px",
      fontWeight: 520,
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.52)", fontWeight: 520 },
    "& .MuiInputLabel-root.Mui-focused": { color: "rgba(255,234,0,0.85)" },
    // remove underline
    "& .MuiFilledInput-underline:before": { borderBottom: "none" },
    "& .MuiFilledInput-underline:after": { borderBottom: "none" },
  } as const;

  const selectSx = {
    "& .MuiFilledInput-root": {
      borderRadius: "12px",
      backgroundColor: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
    },
    "& .MuiFilledInput-root.Mui-focused": {
      borderColor: "rgba(255,234,0,0.55)",
      boxShadow: "0 0 0 3px rgba(255,234,0,0.10)",
    },
    "& .MuiSelect-select": { color: "rgba(255,255,255,0.92)", fontWeight: 520 },
    "& .MuiSelect-icon": { color: "rgba(255,255,255,0.65)" },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.52)", fontWeight: 520 },
    "& .MuiInputLabel-root.Mui-focused": { color: "rgba(255,234,0,0.85)" },
    "& .MuiFilledInput-underline:before": { borderBottom: "none" },
    "& .MuiFilledInput-underline:after": { borderBottom: "none" },
  } as const;

  // Shared input fields for signup
  const renderFields = (roles: string[]) => (
    <>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Username"
          variant="filled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
           onKeyDown={handleEnterKey} 
          sx={{ ...filledSx, mb: 0 }}
        />

        <FormControl fullWidth variant="filled" sx={{ ...selectSx }}>
          <InputLabel>Role</InputLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value as string)}>
            {roles.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TextField
        fullWidth
        label="Email"
        variant="filled"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
         onKeyDown={handleEnterKey} 
        sx={filledSx}
      />

      <TextField
        fullWidth
        label="Password"
        variant="filled"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
         onKeyDown={handleEnterKey} 
        sx={filledSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleShow} sx={{ color: "rgba(255,255,255,0.70)" }}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );

  const signupUser = async () => {
    if (!email || !password || !username || !role) {
      showToast("Fill all details carefully!", "error");
      return;
    }
    if (!agree) {
      showToast("You must agree to the Terms & Conditions.", "error");
      return;
    }
    try {
      await signUp(email, password, username);
      showToast("Confirmation code sent to your email.", "success");
      setMode("confirm");
    } catch (e: any) {
      if (e.code === "UsernameExistsException") showToast("User already exists !", "error");
      else showToast(e.message || "Sign-up failed.", "error");
    }
  };

  const confirmUser = async () => {
    try {
      await confirmSignUp(email, otp);
      showToast("Email confirmed! You can now log in.", "success");
      setMode("login");
    } catch {
      showToast("Code entered is incorrect or invalid.", "error", 3000);
    }
  };

  const login = async () => {
    if (!email || !password) {
      showToast("Please fill login details", "error");
      return;
    }
    try {
      const { idToken, accessToken, refreshToken } = await signIn(email, password);
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      showToast("Login successful! redirecting..", "success");
      setTimeout(() => navigate("/dashboard", { replace: true }), 900);
    } catch {
      showToast("Invalid credentials", "error");
    }
  };

  const sendCode = async () => {
    try {
      await forgotPassword(email);
      showToast("Password reset code sent.", "success");
      setMode("reset");
    } catch (e: any) {
      showToast(e.message || "Could not send reset code.", "error");
    }
  };

  const resetPass = async () => {
    if (newPass !== confirmPassword) {
      showToast("Passwords don't match.", "error");
      return;
    }
    try {
      await resetPassword(email, otp, newPass);
      showToast("Password reset! You can now log in.", "success");
      setMode("login");
    } catch {
      showToast("Code entered is incorrect or invalid.", "error", 3000);
    }
  };

    // ✅ Press Enter = run primary action for current mode
  const submitPrimaryAction = () => {
    switch (mode) {
      case "login":
        return login();
      case "signup":
        return signupUser();
      case "confirm":
        return confirmUser();
      case "forgot":
        return sendCode();
      case "reset":
        return resetPass();
      default:
        return;
    }
  };

  const handleEnterKey = (e: any) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    submitPrimaryAction();
  };


  return (
    <>
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#0b0b0d",
          overflow: "hidden",
          fontFamily: "inherit", // ✅ inherit Sansation from global CSS
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "96vw",
            maxWidth: 1400,
            height: "85vh",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 10,
            bgcolor: "#090A0E",
          }}
        >
          {/* Left carousel */}
          <Box sx={{ flex: 1, position: "relative" }}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${images[currentSlide]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* subtle dark overlay to match site */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, rgba(0,0,0,0.22), rgba(0,0,0,0.55))",
              }}
            />
            <Box
              component="img"
              src={ComLogo}
              alt="logo"
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                width: 110,
                zIndex: 2,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 1,
                zIndex: 2,
              }}
            >
              {images.map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: currentSlide === i ? 20 : 12,
                    height: 4,
                    bgcolor: currentSlide === i ? YELLOW : "rgba(255,255,255,0.26)",
                    borderRadius: 2,
                    transition: "width .3s",
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Right forms */}
          <Box
            sx={{
              flex: 1,
              p: 6,
              bgcolor: "#15181C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "inherit",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 560 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={getInitialVariant(mode)}
                  animate={animateVariant}
                  exit={getExitVariant(mode)}
                >
                  {mode === "signup" && (
                    <>
                      <Typography variant="h4" sx={{ ...H2_SX, mb: 2 }}>
                        Create an account
                      </Typography>

                      {renderFields(["Admin", "User"])}

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            sx={{
                              color: "rgba(255,255,255,0.48)",
                              "&.Mui-checked": { color: YELLOW },
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ color: "rgba(255,255,255,0.78)", fontWeight: 520 }}>
                            I agree to the{" "}
                            <Box component="span" sx={{ color: YELLOW, textDecoration: "underline", fontWeight: 600 }}>
                              Terms & Conditions
                            </Box>
                          </Typography>
                        }
                        sx={{ mb: 3 }}
                      />

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={signupUser}
                        sx={{
                          bgcolor: YELLOW,
                          color: "#0b0b0d",
                          fontWeight: 700,
                          borderRadius: "12px",
                          py: 1.4,
                          boxShadow: "0 10px 24px rgba(255,234,0,0.14)",
                          textTransform: "none",
                          "&:hover": { bgcolor: "#ffe100", transform: "translateY(-1px)" },
                        }}
                      >
                        Sign up
                      </Button>
                    </>
                  )}

                  {mode === "confirm" && (
                    <>
                      <Typography variant="h4" sx={{ ...H2_SX, mb: 2 }}>
                        Confirm your email
                      </Typography>

                      <TextField
                        fullWidth
                        label="Confirmation Code"
                        variant="filled"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        onKeyDown={handleEnterKey}
                        sx={filledSx}
                      />

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={confirmUser}
                        sx={{
                          bgcolor: YELLOW,
                          color: "#0b0b0d",
                          fontWeight: 700,
                          borderRadius: "12px",
                          py: 1.4,
                          boxShadow: "0 10px 24px rgba(255,234,0,0.14)",
                          textTransform: "none",
                          "&:hover": { bgcolor: "#ffe100", transform: "translateY(-1px)" },
                        }}
                      >
                        Confirm & continue
                      </Button>
                    </>
                  )}

                  {mode === "login" && (
                    <>
                      <Typography
                        variant="h3"
                        sx={{
                          ...H1_SX,
                          mb: 2.5,
                          fontSize: { xs: 38, md: 48 }, // ✅ still big, but not heavy
                        }}
                      >
                        Welcome Back
                      </Typography>

                      <TextField
                        fullWidth
                        label="Email"
                        variant="filled"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleEnterKey} 
                        sx={filledSx}
                      />

                      <TextField
                        fullWidth
                        label="Password"
                        variant="filled"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleEnterKey} 
                        sx={filledSx}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={toggleShow} sx={{ color: "rgba(255,255,255,0.70)" }}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Box textAlign="right" mb={3}>
                        <Typography
                          variant="body2"
                          sx={{ ...LINK_SX }}
                          onClick={() => setMode("forgot")}
                        >
                          Forgot password?
                        </Typography>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={login}
                        sx={{
                          bgcolor: YELLOW,
                          color: "#0b0b0d",
                          fontWeight: 720,
                          borderRadius: "12px",
                          py: 1.6,
                          boxShadow: "0 10px 24px rgba(255,234,0,0.12)",
                          letterSpacing: "0.06em",
                          "&:hover": { bgcolor: "#ffe100", transform: "translateY(-1px)" },
                        }}
                      >
                        LOG IN
                      </Button>

                      <Typography
                        sx={{
                          mt: 2,
                          color: "rgba(255,255,255,0.52)",
                          fontSize: 13,
                          fontWeight: 520,
                        }}
                      >
                        Use your credentials to access the dashboard.
                      </Typography>
                    </>
                  )}

                  {mode === "forgot" && (
                    <>
                      <Typography variant="h4" sx={{ ...H2_SX, mb: 2 }}>
                        Recover password
                      </Typography>

                      <TextField
                        fullWidth
                        label="Email"
                        variant="filled"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleEnterKey} 
                        sx={filledSx}
                      />

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={sendCode}
                        sx={{
                          bgcolor: YELLOW,
                          color: "#0b0b0d",
                          fontWeight: 700,
                          borderRadius: "12px",
                          py: 1.4,
                          boxShadow: "0 10px 24px rgba(255,234,0,0.12)",
                          textTransform: "none",
                          "&:hover": { bgcolor: "#ffe100", transform: "translateY(-1px)" },
                        }}
                      >
                        Send reset code
                      </Button>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.62)",
                          mt: 2,
                          cursor: "pointer",
                          fontWeight: 560,
                        }}
                        onClick={() => setMode("login")}
                      >
                        Back to login
                      </Typography>
                    </>
                  )}

                  {mode === "reset" && (
                    <>
                      <Typography variant="h4" sx={{ ...H2_SX, mb: 2 }}>
                        Reset password
                      </Typography>

                      <TextField
                        fullWidth
                        label="Reset Code"
                        variant="filled"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        onKeyDown={handleEnterKey} 
                        sx={filledSx}
                      />

                      <TextField
                        fullWidth
                        label="New Password"
                        variant="filled"
                        type={showPassword ? "text" : "password"}
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        onKeyDown={handleEnterKey} 
                        sx={filledSx}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={toggleShow} sx={{ color: "rgba(255,255,255,0.70)" }}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Confirm Password"
                        variant="filled"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={handleEnterKey} 
                        sx={filledSx}
                      />

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={resetPass}
                        sx={{
                          bgcolor: YELLOW,
                          color: "#0b0b0d",
                          fontWeight: 700,
                          borderRadius: "12px",
                          py: 1.4,
                          boxShadow: "0 10px 24px rgba(255,234,0,0.12)",
                          textTransform: "none",
                          "&:hover": { bgcolor: "#ffe100", transform: "translateY(-1px)" },
                        }}
                      >
                        Reset password
                      </Button>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.62)",
                          mt: 2,
                          cursor: "pointer",
                          fontWeight: 560,
                        }}
                        onClick={() => setMode("login")}
                      >
                        Back to login
                      </Typography>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={snackbarDuration}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
