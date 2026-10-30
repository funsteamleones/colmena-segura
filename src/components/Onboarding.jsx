import { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import BeeMascot from './BeeMascot';

// ─── PARENT ONBOARDING ────────────────────────────────────────────────────────
const ParentOnboarding = () => {
  const { saveParentSetup } = useAppContext();
  const [step, setStep]             = useState(1);
  const [childName, setChildName]   = useState('');
  const [pin, setPin]               = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [showPin, setShowPin]       = useState(false);
  const [error, setError]           = useState('');

  const goStep2 = () => {
    if (!childName.trim()) { setError('Por favor escribe el nombre de tu hijo/a.'); return; }
    setError(''); setStep(2);
  };

  const finish = () => {
    if (pin.length < 4) { setError('El PIN debe tener al menos 4 dígitos.'); return; }
    if (pin !== pinConfirm) { setError('Los PINs no coinciden.'); return; }
    saveParentSetup({ childName, pin });
  };

  return (
    <div className="flex-col animate-fade-in" style={{ height: '100%', justifyContent: 'center', padding: '24px', gap: '24px' }}>

      {/* Progress */}
      <div className="flex-row" style={{ gap: '8px', justifyContent: 'center' }}>
        {[1, 2].map(s => (
          <div key={s} style={{
            width: s === step ? '28px' : '8px', height: '8px', borderRadius: '4px',
            background: s <= step ? 'var(--color-primary)' : 'var(--color-gray-300)',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* STEP 1: child name */}
      {step === 1 && (
        <div className="flex-col gap-4 animate-fade-in">
          <div style={{ textAlign: 'center' }}>
            <BeeMascot mode="shield" size={105} style={{ margin: '0 auto 12px' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 900 }}>Configuración Parental</h1>
            <p className="text-muted mt-2">Primero, ¿cómo se llama tu hijo/a?</p>
          </div>
          <input
            type="text" value={childName} maxLength={20} autoFocus
            onChange={e => { setChildName(e.target.value); setError(''); }}
            placeholder="Ej. Sofía, Mateo..."
            style={{ padding: '16px', fontSize: '20px', textAlign: 'center', borderRadius: '12px', border: '2px solid var(--color-gray-300)', width: '100%', fontWeight: 700 }}
            onKeyDown={e => e.key === 'Enter' && goStep2()}
          />
          {error && <p className="text-danger text-center" style={{ fontSize: '14px' }}>{error}</p>}
          <button className="btn btn-primary" onClick={goStep2}>
            Siguiente <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 2: PIN */}
      {step === 2 && (
        <div className="flex-col gap-4 animate-fade-in">
          <div style={{ textAlign: 'center' }}>
            <h2>Crea tu PIN de acceso</h2>
            <p className="text-muted mt-2">Solo tú deberías conocer este PIN. Mínimo 4 dígitos.</p>
          </div>

          <div className="flex-col gap-2">
            <label className="font-bold" style={{ fontSize: '13px' }}>Tu PIN:</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPin ? 'text' : 'password'} value={pin} autoFocus
                onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 8)); setError(''); }}
                placeholder="• • • •"
                style={{ padding: '16px', fontSize: '26px', textAlign: 'center', letterSpacing: '8px', borderRadius: '12px', border: '2px solid var(--color-gray-300)', width: '100%' }}
              />
              <button type="button" onClick={() => setShowPin(v => !v)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex-col gap-2">
            <label className="font-bold" style={{ fontSize: '13px' }}>Confirma tu PIN:</label>
            <input
              type={showPin ? 'text' : 'password'} value={pinConfirm}
              onChange={e => { setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 8)); setError(''); }}
              placeholder="Repite el PIN"
              style={{
                padding: '16px', fontSize: '26px', textAlign: 'center', letterSpacing: '8px', borderRadius: '12px',
                border: `2px solid ${pinConfirm && pin !== pinConfirm ? 'var(--color-danger)' : 'var(--color-gray-300)'}`, width: '100%',
              }}
              onKeyDown={e => e.key === 'Enter' && finish()}
            />
          </div>

          {error && <p className="text-danger text-center" style={{ fontSize: '14px' }}>❌ {error}</p>}
          <button className="btn btn-primary" onClick={finish} disabled={pin.length < 4}>
            ✅ Finalizar y entrar al Panel
          </button>
          <button className="btn btn-outline" onClick={() => { setError(''); setStep(1); }}>Volver</button>
        </div>
      )}
    </div>
  );
};

// ─── CHILD ONBOARDING ─────────────────────────────────────────────────────────
const ChildOnboarding = () => {
  const { saveChildSetup } = useAppContext();
  const [name, setName]   = useState('');
  const [error, setError] = useState('');

  const finish = () => {
    if (!name.trim()) { setError('¡Escribe tu nombre!'); return; }
    saveChildSetup({ childName: name });
  };

  return (
    <div className="flex-col animate-fade-in" style={{ height: '100%', justifyContent: 'center', padding: '32px 24px', gap: '28px' }}>
      <div style={{ textAlign: 'center' }}>
        <BeeMascot mode="happy" size={120} style={{ margin: '0 auto 12px' }} />
        <h1 style={{ fontSize: '26px', fontWeight: 900 }}>¡Hola! ¿Cómo te llamas?</h1>
        <p className="text-muted mt-2">Escribe tu nombre para empezar a ganar monedas.</p>
      </div>
      <input
        type="text" value={name} maxLength={20} autoFocus
        onChange={e => { setName(e.target.value); setError(''); }}
        placeholder="Tu nombre aquí..."
        style={{ padding: '18px', fontSize: '22px', textAlign: 'center', borderRadius: '14px', border: '2px solid var(--color-gray-300)', width: '100%', fontWeight: 800 }}
        onKeyDown={e => e.key === 'Enter' && finish()}
      />
      {error && <p className="text-danger text-center">{error}</p>}
      <button className="btn btn-primary" onClick={finish} style={{ padding: '16px', fontSize: '18px' }}>
        ¡Empezar! 🚀
      </button>
    </div>
  );
};

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
const Onboarding = () => {
  const { deviceMode } = useAppContext();
  return deviceMode === 'parent_device' ? <ParentOnboarding /> : <ChildOnboarding />;
};

export default Onboarding;
