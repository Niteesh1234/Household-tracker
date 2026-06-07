import { useState } from "react";

import { AppHeader } from "./components/AppHeader";
import { CategoriesPage } from "./pages/CategoriesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExpensesPage } from "./pages/ExpensesPage";
import { MaintenancePage } from "./pages/MaintenancePage";
import type { AppView } from "./types/navigation";

export default function App() {
  const [activeView, setActiveView] = useState<AppView>("dashboard");

  return (
    <>
      <AppHeader activeView={activeView} onNavigate={setActiveView} />
      {activeView === "dashboard" && <DashboardPage />}
      {activeView === "categories" && <CategoriesPage />}
      {activeView === "expenses" && <ExpensesPage />}
      {activeView === "maintenance" && <MaintenancePage />}
    </>
  );
}