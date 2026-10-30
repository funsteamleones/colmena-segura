import { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ParentLogin = () => {
  const { loginParent, setCurrentScreen, childData } = useAppContext();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginParent(pin)) {
      setPin('');
      setError('');
    } else {
      setError('PIN incorrecto. Inténtalo de nuevo.');
      setPin('');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleReturnToChild = () => {
    setCurrentScreen('child');
  };

  return (
    <div
      className="flex-col animate-fade-in"
      style={{ height: '100%', justifyContent: 'center', padding: '32px 24px', gap: '28px' }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1E293B, #334155)',
            borderRadius: '24px',
            padding: '20px',
            display: 'inline-flex',
            marginBottom: '20px',
            boxShadow: '0 8px 32px rgba(15, 23, 42, 0.3)',
          }}
        >
          <ShieldCheck size={40} color="#FFCA28" />
        </div>
        <h1 style={{ fontSize: '26px', color: '#1E293B', fontWeight: 900 }}>Panel Parental</h1>
        <p className="text-muted" style={{ marginTop: '8px', fontSize: '14px' }}>
          Ingresa tu PIN de seguridad para acceder al control de la familia.
        </p>
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
            maxLength={6}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, ''));
              setError('');
            }}
            placeholder="• • • •"
            autoFocus
            style={{
              padding: '18px',
              fontSize: '32px',
              textAlign: 'center',
              letterSpacing: '10px',
              borderRadius: '16px',
              border: `2px solid ${error ? '#EF4444' : '#CBD5E1'}`,
              width: '100%',
              background: '#F8FAFC',
              color: '#1E293B',
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
            }}
          >
            {showPin ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>

        {error && <p className="text-danger text-center" style={{ fontSize: '14px', margin: 0 }}>❌ {error}</p>}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={pin.length < 4}
          style={{ padding: '16px', fontSize: '16px', borderRadius: '16px', fontWeight: 800 }}
        >
          Entrar al Panel
        </button>

        <div className="flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={handleReturnToChild}
            style={{
              padding: '12px',
              fontSize: '14px',
              background: 'transparent',
              border: 'none',
              color: '#475569',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <ArrowLeft size={18} /> Volver a la vista de {childData.name} ({childData.icon || '🐝'})
          </button>
        </div>
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
