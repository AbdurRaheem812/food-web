import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OwnerOnboarding from "./pages/owner/OwnerOnboarding";
import MyRestaurants from "./pages/owner/MyRestaurants";
import MenuManagement from "./pages/owner/MenuManagement";
import RestaurantListing from "./pages/RestaurantListing";
import RestaurantDetail from "./pages/RestaurantDetails";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import RoleRoute from "./components/routing/RoleRoute";
import NotAllowed from "./pages/NotAllowed";

const Home = () => (
  <div className="min-h-screen bg-[#0D0D0F] text-white p-8">
    Public Home Page
  </div>
);
const CustomerDashboard = () => (
  <div className="min-h-screen bg-[#0D0D0F] text-white p-8">
    Customer Dashboard
  </div>
);
const OwnerDashboard = () => (
  <div className="min-h-screen bg-[#0D0D0F] text-white p-8">
    Owner Dashboard
  </div>
);

function App() {
  return (
    <div className="bg-[#0D0D0F] min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<RestaurantListing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/not-allowed" element={<NotAllowed />} />
        <Route path="/owner/restaurants/:restaurantId/menu" element={<MenuManagement />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<CustomerDashboard />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["OWNER"]} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/onboarding" element={<OwnerOnboarding />} />
          <Route path="/owner/restaurants" element={<MyRestaurants />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
