import { useEffect, useState, useRef } from "react"; // Added useRef
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const hasCalled = useRef(false);
  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const confirmEmail = async () => {
      try {
        await axios.get(`https://gcb-fest.onrender.com/api/auth/verify-email/${token}`);
        // await axios.get(`http://localhost:8081/api/auth/verify-email/${token}`);
        setStatus("success");
      } catch (err) {
        console.log(err.response?.data);
        setStatus("error");
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <h1 className="text-2xl font-bold">Verifying...</h1>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h1 className="text-2xl font-bold">Verified!</h1>
            <p className="text-slate-400">
              Your account is active. You can now access your dashboard.
            </p>
            <Link
              to="/"
              className="mt-4 bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl transition-all inline-block w-full font-semibold"
            >
              Sign In
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-16 h-16 text-red-500" />
            <h1 className="text-2xl font-bold">Verification Failed</h1>
            <p className="text-slate-400">
              The link is invalid or has expired.
            </p>
            <Link to="/register" className="mt-4 text-blue-400 hover:underline">
              Try Registering Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
