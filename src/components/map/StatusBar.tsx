"use client";

interface StatusBarProps {
  isLoading: boolean;
  isError: boolean;
  latestTime: Date | undefined;
}

export function StatusBar({ isLoading, isError, latestTime }: StatusBarProps) {
  const text = isError
    ? "データの取得に失敗しました"
    : isLoading
      ? "読み込み中…"
      : latestTime
        ? `最終更新 ${new Intl.DateTimeFormat("ja-JP", {
            timeZone: "Asia/Tokyo",
            hour: "2-digit",
            minute: "2-digit",
          }).format(latestTime)}`
        : "";

  if (!text) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--panel-surface)",
        color: isError ? "#d03b3b" : "var(--panel-ink-secondary)",
        borderRadius: 8,
        padding: "6px 10px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        fontSize: 12,
      }}
    >
      {text}
    </div>
  );
}
