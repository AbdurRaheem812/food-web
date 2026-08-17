import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { applyAsRestaurant, uploadRestaurantLogo } from '../../api/restaurantApi';
import { ImageUploadPreview } from '../../components/form/ImageUploadPreview';

const CUISINE_OPTIONS = ['Pakistani', 'Chinese', 'Italian', 'Fast Food', 'BBQ', 'Desserts'];

const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {[1, 2, 3].map((step) => (
      <div key={step} className="flex items-center gap-2">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border transition-colors ${
            step === current
              ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_20px_rgba(255,122,26,0.5)]'
              : step < current
              ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
              : 'bg-white/5 border-white/10 text-white/40'
          }`}
        >
          {step}
        </div>
        {step < 3 && <div className={`w-10 h-0.5 ${step < current ? 'bg-orange-500/50' : 'bg-white/10'}`} />}
      </div>
    ))}
  </div>
);

const inputClass =
  'bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors w-full';

const OwnerOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdRestaurantId, setCreatedRestaurantId] = useState(null); 

  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    description: '',
    address: '',
    deliveryFee: '',
    minimumOrder: '',
    openTime: '',
    closeTime: '',
    cuisines: [],
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const toggleCuisine = (cuisine) => {
    setBusinessInfo((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter((c) => c !== cuisine)
        : [...prev.cuisines, cuisine],
    }));
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const restaurant = await applyAsRestaurant({
        ...businessInfo,
        deliveryFee: Number(businessInfo.deliveryFee),
        minimumOrder: Number(businessInfo.minimumOrder),
      });
      setCreatedRestaurantId(restaurant.id);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
};

const handleLogoSubmit = async (e) => {
    e.preventDefault();
    if (!logoFile) {
      setError('Please select a logo image.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await uploadRestaurantLogo(createdRestaurantId, logoFile); 
      navigate('/owner/restaurants');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
};

const handleLogoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setLogoFile(file);
  setLogoPreview(URL.createObjectURL(file));
};

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <StepIndicator current={step} />

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Step 1 — account confirmation */}
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome, {user?.username} 👋</h1>
            <p className="text-white/50 mb-6">
              Your account is set up. Next, tell us about your restaurant so we can review your application.
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-full shadow-[0_0_20px_rgba(255,122,26,0.4)] transition-colors"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Step 2 — business info */}
        {step === 2 && (
          <form onSubmit={handleBusinessSubmit} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white mb-1">Tell us about your restaurant</h2>
            <input className={inputClass} placeholder="Restaurant name" required
              value={businessInfo.name}
              onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })} />
            <textarea className={inputClass} placeholder="Description (optional)" rows={2}
              value={businessInfo.description}
              onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })} />
            <input className={inputClass} placeholder="Address" required
              value={businessInfo.address}
              onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })} />

            <div className="flex gap-3">
              <input className={inputClass} type="number" step="0.01" placeholder="Delivery fee" required
                value={businessInfo.deliveryFee}
                onChange={(e) => setBusinessInfo({ ...businessInfo, deliveryFee: e.target.value })} />
              <input className={inputClass} type="number" step="0.01" placeholder="Minimum order" required
                value={businessInfo.minimumOrder}
                onChange={(e) => setBusinessInfo({ ...businessInfo, minimumOrder: e.target.value })} />
            </div>

            <div className="flex gap-3">
              <input className={inputClass} type="time" required
                value={businessInfo.openTime}
                onChange={(e) => setBusinessInfo({ ...businessInfo, openTime: e.target.value })} />
              <input className={inputClass} type="time" required
                value={businessInfo.closeTime}
                onChange={(e) => setBusinessInfo({ ...businessInfo, closeTime: e.target.value })} />
            </div>

            <div>
              <p className="text-white/50 text-sm mb-2">Cuisine types</p>
              <div className="flex flex-wrap gap-2">
                {CUISINE_OPTIONS.map((cuisine) => (
                  <button
                    type="button"
                    key={cuisine}
                    onClick={() => toggleCuisine(cuisine)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      businessInfo.cuisines.includes(cuisine)
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || businessInfo.cuisines.length === 0}
              className="mt-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3 rounded-full shadow-[0_0_20px_rgba(255,122,26,0.4)] transition-colors"
            >
              {loading ? 'Submitting...' : 'Continue'}
            </button>
          </form>
        )}

        {/* Step 3 — logo upload */}        
        {step === 3 && (
          <form onSubmit={handleLogoSubmit} className="flex flex-col gap-4 items-center">
            <h2 className="text-xl font-bold text-white mb-1 self-start">Upload your logo</h2>

            <ImageUploadPreview
              preview={logoPreview}
              onChange={handleLogoChange}
              size="w-40 h-40"
              label="Click to select logo image"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3 rounded-full shadow-[0_0_20px_rgba(255,122,26,0.4)] transition-colors"
            >
              {loading ? 'Uploading...' : 'Finish Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OwnerOnboarding;