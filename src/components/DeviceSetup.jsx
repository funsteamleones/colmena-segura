import { useAppContext } from '../store/AppContext';
import { ShieldCheck, Baby, Smartphone } from 'lucide-react';

const DeviceSetup = () => {
  const { setDeviceMode } = useAppContext();

  return (
    <div
      className="flex-col animate-fade-in"
      style={{ height: '100%', justifyContent: 'center', alignItems: 'center', padding: '32px 24px', gap: '32px' }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>
          <Smartphone size={52} style={{ color: 'var(--color-primary)', margin: '0 auto' }} />
        </div>
        <h1 style={{ fontSize: '26px', color: 'var(--text-main)' }}>¿Este dispositivo es de quién?</h1>
        <p className="text-muted" style={{ marginTop: '10px', lineHeight: '1.7' }}>
          Elige el rol de este celular. Esta configuración solo se hace una vez.
        </p>
      </div>

      {/* Opciones */}
      <div className="flex-col gap-4" style={{ width: '100%' }}>

        {/* Padre */}
        <button
          onClick={() => setDeviceMode('parent_device')}
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            border: 'none',
            borderRadius: '24px',
            padding: '28px 24px',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.4)'; }}
        >
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '16px',
            padding: '14px',
            flexShrink: 0,
          }}>
            <ShieldCheck size={32} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Portal del</p>
            <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '4px' }}>Padre / Madre</h2>
            <p style={{ fontSize: '13px', opacity: 0.8 }}>Controla misiones, recompensas y monedas. Protegido con PIN.</p>
          </div>
        </button>

        {/* Hijo */}
        <button
          onClick={() => setDeviceMode('child_device')}
          style={{
            background: 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)',
            border: 'none',
            borderRadius: '24px',
            padding: '28px 24px',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(245, 158, 11, 0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(245, 158, 11, 0.4)'; }}
        >
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '16px',
            padding: '14px',
            flexShrink: 0,
          }}>
            <Baby size={32} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Portal del</p>
            <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '4px' }}>Niño / Niña</h2>
            <p style={{ fontSize: '13px', opacity: 0.8 }}>Completa misiones y canjea recompensas. Sin contraseña.</p>
          </div>
        </button>
      </div>

      <p className="text-muted" style={{ fontSize: '12px', textAlign: 'center' }}>
        💡 Esta elección se guarda en el dispositivo y no se puede cambiar sin resetear la app.
      </p>
    </div>
  );
};

export default DeviceSetup;
