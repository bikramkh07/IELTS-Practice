export default function MockFeedbackBanner() {
  return (
    <p
      style={{
        margin: '0 0 12px',
        padding: '8px 12px',
        borderRadius: 8,
        background: 'rgba(255, 193, 7, 0.12)',
        border: '1px solid rgba(255, 193, 7, 0.35)',
        color: 'var(--gold)',
        fontSize: '0.85rem',
      }}
    >
      Sample scores — configure <code>GEMINI_API_KEY</code> for live AI evaluation.
    </p>
  );
}
