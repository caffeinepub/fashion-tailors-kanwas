import { Toaster } from "@/components/ui/sonner";
import Footer from "./components/Footer";
import InstallPWA from "./components/InstallPWA";
import Navbar from "./components/Navbar";
import { BrowserRouter, Navigate, Route, Routes } from "./lib/router";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import BookingPage from "./pages/BookingPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import LocationPage from "./pages/LocationPage";
import ServicesPage from "./pages/ServicesPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = sessionStorage.getItem("kanwas_admin_auth") === "true";
  if (!isAuth) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#141818",
            color: "#f3f0e8",
            border: "1px solid #a8842c",
          },
        }}
      />
      <InstallPWA />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/services"
          element={
            <Layout>
              <ServicesPage />
            </Layout>
          }
        />
        <Route
          path="/gallery"
          element={
            <Layout>
              <GalleryPage />
            </Layout>
          }
        />
        <Route
          path="/booking"
          element={
            <Layout>
              <BookingPage />
            </Layout>
          }
        />
        <Route
          path="/location"
          element={
            <Layout>
              <LocationPage />
            </Layout>
          }
        />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
