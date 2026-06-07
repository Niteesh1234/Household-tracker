import { useEffect, useState } from "react";

import { getDashboardAnalytics } from "../api/analyticsApi";
import { ApiError } from "../api/http";
import { BarList } from "../components/BarList";
import { PieChart } from "../components/PieChart";
import { SummaryCard } from "../components/SummaryCard";
import { apiV1Url, frontendConfig } from "../config/environment";
import type { DashboardAnalyticsResponse } from "../types/analytics";
import { formatCurrency, formatDate, formatNumber, toTitleCase } from "../utils/formatters";

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await getDashboardAnalytics();

        if (isActive) {
          setDashboard(response);
        }
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (error instanceof ApiError) {
          setErrorMessage(`${error.message}${error.status ? ` (HTTP ${error.status})` : ""}`);
          return;
        }

        setErrorMessage("Unable to load dashboard data. Make sure the backend is running.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  const expenseSpendItems =
    dashboard?.expense_spend_by_category.map((item) => ({
      label: item.category_name,
      value: item.total_amount,
      formattedValue: formatCurrency(item.total_amount),
      meta: `${formatNumber(item.count)} expense${item.count === 1 ? "" : "s"}`,
    })) ?? [];

  const maintenanceCostItems =
    dashboard?.maintenance_cost_by_asset_type.map((item) => ({
      label: item.asset_type,
      value: item.total_cost,
      formattedValue: formatCurrency(item.total_cost),
      meta: `${formatNumber(item.count)} record${item.count === 1 ? "" : "s"}`,
    })) ?? [];

  const expensePieItems = expenseSpendItems.map((item) => ({
    label: item.label,
    value: item.value,
    formattedValue: item.formattedValue,
    meta: item.meta,
  }));

  const maintenancePieItems = maintenanceCostItems.map((item) => ({
    label: item.label,
    value: item.value,
    formattedValue: item.formattedValue,
    meta: item.meta,
  }));

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Household Maintenance Tracker</p>
          <h1>Dashboard</h1>
          <p className="hero__description">
            First React screen connected to the FastAPI analytics endpoint.
          </p>
        </div>

        <div className="environment-badge" title="Frontend environment and API base URL">
          <span>{frontendConfig.appEnvironment}</span>
          <strong>{apiV1Url}</strong>
        </div>
      </section>

      {isLoading && <div className="status-card">Loading dashboard analytics…</div>}

      {errorMessage && (
        <div className="status-card status-card--error">
          <strong>Could not load dashboard</strong>
          <span>{errorMessage}</span>
          <small>Start MongoDB and FastAPI, then refresh this page.</small>
        </div>
      )}

      {dashboard && !isLoading && !errorMessage && (
        <>
          <section className="summary-grid" aria-label="Dashboard summary">
            <SummaryCard
              label="Total expenses"
              value={formatCurrency(dashboard.expenses.total_amount)}
              helperText={`${formatNumber(dashboard.expenses.total_count)} expense records`}
              tone="blue"
            />
            <SummaryCard
              label="Maintenance cost"
              value={formatCurrency(dashboard.maintenance.total_cost)}
              helperText={`${formatNumber(dashboard.maintenance.total_count)} maintenance records`}
              tone="green"
            />
            <SummaryCard
              label="Expense categories"
              value={formatNumber(dashboard.expense_spend_by_category.length)}
              helperText="Categories with spending"
              tone="purple"
            />
            <SummaryCard
              label="Asset types"
              value={formatNumber(dashboard.maintenance_cost_by_asset_type.length)}
              helperText="Maintenance groups tracked"
              tone="orange"
            />
          </section>

          <section className="pie-grid" aria-label="Dashboard pie charts">
            <PieChart
              title="Expense distribution"
              centerLabel="Expenses"
              centerValue={formatCurrency(dashboard.expenses.total_amount)}
              emptyMessage="No expense distribution data yet. Add expenses to see this pie chart."
              items={expensePieItems}
            />
            <PieChart
              title="Maintenance distribution"
              centerLabel="Maintenance"
              centerValue={formatCurrency(dashboard.maintenance.total_cost)}
              emptyMessage="No maintenance distribution data yet. Add maintenance records to see this pie chart."
              items={maintenancePieItems}
            />
          </section>

          <section className="charts-grid">
            <BarList
              title="Spend by category"
              emptyMessage="No expense category data yet. Create expenses from the API to populate this chart."
              items={expenseSpendItems}
            />
            <BarList
              title="Maintenance cost by asset type"
              emptyMessage="No maintenance cost data yet. Create maintenance records from the API to populate this chart."
              items={maintenanceCostItems}
            />
          </section>

          <section className="tables-grid">
            <section className="panel">
              <div className="panel__header">
                <h2>Recent expenses</h2>
              </div>
              {dashboard.recent_expenses.length === 0 ? (
                <p className="empty-state">No recent expenses yet.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th className="align-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.recent_expenses.map((expense) => (
                        <tr key={expense.id}>
                          <td>{expense.title}</td>
                          <td>{expense.category_name}</td>
                          <td>{formatDate(expense.expense_date)}</td>
                          <td className="align-right">{formatCurrency(expense.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="panel">
              <div className="panel__header">
                <h2>Recent maintenance</h2>
              </div>
              {dashboard.recent_maintenance_records.length === 0 ? (
                <p className="empty-state">No recent maintenance records yet.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Asset</th>
                        <th>Status</th>
                        <th className="align-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.recent_maintenance_records.map((record) => (
                        <tr key={record.id}>
                          <td>{record.title}</td>
                          <td>{record.asset_name}</td>
                          <td>{toTitleCase(record.status)}</td>
                          <td className="align-right">{formatCurrency(record.cost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </section>
        </>
      )}
    </main>
  );
}