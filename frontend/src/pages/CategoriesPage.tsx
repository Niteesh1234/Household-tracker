import { FormEvent, useEffect, useState } from "react";

import { createCategory, listCategories } from "../api/resourcesApi";
import { ApiError } from "../api/http";
import { FeedbackMessage } from "../components/FeedbackMessage";
import type { CategoryCreatePayload, CategoryResponse, CategoryType } from "../types/domain";
import { CATEGORY_TYPE_OPTIONS } from "../types/domain";
import { formatDate, optionalText, toTitleCase } from "../utils/formatters";

const initialForm: CategoryCreatePayload = {
  name: "",
  description: "",
  category_type: "both",
  color: "#2563eb",
};

export function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [form, setForm] = useState<CategoryCreatePayload>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadCategories() {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await listCategories();
      setCategories(response);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to load categories."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload: CategoryCreatePayload = {
        name: form.name.trim(),
        description: form.description?.trim() || null,
        category_type: form.category_type,
        color: form.color,
      };

      const createdCategory = await createCategory(payload);
      setCategories((current) => [createdCategory, ...current]);
      setForm(initialForm);
      setSuccessMessage(`Created category "${createdCategory.name}".`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to create category."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-shell page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Setup</p>
          <h1>Categories</h1>
          <p className="hero__description">
            Create reusable categories for expenses, maintenance records, or both.
          </p>
        </div>
      </section>

      <section className="resource-grid">
        <section className="panel">
          <div className="panel__header">
            <h2>Create category</h2>
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Name</span>
              <input
                required
                minLength={2}
                maxLength={80}
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Utilities"
              />
            </label>

            <label className="form-field">
              <span>Type</span>
              <select
                value={form.category_type}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category_type: event.target.value as CategoryType }))
                }
              >
                {CATEGORY_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {toTitleCase(option)}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Color</span>
              <input
                type="color"
                value={form.color}
                onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
              />
            </label>

            <label className="form-field form-field--full">
              <span>Description</span>
              <textarea
                maxLength={300}
                value={form.description ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Optional notes about when to use this category"
              />
            </label>

            <button className="primary-button" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating…" : "Create category"}
            </button>
          </form>

          {successMessage && <FeedbackMessage type="success" title="Success" message={successMessage} />}
          {errorMessage && <FeedbackMessage type="error" title="Something went wrong" message={errorMessage} />}
        </section>

        <section className="panel">
          <div className="panel__header">
            <h2>Category list</h2>
            <button className="secondary-button" type="button" onClick={() => void loadCategories()}>
              Refresh
            </button>
          </div>

          {isLoading ? (
            <p className="empty-state">Loading categories…</p>
          ) : categories.length === 0 ? (
            <p className="empty-state">No categories yet. Create one to start tracking expenses and maintenance.</p>
          ) : (
            <div className="card-list">
              {categories.map((category) => (
                <article className="category-card" key={category.id}>
                  <span className="category-card__swatch" style={{ backgroundColor: category.color }} />
                  <div>
                    <strong>{category.name}</strong>
                    <p>{optionalText(category.description)}</p>
                    <small>
                      {toTitleCase(category.category_type)} • Created {formatDate(category.created_at)}
                    </small>
                  </div>
                </article>
              ))}
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