import { useState } from 'react';
import { X, Check, Clock, AlertTriangle, Eye, Sparkles } from 'lucide-react';
import { SCREEN_INVESTMENT_CATEGORIES } from '../store/educationalTips';
import BeeMascot from './BeeMascot';

export const ScreenInvestmentModal = ({
  reward,
  isOpen,
  onClose,
  onConfirm,
  coinsBalance,
}) => {
  const [selectedCat, setSelectedCat] = useState('videojuegos');

  if (!isOpen || !reward) return null;

  const isScreenReward = reward.duration > 0;
  const canAfford = coinsBalance >= reward.coinsCost;

  const handleConfirm = () => {
    if (!canAfford) return;
    onConfirm(reward, selectedCat);
    onClose();
  };

  const currentCategory = SCREEN_INVESTMENT_CATEGORIES.find(c => c.id === selectedCat);

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
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          borderRadius: '32px',
          padding: '24px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '2px solid #FEF08A',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
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

        {/* Header */}
        <div style={{ textAlign: 'center', marginTop: '6px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: '#FFFBEB',
              border: '2px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 8px',
            }}
          >
            {reward.icon}
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1E293B' }}>
            {reward.title}
          </h2>
          <div className="flex-row justify-center gap-2 align-center mt-1">
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#D97706' }}>
              🪙 {reward.coinsCost} monedas
            </span>
            {isScreenReward && (
              <span
                style={{
                  background: '#EFF6FF',
                  color: '#2563EB',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 800,
                }}
              >
                ⏱️ +{reward.duration} min
              </span>
            )}
          </div>
        </div>

        {/* Si es recompensa de pantalla: selector de inversión */}
        {isScreenReward ? (
          <div style={{ marginTop: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '8px' }}>
              ¿En qué vas a invertir este tiempo de pantalla?
            </label>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px', lineHeight: '1.4' }}>
              Selecciona la actividad para que tus papás sepan cómo administras tu tiempo digital:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SCREEN_INVESTMENT_CATEGORIES.map((cat) => {
                const isSelected = selectedCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCat(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #F59E0B' : '1px solid #E2E8F0',
                      background: isSelected ? '#FFFBEB' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{cat.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: isSelected ? '#B45309' : '#1E293B' }}>
                        {cat.label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        {cat.examples}
                      </div>
                    </div>
                    {isSelected && (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#F59E0B',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Impacto / Consejo de Salud */}
            {currentCategory && (
              <div
                style={{
                  marginTop: '14px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '12px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                <Eye size={18} color="#D97706" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: '#475569', lineHeight: '1.4' }}>
                  <strong>Consejo saludable:</strong> {currentCategory.healthImpact}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ margin: '20px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
              ¡Excelente elección! Al canjear esta recompensa, acuerda con tu familia el momento perfecto para disfrutarla juntos.
            </p>
          </div>
        )}

        {/* Consejo Subliminal */}
        <div
          style={{
            marginTop: '16px',
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            padding: '12px',
            borderRadius: '16px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '24px' }}>🐝</span>
          <p style={{ fontSize: '11px', color: '#78350F', margin: 0, fontWeight: 700, lineHeight: '1.4' }}>
            ¡Recuerda pestañear con frecuencia y hacer pausas mirando por la ventana para cuidar tus ojos!
          </p>
        </div>

        {/* Botón de Confirmación */}
        <button
          type="button"
          disabled={!canAfford}
          onClick={handleConfirm}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '16px',
            borderRadius: '16px',
            border: 'none',
            background: canAfford
              ? 'linear-gradient(135deg, #FFCA28 0%, #F59E0B 100%)'
              : '#E2E8F0',
            color: canAfford ? '#1E293B' : '#94A3B8',
            fontWeight: 800,
            fontSize: '16px',
            cursor: canAfford ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: canAfford ? '0 8px 24px rgba(245, 158, 11, 0.4)' : 'none',
          }}
        >
          {canAfford ? (
            <>
              <Check size={18} strokeWidth={3} /> Confirmar Canje (-{reward.coinsCost} pts)
            </>
          ) : (
            'Puntos insuficientes'
          )}
        </button>
      </div>
    </div>
  );
};

export default ScreenInvestmentModal;
