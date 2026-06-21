import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../api/auth.api";
import { useAuth } from "../context/auth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ErrorMessage } from "../components/ui/Feedback";

export const RegisterPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const validate = (): string => {
    if (!username.trim()) return "Username is required.";
    if (username.length < 3) return "Username must be at least 3 characters.";
    if (!email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError("");

    try {
      const data = await registerApi({ username, email, password });
      login(data.token, data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-card p-8 shadow-sm">
        <h1 className="font-display text-3xl text-ink mb-1">Create an account</h1>
        <p className="text-ink-muted text-sm mb-6">List and manage properties in minutes.</p>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Username" value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="propuser" autoComplete="username" />

          <Input label="Email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" autoComplete="email" />

          <Input label="Password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters" autoComplete="new-password" />

          <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
            Create account
          </Button>
        </form>

        <p className="text-sm text-ink-muted text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
