import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../hooks/useAuth";
import {
  updateProfile,
  deactivateAccount,
  deleteAccountPermanently,
} from "../api/authApi";

const profileSchema = Yup.object({
  username: Yup.string().min(3).required("Username is required"),
  phoneNumber: Yup.string().notRequired(),
  address: Yup.string().notRequired(),
});

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [processing, setProcessing] = useState(false);

  const isCustomer = user?.roles?.includes("CUSTOMER");
  const isOwner = user?.roles?.includes("OWNER");
  const isAdmin = user?.roles?.includes("ADMIN");

  const formik = useFormik({
    initialValues: {
      username: user?.username || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
    },
    validationSchema: profileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      setSuccess(false);
      try {
        const updatedUser = await updateProfile(values);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess(true);
      } catch (err) {
        setError(
          err.response?.data?.error?.message || "Could not update profile.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeactivate = async () => {
    setProcessing(true);
    setDeleteError("");
    try {
      await deactivateAccount();
      logout();
      navigate("/login");
    } catch (err) {
      setDeleteError(
        err.response?.data?.error?.message || "Could not deactivate account.",
      );
      setProcessing(false);
    }
  };

  const handlePermanentDelete = async () => {
    setProcessing(true);
    setDeleteError("");
    try {
      await deleteAccountPermanently();
      logout();
      navigate("/login");
    } catch (err) {
      setDeleteError(
        err.response?.data?.error?.message || "Could not delete account.",
      );
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] px-4 py-10">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>

        {/* Role-based quick links */}
        <div className="flex flex-wrap gap-2 mb-6">
          {isCustomer && (
            <Link
              to="/orders"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
            >
              My Orders
            </Link>
          )}
          {isOwner && (
            <Link
              to="/owner/restaurants"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
            >
              My Restaurants
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
            >
              Admin Panel
            </Link>
          )}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            Profile updated
          </div>
        )}

        <form
          onSubmit={formik.handleSubmit}
          noValidate
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-3 mb-6"
        >
          <p className="text-white/40 text-xs">Email (cannot be changed)</p>
          <input
            disabled
            value={user?.email || ""}
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/40"
          />

          <label className="text-white/60 text-sm mt-2">Username</label>
          <input
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-orange-500"
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-red-400 text-xs">{formik.errors.username}</p>
          )}

          <label className="text-white/60 text-sm mt-2">Phone Number</label>
          <input
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-orange-500"
          />

          <label className="text-white/60 text-sm mt-2">Delivery Address</label>
          <textarea
            name="address"
            rows={2}
            value={formik.values.address}
            onChange={formik.handleChange}
            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-orange-500"
          />

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="mt-3 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3 rounded-full"
          >
            {formik.isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Account actions */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
          >
            Logout
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
          <div className="bg-[#151517] border border-white/10 rounded-2xl p-6 max-w-sm">
            <h2 className="text-white font-semibold mb-2">
              Delete your account?
            </h2>
            <p className="text-white/50 text-sm mb-4">
              Choose how you'd like to proceed. This cannot be undone.
            </p>

            {deleteError && (
              <p className="text-red-400 text-xs mb-3">{deleteError}</p>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={handleDeactivate}
                disabled={processing}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-sm text-left"
              >
                <span className="font-medium">Deactivate account</span>
                <p className="text-white/40 text-xs mt-0.5">
                  Blocks login, keeps your order/restaurant history intact.
                </p>
              </button>
              <button
                onClick={handlePermanentDelete}
                disabled={processing}
                className="px-4 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 text-red-400 text-sm text-left"
              >
                <span className="font-medium">Permanently delete</span>
                <p className="text-red-400/60 text-xs mt-0.5">
                  Removes your account entirely. Fails if you have order
                  history.
                </p>
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={processing}
                className="px-4 py-2 rounded-full text-white/50 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
