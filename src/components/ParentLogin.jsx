import { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';

const ParentLogin = () => {
  const { loginParent } = useAppContext();
  const [pin, setPin]       = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError]   = useState('');
  const [shake, setShake]   = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginParent(pin)) {
      setPin('');
      setError('');
    } else {
      setError('PIN incorrecto.');
      setPin('');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div
      className="flex-col animate-fade-in"
      style={{ height: '100%', justifyContent: 'center', padding: '32px 24px', gap: '28px' }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          borderRadius: '24px', padding: '20px', display: 'inline-flex', marginBottom: '20px',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
        }}>
          <ShieldCheck size={40} color="white" />
        </div>
        <h1 style={{ fontSize: '26px' }}>Panel Parental</h1>
        <p className="text-muted" style={{ marginTop: '8px' }}>Ingresa tu PIN para acceder.</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleLogin}
        className="flex-col gap-4"
        style={{ animation: shake ? 'shake 0.4s ease' : 'none' }}
      >
        <div style={{ position: 'relative' }}>
          <input
            type={showPin ? 'text' : 'password'}
            value={pin}
            onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 8)); setError(''); }}
            placeholder="• • • •"
            autoFocus
            style={{
              padding: '20px',
              fontSize: '32px',
              textAlign: 'center',
              letterSpacing: '10px',
              borderRadius: '16px',
              border: `2px solid ${error ? 'var(--color-danger)' : 'var(--color-gray-300)'}`,
              width: '100%',
              background: 'var(--color-gray-100)',
              color: 'var(--text-main)',
            }}
          />
          <button type="button" onClick={() => setShowPin(v => !v)}
            style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            {showPin ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>

        {error && <p className="text-danger text-center" style={{ fontSize: '14px' }}>❌ {error}</p>}

        <button type="submit" className="btn btn-primary" disabled={pin.length < 4}
          style={{ padding: '16px', fontSize: '17px' }}>
          Entrar al Panel
        </button>
      </form>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-5px); }
          80%      { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default ParentLogin;
