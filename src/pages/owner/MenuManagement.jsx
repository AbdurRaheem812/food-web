import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFormik } from "formik";
import {
  getCategories,
  createCategory,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  toggleMenuItemAvailability,
  uploadMenuItemImage,
  deleteMenuItem,
} from "../../api/menuApi";
import { ImageUploadPreview } from "../../components/form/ImageUploadPreview";
import { FieldError } from "../../components/form/FieldError";
import { categorySchema, menuItemSchema } from "../../validation/menuSchema";

const inputClass =
  "bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors w-full text-sm";

const MenuManagement = () => {
  const { restaurantId } = useParams();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newItemFile, setNewItemFile] = useState(null);
  const [newItemPreview, setNewItemPreview] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [cats, menuItems] = await Promise.all([
        getCategories(restaurantId),
        getMenuItems(restaurantId),
      ]);
      setCategories(cats);
      setItems(menuItems);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Could not load menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [restaurantId]);

  const handleNewItemFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewItemFile(file);
    setNewItemPreview(URL.createObjectURL(file));
  };

  
  const categoryFormik = useFormik({
    initialValues: { name: "" },
    validationSchema: categorySchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setError("");
      try {
        await createCategory(restaurantId, values.name.trim());
        resetForm();
        loadAll();
      } catch (err) {
        setError(err.response?.data?.error?.message || "Could not create category.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  
  const itemFormik = useFormik({
    initialValues: { name: "", description: "", price: "", categoryId: "", isVeg: false },
    validationSchema: menuItemSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setError("");
      try {
        const payload = {
          name: values.name,
          description: values.description || undefined,
          price: Number(values.price),
          isVeg: values.isVeg,
          categoryId: values.categoryId || undefined,
        };
        const created = await createMenuItem(restaurantId, payload);

        if (newItemFile) {
          await uploadMenuItemImage(created.id, newItemFile);
        }

        resetForm();
        setNewItemFile(null);
        setNewItemPreview(null);
        loadAll();
      } catch (err) {
        setError(err.response?.data?.error?.message || "Could not create menu item.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleToggleAvailable = async (itemId) => {
    try {
      await toggleMenuItemAvailability(itemId);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.error?.message || "Could not update item.");
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteMenuItem(itemId);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.error?.message || "Could not delete item.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-white/50">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Manage Menu</h1>
          <Link to="/owner/restaurants" className="text-white/50 hover:text-white text-sm">
            ← Back to restaurants
          </Link>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}


        <form onSubmit={categoryFormik.handleSubmit} noValidate className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-4">
          <div className="flex gap-3">
            <input
              name="name"
              className={inputClass}
              placeholder="New category name (e.g. Burgers)"
              value={categoryFormik.values.name}
              onChange={categoryFormik.handleChange}
              onBlur={categoryFormik.handleBlur}
            />
            <button
              type="submit"
              disabled={categoryFormik.isSubmitting}
              className="px-5 py-2 rounded-full bg-orange-500 disabled:opacity-50 text-white text-sm font-medium whitespace-nowrap"
            >
              Add Category
            </button>
          </div>
          <FieldError touched={categoryFormik.touched.name} error={categoryFormik.errors.name} />
        </form>


        <form onSubmit={itemFormik.handleSubmit} noValidate className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-8 flex flex-col gap-1">
          <p className="text-white/70 text-sm font-medium mb-2">Add a menu item</p>

          <div className="flex gap-3">
            <div className="flex-1">
              <input
                name="name"
                className={inputClass}
                placeholder="Item name"
                value={itemFormik.values.name}
                onChange={itemFormik.handleChange}
                onBlur={itemFormik.handleBlur}
              />
              <FieldError touched={itemFormik.touched.name} error={itemFormik.errors.name} />
            </div>
            <div className="flex-1">
              <input
                name="price"
                type="number"
                step="0.01"
                className={inputClass}
                placeholder="Price"
                value={itemFormik.values.price}
                onChange={itemFormik.handleChange}
                onBlur={itemFormik.handleBlur}
              />
              <FieldError touched={itemFormik.touched.price} error={itemFormik.errors.price} />
            </div>
          </div>

          <input
            name="description"
            className={inputClass}
            placeholder="Description (optional)"
            value={itemFormik.values.description}
            onChange={itemFormik.handleChange}
            onBlur={itemFormik.handleBlur}
          />

          <div className="flex items-center gap-3 mt-2">
            <select
              name="categoryId"
              className={inputClass}
              value={itemFormik.values.categoryId}
              onChange={itemFormik.handleChange}
            >
              <option value="" style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
                  {c.name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-white/60 text-sm whitespace-nowrap">
              <input
                type="checkbox"
                name="isVeg"
                checked={itemFormik.values.isVeg}
                onChange={itemFormik.handleChange}
              />
              Veg
            </label>
          </div>

          <div className="mt-2">
            <ImageUploadPreview
              preview={newItemPreview}
              onChange={handleNewItemFileChange}
              size="w-24 h-24"
              label="Add Item Image"
            />
          </div>

          <button
            type="submit"
            disabled={itemFormik.isSubmitting}
            className="mt-3 px-5 py-2 rounded-full bg-orange-500 disabled:opacity-50 text-white text-sm font-medium self-start"
          >
            {itemFormik.isSubmitting ? "Adding..." : "Add Item"}
          </button>
        </form>


        <div className="flex flex-col gap-3">
          {items.length === 0 && <p className="text-white/40 text-sm">No menu items yet.</p>}
          {items.map((item) => (
            <div key={item.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-white/10" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-white/30 text-xs">No image</div>
              )}
              <div className="flex-1">
                <p className="text-white font-medium">
                  {item.name} {item.isVeg && <span className="text-green-400 text-xs">🌱</span>}
                </p>
                <p className="text-white/50 text-sm">
                  ${Number(item.price).toFixed(2)} · {item.category?.name || "No category"}
                </p>
              </div>
              <button
                onClick={() => handleToggleAvailable(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  item.isAvailable ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"
                }`}
              >
                {item.isAvailable ? "Available" : "Unavailable"}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;