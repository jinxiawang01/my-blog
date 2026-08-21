export default function NotFoundPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '160px 24px', background: '#030303', color: '#f7f3ed' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ margin: 0, fontSize: 48, fontWeight: 500 }}>Page not found</h1>
        <p style={{ marginTop: 16, color: 'rgba(247, 243, 237, 0.7)' }}>
          The page you are looking for does not exist.
        </p>
      </div>
    </main>
  )
}
