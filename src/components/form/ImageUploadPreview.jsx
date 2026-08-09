export const ImageUploadPreview = ({ preview, onChange, size = 'w-40 h-40', label = 'Click to select image' }) => (
  <label
    className={`${size} rounded-3xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer overflow-hidden bg-white/5 hover:border-orange-500 transition-colors`}
  >
    {preview ? (
      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
    ) : (
      <span className="text-white/40 text-sm text-center px-4">{label}</span>
    )}
    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={onChange}
      className="hidden"
    />
  </label>
);