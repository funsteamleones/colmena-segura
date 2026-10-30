import React from 'react';

/**
 * BeeMascot - Mascota 3D estilizada en SVG de alta definición
 * Modos:
 *  - 'happy': Saludando con gran sonrisa
 *  - 'reading': Leyendo un libro de aventuras
 *  - 'shield': Con escudo de protección digital
 *  - 'warning': Con teléfono y advertencia de límite de pantallas
 *  - 'crown': Con corona de campeón
 */
export const BeeMascot = ({ mode = 'happy', size = 120, className = '', style = {} }) => {
  return (
    <div
      className={`bee-mascot-wrapper ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none',
        ...style,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="beeBodyGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="60%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#E67E00" />
          </radialGradient>

          <linearGradient id="stripeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2A2A38" />
            <stop offset="50%" stopColor="#1E202B" />
            <stop offset="100%" stopColor="#15161E" />
          </linearGradient>

          <linearGradient id="wingGradLeft" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#7DD3FC" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="wingGradRight" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#7DD3FC" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <filter id="beeSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" />
          </filter>

          <filter id="glowHex" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── ALAS (WINGS) CON ANIMACIÓN DE ALETEO ── */}
        <g className="mascot-wings">
          {/* Ala Izquierda */}
          <path
            d="M 68 85 C 20 60, 20 18, 65 38 C 90 50, 85 80, 68 85 Z"
            fill="url(#wingGradLeft)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeOpacity="0.8"
            style={{ transformOrigin: '70px 80px' }}
          />
          {/* Vena de ala izquierda */}
          <path d="M 62 76 C 45 56, 38 42, 52 38" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />

          {/* Ala Derecha */}
          <path
            d="M 132 85 C 180 60, 180 18, 135 38 C 110 50, 115 80, 132 85 Z"
            fill="url(#wingGradRight)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeOpacity="0.8"
            style={{ transformOrigin: '130px 80px' }}
          />
          {/* Vena de ala derecha */}
          <path d="M 138 76 C 155 56, 162 42, 148 38" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
        </g>

        {/* ── AGUIJÓN PEQUEÑO ── */}
        <path d="M 94 172 Q 100 188 106 172 Z" fill="#1E202B" />

        {/* ── CUERPO PRINCIPAL ── */}
        <g filter="url(#beeSoftShadow)">
          {/* Base dorada */}
          <ellipse cx="100" cy="115" rx="56" ry="60" fill="url(#beeBodyGrad)" />

          {/* Franjas negras redondeadas */}
          {/* Franja 1 */}
          <path
            d="M 49 105 Q 100 115 151 105 Q 153 118 149 125 Q 100 135 51 125 Q 47 118 49 105 Z"
            fill="url(#stripeGrad)"
          />
          {/* Franja 2 */}
          <path
            d="M 58 138 Q 100 148 142 138 Q 138 152 132 158 Q 100 166 68 158 Q 62 152 58 138 Z"
            fill="url(#stripeGrad)"
          />
        </g>

        {/* ── ANTENAS ── */}
        {/* Antena Izquierda */}
        <path
          d="M 80 62 Q 62 25 50 32"
          stroke="#1E202B"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <circle cx="49" cy="31" r="7" fill="#FFA000" stroke="#1E202B" strokeWidth="3" />

        {/* Antena Derecha */}
        <path
          d="M 120 62 Q 138 25 150 32"
          stroke="#1E202B"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <circle cx="151" cy="31" r="7" fill="#FFA000" stroke="#1E202B" strokeWidth="3" />

        {/* ── CARITA / OJOS / MEJILLAS ── */}
        {/* Mejillas sonrosadas */}
        <ellipse cx="68" cy="98" rx="8" ry="5" fill="#FB7185" opacity="0.6" />
        <ellipse cx="132" cy="98" rx="8" ry="5" fill="#FB7185" opacity="0.6" />

        {/* Ojos grandes expresivos estilo 3D */}
        {/* Ojo Izquierdo */}
        <ellipse cx="76" cy="85" rx="14" ry="17" fill="#FFFFFF" />
        <ellipse cx="78" cy="85" rx="11" ry="14" fill="#1C1917" />
        <circle cx="75" cy="79" r="4.5" fill="#FFFFFF" />
        <circle cx="83" cy="89" r="2.2" fill="#FFFFFF" />

        {/* Ojo Derecho */}
        <ellipse cx="124" cy="85" rx="14" ry="17" fill="#FFFFFF" />
        <ellipse cx="122" cy="85" rx="11" ry="14" fill="#1C1917" />
        <circle cx="119" cy="79" r="4.5" fill="#FFFFFF" />
        <circle cx="127" cy="89" r="2.2" fill="#FFFFFF" />

        {/* Cejas amigables */}
        <path d="M 66 68 Q 76 65 86 71" stroke="#1E202B" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 134 68 Q 124 65 114 71" stroke="#1E202B" strokeWidth="3.5" strokeLinecap="round" />

        {/* Sonrisa alegre */}
        <path
          d="M 88 100 Q 100 114 112 100"
          stroke="#1E202B"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="#991B1B"
        />
        <path d="M 94 105 Q 100 102 106 105" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

        {/* ── ELEMENTOS POR MODO ── */}

        {/* MODO CORONA */}
        {mode === 'crown' && (
          <g filter="url(#glowHex)">
            <path
              d="M 82 50 L 88 32 L 100 42 L 112 32 L 118 50 Z"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="88" cy="32" r="2.5" fill="#EF4444" />
            <circle cx="100" cy="41" r="2.5" fill="#3B82F6" />
            <circle cx="112" cy="32" r="2.5" fill="#10B981" />
          </g>
        )}

        {/* MODO ESCUDO */}
        {mode === 'shield' && (
          <g transform="translate(115, 100) scale(0.65)" filter="url(#beeSoftShadow)">
            <path
              d="M 50 10 L 90 25 V 55 C 90 85 50 110 50 110 C 50 110 10 85 10 55 V 25 Z"
              fill="url(#shieldGrad)"
              stroke="#FFFFFF"
              strokeWidth="4"
            />
            {/* Icono de personitas / familia en el escudo */}
            <circle cx="50" cy="45" r="9" fill="#FFFFFF" />
            <path d="M 32 75 C 32 62 40 58 50 58 C 60 58 68 62 68 75 Z" fill="#FFFFFF" />
          </g>
        )}

        {/* MODO LIBRO */}
        {mode === 'reading' && (
          <g transform="translate(48, 126) scale(0.7)" filter="url(#beeSoftShadow)">
            <path
              d="M 10 25 Q 75 10 75 35 Q 75 10 140 25 L 135 60 Q 75 45 75 68 Q 75 45 15 60 Z"
              fill="#3B82F6"
              stroke="#1D4ED8"
              strokeWidth="3"
            />
            {/* Páginas abiertas */}
            <path d="M 16 28 Q 74 16 74 38 L 74 62 Q 74 44 20 54 Z" fill="#FFFFFF" />
            <path d="M 134 28 Q 76 16 76 38 L 76 62 Q 76 44 130 54 Z" fill="#F8FAFC" />
            <line x1="28" y1="36" x2="62" y2="33" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="28" y1="44" x2="58" y2="41" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="88" y1="33" x2="122" y2="36" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="88" y1="41" x2="118" y2="44" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* MODO WARNING (Aviso de pantallas de aviso app.png) */}
        {mode === 'warning' && (
          <g transform="translate(120, 95) scale(0.65)" filter="url(#beeSoftShadow)">
            {/* Smartphone */}
            <rect x="10" y="5" width="50" height="85" rx="8" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
            <rect x="15" y="16" width="40" height="60" rx="4" fill="#0F172A" />
            <circle cx="35" cy="82" r="3" fill="#64748B" />

            {/* Símbolo de bloqueo / prohibición rojo */}
            <circle cx="35" cy="46" r="16" stroke="#EF4444" strokeWidth="4" fill="none" />
            <line x1="24" y1="35" x2="46" y2="57" stroke="#EF4444" strokeWidth="4" />
          </g>
        )}

        {/* MODO HAPPY (Brazos saludando) */}
        {mode === 'happy' && (
          <g>
            {/* Brazo izquierdo apoyado */}
            <path d="M 52 118 Q 40 126 48 136" stroke="#1E202B" strokeWidth="5" strokeLinecap="round" />
            {/* Brazo derecho saludando arriba */}
            <path
              d="M 148 116 Q 166 102 168 88"
              stroke="#1E202B"
              strokeWidth="5"
              strokeLinecap="round"
              className="mascot-wave-arm"
              style={{ transformOrigin: '148px 116px' }}
            />
            <circle cx="168" cy="86" r="5" fill="#FFB300" stroke="#1E202B" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default BeeMascot;
