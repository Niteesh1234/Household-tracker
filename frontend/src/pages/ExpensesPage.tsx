import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError } from "../api/http";
import { createExpense, listCategories, listExpenses } from "../api/resourcesApi";
import { FeedbackMessage } from "../components/FeedbackMessage";
import type { CategoryResponse, ExpenseCreatePayload, ExpenseResponse, PaymentMethod } from "../types/domain";
import { PAYMENT_METHOD_OPTIONS } from "../types/domain";
import { formatCurrency, formatDate, optionalText, toTitleCase } from "../utils/formatters";

const today = new Date().toISOString().slice(0, 10);

const initialForm: ExpenseCreatePayload = {
  title: "",
  amount: 0,
  category_id: "",
  expense_date: today,
  paid_by: "Household",
  vendor: "",
  payment_method: "other",
  notes: "",
};

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [form, setForm] = useState<ExpenseCreatePayload>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.category_type === "expense" || category.category_type === "both"),
    [categories],
  );

  async function loadPageData() {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const [categoryResponse, expenseResponse] = await Promise.all([listCategories(), listExpenses()]);
      setCategories(categoryResponse);
      setExpenses(expenseResponse);

      const firstExpenseCategory = categoryResponse.find(
        (category) => category.category_type === "expense" || category.category_type === "both",
      );

      setForm((current) => ({ ...current, category_id: current.category_id || firstExpenseCategory?.id || "" }));
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to load expenses."));
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
      const payload: ExpenseCreatePayload = {
        title: form.title.trim(),
        amount: Number(form.amount),
        category_id: form.category_id,
        expense_date: form.expense_date,
        paid_by: form.paid_by.trim() || "Household",
        vendor: form.vendor?.trim() || null,
        payment_method: form.payment_method,
        notes: form.notes?.trim() || null,
      };

      const createdExpense = await createExpense(payload);
      setExpenses((current) => [createdExpense, ...current]);
      setForm({ ...initialForm, category_id: form.category_id, expense_date: today });
      setSuccessMessage(`Created expense "${createdExpense.title}".`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to create expense."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-shell page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Money out</p>
          <h1>Expenses</h1>
          <p className="hero__description">Create and review household expenses using your existing categories.</p>
        </div>
      </section>

      <section className="resource-grid">
        <section className="panel">
          <div className="panel__header">
            <h2>Create expense</h2>
          </div>

          {expenseCategories.length === 0 && !isLoading && (
            <FeedbackMessage
              type="info"
              title="Create a category first"
              message="Expenses need a category with type Expense or Both. Go to Categories and create one."
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
                placeholder="Electric bill"
              />
            </label>

            <label className="form-field">
              <span>Amount</span>
              <input
                required
                min="0.01"
                step="0.01"
                type="number"
                value={form.amount || ""}
                onChange={(event) => setForm((current) => ({ ...current, amount: Number(event.target.value) }))}
                placeholder="125.50"
              />
            </label>

            <label className="form-field">
              <span>Date</span>
              <input
                required
                type="date"
                value={form.expense_date}
                onChange={(event) => setForm((current) => ({ ...current, expense_date: event.target.value }))}
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
                {expenseCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Payment method</span>
              <select
                value={form.payment_method}
                onChange={(event) =>
                  setForm((current) => ({ ...current, payment_method: event.target.value as PaymentMethod }))
                }
              >
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {toTitleCase(option)}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Paid by</span>
              <input
                required
                minLength={2}
                maxLength={80}
                value={form.paid_by}
                onChange={(event) => setForm((current) => ({ ...current, paid_by: event.target.value }))}
              />
            </label>

            <label className="form-field">
              <span>Vendor</span>
              <input
                maxLength={120}
                value={form.vendor ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, vendor: event.target.value }))}
                placeholder="APS, Costco, Home Depot"
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

            <button className="primary-button" disabled={isSubmitting || expenseCategories.length === 0} type="submit">
              {isSubmitting ? "Creating…" : "Create expense"}
            </button>
          </form>

          {successMessage && <FeedbackMessage type="success" title="Success" message={successMessage} />}
          {errorMessage && <FeedbackMessage type="error" title="Something went wrong" message={errorMessage} />}
        </section>

        <section className="panel">
          <div className="panel__header">
            <h2>Recent expenses</h2>
            <button className="secondary-button" type="button" onClick={() => void loadPageData()}>
              Refresh
            </button>
          </div>

          {isLoading ? (
            <p className="empty-state">Loading expenses…</p>
          ) : expenses.length === 0 ? (
            <p className="empty-state">No expenses yet. Create your first household expense.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Vendor</th>
                    <th className="align-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.title}</td>
                      <td>{expense.category_name}</td>
                      <td>{formatDate(expense.expense_date)}</td>
                      <td>{optionalText(expense.vendor)}</td>
                      <td className="align-right">{formatCurrency(expense.amount)}</td>
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