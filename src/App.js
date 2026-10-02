import { useState } from 'react';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(0);

  const steps = [
    'Visual analysis',
    'Architecture detection', 
    'Text & signage OCR',
    'Geospatial matching',
    'Coordinate inference'
  ];

  function handleFile(f) {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setStep(0);
  }

  async function analyze() {
    if (!file) return;
    setAnalyzing(true);
    setResult(null);

    for (let i = 0; i <= steps.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('https://geolocate-backend-production.up.railway.app/analyze', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      setResult(result);
    } catch (e) {
      setResult({ location: 'Error', lat: 48.85, lng: 2.35, confidence: 0, clues: ['Could not connect to server', 'Make sure backend is running', 'Check console for details', 'Try again'] });
    }
    setAnalyzing(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e8e8f0', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 56, borderBottom: '1px solid #1e1e2e', background: '#0d0d15' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c6ef5' }} />
          GeoLocate<span style={{ color: '#5a5a7a', fontWeight: 400 }}>.ai</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['home', 'history', 'pricing'].map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer', border: '1px solid #2a2a3e', background: page === p ? '#7c6ef5' : 'transparent', color: page === p ? '#fff' : '#a0a0b8' }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {page === 'home' && (
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', minHeight: 'calc(100vh - 56px)' }}>
          <div style={{ background: '#0d0d15', borderRight: '1px solid #1e1e2e', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: 11, color: '#7c6ef5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>New investigation</div>
              <div style={{ fontSize: 13, color: '#5a5a7a' }}>Upload an image to identify its location</div>
            </div>

            {!preview ? (
              <label style={{ border: '1px dashed #2a2a4e', borderRadius: 10, padding: '2rem 1rem', textAlign: 'center', cursor: 'pointer', background: '#0f0f1a' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                <div style={{ fontSize: 13, color: '#5a5a7a' }}>Drop image or <span style={{ color: '#7c6ef5' }}>browse files</span></div>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              </label>
            ) : (
              <div>
                <img src={preview} alt="preview" style={{ width: '100%', borderRadius: 8, maxHeight: 180, objectFit: 'cover' }} />
                <button onClick={() => { setPreview(null); setFile(null); setResult(null); }} style={{ marginTop: 8, width: '100%', padding: '6px', borderRadius: 6, border: '1px solid #2a2a3e', background: 'transparent', color: '#5a5a7a', cursor: 'pointer', fontSize: 12 }}>Remove image</button>
              </div>
            )}

            <button onClick={analyze} disabled={!file || analyzing} style={{ padding: '10px', background: '#7c6ef5', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 500, cursor: file && !analyzing ? 'pointer' : 'not-allowed', opacity: !file || analyzing ? 0.5 : 1 }}>
              {analyzing ? '⏳ Analyzing...' : '🔍 Analyze image'}
            </button>

            <div>
              <div style={{ fontSize: 11, color: '#3a3a5e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>AI Pipeline</div>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, background: step > i ? '#0f2a1a' : step === i && analyzing ? '#1a1530' : '#12121e', border: `1px solid ${step > i ? '#2d7a4f' : step === i && analyzing ? '#7c6ef5' : '#1e1e2e'}` }}>
                    {step > i ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: 12, color: step > i ? '#4aad6e' : step === i && analyzing ? '#a09af5' : '#5a5a7a' }}>{s}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', background: '#0a0a12', borderTop: '1px solid #1a1a2e', padding: '1rem', margin: '0 -1.5rem -1.5rem', borderRadius: '0 0 0 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#3a3a5e' }}>Free plan</span>
                <span style={{ fontSize: 11, color: '#7c6ef5' }}>3 / 10 used</span>
              </div>
              <div style={{ height: 3, background: '#1a1a2e', borderRadius: 2 }}>
                <div style={{ height: '100%', width: '30%', background: '#7c6ef5', borderRadius: 2 }} />
              </div>
            </div>
          </div>

          <div style={{ background: '#060610', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            {!result ? (
              <div style={{ textAlign: 'center', color: '#3a3a5e' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
                <div style={{ fontSize: 13 }}>{analyzing ? 'Analyzing your image...' : 'Upload an image to begin'}</div>
              </div>
            ) : (
              <div style={{ width: '100%', maxWidth: 600 }}>
                <div style={{ background: '#0d0d15', border: '1px solid #1e1e2e', borderRadius: 12, padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 500 }}>{result.location}</div>
                      <div style={{ fontSize: 12, color: '#5a5a7a', fontFamily: 'monospace' }}>{result.lat?.toFixed(4)}, {result.lng?.toFixed(4)}</div>
                    </div>
                    <div style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, background: result.confidence >= 80 ? '#0f2a1a' : '#2a1f0a', color: result.confidence >= 80 ? '#4aad6e' : '#d4a04a', border: `1px solid ${result.confidence >= 80 ? '#2d7a4f' : '#7a5a20'}` }}>
                      {result.confidence}% confidence
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {(result.clues || []).map((c, i) => (
                      <div key={i} style={{ background: '#0f0f1a', border: '1px solid #1e1e2e', borderRadius: 8, padding: '10px' }}>
                        <div style={{ fontSize: 10, color: '#3a3a5e', textTransform: 'uppercase', marginBottom: 4 }}>Clue {i + 1}</div>
                        <div style={{ fontSize: 12, color: '#a0a0c0' }}>{c}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#0d0d15', border: '1px solid #1e1e2e', borderRadius: 12, padding: '1rem', textAlign: 'center', color: '#5a5a7a', fontSize: 13 }}>
                  🗺️ Map: {result.lat?.toFixed(4)}, {result.lng?.toFixed(4)} — <a href={`https://www.google.com/maps?q=${result.lat},${result.lng}`} target="_blank" rel="noreferrer" style={{ color: '#7c6ef5' }}>Open in Google Maps</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {page === 'history' && (
        <div style={{ padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
          <div style={{ fontSize: 22, fontWeight: 500, marginBottom: '1.5rem' }}>Investigation history</div>
          {[{loc:'Paris, France',conf:92,time:'2h ago'},{loc:'Tokyo, Japan',conf:87,time:'5h ago'},{loc:'New York, USA',conf:78,time:'1d ago'}].map((h, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#0d0d15', border: '1px solid #1e1e2e', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>📍 {h.loc}</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#4aad6e' }}>{h.conf}%</div>
                <div style={{ fontSize: 11, color: '#3a3a5e' }}>{h.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {page === 'pricing' && (
        <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 500, marginBottom: '0.5rem' }}>Simple pricing</div>
          <div style={{ fontSize: 13, color: '#5a5a7a', marginBottom: '2rem' }}>Start free, upgrade when you need more</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[{name:'Free',price:'$0',desc:'Get started',features:['10 analyses/month','Basic results','Community support']},{name:'Pro',price:'$12/mo',desc:'Most popular',features:['100 analyses/month','Detailed reports','History & export','Priority support'],accent:true},{name:'Explorer',price:'$24/mo',desc:'Power users',features:['Unlimited analyses','API access','Batch processing','Advanced AI']}].map((p, i) => (
              <div key={i} style={{ background: '#0d0d15', border: `1px solid ${p.accent ? '#7c6ef5' : '#1e1e2e'}`, borderRadius: 12, padding: '1.5rem' }}>
                {p.accent && <div style={{ fontSize: 11, color: '#7c6ef5', marginBottom: 8 }}>MOST POPULAR</div>}
                <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 24, fontWeight: 500, color: '#7c6ef5', marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 12, color: '#5a5a7a', marginBottom: '1rem' }}>{p.desc}</div>
                {p.features.map((f, j) => <div key={j} style={{ fontSize: 13, color: '#a0a0c0', marginBottom: 6 }}>✓ {f}</div>)}
                <button style={{ marginTop: '1rem', width: '100%', padding: '10px', borderRadius: 8, border: 'none', background: p.accent ? '#7c6ef5' : '#1a1a2e', color: '#fff', cursor: 'pointer', fontSize: 14 }}>Get started</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;