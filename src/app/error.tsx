'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#050505',
      color: '#ffffff',
    }}>
      <h2>Something went wrong!</h2>
      <button
        onClick={() => reset()}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          backgroundColor: '#00ff00',
          color: '#000000',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Try again
      </button>
    </div>
  );
}
