import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OwnerOnboarding from "./pages/owner/OwnerOnboarding";
import MyRestaurants from "./pages/owner/MyRestaurants";
import MenuManagement from "./pages/owner/MenuManagement";
import RestaurantListing from "./pages/RestaurantListing";
import RestaurantDetail from "./pages/RestaurantDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/customer/MyOrders";
import OrderDetail from "./pages/customer/OrderDetail";
import IncomingOrders from "./pages/owner/IncomingOrders";
import ApplicationsQueue from "./pages/admin/ApplicationsQueue";
import UsersTable from "./pages/admin/UserTable";
import AdminStats from "./pages/admin/AdminStats";
import Profile from "./pages/Profile";
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
        <Route
          path="/owner/restaurants/:restaurantId/menu"
          element={<MenuManagement />}
        />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["OWNER"]} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/onboarding" element={<OwnerOnboarding />} />
          <Route path="/owner/restaurants" element={<MyRestaurants />} />
          <Route path="/owner/orders" element={<IncomingOrders />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<ApplicationsQueue />} />
          <Route path="/admin/users" element={<UsersTable />} />
          <Route path="/admin/stats" element={<AdminStats />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
