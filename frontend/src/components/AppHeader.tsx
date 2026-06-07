import type { AppView } from "../types/navigation";
import { apiV1Url, frontendConfig } from "../config/environment";

interface AppHeaderProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

const navItems: Array<{ view: AppView; label: string }> = [
  { view: "dashboard", label: "Dashboard" },
  { view: "categories", label: "Categories" },
  { view: "expenses", label: "Expenses" },
  { view: "maintenance", label: "Maintenance" },
];

export function AppHeader({ activeView, onNavigate }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="app-header__eyebrow">Household Tracker</p>
        <strong className="app-header__title">Maintenance + Expenses</strong>
      </div>

      <nav className="app-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            className={item.view === activeView ? "app-nav__button app-nav__button--active" : "app-nav__button"}
            key={item.view}
            type="button"
            onClick={() => onNavigate(item.view)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="app-header__meta" title={apiV1Url}>
        <span>{frontendConfig.appEnvironment}</span>
        <small>{apiV1Url}</small>
      </div>
    </header>
  );
}