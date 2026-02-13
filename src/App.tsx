

// // src/App.tsx
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import RequireAuth from "./Components/RequireAuth";

// import Landing from "./pages/Landing";
// import Signup from "./pages/Signup";

// // ✅ new public pages you created
// import Usecases from "./pages/Usecases";
// import Docs from "./pages/Docs";
// import Pricing from "./pages/Pricing";
// import ContactSales from "./pages/Contactsales";

// // protected pages
// import Dashboard from "./pages/dashboard";
// import Faults from "./pages/Faults";
// import Alerts from "./pages/Alerts";
// import Reports from "./pages/Reports";
// import IAM from "./pages/Iam";
// import UsersList from "./pages/UsersList";
// import ViewLocations from "./pages/ViewLocations";
// import MainLayout from "./layout/MainLayout";

// export default function App() {
//   const token = localStorage.getItem("idToken");

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* ✅ Public Landing */}
//         <Route path="/" element={<Landing />} />

//         {/* ✅ Public pages */}
//         <Route path="/use-cases" element={<Usecases />} />
//         <Route path="/docs" element={<Docs />} />
//         <Route path="/pricing" element={<Pricing />} />
//         <Route path="/contact-sales" element={<ContactSales />} />

//         {/* Old root redirect moved */}
//         <Route
//           path="/app"
//           element={
//             token ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />

//         {/* Login page */}
//         <Route
//           path="/login"
//           element={
//             token ? (
//               <Navigate to="/dashboard" replace={false} />
//             ) : (
//               <Signup initialMode="login" />
//             )
//           }
//         />

//         {/* Admin-only “Create User” */}
//         <Route
//           path="/admin/users/new"
//           element={
//             <RequireAuth>
//               <Signup initialMode="signup" />
//             </RequireAuth>
//           }
//         />

//         {/* ✅ Protected */}
//         <Route
//           path="/dashboard"
//           element={
//             <RequireAuth>
//               <MainLayout>
//                 <Dashboard />
//               </MainLayout>
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/faults"
//           element={
//             <RequireAuth>
//               <MainLayout>
//                 <Faults />
//               </MainLayout>
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/alerts"
//           element={
//             <RequireAuth>
//               <MainLayout>
//                 <Alerts />
//               </MainLayout>
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/reports"
//           element={
//             <RequireAuth>
//               <MainLayout>
//                 <Reports />
//               </MainLayout>
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/iam"
//           element={
//             <RequireAuth>
//               <MainLayout>
//                 <IAM />
//               </MainLayout>
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/users"
//           element={
//             <RequireAuth>
//               <MainLayout>
//                 <UsersList />
//               </MainLayout>
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/locations"
//           element={
//             <RequireAuth>
//               <MainLayout>
//                 <ViewLocations />
//               </MainLayout>
//             </RequireAuth>
//           }
//         />

//         {/* fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }



// src/App.tsx
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import RequireAuth from "./Components/RequireAuth";

// import Landing from "./pages/Landing";
// import Signup from "./pages/Signup";

// // ✅ public pages
// import Usecases from "./pages/Usecases";
// import Docs from "./pages/Docs";
// import Pricing from "./pages/Pricing";
// import ContactSales from "./pages/Contactsales";

// // ✅ protected pages
// import Dashboard from "./pages/dashboard";
// import Faults from "./pages/Faults";
// import Alerts from "./pages/Alerts";
// import Reports from "./pages/Reports";
// import IAM from "./pages/Iam";
// import UsersList from "./pages/UsersList";
// import ViewLocations from "./pages/ViewLocations";

// import MainLayout from "./layout/MainLayout";

// export default function App() {
//   const token = localStorage.getItem("idToken");

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* ✅ Public Landing */}
//         <Route path="/" element={<Landing />} />

//         {/* ✅ Public pages */}
//         <Route path="/use-cases" element={<Usecases />} />
//         <Route path="/docs" element={<Docs />} />
//         <Route path="/pricing" element={<Pricing />} />
//         <Route path="/contact-sales" element={<ContactSales />} />

//         {/* Old root redirect moved */}
//         <Route
//           path="/app"
//           element={
//             token ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />

//         {/* Login page */}
//         <Route
//           path="/login"
//           element={
//             token ? (
//               <Navigate to="/dashboard" replace={false} />
//             ) : (
//               <Signup initialMode="login" />
//             )
//           }
//         />

//         {/* Admin-only “Create User” */}
//         <Route
//           path="/admin/users/new"
//           element={
//             <RequireAuth>
//               <Signup initialMode="signup" />
//             </RequireAuth>
//           }
//         />

//         {/* ✅ Protected group (MainLayout applied ONCE) */}
//         <Route
//           element={
//             <RequireAuth>
//               <MainLayout />
//             </RequireAuth>
//           }
//         >
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/faults" element={<Faults />} />
//           <Route path="/alerts" element={<Alerts />} />
//           <Route path="/reports" element={<Reports />} />
//           <Route path="/iam" element={<IAM />} />
//           <Route path="/users" element={<UsersList />} />
//           <Route path="/locations" element={<ViewLocations />} />
//         </Route>

//         {/* fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


//pp3/
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./Components/RequireAuth";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";

// ✅ public pages
import Usecases from "./pages/Usecases";
import Docs from "./pages/Docs";
import Pricing from "./pages/Pricing";
import ContactSales from "./pages/Contactsales";

// ✅ protected pages
import Dashboard from "./pages/dashboard";
import Faults from "./pages/Faults";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import IAM from "./pages/Iam";
import UsersList from "./pages/UsersList";
import ViewLocations from "./pages/ViewLocations";
import UserProfile from "./pages/UserProfile"; // ✅ NEW

import MainLayout from "./layout/MainLayout";

export default function App() {
  const token = localStorage.getItem("idToken");

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Public Landing */}
        <Route path="/" element={<Landing />} />

        {/* ✅ Public pages */}
        <Route path="/use-cases" element={<Usecases />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact-sales" element={<ContactSales />} />

        {/* Old root redirect moved */}
        <Route
          path="/app"
          element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />

        {/* Login page */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/dashboard" replace={false} /> : <Signup initialMode="login" />
          }
        />

        {/* Admin-only “Create User” */}
        <Route
          path="/admin/users/new"
          element={
            <RequireAuth>
              <Signup initialMode="signup" />
            </RequireAuth>
          }
        />

        {/* ✅ Protected group (MainLayout applied ONCE) */}
        <Route
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/faults" element={<Faults />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/iam" element={<IAM />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/locations" element={<ViewLocations />} />

          {/* ✅ NEW: User Profile */}
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
