import React from 'react';
import BeeMascot from './BeeMascot';
import { X, HeartPulse, Eye, Moon, CheckCircle } from 'lucide-react';

export const ScreenTimeAlertModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '390px',
          backgroundColor: '#FFFFFF',
          borderRadius: '32px',
          padding: '24px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '2px solid #FEF08A',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
          }}
        >
          <X size={20} />
        </button>

        {/* Header con Mascota en pose de Advertencia */}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <BeeMascot mode="warning" size={130} style={{ margin: '0 auto' }} />

          <div
            style={{
              display: 'inline-block',
              background: '#FEE2E2',
              color: '#B91C1C',
              padding: '4px 14px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '10px',
            }}
          >
            Aviso de Bienestar Digital
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#1E293B', marginTop: '8px', lineHeight: 1.2 }}>
            ¡Cuidemos nuestro tiempo en pantalla!
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px', lineHeight: 1.5 }}>
            Pasar demasiado tiempo frente al celular o redes sociales puede afectar nuestro descanso, ánimo y concentración.
          </p>
        </div>

        {/* Puntos Clave de Salud */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '18px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#F8FAFC',
              padding: '12px 14px',
              borderRadius: '16px',
            }}
          >
            <div style={{ background: '#DBEAFE', padding: '8px', borderRadius: '12px', color: '#2563EB', flexShrink: 0 }}>
              <Eye size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>Descansa tus ojos</h4>
              <p style={{ fontSize: '11px', color: '#64748B' }}>Aplica la regla 20-20: cada 20 min mira a lo lejos por 20 segundos.</p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#F8FAFC',
              padding: '12px 14px',
              borderRadius: '16px',
            }}
          >
            <div style={{ background: '#FEF3C7', padding: '8px', borderRadius: '12px', color: '#D97706', flexShrink: 0 }}>
              <Moon size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>Duerme mejor</h4>
              <p style={{ fontSize: '11px', color: '#64748B' }}>Evita pantallas al menos 1 hora antes de ir a dormir.</p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#F8FAFC',
              padding: '12px 14px',
              borderRadius: '16px',
            }}
          >
            <div style={{ background: '#DCFCE7', padding: '8px', borderRadius: '12px', color: '#16A34A', flexShrink: 0 }}>
              <HeartPulse size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>Mueve tu cuerpo</h4>
              <p style={{ fontSize: '11px', color: '#64748B' }}>Jugar al aire libre y hacer deporte nos llena de energía real.</p>
            </div>
          </div>
        </div>

        {/* Botón de Acción */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '14px',
            background: 'linear-gradient(135deg, #FFCA28 0%, #F59E0B 100%)',
            border: 'none',
            borderRadius: '16px',
            color: '#1E293B',
            fontWeight: 800,
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
          }}
        >
          <CheckCircle size={18} strokeWidth={2.5} />
          ¡Entendido! Vamos a movernos
        </button>
      </div>
    </div>
  );
};

export default ScreenTimeAlertModal;
