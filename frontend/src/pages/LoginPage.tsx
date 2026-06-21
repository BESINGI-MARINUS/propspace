import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginApi } from "../api/auth.api";
import { useAuth } from "../context/auth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ErrorMessage } from "../components/ui/Feedback";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = (location.state as any)?.from?.pathname ?? "/";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Email and password are required."); return; }

    setLoading(true);
    setError("");

    try {
      const data = await loginApi({ email, password });
      login(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-card p-8 shadow-sm">
        <h1 className="font-display text-3xl text-ink mb-1">Welcome back</h1>
        <p className="text-ink-muted text-sm mb-6">Sign in to manage your listings.</p>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" autoComplete="email" />

          <Input label="Password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" autoComplete="current-password" />

          <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
            Sign in
          </Button>
        </form>

        <p className="text-sm text-ink-muted text-center mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Get started
          </Link>
        </p>
      </div>
    </div>
  );
};
