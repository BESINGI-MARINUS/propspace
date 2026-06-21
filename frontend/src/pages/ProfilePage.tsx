import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/auth";
import { updateProfileApi, changePasswordApi } from "../api/user.api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ErrorMessage, SuccessMessage } from "../components/ui/Feedback";

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  // Profile form state
  const [username, setUsername] = useState(user?.username ?? "");
  const [phone, setPhone]       = useState(user?.phone ?? "");
  const [avatar, setAvatar]     = useState(user?.avatar ?? "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg]         = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading]     = useState(false);
  const [pwMsg, setPwMsg]             = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const data = await updateProfileApi({ username, phone, avatar });
      updateUser(data.user);
      setProfileMsg({ type: "success", text: "Profile updated." });
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.response?.data?.message ?? "Update failed." });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPwMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    setPwLoading(true);
    setPwMsg(null);
    try {
      await changePasswordApi({ oldPassword, newPassword });
      setPwMsg({ type: "success", text: "Password updated." });
      setOldPassword(""); setNewPassword("");
    } catch (err: any) {
      setPwMsg({ type: "error", text: err.response?.data?.message ?? "Password change failed." });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl text-ink mb-8">Account settings</h1>

      {/* Profile section */}
      <section className="bg-surface-card border border-surface-border rounded-card p-6 sm:p-8 mb-6">
        <h2 className="font-display text-xl text-ink mb-5">Profile</h2>

        {profileMsg?.type === "error"   && <div className="mb-4"><ErrorMessage message={profileMsg.text} /></div>}
        {profileMsg?.type === "success" && <div className="mb-4"><SuccessMessage message={profileMsg.text} /></div>}

        {/* Avatar preview */}
        {avatar && (
          <div className="mb-4">
            <img src={avatar} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover border-2 border-surface-border" />
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input label="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+237 6XX XXX XXX" />
          <Input label="Avatar URL" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
          <div className="pt-1">
            <Button type="submit" loading={profileLoading}>Save changes</Button>
          </div>
        </form>
      </section>

      {/* Password section */}
      <section className="bg-surface-card border border-surface-border rounded-card p-6 sm:p-8">
        <h2 className="font-display text-xl text-ink mb-5">Change password</h2>

        {pwMsg?.type === "error"   && <div className="mb-4"><ErrorMessage message={pwMsg.text} /></div>}
        {pwMsg?.type === "success" && <div className="mb-4"><SuccessMessage message={pwMsg.text} /></div>}

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <Input label="Current password" type="password" value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)} placeholder="••••••••" />
          <Input label="New password" type="password" value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" />
          <div className="pt-1">
            <Button type="submit" loading={pwLoading}>Update password</Button>
          </div>
        </form>
      </section>
    </main>
  );
};
