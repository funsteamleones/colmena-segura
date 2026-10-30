import { useState, useMemo } from 'react';
import { useAppContext, PRESET_ICONS, DEFAULT_CHILD_ICON } from '../store/AppContext';
import {
  LogOut, Plus, Minus, Activity, ShieldCheck, Clock,
  AlertTriangle, CheckCircle, Trash2, KeyRound, User, Save, X, Gift, CheckSquare,
  Smartphone, Users, Check, RefreshCw, Sparkles, Brain, Award, Eye, Flame, ChevronRight,
  TrendingUp, Compass, Heart, Database, Copy, ExternalLink, Wifi, CheckCircle2
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  isSupabaseConfigured
} from '../services/supabase';

const EmojiPicker = ({ value, onChange, onClearDefault }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          fontSize: '26px',
          background: '#F1F5F9',
          border: '1px solid #CBD5E1',
          borderRadius: '12px',
          padding: '8px 12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span>{value || DEFAULT_CHILD_ICON}</span>
        <span style={{ fontSize: '11px', color: '#64748B' }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          zIndex: 100,
          top: '56px',
          left: 0,
          background: 'white',
          border: '1px solid #CBD5E1',
          borderRadius: '16px',
          padding: '12px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
          width: '260px'
        }}>
          <div className="flex-row justify-between align-center mb-2">
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Elige un icono</span>
            {onClearDefault && (
              <button
                type="button"
                onClick={() => { onClearDefault(); setOpen(false); }}
                style={{ background: 'none', border: 'none', color: '#D97706', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Default (🐝)
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
            {PRESET_ICONS.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => { onChange(e); setOpen(false); }}
                style={{
                  fontSize: '22px',
                  background: value === e ? '#FEF3C7' : 'none',
                  border: value === e ? '1px solid #F59E0B' : 'none',
                  borderRadius: '8px',
                  padding: '6px 2px',
                  cursor: 'pointer'
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── AGREGAR MISIÓN ─────────────────────────────────────────────────────────────
const AddActivityForm = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [coins, setCoins] = useState('');
  const [icon, setIcon] = useState('🌟');
  const [category, setCategory] = useState('habitos');
  const [time, setTime] = useState('20 min');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) { setError('Escribe el título de la misión.'); return; }
    const c = parseInt(coins);
    if (isNaN(c) || c <= 0) { setError('Las monedas deben ser mayores a 0.'); return; }
    onAdd({
      title: title.trim(),
      coins: c,
      icon,
      category,
      time: time.trim() || '20 min',
      description: description.trim() || 'Cumple con esta tarea y avisa a tus padres para recibir tu recompensa.',
    });
    onCancel();
  };

  return (
    <div className="flex-col gap-3 card animate-fade-in" style={{ border: '2px dashed #F59E0B', padding: '18px', borderRadius: '18px', background: '#FFFBEB' }}>
      <h3 style={{ color: '#B45309', margin: 0, fontSize: '16px', fontWeight: 800 }}>Crear Nueva Misión para los Hijos</h3>
      <div className="flex-row gap-2">
        <EmojiPicker value={icon} onChange={setIcon} />
        <input
          type="text"
          value={title}
          placeholder="Nombre de la misión (ej. Tender la cama)"
          onChange={e => { setTitle(e.target.value); setError(''); }}
          style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px' }}
        />
      </div>

      <div className="flex-row gap-2 align-center">
        <div className="flex-row gap-1 align-center" style={{ flex: 1, background: '#FFFFFF', padding: '6px 12px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
          <span>🪙 Oro:</span>
          <input
            type="number"
            value={coins}
            placeholder="Monedas (ej. 30)"
            onChange={e => { setCoins(e.target.value); setError(''); }}
            style={{ width: '100%', border: 'none', outline: 'none', padding: '6px', fontSize: '14px', fontWeight: 700 }}
            min="1"
          />
        </div>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}
        >
          <option value="escuela">📚 Escuela</option>
          <option value="hogar">🏠 Hogar</option>
          <option value="salud">🏃 Salud / Deporte</option>
          <option value="habitos">💖 Hábitos & Convivencia</option>
        </select>
      </div>

      <input
        type="text"
        value={description}
        placeholder="Instrucciones breves para el niño..."
        onChange={e => setDescription(e.target.value)}
        style={{ padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '13px' }}
      />

      {error && <p className="text-danger" style={{ fontSize: '13px', margin: 0 }}>⚠️ {error}</p>}

      <div className="flex-row gap-2">
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          style={{ flex: 1, padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Save size={16} /> Guardar Misión
        </button>
        <button
          onClick={onCancel}
          style={{ padding: '12px', background: 'transparent', border: '1px solid #CBD5E1', borderRadius: '12px', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// ─── AGREGAR RECOMPENSA ──────────────────────────────────────────────────────────
const AddRewardForm = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [coinsCost, setCoinsCost] = useState('');
  const [duration, setDuration] = useState('15');
  const [isScreenReward, setIsScreenReward] = useState(true);
  const [icon, setIcon] = useState('🎁');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) { setError('Escribe el nombre de la recompensa.'); return; }
    const c = parseInt(coinsCost);
    if (isNaN(c) || c <= 0) { setError('El costo en monedas debe ser mayor a 0.'); return; }
    onAdd({
      title: title.trim(),
      coinsCost: c,
      duration: isScreenReward ? parseInt(duration) || 15 : 0,
      icon,
      category: isScreenReward ? 'pantalla' : 'familiar',
    });
    onCancel();
  };

  return (
    <div className="flex-col gap-3 card animate-fade-in" style={{ border: '2px dashed #3B82F6', padding: '18px', borderRadius: '18px', background: '#EFF6FF' }}>
      <h3 style={{ color: '#1E40AF', margin: 0, fontSize: '16px', fontWeight: 800 }}>Nueva Recompensa en la Tienda</h3>
      <div className="flex-row gap-2">
        <EmojiPicker value={icon} onChange={setIcon} />
        <input
          type="text"
          value={title}
          placeholder="Nombre (ej. 20 min de juegos o Helado)"
          onChange={e => { setTitle(e.target.value); setError(''); }}
          style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px' }}
        />
      </div>

      <div className="flex-row gap-2 align-center">
        <div className="flex-row gap-1 align-center" style={{ flex: 1, background: '#FFFFFF', padding: '6px 12px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
          <span>🪙 Costo:</span>
          <input
            type="number"
            value={coinsCost}
            placeholder="Monedas (ej. 40)"
            onChange={e => { setCoinsCost(e.target.value); setError(''); }}
            style={{ width: '100%', border: 'none', outline: 'none', padding: '6px', fontSize: '14px', fontWeight: 700 }}
            min="1"
          />
        </div>

        <label className="flex-row gap-2 align-center" style={{ fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isScreenReward}
            onChange={e => setIsScreenReward(e.target.checked)}
          />
          <span>¿Es tiempo de pantalla?</span>
        </label>
      </div>

      {isScreenReward && (
        <div className="flex-row gap-2 align-center">
          <span style={{ fontSize: '13px', color: '#1E40AF', fontWeight: 700 }}>Minutos de pantalla:</span>
          <input
            type="number"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            style={{ width: '80px', padding: '8px', borderRadius: '10px', border: '1px solid #CBD5E1', textAlign: 'center', fontWeight: 800 }}
            min="5"
            step="5"
          />
          <span style={{ fontSize: '12px', color: '#64748B' }}>minutos</span>
        </div>
      )}

      {error && <p className="text-danger" style={{ fontSize: '13px', margin: 0 }}>⚠️ {error}</p>}

      <div className="flex-row gap-2">
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          style={{ flex: 1, padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Save size={16} /> Guardar Recompensa
        </button>
        <button
          onClick={onCancel}
          style={{ padding: '12px', background: 'transparent', border: '1px solid #CBD5E1', borderRadius: '12px', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// ─── PARENT DASHBOARD PRINCIPAL ─────────────────────────────────────────────────
const ParentDashboard = () => {
  const {
    parentAccount,
    childrenList,
    activeChildId,
    childData,
    setActiveChild,
    createChildProfile,
    updateChildProfile,
    taskValidationRequests,
    parentApproveTask,
    parentRejectTask,
    activities,
    addActivity,
    removeActivity,
    rewards,
    addReward,
    removeReward,
    adjustChildCoins,
    history,
    parentNeuroTips,
    screenInvestmentCategories,
    getPediatricStandardForAge,
    logoutParent,
    updatePin,
    setDeviceMode,
    resetAllData,
    setCurrentScreen,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'tasks', 'monitoring', 'adjust', 'config'
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddReward, setShowAddReward] = useState(false);
  const [showNewChildModal, setShowNewChildModal] = useState(false);

  // Neuro Tip Index
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // New Child Form State
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(8);
  const [newChildIcon, setNewChildIcon] = useState('🦁');

  // Adjust coins state
  const [adjustAmount, setAdjustAmount] = useState(20);
  const [adjustReason, setAdjustReason] = useState('Bonificación por excelente conducta');

  // Security PIN state
  const [newPin, setNewPin] = useState('');
  const [newPinConfirm, setNewPinConfirm] = useState('');
  const [pinMsg, setPinMsg] = useState('');

  // ─── Cloud Database (Supabase) State ───
  const [dbConfig, setDbConfig] = useState(() => getSupabaseConfig());
  const [isDbOnline, setIsDbOnline] = useState(() => isSupabaseConfigured());
  const [dbLoading, setDbLoading] = useState(false);
  const [dbFeedback, setDbFeedback] = useState(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleTestAndSaveDb = async () => {
    if (!dbConfig.url.trim() || !dbConfig.anonKey.trim()) {
      setDbFeedback({ type: 'error', text: 'Ingresa la URL y la Anon Key de tu proyecto en Supabase.' });
      return;
    }
    setDbLoading(true);
    setDbFeedback(null);
    const result = await testSupabaseConnection(dbConfig.url.trim(), dbConfig.anonKey.trim());
    setDbLoading(false);
    if (result.ok) {
      saveSupabaseConfig(dbConfig.url.trim(), dbConfig.anonKey.trim());
      setIsDbOnline(true);
      setDbFeedback({ type: 'success', text: '¡Conexión exitosa a Supabase! Tu base de datos en la nube está activa.' });
    } else {
      setDbFeedback({ type: 'error', text: `No se pudo conectar: ${result.error}. Verifica las credenciales o que hayas ejecutado el script SQL en Supabase.` });
    }
  };

  // Solicitudes pendientes de este niño
  const pendingRequestsForActiveChild = useMemo(() => {
    return taskValidationRequests.filter(r => r.status === 'pending' && r.childId === childData.id);
  }, [taskValidationRequests, childData.id]);

  const allPendingRequests = useMemo(() => {
    return taskValidationRequests.filter(r => r.status === 'pending');
  }, [taskValidationRequests]);

  // Estándar pediátrico para la edad del hijo
  const pediatricStandard = useMemo(() => {
    return getPediatricStandardForAge(childData.age || 8);
  }, [childData.age, getPediatricStandardForAge]);

  // Cálculo de Semáforo de Pantalla
  const screenTimeUsedToday = childData.screenTimeUsedToday || 0;
  const maxHealthyLimit = pediatricStandard.maxScreenMinutesDaily;
  const screenHealthRatio = maxHealthyLimit > 0 ? screenTimeUsedToday / maxHealthyLimit : 0;

  let healthStatus = 'green'; // 'green', 'yellow', 'red'
  if (screenHealthRatio >= 1.0) {
    healthStatus = 'red';
  } else if (screenHealthRatio >= 0.75) {
    healthStatus = 'yellow';
  }

  // Desglose de inversión de tiempo de pantalla
  const investments = childData.screenTimeInvestments || [];
  const categoryTotals = useMemo(() => {
    const totals = {
      videojuegos: 0,
      videos: 0,
      educativo: 0,
      social: 0,
      creatividad: 0,
    };
    investments.forEach(inv => {
      if (totals[inv.category] !== undefined) {
        totals[inv.category] += inv.minutes;
      }
    });
    return totals;
  }, [investments]);

  const totalInvestedMinutes = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const currentNeuroTip = parentNeuroTips[currentTipIndex % parentNeuroTips.length];

  const handleCreateChild = (e) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    createChildProfile({
      name: newChildName.trim(),
      age: Number(newChildAge),
      icon: newChildIcon,
    });
    setShowNewChildModal(false);
    setNewChildName('');
  };

  const handleUpdatePin = (e) => {
    e.preventDefault();
    if (newPin.length < 4) { setPinMsg('El PIN debe tener al menos 4 dígitos'); return; }
    if (newPin !== newPinConfirm) { setPinMsg('Los PINs no coinciden'); return; }
    updatePin(newPin);
    setNewPin('');
    setNewPinConfirm('');
    setPinMsg('✅ PIN actualizado correctamente');
    setTimeout(() => setPinMsg(''), 3000);
  };

  const TABS = [
    { id: 'overview', label: 'Resumen & Validar', badge: allPendingRequests.length },
    { id: 'tasks', label: 'Misiones & Premios' },
    { id: 'monitoring', label: 'Monitoreo & Estándar OMS' },
    { id: 'adjust', label: 'Saldo & Historial' },
    { id: 'config', label: 'Configuración' },
  ];

  return (
    <div style={{ background: '#0F172A', minHeight: '100%', display: 'flex', flexDirection: 'column', color: '#F8FAFC' }}>
      
      {/* ─── DARK HEADER ─── */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex-row justify-between align-center">
          <div className="flex-row gap-3 align-center">
            <div style={{ background: '#FFCA28', width: '46px', height: '46px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(255, 202, 40, 0.3)' }}>
              <ShieldCheck size={26} color="#0F172A" strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{ color: '#FFCA28', fontSize: '20px', fontWeight: 900, margin: 0 }}>
                Colmena Segura
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 700, margin: 0 }}>
                Panel de {parentAccount.name || 'Papá / Mamá'}
              </p>
            </div>
          </div>

          <div className="flex-row gap-2">
            <button
              onClick={() => setCurrentScreen('admin_dashboard')}
              title="Panel de Super Admin & Monitoreo Global"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 202, 40, 0.2), rgba(245, 158, 11, 0.2))',
                border: '1px solid rgba(255, 202, 40, 0.4)',
                borderRadius: '12px',
                padding: '8px 12px',
                color: '#FFCA28',
                fontSize: '12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <span>👑</span> Admin
            </button>
            <button
              onClick={() => setCurrentScreen('child')}
              title="Ver vista del hijo"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '12px',
                padding: '8px 12px',
                color: '#FEF3C7',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <span>{childData.icon || '🐝'}</span> Vista Hijo
            </button>
            <button
              onClick={logoutParent}
              title="Cerrar sesión"
              style={{
                background: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <LogOut size={18} color="#0F172A" />
            </button>
          </div>
        </div>

        {/* Multi-Child Selector */}
        <div className="flex-row gap-2 mt-4" style={{ overflowX: 'auto', paddingBottom: '4px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 800, whiteSpace: 'nowrap' }}>
            Hijo/a:
          </span>
          {childrenList.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChild(c.id)}
              style={{
                background: c.id === childData.id ? 'linear-gradient(135deg, #FFCA28 0%, #F59E0B 100%)' : 'rgba(255,255,255,0.08)',
                color: c.id === childData.id ? '#0F172A' : '#FFFFFF',
                border: 'none',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{c.icon || DEFAULT_CHILD_ICON}</span>
              <span>{c.name} ({c.age || 8}a)</span>
              {taskValidationRequests.some(r => r.status === 'pending' && r.childId === c.id) && (
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></span>
              )}
            </button>
          ))}

          <button
            onClick={() => setShowNewChildModal(true)}
            style={{
              background: 'transparent',
              border: '1px dashed rgba(255,255,255,0.25)',
              color: '#FFCA28',
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            <Plus size={14} /> Agregar Hijo
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex-row gap-2 mt-4" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '10px 14px',
                background: activeTab === t.id ? '#FFCA28' : 'transparent',
                color: activeTab === t.id ? '#0F172A' : '#94A3B8',
                border: activeTab === t.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{t.label}</span>
              {t.badge > 0 && (
                <span style={{ background: '#EF4444', color: '#FFFFFF', borderRadius: '999px', padding: '1px 6px', fontSize: '10px', fontWeight: 900 }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── WHITE/LIGHT CONTAINER ─── */}
      <div style={{ background: '#F8FAFC', flex: 1, borderTopLeftRadius: '28px', borderTopRightRadius: '28px', padding: '24px 20px', overflowY: 'auto', color: '#1E293B' }}>
        
        {/* ─── TAB 1: RESUMEN & VALIDACIÓN DE TAREAS ─── */}
        {activeTab === 'overview' && (
          <div className="flex-col gap-4 animate-fade-in">
            {/* Header del Hijo Seleccionado */}
            <div className="flex-row justify-between align-center">
              <div className="flex-row gap-3 align-center">
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#FEF3C7', border: '3px solid #FFCA28', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                  {childData.icon || DEFAULT_CHILD_ICON}
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>
                    {childData.name}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontWeight: 700 }}>
                    {childData.age || 8} años · Nivel {childData.level} ({childData.coins} monedas acumuladas)
                  </p>
                </div>
              </div>
            </div>

            {/* 🚨 SECCIÓN CRÍTICA: VALIDACIÓN DE MISIONES (PADRE APRUEBA -> SE ACREDITA EL ORO) */}
            <div
              className="card flex-col gap-3"
              style={{
                background: allPendingRequests.length > 0 ? '#FEF3C7' : '#FFFFFF',
                border: allPendingRequests.length > 0 ? '2px solid #F59E0B' : '1px solid #E2E8F0',
                borderRadius: '24px',
                padding: '20px',
              }}
            >
              <div className="flex-row justify-between align-center">
                <div className="flex-row gap-2 align-center">
                  <span style={{ fontSize: '22px' }}>{allPendingRequests.length > 0 ? '🚨' : '✅'}</span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                      Misiones Pendientes de Validación ({allPendingRequests.length})
                    </h3>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                      El oro se agrega a la cuenta del hijo únicamente cuando tú lo apruebas.
                    </p>
                  </div>
                </div>
              </div>

              {allPendingRequests.length === 0 ? (
                <div style={{ padding: '12px', background: '#F0FDF4', borderRadius: '16px', textAlign: 'center', color: '#166534', fontSize: '13px', fontWeight: 700 }}>
                  ✨ ¡Todo validado! Ningún hijo tiene misiones pendientes de revisión en este momento.
                </div>
              ) : (
                <div className="flex-col gap-2">
                  {allPendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="card flex-row justify-between align-center"
                      style={{
                        padding: '14px 16px',
                        borderRadius: '16px',
                        background: '#FFFFFF',
                        border: '1px solid #FDE68A',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)',
                      }}
                    >
                      <div className="flex-row gap-3 align-center" style={{ flex: 1 }}>
                        <span style={{ fontSize: '26px' }}>{req.taskIcon || '📖'}</span>
                        <div>
                          <div style={{ fontSize: '11px', color: '#D97706', fontWeight: 800 }}>
                            {req.childIcon} {req.childName} solicitó:
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: 900, color: '#1E293B' }}>
                            {req.taskTitle}
                          </div>
                          <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 800 }}>
                            +{req.taskCoins} monedas de oro
                          </div>
                        </div>
                      </div>

                      <div className="flex-row gap-2">
                        <button
                          onClick={() => parentRejectTask(req.id)}
                          style={{
                            background: '#F1F5F9',
                            border: '1px solid #CBD5E1',
                            borderRadius: '12px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            color: '#64748B',
                          }}
                        >
                          Repetir
                        </button>
                        <button
                          onClick={() => parentApproveTask(req.id)}
                          style={{
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '8px 14px',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          <Check size={14} strokeWidth={3} /> Aprobar (+{req.taskCoins})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saldo y Estadísticas Rápidas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="card flex-col gap-1 p-4" style={{ borderRadius: '20px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <div className="flex-row justify-between align-center">
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Saldo en Oro</span>
                  <span style={{ fontSize: '20px' }}>🪙</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#D97706' }}>
                  {childData.coins} pts
                </div>
                <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>
                  {childData.completedTaskIds?.length || 0} misiones aprobadas
                </span>
              </div>

              <div className="card flex-col gap-1 p-4" style={{ borderRadius: '20px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <div className="flex-row justify-between align-center">
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Pantalla Canjeada</span>
                  <span style={{ fontSize: '20px' }}>⏱️</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#2563EB' }}>
                  {screenTimeUsedToday} min
                </div>
                <span style={{ fontSize: '11px', color: healthStatus === 'green' ? '#16A34A' : healthStatus === 'yellow' ? '#D97706' : '#DC2626', fontWeight: 700 }}>
                  Límite OMS: {maxHealthyLimit} min/día
                </span>
              </div>
            </div>

            {/* Cápsula de Neurociencia & Pediatría Subliminal/Informativa */}
            <div
              className="card flex-col gap-2"
              style={{
                background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                border: '1.5px solid #BFDBFE',
                borderRadius: '24px',
                padding: '18px',
              }}
            >
              <div className="flex-row justify-between align-center">
                <div className="flex-row gap-2 align-center">
                  <Brain size={20} color="#2563EB" />
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Micro-Neurociencia Pediátrica · {currentNeuroTip.badge}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentTipIndex(prev => prev + 1)}
                  style={{ background: 'white', border: '1px solid #BFDBFE', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#2563EB' }}
                >
                  <RefreshCw size={13} />
                </button>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#1E3A8A', margin: 0 }}>
                {currentNeuroTip.title}
              </h4>
              <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: '1.5' }}>
                {currentNeuroTip.text}
              </p>
              <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '12px', fontSize: '12px', color: '#1E40AF', fontWeight: 700, borderLeft: '3px solid #2563EB' }}>
                💡 Acción recomendada: {currentNeuroTip.action}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: GESTOR DE TAREAS Y RECOMPENSAS ─── */}
        {activeTab === 'tasks' && (
          <div className="flex-col gap-4 animate-fade-in">
            {/* Cabecera con botón de agregar */}
            <div className="flex-row justify-between align-center">
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>Misiones de la Familia</h2>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>El padre define el oro y los objetivos</p>
              </div>
              <button
                onClick={() => setShowAddActivity(true)}
                className="btn btn-primary"
                style={{ padding: '8px 14px', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> Nueva Misión
              </button>
            </div>

            {showAddActivity && (
              <AddActivityForm
                onAdd={addActivity}
                onCancel={() => setShowAddActivity(false)}
              />
            )}

            {/* Listado de Tareas */}
            <div className="flex-col gap-2">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="card flex-row justify-between align-center"
                  style={{
                    padding: '14px 16px',
                    borderRadius: '16px',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div className="flex-row gap-3 align-center" style={{ flex: 1 }}>
                    <span style={{ fontSize: '26px' }}>{act.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>
                        {act.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#D97706', fontWeight: 700 }}>
                        +{act.coins} monedas · {act.time}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeActivity(act.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '6px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Catálogo de Recompensas */}
            <div className="flex-row justify-between align-center mt-4">
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>Recompensas Disponibles</h2>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Canjes de pantalla y premios de la vida real</p>
              </div>
              <button
                onClick={() => setShowAddReward(true)}
                style={{
                  background: '#EFF6FF',
                  color: '#2563EB',
                  border: '1px solid #BFDBFE',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={16} /> Nuevo Premio
              </button>
            </div>

            {showAddReward && (
              <AddRewardForm
                onAdd={addReward}
                onCancel={() => setShowAddReward(false)}
              />
            )}

            <div className="flex-col gap-2">
              {rewards.map((rew) => (
                <div
                  key={rew.id}
                  className="card flex-row justify-between align-center"
                  style={{
                    padding: '14px 16px',
                    borderRadius: '16px',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div className="flex-row gap-3 align-center" style={{ flex: 1 }}>
                    <span style={{ fontSize: '26px' }}>{rew.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>
                        {rew.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#D97706', fontWeight: 700 }}>
                        🪙 {rew.coinsCost} pts {rew.duration > 0 && `· ⏱️ ${rew.duration} min`}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeReward(rew.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '6px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 3: MONITOREO DE PANTALLA & ESTÁNDAR PEDIÁTRICO OMS ─── */}
        {activeTab === 'monitoring' && (
          <div className="flex-col gap-4 animate-fade-in">
            {/* Cabecera */}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>
                Monitoreo de Pantallas: {childData.name} ({childData.age || 8} años)
              </h2>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                Tiempo canjeado, desglose de inversión y estándares pediátricos
              </p>
            </div>

            {/* Semáforo de Salud Digital */}
            <div
              className="card flex-col gap-3"
              style={{
                borderRadius: '24px',
                padding: '20px',
                background: healthStatus === 'green' ? '#F0FDF4' : healthStatus === 'yellow' ? '#FFFBEB' : '#FEF2F2',
                border: `2px solid ${healthStatus === 'green' ? '#86EFAC' : healthStatus === 'yellow' ? '#FDE68A' : '#FECACA'}`,
              }}
            >
              <div className="flex-row justify-between align-center">
                <div className="flex-row gap-2 align-center">
                  <span style={{ fontSize: '26px' }}>
                    {healthStatus === 'green' ? '🟢' : healthStatus === 'yellow' ? '🟡' : '🔴'}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0, color: healthStatus === 'green' ? '#166534' : healthStatus === 'yellow' ? '#92400E' : '#991B1B' }}>
                      {healthStatus === 'green' ? 'Estado: Equilibrio Óptimo' : healthStatus === 'yellow' ? 'Estado: Próximo al Límite' : 'Estado: Alerta de Sobrecarga'}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                      Según estándares de la OMS y Academia Americana de Pediatría (AAP)
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#1E293B' }}>
                    {screenTimeUsedToday}m / {maxHealthyLimit}m
                  </span>
                </div>
              </div>

              {/* Barra Comparativa */}
              <div style={{ height: '12px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, Math.round(screenHealthRatio * 100))}%`,
                    background: healthStatus === 'green' ? '#10B981' : healthStatus === 'yellow' ? '#F59E0B' : '#EF4444',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              <div style={{ fontSize: '12px', color: '#334155', lineHeight: '1.5' }}>
                <strong>Directriz Médica OMS ({pediatricStandard.ageRange}):</strong> {pediatricStandard.guideline}
              </div>
            </div>

            {/* ¿EN QUÉ INVIERTE EL TIEMPO EL HIJO? (REQUERIMIENTO EXPLÍCITO) */}
            <div className="card flex-col gap-3 p-4" style={{ borderRadius: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div className="flex-row justify-between align-center">
                <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0 }}>
                  ¿En qué invierte su tiempo digital?
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>
                  Total canjeado: {totalInvestedMinutes} min
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                El niño selecciona la categoría cada vez que canjea minutos de pantalla:
              </p>

              <div className="flex-col gap-2 mt-1">
                {screenInvestmentCategories.map((cat) => {
                  const minutes = categoryTotals[cat.id] || 0;
                  const percent = totalInvestedMinutes > 0 ? Math.round((minutes / totalInvestedMinutes) * 100) : 0;

                  return (
                    <div key={cat.id} className="flex-col gap-1">
                      <div className="flex-row justify-between align-center" style={{ fontSize: '13px' }}>
                        <span className="flex-row gap-2 align-center">
                          <span>{cat.icon}</span>
                          <strong style={{ color: '#1E293B' }}>{cat.label}</strong>
                          <span style={{ fontSize: '11px', color: '#94A3B8' }}>({cat.examples})</span>
                        </span>
                        <span style={{ fontWeight: 800, color: cat.color }}>
                          {minutes} min ({percent}%)
                        </span>
                      </div>
                      <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${percent}%`,
                            background: cat.color,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ESTÁNDAR DE "HIJO IDEAL" (LOS 4 PILARES DEL DESARROLLO PEDIÁTRICO) */}
            <div className="card flex-col gap-3 p-4" style={{ borderRadius: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0, color: '#1E293B' }}>
                Estándar de "Hijo Ideal": Balance Pediátrico Diario
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                Métricas recomendadas para un niño de {childData.age || 8} años según medicina pediátrica:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '20px' }}>💤</div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>Sueño Diario</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#2563EB' }}>
                    {pediatricStandard.recommendedSleepHours} Horas
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>Sin pantallas 1h antes</span>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '20px' }}>🏃</div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>Actividad Física</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#16A34A' }}>
                    {pediatricStandard.minPhysicalActivityMinutes} min/día
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>Luz solar para la visión</span>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '20px' }}>📱</div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>Límite de Ocio</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#D97706' }}>
                    Máx {pediatricStandard.maxScreenMinutesDaily} min
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>Regulado por recompensas</span>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '20px' }}>📚</div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>Hábitos Cumplidos</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#7C3AED' }}>
                    {childData.completedTaskIds?.length || 0} misiones
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>Validación parental previa</span>
                </div>
              </div>
            </div>

            {/* Historial reciente de canjes */}
            <div className="card flex-col gap-2 p-4" style={{ borderRadius: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Registro Reciente de Canjes de Pantalla
              </h4>
              {investments.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>No hay registros de canjes aún.</p>
              ) : (
                <div className="flex-col gap-2 mt-2">
                  {investments.slice(0, 5).map((inv) => (
                    <div
                      key={inv.id}
                      className="flex-row justify-between align-center"
                      style={{ padding: '8px 12px', background: '#F8FAFC', borderRadius: '12px', fontSize: '12px' }}
                    >
                      <span className="flex-row gap-2 align-center">
                        <span>⏱️</span>
                        <strong>{inv.rewardTitle}</strong>
                        <span style={{ color: '#64748B' }}>({inv.category})</span>
                      </span>
                      <span style={{ fontWeight: 800, color: '#2563EB' }}>
                        +{inv.minutes} min
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 4: AJUSTAR SALDO & HISTORIAL ─── */}
        {activeTab === 'adjust' && (
          <div className="flex-col gap-4 animate-fade-in">
            <div className="card flex-col gap-3 p-4" style={{ borderRadius: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0 }}>
                Ajustar Saldo de Monedas para {childData.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                Otorga bonificaciones especiales o descuenta puntos si no se cumplió un acuerdo familiar.
              </p>

              <div className="flex-row gap-2 align-center mt-2">
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(Number(e.target.value))}
                  style={{ width: '100px', padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '16px', fontWeight: 800, textAlign: 'center' }}
                />
                <input
                  type="text"
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  placeholder="Motivo del ajuste..."
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div className="flex-row gap-2 mt-2">
                <button
                  onClick={() => adjustChildCoins(Math.abs(adjustAmount), adjustReason)}
                  style={{ flex: 1, padding: '12px', background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}
                >
                  + Bonificar Monedas
                </button>
                <button
                  onClick={() => adjustChildCoins(-Math.abs(adjustAmount), adjustReason)}
                  style={{ flex: 1, padding: '12px', background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}
                >
                  - Deducir Monedas
                </button>
              </div>
            </div>

            {/* Historial General */}
            <div className="card flex-col gap-2 p-4" style={{ borderRadius: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0 }}>
                Historial de Movimientos de la Familia
              </h3>

              <div className="flex-col gap-2 mt-2">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="flex-row justify-between align-center"
                    style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: '14px', fontSize: '13px' }}
                  >
                    <span>{h.concept}</span>
                    <span style={{ fontWeight: 800, color: h.amount >= 0 ? '#16A34A' : '#EF4444' }}>
                      {h.amount >= 0 ? `+${h.amount}` : h.amount} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 5: CONFIGURACIÓN & SEGURIDAD ─── */}
        {activeTab === 'config' && (
          <div className="flex-col gap-4 animate-fade-in">
            {/* Cuenta de Padres */}
            <div className="card flex-col gap-3 p-4" style={{ borderRadius: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0 }}>Cuenta del Padre / Madre</h3>
              <div style={{ fontSize: '13px', color: '#334155' }}>
                <div><strong>Nombre:</strong> {parentAccount.name}</div>
                <div><strong>Email/Familia:</strong> {parentAccount.email}</div>
              </div>
            </div>

            {/* Cambiar PIN */}
            <form onSubmit={handleUpdatePin} className="card flex-col gap-3 p-4" style={{ borderRadius: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0 }}>Cambiar PIN Maestro</h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                Este PIN protege el acceso parental en los dispositivos de tus hijos.
              </p>

              <div className="flex-row gap-2">
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Nuevo PIN"
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', textAlign: 'center', letterSpacing: '4px' }}
                />
                <input
                  type="password"
                  maxLength={6}
                  value={newPinConfirm}
                  onChange={e => setNewPinConfirm(e.target.value.replace(/\D/g, ''))}
                  placeholder="Repetir PIN"
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', textAlign: 'center', letterSpacing: '4px' }}
                />
              </div>

              {pinMsg && <p style={{ fontSize: '12px', margin: 0 }}>{pinMsg}</p>}

              <button type="submit" className="btn btn-primary" style={{ padding: '10px', borderRadius: '12px' }}>
                Actualizar PIN
              </button>
            </form>

            {/* ─── BASE DE DATOS EN LA NUBE (SUPABASE) ─── */}
            <div className="card flex-col gap-3 p-4" style={{ borderRadius: '24px', background: '#FFFFFF', border: isDbOnline ? '2px solid #86EFAC' : '1px solid #E2E8F0' }}>
              <div className="flex-row justify-between align-center">
                <div className="flex-row gap-2 align-center">
                  <Database size={22} color={isDbOnline ? '#16A34A' : '#2563EB'} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0, color: '#1E293B' }}>
                      Base de Datos en la Nube (Supabase)
                    </h3>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                      Sincronización en vivo entre el celular del padre y el del hijo
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 800,
                    background: isDbOnline ? '#DCFCE7' : '#FEF3C7',
                    color: isDbOnline ? '#166534' : '#B45309',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Wifi size={12} /> {isDbOnline ? 'Nube Activa' : 'Modo Local'}
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                Para que cuando estés en tu celular y tu hijo en el suyo las tareas y monedas se actualicen <strong>en tiempo real</strong> de forma 100% gratuita, conecta tu proyecto de Supabase:
              </p>

              <div className="flex-col gap-2">
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>Project URL:</label>
                  <input
                    type="text"
                    value={dbConfig.url}
                    onChange={e => setDbConfig(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://xyzcompany.supabase.co"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>Anon Public Key:</label>
                  <input
                    type="password"
                    value={dbConfig.anonKey}
                    onChange={e => setDbConfig(prev => ({ ...prev, anonKey: e.target.value }))}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>
              </div>

              {dbFeedback && (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: dbFeedback.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                    color: dbFeedback.type === 'success' ? '#166534' : '#991B1B',
                    border: `1px solid ${dbFeedback.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
                  }}
                >
                  {dbFeedback.text}
                </div>
              )}

              <div className="flex-row gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleTestAndSaveDb}
                  disabled={dbLoading}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 800 }}
                >
                  {dbLoading ? 'Probando conexión...' : 'Conectar y Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSqlModal(true)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: '#EFF6FF',
                    color: '#2563EB',
                    border: '1px solid #BFDBFE',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  📋 Ver SQL
                </button>
              </div>
            </div>

            {/* Acceso al Panel de Super Admin & Forzar Actualizaciones */}
            <div className="card flex-col gap-3 p-4" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', border: '1px solid rgba(255, 202, 40, 0.3)', color: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>👑</span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0, color: '#FFCA28' }}>Panel Super Admin & Monitoreo</h3>
                    <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>Supervisión de todas las familias, datos y forzar actualizaciones</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setCurrentScreen('admin_dashboard')}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #FFB300, #F59E0B)',
                    color: '#0F172A',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '12px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>👑</span> Abrir Panel Admin
                </button>

                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('check-app-update'));
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <RefreshCw size={14} /> Buscar Actualizaciones
                </button>
              </div>
            </div>

            {/* Modo de este Dispositivo */}
            <div className="card flex-col gap-3 p-4" style={{ borderRadius: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, margin: 0 }}>Rol de este Dispositivo</h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                Si vas a entregarle este teléfono a tu hijo, bloquéalo en Modo Hijo:
              </p>

              <button
                onClick={() => setDeviceMode('child_device', childData.id)}
                style={{
                  background: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '14px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Smartphone size={18} /> Bloquear este celular en Modo de {childData.name}
              </button>
            </div>

            {/* Reseteo a valores de fábrica */}
            <div className="card flex-col gap-2 p-4" style={{ borderRadius: '24px', background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#991B1B', margin: 0 }}>Zona Peligrosa</h3>
              <p style={{ fontSize: '12px', color: '#7F1D1D', margin: 0 }}>
                Borrar todos los datos locales y reiniciar el asistente de bienvenida.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('¿Seguro que deseas reiniciar todos los datos de la app?')) {
                    resetAllData();
                  }
                }}
                style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '10px', fontWeight: 800, cursor: 'pointer', marginTop: '6px' }}
              >
                Resetear Todo de Fábrica
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── MODAL CREAR NUEVO HIJO ─── */}
      {showNewChildModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowNewChildModal(false)}
        >
          <form
            onSubmit={handleCreateChild}
            className="card flex-col gap-4 animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '24px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex-row justify-between align-center">
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                Nuevo Hijo/a
              </h2>
              <button
                type="button"
                onClick={() => setShowNewChildModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: '#FEF3C7',
                  border: '3px solid #FFCA28',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '34px',
                  margin: '0 auto 8px',
                }}
              >
                {newChildIcon}
              </div>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {PRESET_ICONS.slice(0, 6).map((ico) => (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => setNewChildIcon(ico)}
                    style={{
                      background: newChildIcon === ico ? '#FFCA28' : '#F1F5F9',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '4px',
                      fontSize: '18px',
                      cursor: 'pointer',
                    }}
                  >
                    {ico}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-col gap-1">
              <label style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>Nombre:</label>
              <input
                type="text"
                value={newChildName}
                onChange={e => setNewChildName(e.target.value)}
                placeholder="Ej. Sofía, Lucas..."
                autoFocus
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px' }}
              />
            </div>

            <div className="flex-col gap-1">
              <label style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>Edad (Años):</label>
              <input
                type="number"
                min="3"
                max="17"
                value={newChildAge}
                onChange={e => setNewChildAge(Number(e.target.value))}
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px', fontWeight: 800, width: '90px' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!newChildName.trim()}
              style={{ padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: 800 }}
            >
              Crear Perfil de Hijo
            </button>
          </form>
        </div>
      )}

      {/* ─── MODAL SCRIPT SQL DE SUPABASE ─── */}
      {showSqlModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowSqlModal(false)}
        >
          <div
            className="card flex-col gap-3 animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '85vh',
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '24px',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex-row justify-between align-center">
              <div className="flex-row gap-2 align-center">
                <Database size={22} color="#2563EB" />
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                  Script SQL para tu Supabase Gratuito
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
              <strong>Instrucciones rápidas (2 minutos):</strong><br />
              1. Ve a <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#2563EB', fontWeight: 800 }}>supabase.com</a> y crea un proyecto gratuito.<br />
              2. En el menú izquierdo ve a <strong>SQL Editor</strong>.<br />
              3. Pega este código y presiona <strong>RUN</strong>.<br />
              4. En <strong>Project Settings &gt; API</strong>, copia tu URL y Anon Key y pégalas aquí.
            </p>

            <div style={{ position: 'relative' }}>
              <pre
                style={{
                  background: '#0F172A',
                  color: '#F8FAFC',
                  padding: '16px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  maxHeight: '260px',
                  lineHeight: '1.5',
                }}
              >
{`-- COLMENA SEGURA - TABLAS Y REALTIME
create table if not exists public.families (
  id text primary key,
  parent_name text not null,
  email text,
  pin text default '1234'
);

create table if not exists public.children (
  id text primary key,
  family_id text references public.families(id),
  name text not null,
  age integer default 8,
  icon text default '🐝',
  coins integer default 100,
  screen_time_used_today integer default 0,
  completed_task_ids jsonb default '[]'::jsonb,
  pending_task_ids jsonb default '[]'::jsonb,
  screen_time_investments jsonb default '[]'::jsonb
);

create table if not exists public.task_validation_requests (
  id text primary key,
  child_id text references public.children(id),
  child_name text not null,
  task_title text not null,
  task_coins integer not null,
  status text default 'pending',
  requested_at timestamp default now()
);

alter publication supabase_realtime add table public.children;
alter publication supabase_realtime add table public.task_validation_requests;`}
              </pre>
            </div>

            <button
              type="button"
              onClick={() => {
                const sqlText = `-- COLMENA SEGURA - TABLAS Y REALTIME\ncreate table if not exists public.families (id text primary key, parent_name text not null, email text, pin text default '1234');\ncreate table if not exists public.children (id text primary key, family_id text references public.families(id), name text not null, age integer default 8, icon text default '🐝', coins integer default 100, screen_time_used_today integer default 0, completed_task_ids jsonb default '[]'::jsonb, pending_task_ids jsonb default '[]'::jsonb, screen_time_investments jsonb default '[]'::jsonb);\ncreate table if not exists public.task_validation_requests (id text primary key, child_id text references public.children(id), child_name text not null, task_title text not null, task_coins integer not null, status text default 'pending', requested_at timestamp default now());\nalter publication supabase_realtime add table public.children;\nalter publication supabase_realtime add table public.task_validation_requests;`;
                navigator.clipboard.writeText(sqlText);
                setCopiedSql(true);
                setTimeout(() => setCopiedSql(false), 2500);
              }}
              className="btn btn-primary"
              style={{ padding: '14px', borderRadius: '14px', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {copiedSql ? (
                <>
                  <Check size={18} strokeWidth={3} /> ¡Script SQL Copiado al Portapapeles!
                </>
              ) : (
                <>
                  <Copy size={18} /> Copiar Script SQL Completo
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
