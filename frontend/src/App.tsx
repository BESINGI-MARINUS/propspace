import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/layout/Navbar";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

import { HomePage }           from "./pages/HomePage";
import { LoginPage }          from "./pages/LoginPage";
import { RegisterPage }       from "./pages/RegisterPage";
import { PropertyDetailPage } from "./pages/PropertyDetailPage";
import { DashboardPage }      from "./pages/DashboardPage";
import { CreateListingPage }  from "./pages/CreateListingPage";
import { EditListingPage }    from "./pages/EditListingPage";
import { ProfilePage }        from "./pages/ProfilePage";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/"            element={<HomePage />} />
            <Route path="/login"       element={<LoginPage />} />
            <Route path="/register"    element={<RegisterPage />} />
            <Route path="/listings/:id" element={<PropertyDetailPage />} />

            {/* Protected */}
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/listings/new" element={
              <ProtectedRoute><CreateListingPage /></ProtectedRoute>
            } />
            <Route path="/listings/:id/edit" element={
              <ProtectedRoute><EditListingPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h1 className="font-display text-6xl text-ink mb-3">404</h1>
                <p className="text-ink-muted mb-6">This page doesn't exist.</p>
                <a href="/" className="text-primary font-medium hover:underline">Back to listings</a>
              </div>
            } />
          </Routes>
        </div>

        <footer className="bg-primary text-white/60 text-xs text-center py-5 mt-10">
          © {new Date().getFullYear()} PropSpace — Property listings platform
        </footer>
      </div>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
