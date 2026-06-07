interface FeedbackMessageProps {
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}

export function FeedbackMessage({ type, title, message }: FeedbackMessageProps) {
  return (
    <div className={`feedback feedback--${type}`}>
      <strong>{title}</strong>
      {message && <span>{message}</span>}
    </div>
  );
}