import { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import { fetchAdminOverviewData } from '../services/cloudSync';
import { getSupabaseClient } from '../services/supabase';
import {
  Users,
  ShieldAlert,
  Clock,
  Coins,
  RefreshCw,
  Download,
  ArrowLeft,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Gamepad2,
  Tv,
  Smartphone,
  Palette,
  BookOpen,
  Send,
  Lock,
  KeyRound,
  Eye,
  LogOut,
  Radio,
} from 'lucide-react';

const ADMIN_MASTER_PASS = 'W2*meAP9eCvjKMb';
const ADMIN_QUICK_PIN = '7777';

export default function AdminDashboard() {
  const { setCurrentScreen, showToast, childrenList, parentAccount, parentPin, taskValidationRequests } = useAppContext();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('colmena_admin_auth') === 'true';
  });
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Data State
  const [loading, setLoading] = useState(true);
  const [cloudData, setCloudData] = useState({
    families: [],
    children: [],
    requests: [],
    activities: [],
    rewards: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'families' | 'activity'
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Check Supabase connection
  const isSupabaseConfigured = Boolean(getSupabaseClient());

  // Load Data
  const loadData = async () => {
    setLoading(true);
    const data = await fetchAdminOverviewData();
    if (data) {
      setCloudData(data);
    }
    setLastRefreshed(new Date());
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Merge Cloud + Local for accurate display even before first network sync
  const mergedFamilies = useMemo(() => {
    const list = [...(cloudData.families || [])];
    if (list.length === 0 && parentAccount?.isRegistered) {
      list.push({
        id: 'familia-principal',
        parent_name: parentAccount.name || 'Familia Principal',
        email: parentAccount.email || 'familia@colmena.com',
        pin: parentPin || '1234',
        created_at: new Date().toISOString(),
      });
    }
    return list;
  }, [cloudData.families, parentAccount, parentPin]);

  const mergedChildren = useMemo(() => {
    if (cloudData.children && cloudData.children.length > 0) {
      return cloudData.children;
    }
    return childrenList || [];
  }, [cloudData.children, childrenList]);

  const mergedRequests = useMemo(() => {
    if (cloudData.requests && cloudData.requests.length > 0) {
      return cloudData.requests;
    }
    return taskValidationRequests || [];
  }, [cloudData.requests, taskValidationRequests]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalFamilies = mergedFamilies.length || 1;
    const totalChildren = mergedChildren.length || 0;

    let totalCoins = 0;
    let totalScreenMinutesToday = 0;
    let healthyCount = 0;

    // Categories breakdown
    const categoryTotals = {
      videojuegos: 0,
      videos: 0,
      redes: 0,
      creatividad: 0,
      educativo: 0,
    };

    mergedChildren.forEach((c) => {
      totalCoins += c.coins || 0;
      const usedToday = c.screen_time_used_today || c.screenTimeUsedToday || 0;
      const limit = c.recommended_screen_limit || c.recommendedScreenTimeLimit || 90;
      totalScreenMinutesToday += usedToday;

      if (usedToday <= limit) {
        healthyCount++;
      }

      // Sum investments
      const investments = c.screen_time_investments || c.screenTimeInvestments || [];
      investments.forEach((inv) => {
        const cat = inv.category || 'videojuegos';
        if (categoryTotals[cat] !== undefined) {
          categoryTotals[cat] += inv.minutes || 0;
        } else {
          categoryTotals.videojuegos += inv.minutes || 0;
        }
      });
    });

    const pendingRequests = mergedRequests.filter((r) => r.status === 'pending').length;
    const approvedRequests = mergedRequests.filter((r) => r.status === 'approved').length;
    const healthRate = totalChildren > 0 ? Math.round((healthyCount / totalChildren) * 100) : 100;

    return {
      totalFamilies,
      totalChildren,
      totalCoins,
      totalScreenMinutesToday,
      pendingRequests,
      approvedRequests,
      healthRate,
      categoryTotals,
    };
  }, [mergedFamilies, mergedChildren, mergedRequests]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (passInput === ADMIN_MASTER_PASS || passInput === ADMIN_QUICK_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('colmena_admin_auth', 'true');
      setAuthError(false);
      showToast('Sesión de Super-Admin iniciada', '👑');
    } else {
      setAuthError(true);
      showToast('Clave de administrador incorrecta', '❌');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('colmena_admin_auth');
    showToast('Sesión de administrador cerrada', '🔒');
  };

  // Broadcast force update to all devices
  const handleForceBroadcastUpdate = () => {
    window.dispatchEvent(new CustomEvent('check-app-update'));
    showToast('🚀 Solicitud de actualización forzada emitida al sistema', '✨');
  };

  // Export database as JSON
  const handleExportJSON = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      families: mergedFamilies,
      children: mergedChildren,
      requests: mergedRequests,
      metrics,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `colmena-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Copia de seguridad exportada con éxito', '💾');
  };

  // Filtered children list for table
  const filteredChildren = useMemo(() => {
    if (!searchQuery.trim()) return mergedChildren;
    const q = searchQuery.toLowerCase();
    return mergedChildren.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q))
    );
  }, [mergedChildren, searchQuery]);

  // ─── LOGIN SCREEN IF NOT AUTHENTICATED ─────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at top, #1E293B, #0F172A, #020617)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          color: '#F8FAFC',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            background: 'rgba(30, 41, 59, 0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 202, 40, 0.25)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
            padding: '36px 28px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #FFB300, #FF6F00)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              margin: '0 auto 20px',
              boxShadow: '0 10px 25px rgba(255, 179, 0, 0.35)',
            }}
          >
            👑
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFCA28', marginBottom: '8px' }}>
            Panel de Super Admin
          </h2>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '28px', lineHeight: '1.4' }}>
            Monitoreo central de usuarios, familias y bienestar digital en tiempo real.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <KeyRound
                size={18}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                }}
              />
              <input
                type="password"
                placeholder="Ingresa PIN (7777) o Clave Maestra"
                value={passInput}
                onChange={(e) => {
                  setPassInput(e.target.value);
                  setAuthError(false);
                }}
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 46px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: authError ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '14px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {authError && (
              <p style={{ fontSize: '13px', color: '#F87171', margin: '0', textAlign: 'left' }}>
                Clave no válida. Usa el PIN de administrador (7777) o la clave maestra.
              </p>
            )}

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #FFB300, #F59E0B)',
                color: '#0F172A',
                fontWeight: 800,
                fontSize: '15px',
                padding: '14px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(255, 179, 0, 0.3)',
                transition: 'transform 0.15s ease',
              }}
            >
              <Lock size={18} />
              Desbloquear Monitoreo
            </button>
          </form>

          <button
            onClick={() => setCurrentScreen('parent_dashboard')}
            style={{
              marginTop: '20px',
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
            }}
          >
            <ArrowLeft size={16} /> Volver a Colmena Segura
          </button>
        </div>
      </div>
    );
  }

  // ─── AUTHENTICATED ADMIN DASHBOARD ─────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0B0F19',
        color: '#F8FAFC',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        paddingBottom: '80px',
      }}
    >
      {/* 1. Header Bar */}
      <header
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid rgba(255, 202, 40, 0.2)',
          padding: '16px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setCurrentScreen('parent_dashboard')}
            title="Volver a la App"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#CBD5E1',
              padding: '8px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Volver
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>👑</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFCA28' }}>
                  Colmena Central
                </h1>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: isSupabaseConfigured ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                    color: isSupabaseConfigured ? '#4ADE80' : '#FACC15',
                    border: isSupabaseConfigured ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: isSupabaseConfigured ? '#4ADE80' : '#FACC15',
                      boxShadow: isSupabaseConfigured ? '0 0 8px #4ADE80' : 'none',
                    }}
                  />
                  {isSupabaseConfigured ? 'PostgreSQL Nube en Vivo' : 'Modo Local'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
                Supervisión Global de Familias, Niños y Tiempos de Pantalla
              </p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={loadData}
            title="Refrescar datos desde la nube"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            Refrescar
          </button>

          <button
            onClick={handleForceBroadcastUpdate}
            title="Forzar a todos los celulares a recargar a la última versión"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              border: 'none',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            }}
          >
            <Radio size={15} />
            Forzar Actualización
          </button>

          <button
            onClick={handleExportJSON}
            title="Descargar respaldo JSON completo"
            style={{
              background: 'rgba(255, 202, 40, 0.15)',
              border: '1px solid rgba(255, 202, 40, 0.3)',
              color: '#FFCA28',
              padding: '8px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            <Download size={15} />
            Exportar
          </button>

          <button
            onClick={handleLogout}
            title="Cerrar sesión de administrador"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              padding: '8px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
        
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '12px',
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              background: activeTab === 'overview' ? 'rgba(255, 202, 40, 0.15)' : 'transparent',
              color: activeTab === 'overview' ? '#FFCA28' : '#94A3B8',
              border: activeTab === 'overview' ? '1px solid rgba(255, 202, 40, 0.3)' : '1px solid transparent',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            📊 Resumen & Métricas Clave
          </button>

          <button
            onClick={() => setActiveTab('families')}
            style={{
              background: activeTab === 'families' ? 'rgba(255, 202, 40, 0.15)' : 'transparent',
              color: activeTab === 'families' ? '#FFCA28' : '#94A3B8',
              border: activeTab === 'families' ? '1px solid rgba(255, 202, 40, 0.3)' : '1px solid transparent',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            👨‍👩‍👧‍👦 Directorio de Familias e Hijos ({mergedChildren.length})
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            style={{
              background: activeTab === 'activity' ? 'rgba(255, 202, 40, 0.15)' : 'transparent',
              color: activeTab === 'activity' ? '#FFCA28' : '#94A3B8',
              border: activeTab === 'activity' ? '1px solid rgba(255, 202, 40, 0.3)' : '1px solid transparent',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            ⚡ Actividad en Vivo ({mergedRequests.length})
          </button>
        </div>

        {/* ─── TAB 1: OVERVIEW METRICS ─── */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '28px',
              }}
            >
              {/* Families */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>Familias Registradas</span>
                  <Users size={20} color="#38BDF8" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF' }}>{metrics.totalFamilies}</div>
                <span style={{ fontSize: '12px', color: '#38BDF8' }}>Cuentas parentales activas</span>
              </div>

              {/* Children */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>Hijos Supervisados</span>
                  <span style={{ fontSize: '20px' }}>🐝</span>
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFCA28' }}>{metrics.totalChildren}</div>
                <span style={{ fontSize: '12px', color: '#FACC15' }}>Dispositivos protegidos</span>
              </div>

              {/* Screen Time Today */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>Minutos Pantalla Canjeados</span>
                  <Clock size={20} color="#F43F5E" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF' }}>
                  {metrics.totalScreenMinutesToday}{' '}
                  <span style={{ fontSize: '16px', fontWeight: 500, color: '#94A3B8' }}>min</span>
                </div>
                <span style={{ fontSize: '12px', color: '#FB7185' }}>Canjeados hoy en el sistema</span>
              </div>

              {/* Total Coins */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>Monedas en Circulación</span>
                  <Coins size={20} color="#EAB308" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFCA28' }}>{metrics.totalCoins}</div>
                <span style={{ fontSize: '12px', color: '#FACC15' }}>Ganadas por hábitos sanos</span>
              </div>

              {/* Digital Health Rate */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>Salud Digital OMS</span>
                  <CheckCircle2 size={20} color="#10B981" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#34D399' }}>{metrics.healthRate}%</div>
                <span style={{ fontSize: '12px', color: '#6EE7B7' }}>Niños dentro de límites recomendados</span>
              </div>
            </div>

            {/* Screen Time Investment Category Breakdown */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '24px',
                marginBottom: '28px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px', color: '#FFCA28' }}>
                🎮 Distribución de Uso de Pantallas por Categoría
              </h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px' }}>
                Total acumulado de minutos invertidos por los niños en cada categoría:
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '14px',
                    padding: '16px',
                    borderLeft: '4px solid #8B5CF6',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C4B5FD', fontSize: '13px' }}>
                    <Gamepad2 size={16} /> Videojuegos
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
                    {metrics.categoryTotals.videojuegos} <span style={{ fontSize: '14px', color: '#94A3B8' }}>min</span>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '14px',
                    padding: '16px',
                    borderLeft: '4px solid #EF4444',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FCA5A5', fontSize: '13px' }}>
                    <Tv size={16} /> Videos & YouTube
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
                    {metrics.categoryTotals.videos} <span style={{ fontSize: '14px', color: '#94A3B8' }}>min</span>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '14px',
                    padding: '16px',
                    borderLeft: '4px solid #EC4899',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F472B6', fontSize: '13px' }}>
                    <Smartphone size={16} /> Redes Sociales
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
                    {metrics.categoryTotals.redes} <span style={{ fontSize: '14px', color: '#94A3B8' }}>min</span>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '14px',
                    padding: '16px',
                    borderLeft: '4px solid #10B981',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6EE7B7', fontSize: '13px' }}>
                    <BookOpen size={16} /> Educativo
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
                    {metrics.categoryTotals.educativo} <span style={{ fontSize: '14px', color: '#94A3B8' }}>min</span>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '14px',
                    padding: '16px',
                    borderLeft: '4px solid #3B82F6',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#93C5FD', fontSize: '13px' }}>
                    <Palette size={16} /> Creatividad
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
                    {metrics.categoryTotals.creatividad} <span style={{ fontSize: '14px', color: '#94A3B8' }}>min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Preview Table */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  👶 Últimos Hijos Registrados
                </h3>
                <button
                  onClick={() => setActiveTab('families')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FFCA28',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Ver todos los {mergedChildren.length} →
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8' }}>
                      <th style={{ padding: '12px 8px' }}>Hijo/a</th>
                      <th style={{ padding: '12px 8px' }}>Edad</th>
                      <th style={{ padding: '12px 8px' }}>Monedas</th>
                      <th style={{ padding: '12px 8px' }}>Uso Pantalla Hoy</th>
                      <th style={{ padding: '12px 8px' }}>Semáforo OMS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mergedChildren.slice(0, 5).map((child) => {
                      const used = child.screen_time_used_today || child.screenTimeUsedToday || 0;
                      const limit = child.recommended_screen_limit || child.recommendedScreenTimeLimit || 90;
                      const isOver = used > limit;
                      return (
                        <tr
                          key={child.id}
                          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#E2E8F0' }}
                        >
                          <td style={{ padding: '12px 8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '18px' }}>{child.icon || '🐝'}</span>
                            {child.name}
                          </td>
                          <td style={{ padding: '12px 8px', color: '#94A3B8' }}>{child.age} años</td>
                          <td style={{ padding: '12px 8px', color: '#FFCA28', fontWeight: 700 }}>
                            🪙 {child.coins || 0}
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            {used} / {limit} min
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: '999px',
                                fontSize: '11px',
                                fontWeight: 700,
                                background: isOver ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                                color: isOver ? '#F87171' : '#4ADE80',
                                border: isOver ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
                              }}
                            >
                              {isOver ? '⚠️ Límite Excedido' : '🟢 Saludable'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: FAMILIES & CHILDREN DIRECTORY ─── */}
        {activeTab === 'families' && (
          <div>
            {/* Search and Filters */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8',
                  }}
                />
                <input
                  type="text"
                  placeholder="Buscar por nombre de hijo/a o ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '13px',
                  color: '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Total: <strong>{filteredChildren.length} hijos</strong>
              </div>
            </div>

            {/* Children Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px',
              }}
            >
              {filteredChildren.map((child) => {
                const used = child.screen_time_used_today || child.screenTimeUsedToday || 0;
                const limit = child.recommended_screen_limit || child.recommendedScreenTimeLimit || 90;
                const isOver = used > limit;
                const completedCount = (child.completed_task_ids || child.completedTaskIds || []).length;
                const pendingCount = (child.pending_task_ids || child.pendingTaskIds || []).length;
                const investments = child.screen_time_investments || child.screenTimeInvestments || [];

                return (
                  <div
                    key={child.id}
                    style={{
                      background: 'rgba(30, 41, 59, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '18px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '14px',
                            background: 'rgba(255, 202, 40, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            border: '1px solid rgba(255, 202, 40, 0.3)',
                          }}
                        >
                          {child.icon || '🐝'}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>
                            {child.name}
                          </h4>
                          <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                            {child.age} años · Nivel {child.level || 1}
                          </span>
                        </div>
                      </div>

                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: isOver ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                          color: isOver ? '#F87171' : '#4ADE80',
                          border: isOver ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
                        }}
                      >
                        {isOver ? '⚠️ Límite Excedido' : '🟢 Saludable'}
                      </span>
                    </div>

                    {/* Stats pills */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        background: 'rgba(15, 23, 42, 0.5)',
                        padding: '12px',
                        borderRadius: '12px',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>Monedas Oro</span>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFCA28' }}>
                          🪙 {child.coins || 0}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>Uso de Pantalla</span>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: isOver ? '#F87171' : '#FFFFFF' }}>
                          {used} / {limit} min
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>Misiones Aprobadas</span>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#4ADE80' }}>
                          ✅ {completedCount}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>En Revisión</span>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#FACC15' }}>
                          ⏳ {pendingCount}
                        </div>
                      </div>
                    </div>

                    {/* Recent Category Investments */}
                    {investments.length > 0 && (
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                        <span style={{ fontWeight: 600, color: '#CBD5E1' }}>Último canje: </span>
                        {investments[0].rewardTitle} ({investments[0].category} · {investments[0].minutes} min)
                      </div>
                    )}

                    <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                      <span>ID: {child.id}</span>
                      <span>Familia: {child.family_id || 'Principal'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB 3: REALTIME ACTIVITY AUDIT FEED ─── */}
        {activeTab === 'activity' && (
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFCA28' }}>
                  ⚡ Registro en Vivo de Validaciones y Solicitudes
                </h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                  Flujo sincrónico en tiempo real entre los celulares de los hijos y los paneles de los padres.
                </p>
              </div>

              <span
                style={{
                  fontSize: '12px',
                  color: '#34D399',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#34D399',
                  }}
                />
                Escuchando eventos Supabase
              </span>
            </div>

            {mergedRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                <Clock size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p>No hay solicitudes registradas aún en el sistema.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mergedRequests.map((req) => {
                  const isApproved = req.status === 'approved';
                  const isPending = req.status === 'pending';

                  return (
                    <div
                      key={req.id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '14px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: isApproved
                              ? 'rgba(34, 197, 94, 0.15)'
                              : isPending
                              ? 'rgba(234, 179, 8, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                          }}
                        >
                          {isApproved ? '✅' : isPending ? '⏳' : '🔄'}
                        </div>

                        <div>
                          <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '14px' }}>
                            {req.task_title || req.taskTitle}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                            Solicitado por: <strong>{req.child_name || req.childName}</strong> · Recompensa: +
                            {req.task_coins || req.taskCoins} monedas
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: isApproved
                              ? 'rgba(34, 197, 94, 0.15)'
                              : isPending
                              ? 'rgba(234, 179, 8, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                            color: isApproved ? '#4ADE80' : isPending ? '#FACC15' : '#F87171',
                            border: isApproved
                              ? '1px solid rgba(34, 197, 94, 0.3)'
                              : isPending
                              ? '1px solid rgba(234, 179, 8, 0.3)'
                              : '1px solid rgba(239, 68, 68, 0.3)',
                          }}
                        >
                          {isApproved ? 'Aprobada' : isPending ? 'Esperando Validación' : 'Devuelta'}
                        </span>

                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                          {req.requested_at || req.requestedAt
                            ? new Date(req.requested_at || req.requestedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Reciente'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Spin animation style */}
      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
