import { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { updateProfile } from "../../store/slice/authSlice";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  console.log("Profile user:", user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setStreet(user.address?.street || "");
      setCity(user.address?.city || "");
      setStateField(user.address?.state || "");
      setPostalCode(user.address?.postalCode || "");
      setCountry(user.address?.country || "");
    }
  }, [user]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    dispatch(
      updateProfile({
        name,

        phone,
        address: {
          street,
          city,
          state: stateField,
          postalCode,
          country,
        },
      }),
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-3xl mx-auto bg-black border border-gray-800 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 text-gray-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#020617] border border-gray-700 px-4 py-2 rounded"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-400">Email</label>
            <input
              value={email}
              disabled
              className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-gray-400">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#020617] border border-gray-700 px-4 py-2 rounded"
            />
          </div>

          {/* Address Section */}
          <div className="border-t border-gray-700 pt-5">
            <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>

            <div className="space-y-3">
              <input
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-[#020617] border border-gray-700 px-4 py-2 rounded"
              />

              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#020617] border border-gray-700 px-4 py-2 rounded"
              />

              <input
                placeholder="State"
                value={stateField}
                onChange={(e) => setStateField(e.target.value)}
                className="w-full bg-[#020617] border border-gray-700 px-4 py-2 rounded"
              />

              <input
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full bg-[#020617] border border-gray-700 px-4 py-2 rounded"
              />

              <input
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#020617] border border-gray-700 px-4 py-2 rounded"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:scale-105 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
