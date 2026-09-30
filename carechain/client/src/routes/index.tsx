import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { AppShell } from "../layouts/AppShell";
import { AdminPage, DemoPage, DoctorPage, DoctorPatientPage, LoginPage, OverviewPage, PassportPage, PatientPage, ProviderPage } from "../pages/Pages";

function Shell({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

export function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<Shell><OverviewPage /></Shell>} />
    <Route path="/patient" element={<Shell><PatientPage /></Shell>} />
    <Route path="/patient/passport" element={<Shell><PassportPage /></Shell>} />
    <Route path="/doctor" element={<Shell><DoctorPage /></Shell>} />
    <Route path="/doctor/patient/:id" element={<Shell><DoctorPatientPage /></Shell>} />
    <Route path="/provider" element={<Shell><ProviderPage /></Shell>} />
    <Route path="/admin" element={<Shell><AdminPage /></Shell>} />
    <Route path="/demo" element={<Shell><DemoPage /></Shell>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}