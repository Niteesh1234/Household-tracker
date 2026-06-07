import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError } from "../api/http";
import { createMaintenanceRecord, listCategories, listMaintenanceRecords } from "../api/resourcesApi";
import { FeedbackMessage } from "../components/FeedbackMessage";
import type {
  CategoryResponse,
  MaintenanceCreatePayload,
  MaintenancePriority,
  MaintenanceResponse,
  MaintenanceStatus,
} from "../types/domain";
import { MAINTENANCE_PRIORITY_OPTIONS, MAINTENANCE_STATUS_OPTIONS } from "../types/domain";
import { formatCurrency, formatDate, optionalText, toTitleCase } from "../utils/formatters";

const today = new Date().toISOString().slice(0, 10);

const initialForm: MaintenanceCreatePayload = {
  title: "",
  asset_name: "",
  asset_type: "",
  category_id: "",
  maintenance_date: today,
  status: "scheduled",
  priority: "medium",
  cost: 0,
  service_provider: "",
  next_due_date: "",
  notes: "",
};

export function MaintenancePage() {
  const [records, setRecords] = useState<MaintenanceResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [form, setForm] = useState<MaintenanceCreatePayload>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const maintenanceCategories = useMemo(
    () => categories.filter((category) => category.category_type === "maintenance" || category.category_type === "both"),
    [categories],
  );

  async function loadPageData() {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const [categoryResponse, maintenanceResponse] = await Promise.all([listCategories(), listMaintenanceRecords()]);
      setCategories(categoryResponse);
      setRecords(maintenanceResponse);

      const firstMaintenanceCategory = categoryResponse.find(
        (category) => category.category_type === "maintenance" || category.category_type === "both",
      );

      setForm((current) => ({ ...current, category_id: current.category_id || firstMaintenanceCategory?.id || "" }));
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to load maintenance records."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPageData();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload: MaintenanceCreatePayload = {
        title: form.title.trim(),
        asset_name: form.asset_name.trim(),
        asset_type: form.asset_type.trim(),
        category_id: form.category_id,
        maintenance_date: form.maintenance_date,
        status: form.status,
        priority: form.priority,
        cost: Number(form.cost),
        service_provider: form.service_provider?.trim() || null,
        next_due_date: form.next_due_date || null,
        notes: form.notes?.trim() || null,
      };

      const createdRecord = await createMaintenanceRecord(payload);
      setRecords((current) => [createdRecord, ...current]);
      setForm({ ...initialForm, category_id: form.category_id, maintenance_date: today });
      setSuccessMessage(`Created maintenance record "${createdRecord.title}".`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to create maintenance record."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-shell page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Home care</p>
          <h1>Maintenance</h1>
          <p className="hero__description">Create and review household maintenance records by asset and category.</p>
        </div>
      </section>

      <section className="resource-grid">
        <section className="panel">
          <div className="panel__header">
            <h2>Create maintenance record</h2>
          </div>

          {maintenanceCategories.length === 0 && !isLoading && (
            <FeedbackMessage
              type="info"
              title="Create a category first"
              message="Maintenance records need a category with type Maintenance or Both."
            />
          )}

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="form-field form-field--full">
              <span>Title</span>
              <input
                required
                minLength={2}
                maxLength={120}
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="HVAC inspection"
              />
            </label>

            <label className="form-field">
              <span>Asset name</span>
              <input
                required
                minLength={2}
                maxLength={120}
                value={form.asset_name}
                onChange={(event) => setForm((current) => ({ ...current, asset_name: event.target.value }))}
                placeholder="Main HVAC"
              />
            </label>

            <label className="form-field">
              <span>Asset type</span>
              <input
                required
                minLength={2}
                maxLength={80}
                value={form.asset_type}
                onChange={(event) => setForm((current) => ({ ...current, asset_type: event.target.value }))}
                placeholder="HVAC, Plumbing, Appliance"
              />
            </label>

            <label className="form-field">
              <span>Category</span>
              <select
                required
                value={form.category_id}
                onChange={(event) => setForm((current) => ({ ...current, category_id: event.target.value }))}
              >
                <option value="">Select category</option>
                {maintenanceCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Maintenance date</span>
              <input
                required
                type="date"
                value={form.maintenance_date}
                onChange={(event) => setForm((current) => ({ ...current, maintenance_date: event.target.value }))}
              />
            </label>

            <label className="form-field">
              <span>Status</span>
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as MaintenanceStatus }))}
              >
                {MAINTENANCE_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {toTitleCase(option)}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Priority</span>
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm((current) => ({ ...current, priority: event.target.value as MaintenancePriority }))
                }
              >
                {MAINTENANCE_PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {toTitleCase(option)}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Cost</span>
              <input
                min="0"
                step="0.01"
                type="number"
                value={form.cost || ""}
                onChange={(event) => setForm((current) => ({ ...current, cost: Number(event.target.value) }))}
                placeholder="250.00"
              />
            </label>

            <label className="form-field">
              <span>Next due date</span>
              <input
                type="date"
                value={form.next_due_date ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, next_due_date: event.target.value }))}
              />
            </label>

            <label className="form-field form-field--full">
              <span>Service provider</span>
              <input
                maxLength={120}
                value={form.service_provider ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, service_provider: event.target.value }))}
                placeholder="Company or person who performed the work"
              />
            </label>

            <label className="form-field form-field--full">
              <span>Notes</span>
              <textarea
                maxLength={500}
                value={form.notes ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Optional details"
              />
            </label>

            <button className="primary-button" disabled={isSubmitting || maintenanceCategories.length === 0} type="submit">
              {isSubmitting ? "Creating…" : "Create maintenance record"}
            </button>
          </form>

          {successMessage && <FeedbackMessage type="success" title="Success" message={successMessage} />}
          {errorMessage && <FeedbackMessage type="error" title="Something went wrong" message={errorMessage} />}
        </section>

        <section className="panel">
          <div className="panel__header">
            <h2>Recent maintenance records</h2>
            <button className="secondary-button" type="button" onClick={() => void loadPageData()}>
              Refresh
            </button>
          </div>

          {isLoading ? (
            <p className="empty-state">Loading maintenance records…</p>
          ) : records.length === 0 ? (
            <p className="empty-state">No maintenance records yet. Create your first home-care record.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Asset</th>
                    <th>Status</th>
                    <th>Next due</th>
                    <th className="align-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td>{record.title}</td>
                      <td>
                        {record.asset_name}
                        <small className="table-subtext">{record.asset_type}</small>
                      </td>
                      <td>{toTitleCase(record.status)}</td>
                      <td>{formatDate(record.next_due_date)}</td>
                      <td className="align-right">{formatCurrency(record.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return `${error.message}${error.status ? ` (HTTP ${error.status})` : ""}`;
  }

  return fallback;
}