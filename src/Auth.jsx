import { useState } from 'react';
import { login, register } from './api';

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', color: '#e8e8f0', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  card: { width: '100%', maxWidth: 360, background: '#0d0d15', border: '1px solid #1e1e2e', borderRadius: 12, padding: '2rem' },
  logo: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500, marginBottom: '1.5rem' },
  dot: { width: 8, height: 8, borderRadius: '50%', background: '#7c6ef5' },
  title: { fontSize: 20, fontWeight: 500, marginBottom: '1rem' },
  input: { display: 'block', width: '100%', padding: '10px 12px', marginBottom: 12, fontSize: 14, boxSizing: 'border-box', background: '#0f0f1a', border: '1px solid #2a2a3e', borderRadius: 8, color: '#e8e8f0', outline: 'none' },
  button: { width: '100%', padding: 10, background: '#7c6ef5', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  error: { color: '#e06c6c', fontSize: 13, marginBottom: 12 },
  switch: { marginTop: 16, textAlign: 'center', fontSize: 13, color: '#5a5a7a' },
  link: { background: 'none', border: 'none', color: '#7c6ef5', cursor: 'pointer', fontSize: 'inherit', padding: 0 },
};

// onAuth(user) вызывается после успешного входа или регистрации
export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = isLogin ? await login(email, password) : await register(email, password);
      onAuth(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.dot} />
          GeoLocate<span style={{ color: '#5a5a7a', fontWeight: 400 }}>.ai</span>
        </div>
        <div style={styles.title}>{isLogin ? 'Войти' : 'Регистрация'}</div>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder={isLogin ? 'Пароль' : 'Пароль (минимум 8 символов)'}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            minLength={isLogin ? undefined : 8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div style={styles.error}>{error}</div>}
          <button style={{ ...styles.button, opacity: loading ? 0.5 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Подождите…' : isLogin ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>
        <div style={styles.switch}>
          {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button
            style={styles.link}
            type="button"
            onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(''); }}
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}
