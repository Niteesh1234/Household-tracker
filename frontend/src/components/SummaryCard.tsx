interface SummaryCardProps {
  label: string;
  value: string;
  helperText: string;
  tone: "blue" | "green" | "purple" | "orange";
}

export function SummaryCard({ label, value, helperText, tone }: SummaryCardProps) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <p className="summary-card__label">{label}</p>
      <strong className="summary-card__value">{value}</strong>
      <span className="summary-card__helper">{helperText}</span>
    </article>
  );
}