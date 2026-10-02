import { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const ProfileSelector = () => {
  const { switchProfile, childData, parentPin } = useAppContext();
  const [showPin, setShowPin]     = useState(false);
  const [showPinText, setShowPinText] = useState(false);
  const [pin, setPin]             = useState('');
  const [error, setError]         = useState('');
  const [shake, setShake]         = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleParentLogin = (e) => {
    e.preventDefault();
    if (pin === parentPin) {
      setError('');
      setPin('');
      switchProfile('parent');
    } else {
      setError('PIN incorrecto. Inténtalo de nuevo.');
      setPin('');
      triggerShake();
    }
  };

  return (
    <div className="flex-col" style={{ height: '100%', justifyContent: 'center', alignItems: 'center', padding: '0 8px' }}>
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '56px', lineHeight: 1, marginBottom: '12px' }}>🐝</div>
        <h1 className="text-primary" style={{ fontSize: '28px' }}>¿Quién eres?</h1>
        <p className="text-muted mt-2">Selecciona tu perfil para continuar.</p>
      </div>

      <div className="flex-col gap-4" style={{ width: '100%' }}>
        {!showPin ? (
          <>
            {/* Botón Hijo */}
            <button
              className="card flex-row gap-3"
              style={{ padding: '20px', cursor: 'pointer', border: '2px solid transparent', textAlign: 'left', width: '100%', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              onClick={() => switchProfile('child')}
            >
              <div style={{ background: 'var(--color-primary)', padding: '14px', borderRadius: '50%', color: 'white', flexShrink: 0 }}>
                <User size={28} />
              </div>
              <div>
                <h2>{childData.name}</h2>
                <p className="text-muted">Perfil de Niño/a</p>
              </div>
            </button>

            {/* Botón Padre */}
            <button
              className="card flex-row gap-3"
              style={{ padding: '20px', cursor: 'pointer', border: '2px solid transparent', textAlign: 'left', width: '100%', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-gray-700)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              onClick={() => { setShowPin(true); setError(''); setPin(''); }}
            >
              <div style={{ background: 'var(--color-gray-800)', padding: '14px', borderRadius: '50%', color: 'white', flexShrink: 0 }}>
                <Lock size={28} />
              </div>
              <div>
                <h2>Panel Parental</h2>
                <p className="text-muted">Acceso con PIN</p>
              </div>
            </button>
          </>
        ) : (
          <form
            className="card flex-col gap-4"
            onSubmit={handleParentLogin}
            style={{ animation: shake ? 'shake 0.4s ease' : 'none' }}
          >
            <div style={{ textAlign: 'center' }}>
              <Lock size={32} className="text-primary" style={{ margin: '0 auto 8px' }} />
              <h2>PIN de Seguridad</h2>
              <p className="text-muted" style={{ fontSize: '14px' }}>
                Ingresa tu PIN parental para continuar.
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type={showPinText ? 'text' : 'password'}
                value={pin}
                onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 8)); setError(''); }}
                placeholder="• • • •"
                autoFocus
                style={{
                  padding: '16px',
                  fontSize: '28px',
                  textAlign: 'center',
                  letterSpacing: '8px',
                  borderRadius: '12px',
                  border: `2px solid ${error ? 'var(--color-danger)' : 'var(--color-gray-300)'}`,
                  width: '100%',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-gray-300)'}
              />
              <button
                type="button"
                onClick={() => setShowPinText(v => !v)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                {showPinText ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <p className="text-danger text-center" style={{ fontSize: '14px' }}>
                ❌ {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary" disabled={pin.length < 4}>
              Ingresar
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => { setShowPin(false); setPin(''); setError(''); }}
            >
              Volver
            </button>
          </form>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
};

export default ProfileSelector;
