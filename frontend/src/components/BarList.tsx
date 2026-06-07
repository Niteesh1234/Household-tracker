interface BarListItem {
  label: string;
  value: number;
  meta: string;
  formattedValue: string;
}

interface BarListProps {
  title: string;
  emptyMessage: string;
  items: BarListItem[];
}

export function BarList({ title, emptyMessage, items }: BarListProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 0);

  return (
    <section className="panel">
      <div className="panel__header">
        <h2>{title}</h2>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">{emptyMessage}</p>
      ) : (
        <div className="bar-list">
          {items.map((item) => {
            const width = maxValue > 0 ? Math.max((item.value / maxValue) * 100, 8) : 8;

            return (
              <div className="bar-list__item" key={item.label}>
                <div className="bar-list__row">
                  <span>{item.label}</span>
                  <strong>{item.formattedValue}</strong>
                </div>
                <div className="bar-list__track" aria-hidden="true">
                  <div className="bar-list__bar" style={{ width: `${width}%` }} />
                </div>
                <span className="bar-list__meta">{item.meta}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}