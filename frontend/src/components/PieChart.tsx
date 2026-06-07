interface PieChartItem {
  label: string;
  value: number;
  formattedValue: string;
  meta?: string;
}

interface PieChartProps {
  title: string;
  centerLabel: string;
  centerValue: string;
  emptyMessage: string;
  items: PieChartItem[];
}

const PIE_COLORS = ["#2563eb", "#14b8a6", "#7c3aed", "#ea580c", "#16a34a", "#dc2626", "#0891b2"];

export function PieChart({ title, centerLabel, centerValue, emptyMessage, items }: PieChartProps) {
  const chartItems = items.filter((item) => item.value > 0);
  const total = chartItems.reduce((sum, item) => sum + item.value, 0);

  if (chartItems.length === 0 || total <= 0) {
    return (
      <section className="panel pie-panel">
        <div className="panel__header">
          <h2>{title}</h2>
        </div>
        <p className="empty-state">{emptyMessage}</p>
      </section>
    );
  }

  let cumulativePercent = 0;
  const segments = chartItems.map((item, index) => {
    const percent = (item.value / total) * 100;
    const start = cumulativePercent;
    const end = cumulativePercent + percent;
    cumulativePercent = end;

    return {
      ...item,
      color: PIE_COLORS[index % PIE_COLORS.length],
      percent,
      start,
      end,
    };
  });

  const gradient = segments
    .map((segment) => `${segment.color} ${segment.start.toFixed(2)}% ${segment.end.toFixed(2)}%`)
    .join(", ");

  return (
    <section className="panel pie-panel">
      <div className="panel__header">
        <h2>{title}</h2>
      </div>

      <div className="pie-panel__content">
        <div
          aria-label={`${title} pie chart`}
          className="pie-chart"
          role="img"
          style={{ background: `conic-gradient(${gradient})` }}
        >
          <div className="pie-chart__center">
            <span>{centerLabel}</span>
            <strong>{centerValue}</strong>
          </div>
        </div>

        <div className="pie-legend">
          {segments.map((segment) => (
            <div className="pie-legend__item" key={segment.label}>
              <span className="pie-legend__swatch" style={{ backgroundColor: segment.color }} />
              <div>
                <strong>{segment.label}</strong>
                <small>
                  {segment.formattedValue} • {segment.percent.toFixed(1)}%{segment.meta ? ` • ${segment.meta}` : ""}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}