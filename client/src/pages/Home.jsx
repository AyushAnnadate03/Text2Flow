import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ minHeight: '70vh' }}>
      {/* Hero Section */}
      <section
        style={{
          padding: '60px 24px',
          background: 'linear-gradient(135deg, #0d9488, #14b8a6)', // teal dark → teal medium
          color: 'white',
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 44, margin: 0, fontWeight: 800, letterSpacing: -1 }}>
              Text2Flow — Convert text to flowcharts in seconds
            </h1>
            <p style={{ fontSize: 18, opacity: 0.95, marginTop: 12 }}>
              Type plain-language steps and let Text2Flow generate clear, editable flowcharts — powered by smart parsing
              and export options.
            </p>

            {/* Buttons */}
            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <Link
                to="/editor"
                style={{
                  padding: '12px 18px',
                  background: '#1e3a8a',
                  color: 'white',
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#3b82f6')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#1e3a8a')}
              >
                Try Editor
              </Link>

              <Link
                to="/plans"
                style={{
                  padding: '12px 18px',
                  background: '#1e3a8a',
                  color: 'white',
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#3b82f6')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#1e3a8a')}
              >
                See Plans
              </Link>
            </div>

            <div style={{ marginTop: 18, fontSize: 14, opacity: 0.9 }}>
              Free tier available — upgrade for AI-powered parsing and unlimited exports.
            </div>
          </div>

          {/* Example Box */}
          <div style={{ width: 420, background: 'rgba(255,255,255,0.08)', padding: 18, borderRadius: 12 }}>
            <div style={{ fontSize: 13, opacity: 0.85 }}>Example input</div>
            <pre
              style={{
                background: 'transparent',
                border: 0,
                color: 'white',
                whiteSpace: 'pre-wrap',
                marginTop: 8,
              }}
            >
              Start
              {'\n'}Read input x
              {'\n'}If x &gt; 0 then
              {'\n'}  Print positive
              {'\n'}Else
              {'\n'}  Print non-positive
              {'\n'}End
            </pre>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 20,
        }}
      >
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 6px 18px rgba(2,6,23,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Fast</h3>
          <p>Instantly convert step-by-step text into a visual flowchart you can edit and export.</p>
        </div>
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 6px 18px rgba(2,6,23,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>AI-ready</h3>
          <p>Upgrade to AI parsing for better condition recognition and messy inputs.</p>
        </div>
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 6px 18px rgba(2,6,23,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Flowchart Preview</h3>
          <p>Generated flowcharts will appear here in real-time.</p>
        </div>
      </section>
    </div>
  )
}
