import type { NextPageContext } from 'next'

type ErrorPageProps = {
  statusCode?: number
}

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  return (
    <main style={{ minHeight: '100vh', padding: '160px 24px', background: '#030303', color: '#f7f3ed' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ margin: 0, fontSize: 48, fontWeight: 500 }}>Error</h1>
        <p style={{ marginTop: 16, color: 'rgba(247, 243, 237, 0.7)' }}>
          {statusCode ? `Status code: ${statusCode}` : 'Something went wrong.'}
        </p>
      </div>
    </main>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode || err?.statusCode || 404
  return { statusCode }
}
