import { useState } from 'react';
import { useAppContext, PRESET_ICONS, DEFAULT_CHILD_ICON } from '../store/AppContext';
import { Lock, Eye, EyeOff, Plus, Star, X, Check, ArrowRight } from 'lucide-react';
import BeeMascot from './BeeMascot';

const ProfileSelector = () => {
  const {
    childrenList,
    setActiveChild,
    setCurrentScreen,
    loginParent,
    createChildProfile,
  } = useAppContext();

  const [showPin, setShowPin] = useState(false);
  const [showPinText, setShowPinText] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // New Account Modal state
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(8);
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_CHILD_ICON);
  const [newAccountError, setNewAccountError] = useState('');

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleParentLogin = (e) => {
    e.preventDefault();
    if (loginParent(pin)) {
      setError('');
      setPin('');
      setCurrentScreen('parent_dashboard');
    } else {
      setError('PIN incorrecto. Inténtalo de nuevo.');
      setPin('');
      triggerShake();
    }
  };

  const handleSelectChild = (childId) => {
    setActiveChild(childId);
    setCurrentScreen('child');
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setNewAccountError('Por favor ingresa un nombre.');
      return;
    }
    const finalIcon = selectedIcon || DEFAULT_CHILD_ICON;
    const newProfile = createChildProfile({
      name: newName.trim(),
      age: Number(newAge),
      icon: finalIcon,
    });

    setShowNewAccountModal(false);
    setNewName('');
    setSelectedIcon(DEFAULT_CHILD_ICON);
    setNewAccountError('');

    // Enter newly created profile
    setActiveChild(newProfile.id);
    setCurrentScreen('child');
  };

  return (
    <div className="flex-col" style={{ height: '100%', justifyContent: 'center', alignItems: 'center', padding: '24px 20px', overflowY: 'auto' }}>
      
      {/* Header */}
      <div className="text-center" style={{ marginBottom: '24px' }}>
        <BeeMascot mode="happy" size={90} style={{ margin: '0 auto 8px' }} />
        <h1 className="text-primary" style={{ fontSize: '28px', fontWeight: 900 }}>¿Quién eres?</h1>
        <p className="text-muted mt-1" style={{ fontSize: '15px' }}>Selecciona tu perfil para continuar</p>
      </div>

      <div className="flex-col gap-3" style={{ width: '100%', maxWidth: '380px' }}>
        {!showPin ? (
          <>
            {/* List of Children Profiles */}
            <div className="flex-col gap-3">
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '4px' }}>
                Perfiles de Niños ({childrenList.length})
              </span>

              {childrenList.map((child) => (
                <button
                  key={child.id}
                  className="card flex-row justify-between align-center"
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
                    borderRadius: '20px',
                  }}
                  onClick={() => handleSelectChild(child.id)}
                >
                  <div className="flex-row gap-3 align-center">
                    <div style={{
                      background: '#FEF3C7',
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '26px',
                      flexShrink: 0,
                      border: '2px solid #FFCA28',
                    }}>
                      {child.icon || DEFAULT_CHILD_ICON}
                    </div>
                    <div className="flex-col">
                      <h2 style={{ fontSize: '18px', color: '#1E293B', margin: 0 }}>{child.name}</h2>
                      <div className="flex-row gap-1 align-center mt-1">
                        <Star size={14} color="#FFCA28" fill="#FFCA28" />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>
                          {child.coins || 0} monedas · {child.age || 8} años
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: '#F1F5F9', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={18} color="#64748B" />
                  </div>
                </button>
              ))}
            </div>

            {/* Botón "+ Crear nuevo hijo" */}
            <button
              onClick={() => {
                setShowNewAccountModal(true);
                setNewName('');
                setSelectedIcon(DEFAULT_CHILD_ICON);
                setNewAccountError('');
              }}
              style={{
                background: 'rgba(255, 202, 40, 0.12)',
                border: '2px dashed #D97706',
                borderRadius: '18px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: '#B45309',
                fontWeight: 800,
                fontSize: '15px',
                width: '100%',
              }}
            >
              <Plus size={20} strokeWidth={3} />
              <span>Agregar otro hijo/a</span>
            </button>

            {/* Separador */}
            <div style={{ height: '1px', background: '#E2E8F0', margin: '8px 0' }} />

            {/* Botón Panel Parental */}
            <button
              className="card flex-row justify-between align-center"
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                border: 'none',
                textAlign: 'left',
                width: '100%',
                borderRadius: '20px',
                background: '#1E293B',
                color: 'white',
              }}
              onClick={() => { setShowPin(true); setError(''); setPin(''); }}
            >
              <div className="flex-row gap-3 align-center">
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '50%', color: 'white', flexShrink: 0 }}>
                  <Lock size={24} color="#FFCA28" />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', color: 'white', margin: 0 }}>Panel Parental</h2>
                  <p style={{ fontSize: '13px', opacity: 0.7, margin: 0 }}>Validar misiones y ajustar límites</p>
                </div>
              </div>
              <ArrowRight size={18} color="rgba(255,255,255,0.5)" />
            </button>
          </>
        ) : (
          /* Formulario de PIN */
          <form
            className="card flex-col gap-4 animate-fade-in"
            onSubmit={handleParentLogin}
            style={{
              padding: '24px',
              borderRadius: '24px',
              animation: shake ? 'shake 0.4s ease' : 'none',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: '#EFF6FF', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Lock size={28} color="#2563EB" />
              </div>
              <h2 style={{ fontSize: '22px', margin: 0 }}>PIN Parental</h2>
              <p className="text-muted" style={{ fontSize: '14px', marginTop: '4px' }}>
                Ingresa tu PIN de seguridad para acceder.
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type={showPinText ? 'text' : 'password'}
                value={pin}
                maxLength={6}
                onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setError(''); }}
                placeholder="• • • •"
                autoFocus
                style={{
                  padding: '16px',
                  fontSize: '28px',
                  textAlign: 'center',
                  letterSpacing: '8px',
                  borderRadius: '16px',
                  border: `2px solid ${error ? '#EF4444' : '#CBD5E1'}`,
                  width: '100%',
                  outline: 'none',
                  background: '#F8FAFC',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPinText(!showPinText)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                {showPinText ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && <p className="text-danger text-center" style={{ fontSize: '14px', margin: 0 }}>❌ {error}</p>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={pin.length < 4}
              style={{ padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: 800 }}
            >
              Ingresar al Panel
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => { setShowPin(false); setPin(''); setError(''); }}
              style={{ padding: '12px', borderRadius: '14px', background: 'transparent', cursor: 'pointer', fontWeight: 700 }}
            >
              Volver
            </button>
          </form>
        )}
      </div>

      {/* Modal Crear Hijo */}
      {showNewAccountModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div className="card flex-col gap-4 animate-fade-in" style={{
            width: '100%',
            maxWidth: '380px',
            padding: '24px',
            borderRadius: '28px',
          }}>
            <div className="flex-row justify-between align-center">
              <h2 style={{ fontSize: '20px', color: '#1E293B', margin: 0 }}>Nuevo Hijo/a</h2>
              <button
                type="button"
                onClick={() => setShowNewAccountModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-col gap-1">
              <label style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>Nombre:</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setNewAccountError(''); }}
                placeholder="Nombre del niño/a"
                maxLength={20}
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px' }}
              />
              {newAccountError && <p className="text-danger" style={{ fontSize: '13px' }}>{newAccountError}</p>}
            </div>

            <div className="flex-col gap-1">
              <label style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>Edad (Años):</label>
              <input
                type="number"
                min="3"
                max="17"
                value={newAge}
                onChange={(e) => setNewAge(Number(e.target.value))}
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px', fontWeight: 800, width: '90px' }}
              />
            </div>

            <button
              type="button"
              onClick={handleCreateAccount}
              className="btn btn-primary"
              style={{ padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: 800 }}
            >
              Crear Perfil
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;
