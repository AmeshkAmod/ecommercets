import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, type SubmitEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { resetPassword } from "../../store/slice/authSlice";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);

  const [password, setPassword] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    await dispatch(resetPassword({ token, password })).unwrap();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#020617] via-black to-[#020617] px-4">
      <div className="relative w-full max-w-sm rounded-3xl p-px bg-linear-to-br from-yellow-400/30 to-transparent">
        <div className="bg-[#020617]/90 backdrop-blur-xl rounded-3xl p-7 text-gray-200 shadow-2xl">

          <h1 className="text-3xl font-extrabold text-center tracking-wide mb-1">
            Dark<span className="text-yellow-400">.</span>Cart
          </h1>

          <p className="text-center text-xs text-gray-400 mb-6">
            Enter your new password
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm
                           focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400
                           transition"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full mt-2 bg-yellow-400 text-black py-2.5 rounded-xl font-semibold text-sm
                         hover:brightness-110 transition disabled:opacity-60
                         active:scale-[0.98]"
            >
              {status === "loading" ? "Updating..." : "Update Password"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Back to{" "}
            <Link
              to="/login"
              className="text-yellow-400 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}