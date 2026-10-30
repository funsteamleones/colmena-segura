import { useState } from 'react';
import { useAppContext, PRESET_ICONS, DEFAULT_CHILD_ICON } from '../store/AppContext';
import { ShieldCheck, Baby, Smartphone, ArrowRight, Eye, EyeOff, Lock, Check, Sparkles } from 'lucide-react';
import BeeMascot from './BeeMascot';
import { getPediatricStandardForAge } from '../store/educationalTips';

const DeviceSetup = () => {
  const { registerParentAccount, createChildProfile, setDeviceMode } = useAppContext();

  // Wizard steps: 1 = Cuenta Padre, 2 = Perfil Hijo, 3 = Rol Dispositivo
  const [step, setStep] = useState(1);

  // Form State - Parent
  const [parentName, setParentName] = useState('Carlos');
  const [parentEmail, setParentEmail] = useState('familia@colmena.com');
  const [pin, setPin] = useState('1234');
  const [pinConfirm, setPinConfirm] = useState('1234');
  const [showPin, setShowPin] = useState(false);

  // Form State - Child
  const [childName, setChildName] = useState('Mateo');
  const [childAge, setChildAge] = useState(8);
  const [childIcon, setChildIcon] = useState('🐝');

  const [error, setError] = useState('');

  // Step 1 Validation
  const handleStep1 = (e) => {
    e?.preventDefault();
    if (!parentName.trim()) {
      setError('Por favor escribe tu nombre de padre o madre.');
      return;
    }
    if (pin.length < 4) {
      setError('El PIN de seguridad debe tener 4 dígitos.');
      return;
    }
    if (pin !== pinConfirm) {
      setError('Los PINs no coinciden.');
      return;
    }
    setError('');
    setStep(2);
  };

  // Step 2 Validation
  const handleStep2 = (e) => {
    e?.preventDefault();
    if (!childName.trim()) {
      setError('Por favor escribe el nombre de tu hijo/a.');
      return;
    }
    if (childAge < 3 || childAge > 17) {
      setError('La edad debe estar entre 3 y 17 años.');
      return;
    }
    setError('');
    setStep(3);
  };

  // Step 3: Finalize & assign device
  const handleFinalize = (chosenMode) => {
    // 1. Guardar cuenta del padre
    registerParentAccount({
      name: parentName.trim(),
      email: parentEmail.trim(),
      pin,
    });

    // 2. Crear perfil del hijo con estándares de edad
    const standard = getPediatricStandardForAge(childAge);
    createChildProfile({
      name: childName.trim(),
      age: Number(childAge),
      icon: childIcon || DEFAULT_CHILD_ICON,
      dailyScreenLimit: standard.maxScreenMinutesDaily,
    });

    // 3. Asignar rol del celular
    setDeviceMode(chosenMode);
  };

  const standard = getPediatricStandardForAge(childAge);

  return (
    <div
      className="flex-col animate-fade-in"
      style={{
        minHeight: '100%',
        justifyContent: 'center',
        padding: '28px 20px',
        maxWidth: '460px',
        margin: '0 auto',
      }}
    >
      {/* Header con Mascota */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <BeeMascot mode="happy" size={90} style={{ margin: '0 auto 8px' }} />
        <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#1E293B', letterSpacing: '-0.5px' }}>
          Colmena <span style={{ color: '#D97706' }}>Segura</span>
        </h1>
        <p className="text-muted" style={{ fontSize: '14px', marginTop: '4px' }}>
          Configuración Familiar y Hábitos Digitales Saludables
        </p>

        {/* Progress Dots */}
        <div className="flex-row justify-center gap-2 mt-3">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                width: s === step ? '28px' : '10px',
                height: '8px',
                borderRadius: '999px',
                background: s <= step ? 'linear-gradient(90deg, #F59E0B, #D97706)' : '#E2E8F0',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* ─── PASO 1: CUENTA DE PADRE / MADRE ─── */}
      {step === 1 && (
        <form onSubmit={handleStep1} className="card flex-col gap-4 animate-fade-in" style={{ padding: '24px', borderRadius: '24px' }}>
          <div className="flex-row gap-3 align-center">
            <div style={{ background: '#EFF6FF', padding: '10px', borderRadius: '16px' }}>
              <ShieldCheck size={28} color="#2563EB" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', color: '#1E293B' }}>Paso 1: Cuenta Parental</h2>
              <p className="text-muted" style={{ fontSize: '12px' }}>Tú tendrás el control total de misiones y recompensas</p>
            </div>
          </div>

          <div className="flex-col gap-1">
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>Nombre del Padre o Madre:</label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => { setParentName(e.target.value); setError(''); }}
              placeholder="Ej. Carlos o Mamá Laura"
              style={{ padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px' }}
            />
          </div>

          <div className="flex-col gap-1">
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>Email o Identificador de Familia:</label>
            <input
              type="text"
              value={parentEmail}
              onChange={(e) => { setParentEmail(e.target.value); setError(''); }}
              placeholder="familia@ejemplo.com"
              style={{ padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px' }}
            />
          </div>

          <div className="flex-col gap-1">
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>PIN Secreto (4 dígitos):</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                maxLength={6}
                onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setError(''); }}
                placeholder="• • • •"
                style={{ padding: '14px', fontSize: '20px', textAlign: 'center', letterSpacing: '6px', borderRadius: '12px', border: '1px solid #CBD5E1', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex-col gap-1">
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>Confirma tu PIN:</label>
            <input
              type={showPin ? 'text' : 'password'}
              value={pinConfirm}
              maxLength={6}
              onChange={(e) => { setPinConfirm(e.target.value.replace(/\D/g, '')); setError(''); }}
              placeholder="Repite el PIN"
              style={{ padding: '14px', fontSize: '20px', textAlign: 'center', letterSpacing: '6px', borderRadius: '12px', border: '1px solid #CBD5E1' }}
            />
          </div>

          {error && <p className="text-danger text-center" style={{ fontSize: '13px' }}>⚠️ {error}</p>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '16px', fontSize: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            Continuar al Perfil de tu Hijo <ArrowRight size={18} />
          </button>
        </form>
      )}

      {/* ─── PASO 2: PERFIL DEL HIJO ─── */}
      {step === 2 && (
        <form onSubmit={handleStep2} className="card flex-col gap-4 animate-fade-in" style={{ padding: '24px', borderRadius: '24px' }}>
          <div className="flex-row gap-3 align-center">
            <div style={{ background: '#FEF3C7', padding: '10px', borderRadius: '16px' }}>
              <Baby size={28} color="#D97706" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', color: '#1E293B' }}>Paso 2: ¿Quién es tu hijo/a?</h2>
              <p className="text-muted" style={{ fontSize: '12px' }}>Personaliza su perfil y calcula límites pediátricos</p>
            </div>
          </div>

          {/* Avatar Icon */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: '#FEF9C3',
                border: '3px solid #F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                margin: '0 auto 8px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              }}
            >
              {childIcon}
            </div>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Elige un avatar:</span>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
              {PRESET_ICONS.slice(0, 8).map((ico) => (
                <button
                  key={ico}
                  type="button"
                  onClick={() => setChildIcon(ico)}
                  style={{
                    background: childIcon === ico ? '#F59E0B' : '#F1F5F9',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '6px',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                >
                  {ico}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-col gap-1">
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>Nombre del niño/a:</label>
            <input
              type="text"
              value={childName}
              onChange={(e) => { setChildName(e.target.value); setError(''); }}
              placeholder="Ej. Mateo, Sofía, Lucas..."
              style={{ padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '16px', fontWeight: 700 }}
            />
          </div>

          <div className="flex-col gap-1">
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>Edad del niño/a (Años):</label>
            <div className="flex-row gap-3 align-center">
              <input
                type="number"
                min="3"
                max="17"
                value={childAge}
                onChange={(e) => { setChildAge(Number(e.target.value)); setError(''); }}
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '18px', width: '90px', textAlign: 'center', fontWeight: 800 }}
              />
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                💡 Estándar OMS sugerido: <strong style={{ color: '#D97706' }}>{standard.maxScreenMinutesDaily} min/día</strong>
              </div>
            </div>
          </div>

          {/* Subliminal Neuro-Pediatric Tip */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px', borderRadius: '14px', fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
            <span style={{ fontWeight: 800, color: '#2563EB' }}>🧠 Pediatría OMS ({standard.ageRange}):</span> {standard.guideline}
          </div>

          {error && <p className="text-danger text-center" style={{ fontSize: '13px' }}>⚠️ {error}</p>}

          <div className="flex-row gap-2">
            <button type="button" onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1, padding: '14px' }}>
              Volver
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '14px' }}>
              Paso Final <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}

      {/* ─── PASO 3: ROL DE ESTE CELULAR ─── */}
      {step === 3 && (
        <div className="card flex-col gap-4 animate-fade-in" style={{ padding: '24px', borderRadius: '24px' }}>
          <div className="flex-row gap-3 align-center">
            <div style={{ background: '#ECFDF5', padding: '10px', borderRadius: '16px' }}>
              <Smartphone size={28} color="#059669" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', color: '#1E293B' }}>Paso 3: ¿De quién es este celular?</h2>
              <p className="text-muted" style={{ fontSize: '12px' }}>Elige cómo debe abrir la app en este dispositivo</p>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
            Para que cuando tu hijo/a abra la app <strong>solo vea su vista infantil</strong>, selecciona "Celular del Hijo".
          </p>

          {/* Opción 1: Celular del Padre */}
          <button
            type="button"
            onClick={() => handleFinalize('parent_device')}
            style={{
              background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
              border: 'none',
              borderRadius: '20px',
              padding: '20px',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 8px 24px rgba(30, 41, 59, 0.25)',
              transition: 'transform 0.2s',
            }}
          >
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '16px' }}>
              <ShieldCheck size={28} color="#93C5FD" />
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#93C5FD', fontWeight: 800 }}>
                Dispositivo Principal
              </div>
              <h3 style={{ fontSize: '18px', color: 'white', margin: '2px 0' }}>Celular de Papá / Mamá</h3>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>
                Panel de control, validación de tareas, recompensas y monitoreo de pantallas.
              </p>
            </div>
          </button>

          {/* Opción 2: Celular del Hijo */}
          <button
            type="button"
            onClick={() => handleFinalize('child_device')}
            style={{
              background: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)',
              border: 'none',
              borderRadius: '20px',
              padding: '20px',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
              transition: 'transform 0.2s',
            }}
          >
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '16px' }}>
              <Baby size={28} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#FEF3C7', fontWeight: 800 }}>
                Modo Protegido
              </div>
              <h3 style={{ fontSize: '18px', color: 'white', margin: '2px 0' }}>Celular de {childName}</h3>
              <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>
                Abre <strong>solo en vista de hijo</strong>. No puede editar reglas ni ver el panel parental sin tu PIN.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="btn btn-outline"
            style={{ padding: '12px', border: 'none', color: '#64748B', fontWeight: 700 }}
          >
            Atrás
          </button>
        </div>
      )}
    </div>
  );
};

export default DeviceSetup;
