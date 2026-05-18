import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import "./css/Modal.css";
import "./css/Global.css";

import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Payment from "./pages/Payment";
import ReservationDetails from "./pages/ReservationDetails";
import Contact from "./pages/Contact";
import StaffMessages from "./pages/StaffMessages";
import StaffEmployes from "./pages/StaffEmployes";
import StaffRooms from "./pages/StaffRooms";

import PublicRoute from "./routes/PublicRoute";
import PrivateRouteClient from "./routes/PrivateRouteClient";
import PrivateRouteStaff from "./routes/PrivateRouteStaff";

import Auth from "./pages/Auth";
import DashClient from "./pages/DashClient";
import DashStaff from "./pages/DashStaff";

function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/auth";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
        <Route path="/dashboard" element={<PrivateRouteClient><DashClient /></PrivateRouteClient>} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/payment/:id" element={<PrivateRouteClient><Payment /></PrivateRouteClient>} />
        <Route path="/reservation/:id" element={<PrivateRouteClient allowStaff={true}><ReservationDetails /></PrivateRouteClient>} />
        <Route path="/staff" element={<PrivateRouteStaff><DashStaff /></PrivateRouteStaff>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/staff/messages" element={<PrivateRouteStaff> <StaffMessages /> </PrivateRouteStaff>} />
        <Route path="/staff/employees" element={<PrivateRouteStaff><StaffEmployes /></PrivateRouteStaff>} />
        <Route path="/staff/rooms" element={<PrivateRouteStaff><StaffRooms /></PrivateRouteStaff>} />
      </Routes>
    </>
  );
}

export default function App() {
  useEffect(() => {
    const navType = performance.getEntriesByType("navigation")[0]?.type;
    if (navType !== "reload" && navType !== "back_forward") {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("staffId");
      sessionStorage.removeItem("clientId");
    }
  }, []);

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
