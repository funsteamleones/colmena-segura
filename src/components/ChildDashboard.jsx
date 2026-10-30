import React, { useState, useMemo } from 'react';
import { useAppContext, PRESET_ICONS, DEFAULT_CHILD_ICON, ACHIEVEMENTS_LIST } from '../store/AppContext';
import BeeMascot from './BeeMascot';
import ScreenTimeAlertModal from './ScreenTimeAlertModal';
import ScreenInvestmentModal from './ScreenInvestmentModal';
import {
  Home, CheckSquare, Gift, User,
  ChevronRight, CheckCircle2, Clock,
  ArrowLeft, Edit3, Shield, Award,
  X, Check, Lock, Users, LogOut, Flame,
  Sparkles, Calendar, Eye, HelpCircle, Shuffle
} from 'lucide-react';

// ─── BOTTOM NAVIGATION ──────────────────────────────────────────────────────────
const BottomNav = ({ active, setActive, pendingTasksCount, inReviewCount }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'tasks', icon: CheckSquare, label: 'Tareas', badge: pendingTasksCount, reviewBadge: inReviewCount },
    { id: 'points', icon: Gift, label: 'Puntos' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((t) => {
        const IconComponent = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActive(t.id)}
            style={{ position: 'relative' }}
          >
            <div style={{ position: 'relative' }}>
              <IconComponent size={24} strokeWidth={isActive ? 2.6 : 2} />
              {t.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-10px',
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 900,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  {t.badge}
                </span>
              )}
            </div>
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

// ─── SUBLIMINAL / PEDIATRIC NUDGE BANNER ─────────────────────────────────────────
const SubliminalBeeNudge = ({ tips }) => {
  const [tipIndex, setTipIndex] = useState(0);

  if (!tips || tips.length === 0) return null;

  const currentTip = tips[tipIndex % tips.length];

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <div
      className="card animate-fade-in"
      style={{
        background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
        border: '1.5px solid #FDE68A',
        borderRadius: '20px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 14px rgba(245, 158, 11, 0.1)',
        marginTop: '16px',
        position: 'relative',
      }}
    >
      <div style={{ fontSize: '28px', flexShrink: 0 }}>
        {currentTip.icon || '🐝'}
      </div>

      <div style={{ flex: 1, paddingRight: '24px' }}>
        <div className="flex-row gap-2 align-center mb-1">
          <span
            style={{
              background: '#F59E0B',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: 900,
              padding: '2px 8px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
            }}
          >
            {currentTip.tag || 'Curiosidad Saludable'}
          </span>
          <span style={{ fontSize: '11px', color: '#92400E', fontWeight: 700 }}>
            BeeSafe Kids
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#78350F', margin: 0, fontWeight: 700, lineHeight: '1.4' }}>
          {currentTip.text}
        </p>
      </div>

      <button
        type="button"
        onClick={handleNextTip}
        title="Ver otro consejo"
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid #FDE68A',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#B45309',
        }}
      >
        <Shuffle size={14} />
      </button>
    </div>
  );
};

// ─── HOME VIEW ──────────────────────────────────────────────────────────────────
const HomeView = ({ childData, activities, onSubmitTask, setView, tips }) => {
  const nextLevelTarget = childData.level === 1 ? 250 : childData.level === 2 ? 500 : 1000;
  const prevLevelTarget = childData.level === 1 ? 0 : childData.level === 2 ? 250 : 500;
  const progressRatio = Math.min(
    Math.max((childData.coins - prevLevelTarget) / (nextLevelTarget - prevLevelTarget), 0),
    1
  );
  const progressPercent = Math.round(progressRatio * 100);

  const approvedCount = childData.completedTaskIds?.length || 0;
  const pendingCount = childData.pendingTaskIds?.length || 0;
  const totalTasks = activities.length;

  // Next 3 tasks to display
  const tasksToShow = activities
    .filter((a) => !childData.completedTaskIds?.includes(a.id))
    .slice(0, 3);

  return (
    <div className="animate-fade-in page-container">
      {/* Dark Curved Header */}
      <div className="header-dark-curve"></div>

      <div className="content-wrapper" style={{ zIndex: 10, position: 'relative' }}>
        {/* Top Branding & Child Badge */}
        <div className="flex-row justify-between align-center" style={{ paddingTop: '16px' }}>
          <div className="flex-row gap-2 align-center">
            <span style={{ fontSize: '24px' }}>🐝</span>
            <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '20px', letterSpacing: '-0.5px' }}>
              Colmena <span style={{ color: '#FFCA28' }}>Segura</span>
            </span>
          </div>

          <div
            className="flex-row gap-2 align-center"
            onClick={() => setView('profile')}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              padding: '6px 14px',
              borderRadius: '999px',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <span style={{ fontSize: '18px' }}>{childData.icon || DEFAULT_CHILD_ICON}</span>
            <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 800 }}>{childData.name}</span>
          </div>
        </div>

        {/* 3D Animated Bee Mascot */}
        <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <BeeMascot mode="happy" size={170} />
        </div>

        {/* Greeting & Subtitle */}
        <div style={{ position: 'relative', marginTop: '-15px' }}>
          <h1 className="text-white" style={{ fontSize: '28px', lineHeight: 1.1 }}>
            ¡Hola, {childData.name}!
          </h1>
          <p className="text-white font-bold mt-1" style={{ opacity: 0.85, fontSize: '14px' }}>
            Cumple misiones para ganar oro y canjear tus recompensas ✨
          </p>

          {/* Points Pill Card */}
          <div
            className="card-dark-pill mt-4"
            onClick={() => setView('points')}
            style={{ cursor: 'pointer', transform: 'scale(1)', transition: 'transform 0.15s ease' }}
          >
            <div className="flex-row gap-3 align-center">
              <div
                style={{
                  background: 'linear-gradient(135deg, #FFCA28 0%, #F59E0B 100%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(245, 158, 11, 0.4)',
                }}
              >
                <Award size={26} color="#1E293B" strokeWidth={2.5} />
              </div>
              <div className="flex-col">
                <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Tu Saldo de Oro
                </span>
                <span className="text-white font-extrabold" style={{ fontSize: '28px', lineHeight: '1.1' }}>
                  {childData.coins} <span style={{ fontSize: '16px', color: '#FFCA28' }}>🪙 pts</span>
                </span>
              </div>
            </div>
            <div className="flex-row align-center gap-1">
              <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 700 }}>Canjear</span>
              <ChevronRight size={22} color="#8F95B2" />
            </div>
          </div>
        </div>

        {/* Level Progression */}
        <div className="flex-col gap-1 mt-3">
          <div className="flex-row justify-between text-main font-bold" style={{ fontSize: '13px' }}>
            <span style={{ color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Nivel {childData.level}</span>
              <span style={{ color: '#D97706', fontWeight: 800 }}>· {childData.level === 1 ? 'Aprendiz' : childData.level === 2 ? 'Explorador' : 'Experto'}</span>
            </span>
            <span className="text-muted">{childData.coins} / {nextLevelTarget} pts</span>
          </div>
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Subliminal / Pediatric Nudge */}
        <SubliminalBeeNudge tips={tips} />

        {/* Resumen de hoy (3 Cards) */}
        <div className="flex-row justify-between mt-4 align-center">
          <h2 className="text-main" style={{ fontSize: '18px' }}>Estado de Hoy</h2>
          <span style={{ fontSize: '12px', color: '#D97706', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={14} color="#EA580C" /> {childData.streakDays} días en racha
          </span>
        </div>

        <div className="flex-row gap-3 mt-2" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
          <div className="card text-center flex-col justify-center gap-2" style={{ minWidth: '100px', flex: 1, padding: '14px 10px' }}>
            <div className="icon-circle bg-green-light mx-auto" style={{ width: '38px', height: '38px', margin: '0 auto' }}>
              <CheckCircle2 size={20} color="#16A34A" />
            </div>
            <span className="font-extrabold text-main" style={{ fontSize: '17px' }}>
              {approvedCount}/{totalTasks}
            </span>
            <span className="text-muted" style={{ fontSize: '11px', lineHeight: '1.2' }}>
              Misiones<br />aprobadas
            </span>
          </div>

          <div className="card text-center flex-col justify-center gap-2" style={{ minWidth: '100px', flex: 1, padding: '14px 10px' }}>
            <div className="icon-circle bg-blue-light mx-auto" style={{ width: '38px', height: '38px', margin: '0 auto' }}>
              <Clock size={20} color="#2563EB" />
            </div>
            <span className="font-extrabold text-main" style={{ fontSize: '17px' }}>
              {childData.screenTimeUsedToday || 0}m
            </span>
            <span className="text-muted" style={{ fontSize: '11px', lineHeight: '1.2' }}>
              Pantalla<br />canjeada
            </span>
          </div>

          <div className="card text-center flex-col justify-center gap-2" style={{ minWidth: '100px', flex: 1, padding: '14px 10px' }}>
            <div className="icon-circle bg-orange-light mx-auto" style={{ width: '38px', height: '38px', margin: '0 auto' }}>
              <Award size={20} color="#EA580C" />
            </div>
            <span className="font-extrabold text-main" style={{ fontSize: '17px' }}>
              {pendingCount}
            </span>
            <span className="text-muted" style={{ fontSize: '11px', lineHeight: '1.2' }}>
              En revisión<br />por Papá/Mamá
            </span>
          </div>
        </div>

        {/* Tareas de Hoy con acceso directo */}
        <div className="flex-row justify-between align-center mt-5 mb-2">
          <h2 className="text-main" style={{ fontSize: '18px' }}>Misiones para hoy</h2>
          <button
            type="button"
            onClick={() => setView('tasks')}
            style={{
              background: 'none',
              border: 'none',
              color: '#D97706',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            Ver todas <ChevronRight size={16} />
          </button>
        </div>

        {tasksToShow.length === 0 ? (
          <div
            className="card flex-col align-center text-center p-4"
            style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '24px' }}
          >
            <CheckCircle2 size={36} color="#16A34A" />
            <h3 style={{ fontSize: '16px', color: '#166534', marginTop: '8px' }}>¡Todas las misiones completadas!</h3>
            <p style={{ fontSize: '12px', color: '#15803D', marginTop: '4px' }}>
              Has hecho un trabajo fantástico. Canjea tus puntos por tiempo libre o recompensas familiares.
            </p>
          </div>
        ) : (
          <div className="flex-col gap-2">
            {tasksToShow.map((task) => {
              const isApproved = childData.completedTaskIds?.includes(task.id);
              const isPending = childData.pendingTaskIds?.includes(task.id);

              return (
                <div
                  key={task.id}
                  className="card flex-row justify-between align-center"
                  style={{
                    padding: '14px 16px',
                    borderRadius: '18px',
                    borderLeft: isApproved ? '5px solid #10B981' : isPending ? '5px solid #F59E0B' : '5px solid #FFCA28',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div className="flex-row gap-3 align-center" style={{ flex: 1 }}>
                    <span style={{ fontSize: '26px' }}>{task.icon}</span>
                    <div className="flex-col">
                      <span className="font-extrabold text-main" style={{ fontSize: '15px' }}>
                        {task.title}
                      </span>
                      <div className="flex-row gap-2 align-center mt-1">
                        <span style={{ fontSize: '12px', color: '#D97706', fontWeight: 800 }}>
                          +{task.coins} pts
                        </span>
                        {isPending ? (
                          <span style={{ fontSize: '11px', color: '#B45309', fontWeight: 800, background: '#FEF3C7', padding: '2px 8px', borderRadius: '999px' }}>
                            ⏳ En revisión
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#94A3B8' }}>· {task.time}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isApproved ? (
                    <div
                      style={{
                        padding: '6px 12px',
                        borderRadius: '999px',
                        background: '#DCFCE7',
                        color: '#166534',
                        fontWeight: 800,
                        fontSize: '12px',
                      }}
                    >
                      ✅ Aprobada
                    </div>
                  ) : isPending ? (
                    <div
                      style={{
                        padding: '6px 12px',
                        borderRadius: '999px',
                        background: '#FEF3C7',
                        color: '#B45309',
                        fontWeight: 800,
                        fontSize: '12px',
                      }}
                    >
                      🕒 Revisando
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSubmitTask(task.id)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #FFCA28 0%, #F59E0B 100%)',
                        color: '#1E293B',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      ¡Completar!
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TASKS VIEW (CON ESTADOS: POR HACER, EN REVISIÓN, APROBADAS) ─────────────────
const TasksView = ({ childData, activities, onSubmitTask, onSelectTask, tips }) => {
  const [filterTab, setFilterTab] = useState('todas'); // 'todas', 'por_hacer', 'en_revision', 'aprobadas'
  const [selectedCategory, setSelectedCategory] = useState('todas');

  const filteredActivities = activities.filter((act) => {
    const isApproved = childData.completedTaskIds?.includes(act.id);
    const isPending = childData.pendingTaskIds?.includes(act.id);

    if (filterTab === 'por_hacer' && (isApproved || isPending)) return false;
    if (filterTab === 'en_revision' && !isPending) return false;
    if (filterTab === 'aprobadas' && !isApproved) return false;

    if (selectedCategory !== 'todas' && act.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="animate-fade-in page-container">
      {/* Curved Dark Header */}
      <div className="header-dark-curve" style={{ height: '360px' }}></div>

      <div className="content-wrapper" style={{ zIndex: 10, position: 'relative' }}>
        <div className="flex-row justify-between align-center" style={{ paddingTop: '16px' }}>
          <div>
            <h1 className="text-white" style={{ fontSize: '24px', fontWeight: 900 }}>Misiones Diarias</h1>
            <p className="text-white font-bold" style={{ opacity: 0.8, fontSize: '13px' }}>
              Reclama tus tareas. Papá/Mamá las valida y te suma el oro 🪙
            </p>
          </div>
          <div style={{ fontSize: '28px' }}>{childData.icon || DEFAULT_CHILD_ICON}</div>
        </div>

        {/* Filter Tabs */}
        <div
          className="flex-row gap-1 mt-4 p-1"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            padding: '4px',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'todas', label: 'Todas' },
            { id: 'por_hacer', label: 'Por Hacer' },
            { id: 'en_revision', label: '⏳ En Revisión' },
            { id: 'aprobadas', label: '✅ Aprobadas' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 10px',
                border: 'none',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                background: filterTab === tab.id ? '#FFCA28' : 'transparent',
                color: filterTab === tab.id ? '#1E293B' : '#FFFFFF',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex-row gap-2 mt-3" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'todas', label: '🌟 Todas' },
            { id: 'escuela', label: '📚 Escuela' },
            { id: 'hogar', label: '🏠 Hogar' },
            { id: 'salud', label: '🏃 Salud' },
            { id: 'habitos', label: '💖 Hábitos' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '999px',
                border: selectedCategory === cat.id ? '2px solid #D97706' : '1px solid #E2E8F0',
                background: selectedCategory === cat.id ? '#FFFBEB' : '#FFFFFF',
                color: selectedCategory === cat.id ? '#B45309' : '#64748B',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Subliminal Nudge in Tasks */}
        <SubliminalBeeNudge tips={tips} />

        {/* Task List */}
        <div className="flex-col gap-3 mt-4">
          {filteredActivities.length === 0 ? (
            <div className="card text-center flex-col align-center p-5" style={{ padding: '36px 20px', borderRadius: '24px' }}>
              <Sparkles size={40} color="#D97706" />
              <h3 style={{ fontSize: '17px', color: '#1E293B', marginTop: '12px', fontWeight: 800 }}>
                {filterTab === 'aprobadas'
                  ? 'Aún no tienes tareas aprobadas en este filtro'
                  : filterTab === 'en_revision'
                  ? 'No tienes tareas pendientes de revisión por tus padres'
                  : '¡No hay misiones pendientes por aquí!'}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>
                Completa tus tareas diarias y cuéntale a tu familia para que te otorguen tus monedas.
              </p>
            </div>
          ) : (
            filteredActivities.map((task) => {
              const isApproved = childData.completedTaskIds?.includes(task.id);
              const isPending = childData.pendingTaskIds?.includes(task.id);

              return (
                <div
                  key={task.id}
                  className="card flex-row justify-between align-center"
                  style={{
                    padding: '16px',
                    borderRadius: '20px',
                    border: isApproved ? '1.5px solid #BBF7D0' : isPending ? '1.5px solid #FDE68A' : '1px solid #E2E8F0',
                    background: isApproved ? '#F0FDF4' : isPending ? '#FFFBEB' : '#FFFFFF',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => onSelectTask(task)}
                >
                  <div className="flex-row gap-3 align-center" style={{ flex: 1, marginRight: '10px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '16px',
                        background: isApproved ? '#DCFCE7' : isPending ? '#FEF3C7' : '#FFFBEB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        flexShrink: 0,
                      }}
                    >
                      {task.icon}
                    </div>

                    <div className="flex-col">
                      <span
                        className="font-extrabold text-main"
                        style={{
                          fontSize: '15px',
                          color: isApproved ? '#166534' : '#1E293B',
                        }}
                      >
                        {task.title}
                      </span>
                      <div className="flex-row gap-2 align-center mt-1">
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 800,
                            color: isApproved ? '#15803D' : '#D97706',
                          }}
                        >
                          +{task.coins} pts
                        </span>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>· {task.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions / Badges */}
                  {isApproved ? (
                    <div
                      style={{
                        background: '#DCFCE7',
                        color: '#166534',
                        padding: '6px 12px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 800,
                      }}
                    >
                      ✅ Aprobada
                    </div>
                  ) : isPending ? (
                    <div
                      style={{
                        background: '#FEF3C7',
                        color: '#B45309',
                        padding: '6px 12px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 800,
                      }}
                    >
                      ⏳ En revisión
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSubmitTask(task.id);
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #FFCA28 0%, #F59E0B 100%)',
                        color: '#1E293B',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      ¡Reclamar!
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// ─── POINTS & REWARDS VIEW (CON INVERSIÓN DE PANTALLA) ───────────────────────────
const PointsView = ({ childData, rewards, onOpenInvestmentModal, setView, tips }) => {
  return (
    <div className="animate-fade-in page-container">
      {/* Curved Dark Header */}
      <div className="header-dark-curve" style={{ height: '420px' }}></div>

      <div className="content-wrapper" style={{ zIndex: 10, position: 'relative' }}>
        <div className="flex-row gap-4 align-center" style={{ marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => setView('home')}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </button>
          <div>
            <h2 className="text-white" style={{ fontSize: '20px', fontWeight: 900 }}>Tienda de Recompensas</h2>
            <p className="text-white" style={{ opacity: 0.8, fontSize: '12px' }}>
              Canjea tu oro acumulado con la autorización de tu familia
            </p>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '26px' }}>
            {childData.icon || DEFAULT_CHILD_ICON}
          </div>
        </div>

        {/* Big Glowing Hexagon Badge */}
        <div className="big-hexagon-container" style={{ margin: '24px 0 16px' }}>
          <div className="big-hexagon">
            <Award size={36} color="#1E293B" strokeWidth={2.5} style={{ marginBottom: '2px' }} />
            <span style={{ fontSize: '44px', fontWeight: '900', lineHeight: '1', color: '#1E293B' }}>
              {childData.coins}
            </span>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#78350F', textTransform: 'uppercase' }}>
              Monedas de Oro
            </span>
          </div>
        </div>

        {/* Level Progression Indicator */}
        <div className="flex-col gap-1 mt-2">
          <div className="flex-row justify-between text-white font-bold" style={{ fontSize: '13px' }}>
            <span>Nivel {childData.level} - {childData.level === 1 ? 'Aprendiz' : childData.level === 2 ? 'Explorador' : 'Experto'}</span>
            <span>Meta: {childData.level === 1 ? 250 : childData.level === 2 ? 500 : 1000} pts</span>
          </div>
          <div className="progress-container-dark">
            <div
              className="progress-fill-dark"
              style={{
                width: `${Math.min(100, Math.round((childData.coins / (childData.level === 1 ? 250 : childData.level === 2 ? 500 : 1000)) * 100))}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Rewards Catalog Container */}
      <div
        className="card"
        style={{
          flex: 1,
          minHeight: '440px',
          margin: '-20px 0 0 0',
          borderRadius: '32px 32px 0 0',
          padding: '28px 20px',
          zIndex: 10,
          position: 'relative',
        }}
      >
        <div className="flex-row justify-between align-center mb-4">
          <h2 className="text-main" style={{ fontSize: '18px' }}>Elige tu canje</h2>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>
            {rewards.length} disponibles
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {rewards.map((reward, i) => {
            const colors = ['bg-blue-light', 'bg-orange-light', 'bg-purple-light', 'bg-green-light'];
            const colorClass = colors[i % colors.length];
            const isScreenTimeReward = reward.duration > 0;
            const canAfford = childData.coins >= reward.coinsCost;

            return (
              <div
                key={reward.id}
                className="card flex-col align-center text-center justify-between"
                style={{
                  padding: '18px 12px',
                  borderRadius: '22px',
                  border: canAfford ? '1px solid #E2E8F0' : '1px dashed #CBD5E1',
                  opacity: !canAfford ? 0.65 : 1,
                  boxShadow: '0 6px 16px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'transform 0.15s ease',
                }}
                onClick={() => onOpenInvestmentModal(reward)}
              >
                <div className={`icon-circle ${colorClass}`} style={{ width: '52px', height: '52px', margin: '0 auto 8px', fontSize: '26px' }}>
                  {reward.icon}
                </div>

                <span className="text-orange font-extrabold" style={{ fontSize: '17px', color: '#D97706' }}>
                  🪙 {reward.coinsCost} pts
                </span>
                <span className="text-main font-bold" style={{ fontSize: '13px', lineHeight: '1.2', marginTop: '4px' }}>
                  {reward.title}
                </span>

                {isScreenTimeReward && (
                  <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700, marginTop: '4px' }}>
                    ⏱️ +{reward.duration} min
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Subliminal Nudge in points */}
        <SubliminalBeeNudge tips={tips} />
      </div>
    </div>
  );
};

// ─── PROFILE & ACHIEVEMENTS VIEW ────────────────────────────────────────────────
const ProfileView = ({
  childData,
  updateChildProfile,
  onOpenAlertModal,
  onOpenParentPinModal,
  deviceMode,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(childData.name);
  const [editIcon, setEditIcon] = useState(childData.icon || DEFAULT_CHILD_ICON);

  const handleOpenEdit = () => {
    setEditName(childData.name);
    setEditIcon(childData.icon || DEFAULT_CHILD_ICON);
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    updateChildProfile(childData.id, {
      name: editName.trim(),
      icon: editIcon || DEFAULT_CHILD_ICON,
    });
    setShowEditModal(false);
  };

  return (
    <div className="animate-fade-in page-container">
      {/* Wave Header */}
      <div className="header-profile-wave" style={{ height: '240px' }}></div>

      <div className="content-wrapper" style={{ paddingTop: '24px', position: 'relative', zIndex: 10 }}>
        {/* Profile Card Header */}
        <div className="flex-row justify-between align-center">
          <div className="flex-row gap-3 align-center">
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#FEF3C7',
                border: '3px solid #FFCA28',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                boxShadow: '0 6px 16px rgba(255, 202, 40, 0.4)',
              }}
            >
              {childData.icon || DEFAULT_CHILD_ICON}
            </div>
            <div>
              <h2 className="text-white" style={{ fontSize: '20px', fontWeight: 900 }}>
                {childData.name}
              </h2>
              <span style={{ fontSize: '12px', color: '#FEF3C7', fontWeight: 700 }}>
                {childData.age || 8} años · Nivel {childData.level}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenEdit}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF',
            }}
          >
            <Edit3 size={18} />
          </button>
        </div>

        {/* Stats Grid */}
        <div
          className="card"
          style={{
            marginTop: '24px',
            borderRadius: '24px',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#D97706' }}>
              {childData.coins}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>
              Oro Total
            </div>
          </div>
          <div style={{ borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#2563EB' }}>
              {childData.streakDays}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>
              Días Racha
            </div>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#16A34A' }}>
              {childData.completedTaskIds?.length || 0}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>
              Aprobadas
            </div>
          </div>
        </div>

        {/* Logros Desbloqueados */}
        <div style={{ marginTop: '24px' }}>
          <div className="flex-row justify-between align-center mb-3">
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>
              Tus Medallas y Logros
            </h3>
            <span style={{ fontSize: '12px', color: '#D97706', fontWeight: 800 }}>
              {childData.unlockedAchievements?.length || 0}/{ACHIEVEMENTS_LIST.length}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {ACHIEVEMENTS_LIST.slice(0, 4).map((ach) => {
              const isUnlocked = childData.unlockedAchievements?.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className="card flex-row gap-2 align-center"
                  style={{
                    padding: '12px',
                    borderRadius: '16px',
                    opacity: isUnlocked ? 1 : 0.5,
                    background: isUnlocked ? '#FEF9C3' : '#F8FAFC',
                    border: isUnlocked ? '1px solid #FDE68A' : '1px solid #E2E8F0',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{ach.icon}</span>
                  <div className="flex-col">
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B' }}>
                      {ach.title}
                    </span>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>
                      {ach.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acceso Parental & Ajustes */}
        <div className="flex-col gap-3 mt-5">
          <div
            className="card flex-row justify-between align-center"
            style={{ padding: '16px', cursor: 'pointer', borderRadius: '18px', border: '1px solid #E2E8F0' }}
            onClick={onOpenAlertModal}
          >
            <div className="flex-row gap-3 align-center">
              <div style={{ background: '#EFF6FF', padding: '10px', borderRadius: '12px' }}>
                <Eye size={20} color="#2563EB" />
              </div>
              <div className="flex-col">
                <span className="text-main font-bold" style={{ fontSize: '14px' }}>Bienestar Digital & Ojos Sanos</span>
                <span className="text-muted" style={{ fontSize: '12px' }}>Regla 20-20-20 y hábitos visuales</span>
              </div>
            </div>
            <ChevronRight size={20} color="#94A3B8" />
          </div>

          {/* Botón Acceso Parental con PIN */}
          <div
            className="card flex-row justify-between align-center"
            style={{
              padding: '16px',
              cursor: 'pointer',
              borderRadius: '18px',
              background: '#1E293B',
              color: '#FFFFFF',
            }}
            onClick={onOpenParentPinModal}
          >
            <div className="flex-row gap-3 align-center">
              <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '10px', borderRadius: '12px' }}>
                <Lock size={20} color="#FFCA28" />
              </div>
              <div className="flex-col">
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                  Acceso Parental (Papá / Mamá)
                </span>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Requiere PIN de seguridad de 4 dígitos
                </span>
              </div>
            </div>
            <ChevronRight size={20} color="#FFCA28" />
          </div>
        </div>
      </div>

      {/* Modal Editar Perfil */}
      {showEditModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="card flex-col gap-4 animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-row justify-between align-center">
              <h2 style={{ fontSize: '20px', color: '#1E293B', fontWeight: 900 }}>Personalizar Perfil</h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ textAlign: 'center', margin: '6px 0' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#FEF3C7',
                  border: '3px solid #FFCA28',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '42px',
                  margin: '0 auto 8px',
                  boxShadow: '0 8px 20px rgba(255, 202, 40, 0.4)',
                }}
              >
                {editIcon || DEFAULT_CHILD_ICON}
              </div>
            </div>

            <div className="flex-col gap-1">
              <label style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>Nombre:</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nombre del niño/a"
                maxLength={20}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  border: '1px solid #CBD5E1',
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
            </div>

            <div className="flex-col gap-2">
              <label style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>Elige un avatar:</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '8px',
                  background: '#F8FAFC',
                  padding: '12px',
                  borderRadius: '16px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                }}
              >
                {PRESET_ICONS.map((ico) => {
                  const isSelected = editIcon === ico;
                  return (
                    <button
                      key={ico}
                      type="button"
                      onClick={() => setEditIcon(ico)}
                      style={{
                        background: isSelected ? '#FFCA28' : '#FFFFFF',
                        border: isSelected ? '2px solid #D97706' : '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '6px 0',
                        fontSize: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {ico}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={!editName.trim()}
              style={{
                padding: '14px',
                background: 'linear-gradient(135deg, #FFCA28 0%, #F59E0B 100%)',
                color: '#1E293B',
                border: 'none',
                borderRadius: '16px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── TASK DETAIL MODAL ──────────────────────────────────────────────────────────
const TaskDetailModal = ({ task, isApproved, isPending, onClose, onSubmitTask }) => {
  if (!task) return null;

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
          }}
        >
          <X size={20} color="#64748B" />
        </button>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '22px',
              background: '#FFFBEB',
              border: '2px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '34px',
              margin: '0 auto',
            }}
          >
            {task.icon}
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1E293B', marginTop: '12px' }}>
            {task.title}
          </h2>
          <span
            style={{
              display: 'inline-block',
              background: '#FEF3C7',
              color: '#B45309',
              padding: '4px 14px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 800,
              marginTop: '6px',
            }}
          >
            +{task.coins} monedas de oro
          </span>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '8px', lineHeight: 1.5 }}>
            {task.description}
          </p>
        </div>

        {/* Pasos */}
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
            ¿Cómo completarla?
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {task.steps?.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: '#F8FAFC',
                  padding: '10px 12px',
                  borderRadius: '12px',
                }}
              >
                <div style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }}>
                  <CheckCircle2 size={16} />
                </div>
                <span style={{ fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Consejo Subliminal */}
        <div
          style={{
            marginTop: '16px',
            background: '#FFFBEB',
            border: '1px dashed #FCD34D',
            padding: '14px',
            borderRadius: '16px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '28px' }}>🐝</span>
          <div>
            <h5 style={{ fontSize: '12px', fontWeight: 800, color: '#92400E' }}>Consejo de la Colmena</h5>
            <p style={{ fontSize: '11px', color: '#B45309', marginTop: '2px', lineHeight: 1.3 }}>
              {task.tips}
            </p>
          </div>
        </div>

        {/* Botón de Acción */}
        {isApproved ? (
          <div
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '16px',
              borderRadius: '16px',
              background: '#DCFCE7',
              color: '#166534',
              fontWeight: 800,
              fontSize: '15px',
              textAlign: 'center',
            }}
          >
            ✅ Misión Aprobada (+{task.coins} pts acreditados)
          </div>
        ) : isPending ? (
          <div
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '16px',
              borderRadius: '16px',
              background: '#FEF3C7',
              color: '#B45309',
              fontWeight: 800,
              fontSize: '15px',
              textAlign: 'center',
            }}
          >
            ⏳ En revisión por Papá/Mamá
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              onSubmitTask(task.id);
              onClose();
            }}
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #FFCA28 0%, #F59E0B 100%)',
              color: '#1E293B',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
            }}
          >
            <Check size={18} strokeWidth={3} /> Reclamar Misión y Avisar a Papá/Mamá 🚀
          </button>
        )}
      </div>
    </div>
  );
};

// ─── MAIN CHILD DASHBOARD ────────────────────────────────────────────────────────
const ChildDashboard = () => {
  const {
    childData,
    activities,
    rewards,
    childSubmitTask,
    childClaimReward,
    updateChildProfile,
    childSubliminalTips,
    parentPin,
    loginParent,
    deviceMode,
  } = useAppContext();

  const [currentView, setCurrentView] = useState('home'); // 'home', 'tasks', 'points', 'profile'
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [investmentReward, setInvestmentReward] = useState(null);

  // Parent PIN Prompt Modal (Para salir del modo hijo)
  const [showParentPinModal, setShowParentPinModal] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');

  const pendingTasksCount = useMemo(() => {
    return activities.filter((a) => !childData.completedTaskIds?.includes(a.id) && !childData.pendingTaskIds?.includes(a.id)).length;
  }, [activities, childData.completedTaskIds, childData.pendingTaskIds]);

  const inReviewCount = useMemo(() => {
    return childData.pendingTaskIds?.length || 0;
  }, [childData.pendingTaskIds]);

  const handleParentUnlock = (e) => {
    e?.preventDefault();
    if (loginParent(inputPin)) {
      setShowParentPinModal(false);
      setInputPin('');
      setPinError('');
    } else {
      setPinError('PIN incorrecto. Solo tus padres pueden acceder.');
      setInputPin('');
    }
  };

  return (
    <>
      {currentView === 'home' && (
        <HomeView
          childData={childData}
          activities={activities}
          onSubmitTask={childSubmitTask}
          setView={setCurrentView}
          tips={childSubliminalTips}
        />
      )}

      {currentView === 'tasks' && (
        <TasksView
          childData={childData}
          activities={activities}
          onSubmitTask={childSubmitTask}
          onSelectTask={(task) => setSelectedTask(task)}
          tips={childSubliminalTips}
        />
      )}

      {currentView === 'points' && (
        <PointsView
          childData={childData}
          rewards={rewards}
          onOpenInvestmentModal={(reward) => setInvestmentReward(reward)}
          setView={setCurrentView}
          tips={childSubliminalTips}
        />
      )}

      {currentView === 'profile' && (
        <ProfileView
          childData={childData}
          updateChildProfile={updateChildProfile}
          onOpenAlertModal={() => setIsAlertModalOpen(true)}
          onOpenParentPinModal={() => setShowParentPinModal(true)}
          deviceMode={deviceMode}
        />
      )}

      {/* Modal Detalle de Tarea */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isApproved={childData.completedTaskIds?.includes(selectedTask.id)}
          isPending={childData.pendingTaskIds?.includes(selectedTask.id)}
          onClose={() => setSelectedTask(null)}
          onSubmitTask={childSubmitTask}
        />
      )}

      {/* Modal Canje e Inversión de Pantalla */}
      {investmentReward && (
        <ScreenInvestmentModal
          reward={investmentReward}
          isOpen={Boolean(investmentReward)}
          onClose={() => setInvestmentReward(null)}
          onConfirm={(reward, category) => childClaimReward(reward, category)}
          coinsBalance={childData.coins}
        />
      )}

      {/* Modal Educativo de Pantallas */}
      <ScreenTimeAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />

      {/* Modal Desbloqueo Parental con PIN */}
      {showParentPinModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowParentPinModal(false)}
        >
          <form
            onSubmit={handleParentUnlock}
            className="card flex-col gap-4 animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '360px',
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '24px',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ background: '#EFF6FF', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <Lock size={28} color="#2563EB" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1E293B', margin: 0 }}>
              Control Parental
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Ingresa el PIN maestro para acceder al panel de los padres.
            </p>

            <input
              type="password"
              maxLength={6}
              value={inputPin}
              autoFocus
              onChange={(e) => { setInputPin(e.target.value.replace(/\D/g, '')); setPinError(''); }}
              placeholder="• • • •"
              style={{
                padding: '14px',
                fontSize: '26px',
                textAlign: 'center',
                letterSpacing: '8px',
                borderRadius: '14px',
                border: '1px solid #CBD5E1',
                outline: 'none',
              }}
            />

            {pinError && <p className="text-danger" style={{ fontSize: '13px', margin: 0 }}>❌ {pinError}</p>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={inputPin.length < 4}
              style={{ padding: '14px', borderRadius: '14px', fontSize: '15px' }}
            >
              Entrar al Panel
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowParentPinModal(false)}
              style={{ padding: '10px', border: 'none', color: '#64748B', fontWeight: 700 }}
            >
              Volver
            </button>
          </form>
        </div>
      )}

      <BottomNav
        active={currentView}
        setActive={setCurrentView}
        pendingTasksCount={pendingTasksCount}
        inReviewCount={inReviewCount}
      />
    </>
  );
};

export default ChildDashboard;
