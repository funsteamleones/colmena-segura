import { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import {
  LogOut, Plus, Minus, Activity, ShieldCheck, Clock,
  AlertTriangle, CheckCircle, Trash2, Settings, KeyRound, User, Save, X
} from 'lucide-react';

// ─── Emoji Picker (simplificado) ──────────────────────────────────────────────
const EMOJIS = ['🏠','📚','🌳','🍽️','⚽','🎨','🎵','🐶','🚴','💪','🧹','🛁','🎯','🌟',
                '🎮','📺','🍕','🍿','🎁','🏖️','🎪','🏆','🎤','🎭','🚀','🦄','🍦','🎠'];

const EmojiPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{ fontSize: '28px', background: 'var(--color-gray-100)', border: '1px solid var(--color-gray-300)', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}
      >
        {value}
      </button>
      {open && (
        <div style={{
          position: 'absolute', zIndex: 100, top: '48px', left: 0,
          background: 'white', border: '1px solid var(--color-gray-200)',
          borderRadius: '12px', padding: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', width: '220px'
        }}>
          {EMOJIS.map(e => (
            <button
              key={e} type="button"
              onClick={() => { onChange(e); setOpen(false); }}
              style={{ fontSize: '22px', background: value === e ? 'var(--color-gray-200)' : 'none', border: 'none', borderRadius: '6px', padding: '4px', cursor: 'pointer' }}
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Formulario para añadir Actividad ─────────────────────────────────────────
const AddActivityForm = ({ onAdd, onCancel }) => {
  const [title, setTitle]   = useState('');
  const [coins, setCoins]   = useState('');
  const [icon, setIcon]     = useState('🌟');
  const [error, setError]   = useState('');

  const handleSubmit = () => {
    if (!title.trim()) { setError('Escribe el nombre de la misión.'); return; }
    const c = parseInt(coins);
    if (isNaN(c) || c <= 0) { setError('Las monedas deben ser un número mayor a 0.'); return; }
    onAdd({ title: title.trim(), coins: c, icon, isPositive: true });
    onCancel();
  };

  return (
    <div className="card flex-col gap-3" style={{ border: '2px dashed var(--color-primary)' }}>
      <h3 className="text-primary">Nueva misión</h3>
      <div className="flex-row gap-2">
        <EmojiPicker value={icon} onChange={setIcon} />
        <input
          type="text" value={title} placeholder="Nombre de la misión"
          onChange={e => { setTitle(e.target.value); setError(''); }}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--color-gray-300)' }}
        />
      </div>
      <div className="flex-row gap-2" style={{ alignItems: 'center' }}>
        <span style={{ fontSize: '18px' }}>🪙</span>
        <input
          type="number" value={coins} placeholder="Monedas (ej. 20)"
          onChange={e => { setCoins(e.target.value); setError(''); }}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--color-gray-300)' }}
          min="1"
        />
      </div>
      {error && <p className="text-danger" style={{ fontSize: '13px' }}>{error}</p>}
      <div className="flex-row gap-2">
        <button className="btn btn-primary" style={{ padding: '10px' }} onClick={handleSubmit}><Save size={16} /> Guardar</button>
        <button className="btn btn-outline" style={{ padding: '10px', flex: 'none', width: 'auto' }} onClick={onCancel}><X size={16} /></button>
      </div>
    </div>
  );
};

// ─── Formulario para añadir Recompensa ────────────────────────────────────────
const AddRewardForm = ({ onAdd, onCancel }) => {
  const [title, setTitle]       = useState('');
  const [coinsCost, setCost]    = useState('');
  const [duration, setDuration] = useState('');
  const [icon, setIcon]         = useState('🎁');
  const [error, setError]       = useState('');

  const handleSubmit = () => {
    if (!title.trim()) { setError('Escribe el nombre de la recompensa.'); return; }
    const c = parseInt(coinsCost);
    if (isNaN(c) || c <= 0) { setError('El costo debe ser mayor a 0.'); return; }
    onAdd({ title: title.trim(), coinsCost: c, duration: parseInt(duration) || 0, icon });
    onCancel();
  };

  return (
    <div className="card flex-col gap-3" style={{ border: '2px dashed var(--color-purple)' }}>
      <h3 style={{ color: 'var(--color-purple)' }}>Nueva recompensa</h3>
      <div className="flex-row gap-2">
        <EmojiPicker value={icon} onChange={setIcon} />
        <input
          type="text" value={title} placeholder="Nombre de la recompensa"
          onChange={e => { setTitle(e.target.value); setError(''); }}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--color-gray-300)' }}
        />
      </div>
      <div className="flex-row gap-2" style={{ alignItems: 'center' }}>
        <span style={{ fontSize: '18px' }}>🪙</span>
        <input
          type="number" value={coinsCost} placeholder="Costo en monedas"
          onChange={e => { setCost(e.target.value); setError(''); }}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--color-gray-300)' }}
          min="1"
        />
      </div>
      <div className="flex-row gap-2" style={{ alignItems: 'center' }}>
        <span style={{ fontSize: '18px' }}>⏱️</span>
        <input
          type="number" value={duration} placeholder="Minutos de pantalla (0 si no aplica)"
          onChange={e => setDuration(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--color-gray-300)' }}
          min="0"
        />
      </div>
      {error && <p className="text-danger" style={{ fontSize: '13px' }}>{error}</p>}
      <div className="flex-row gap-2">
        <button className="btn btn-primary" style={{ padding: '10px' }} onClick={handleSubmit}><Save size={16} /> Guardar</button>
        <button className="btn btn-outline" style={{ padding: '10px', flex: 'none', width: 'auto' }} onClick={onCancel}><X size={16} /></button>
      </div>
    </div>
  );
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
const ParentDashboard = () => {
  const {
    childData, history, activities, rewards,
    logoutParent, addCoins, resetCoins,
    addActivity, removeActivity,
    addReward, removeReward,
    updateChildName, updatePin, parentPin,
    resetDevice
  } = useAppContext();

  const [activeTab, setActiveTab]       = useState('overview');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustConcept, setAdjustConcept] = useState('');

  // Config state
  const [newChildName, setNewChildName] = useState(childData.name);
  const [newPin, setNewPin]             = useState('');
  const [newPinConfirm, setNewPinConfirm] = useState('');
  const [pinError, setPinError]         = useState('');
  const [nameSuccess, setNameSuccess]   = useState('');
  const [pinSuccess, setPinSuccess]     = useState('');

  // Form visibility
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddReward, setShowAddReward]     = useState(false);

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h} h ${m} min`;
    return `${m} min`;
  };

  const getTip = () => {
    const { screenTimeUsed, recommendedScreenTimeLimit } = childData;
    if (screenTimeUsed > recommendedScreenTimeLimit) {
      return { type: 'danger', icon: <AlertTriangle size={20} />, title: 'Límite excedido', text: `${childData.name} ha usado ${formatTime(screenTimeUsed)} hoy, superando el límite de ${formatTime(recommendedScreenTimeLimit)}.` };
    } else if (screenTimeUsed > recommendedScreenTimeLimit * 0.8) {
      return { type: 'warning', icon: <AlertTriangle size={20} />, title: 'Cerca del límite', text: `${childData.name} está por alcanzar el límite diario. ¡Buen momento para una actividad sin pantalla!` };
    }
    return { type: 'success', icon: <CheckCircle size={20} />, title: 'Uso saludable', text: `El tiempo de pantalla de ${childData.name} está dentro del límite saludable recomendado.` };
  };
  const tip = getTip();

  const handleAdjustCoins = (isPositive) => {
    const amount = parseInt(adjustAmount);
    if (isNaN(amount) || amount <= 0 || !adjustConcept.trim()) {
      alert('Por favor ingresa un monto válido y un motivo.');
      return;
    }
    addCoins(isPositive ? amount : -amount, adjustConcept.trim());
    setAdjustAmount('');
    setAdjustConcept('');
  };

  const handleSaveName = () => {
    if (!newChildName.trim()) return;
    updateChildName(newChildName);
    setNameSuccess('¡Nombre actualizado!');
    setTimeout(() => setNameSuccess(''), 3000);
  };

  const handleSavePin = () => {
    if (newPin.length < 4) { setPinError('El PIN debe tener al menos 4 dígitos.'); return; }
    if (newPin !== newPinConfirm) { setPinError('Los PINs no coinciden.'); return; }
    updatePin(newPin);
    setNewPin('');
    setNewPinConfirm('');
    setPinError('');
    setPinSuccess('¡PIN actualizado correctamente!');
    setTimeout(() => setPinSuccess(''), 3000);
  };

  const TABS = [
    { id: 'overview', label: 'Resumen' },
    { id: 'adjust',   label: 'Ajustar' },
    { id: 'history',  label: 'Historial' },
    { id: 'config',   label: '⚙️ Config' },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex-row justify-between">
        <div className="flex-row gap-3">
          <div style={{ background: 'var(--color-primary)', padding: '10px', borderRadius: '50%', color: 'white' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-primary" style={{ fontSize: '22px' }}>Panel Parental</h1>
            <p className="text-muted" style={{ fontSize: '12px' }}>Modo Seguro</p>
          </div>
        </div>
        <button className="btn-outline" style={{ padding: '8px 12px', width: 'auto', borderRadius: '12px' }} onClick={logoutParent}>
          <LogOut size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', background: 'var(--color-gray-200)', padding: '4px', borderRadius: '16px' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            className="btn"
            style={{
              background: activeTab === t.id ? 'var(--card-bg)' : 'transparent',
              color: activeTab === t.id ? 'var(--color-primary)' : 'var(--text-muted)',
              padding: '8px 4px', fontSize: '12px', borderRadius: '12px',
            }}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-col gap-3">

        {/* ── RESUMEN ── */}
        {activeTab === 'overview' && (
          <>
            <div className="card text-center" style={{ border: '1px solid var(--color-gray-200)' }}>
              <h3 className="text-muted" style={{ marginBottom: '4px' }}>Perfil activo</h3>
              <h2 style={{ fontSize: '26px', color: 'var(--color-gray-800)' }}>{childData.name}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="card text-center flex-col gap-2" style={{ background: 'var(--color-gray-100)' }}>
                <Activity size={22} className="text-primary" style={{ margin: '0 auto' }} />
                <h3>{childData.coins} 🪙</h3>
                <p className="text-muted" style={{ fontSize: '12px' }}>Saldo Actual</p>
              </div>
              <div className="card text-center flex-col gap-2" style={{ background: 'var(--color-gray-100)' }}>
                <Clock size={22} className="text-warning" style={{ margin: '0 auto' }} />
                <h3>{formatTime(childData.screenTimeAvailable)}</h3>
                <p className="text-muted" style={{ fontSize: '12px' }}>Tiempo Pantalla</p>
              </div>
            </div>
            <div className="card flex-col gap-2" style={{ background: tip.type === 'danger' ? '#fef2f2' : tip.type === 'warning' ? '#fffbeb' : '#f0fdf4', border: `1px solid var(--color-${tip.type})` }}>
              <div className={`flex-row gap-2 font-bold text-${tip.type}`}>{tip.icon} <span>{tip.title}</span></div>
              <p className="text-muted" style={{ fontSize: '13px' }}>{tip.text}</p>
            </div>
          </>
        )}

        {/* ── AJUSTAR ── */}
        {activeTab === 'adjust' && (
          <div className="card flex-col gap-4">
            <h2>Ajuste Manual de Monedas</h2>
            <p className="text-muted">Suma o resta monedas a {childData.name} manualmente.</p>
            <div className="flex-col gap-2">
              <label className="font-bold">Motivo:</label>
              <input type="text" value={adjustConcept} onChange={e => setAdjustConcept(e.target.value)} placeholder="Ej. Ayudó con la cena" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-gray-300)' }} />
            </div>
            <div className="flex-col gap-2">
              <label className="font-bold">Cantidad de monedas:</label>
              <input type="number" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} placeholder="Ej. 20" min="1" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-gray-300)' }} />
            </div>
            <div className="flex-row gap-3">
              <button className="btn btn-success flex-row justify-center gap-2" onClick={() => handleAdjustCoins(true)}><Plus size={18} /> Sumar</button>
              <button className="btn btn-danger flex-row justify-center gap-2" onClick={() => handleAdjustCoins(false)}><Minus size={18} /> Restar</button>
            </div>
            <div style={{ borderTop: '1px solid var(--color-gray-200)', paddingTop: '16px' }}>
              <button className="btn btn-outline flex-row justify-center gap-2" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                onClick={() => { if (window.confirm(`¿Resetear las monedas de ${childData.name} a 0?`)) resetCoins(); }}>
                <Minus size={18} /> Resetear monedas a 0
              </button>
            </div>
          </div>
        )}

        {/* ── HISTORIAL ── */}
        {activeTab === 'history' && (
          <div className="flex-col gap-3">
            {history.length === 0 ? (
              <p className="text-center text-muted" style={{ marginTop: '24px' }}>No hay movimientos todavía.</p>
            ) : (
              history.map(item => (
                <div key={item.id} className="card flex-row justify-between" style={{ padding: '14px 16px', borderLeft: `4px solid ${item.amount > 0 ? 'var(--color-success)' : item.amount === 0 ? 'var(--color-gray-400)' : 'var(--color-danger)'}` }}>
                  <div className="flex-col gap-1">
                    <span className="font-bold" style={{ fontSize: '14px' }}>{item.concept}</span>
                    <span className="text-muted" style={{ fontSize: '11px' }}>{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                  <div className={`font-bold ${item.amount > 0 ? 'text-success' : item.amount === 0 ? 'text-muted' : 'text-danger'}`} style={{ fontSize: '16px', flexShrink: 0 }}>
                    {item.amount > 0 ? '+' : ''}{item.amount} 🪙
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── CONFIGURACIÓN ── */}
        {activeTab === 'config' && (
          <div className="flex-col gap-4">

            {/* Nombre del hijo */}
            <div className="card flex-col gap-3">
              <div className="flex-row gap-2"><User size={20} className="text-primary" /><h3>Nombre del niño/a</h3></div>
              <input
                type="text" value={newChildName}
                onChange={e => { setNewChildName(e.target.value); setNameSuccess(''); }}
                placeholder="Nombre"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-gray-300)' }}
              />
              {nameSuccess && <p className="text-success" style={{ fontSize: '13px' }}>✅ {nameSuccess}</p>}
              <button className="btn btn-primary" style={{ padding: '10px' }} onClick={handleSaveName} disabled={!newChildName.trim() || newChildName === childData.name}>
                <Save size={16} /> Guardar nombre
              </button>
            </div>

            {/* Cambiar PIN */}
            <div className="card flex-col gap-3">
              <div className="flex-row gap-2"><KeyRound size={20} className="text-primary" /><h3>Cambiar PIN</h3></div>
              <input type="password" value={newPin} onChange={e => { setNewPin(e.target.value.replace(/\D/g,'').slice(0,8)); setPinError(''); setPinSuccess(''); }}
                placeholder="Nuevo PIN (mín. 4 dígitos)" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-gray-300)', letterSpacing: '4px', fontSize: '18px', textAlign: 'center' }} />
              <input type="password" value={newPinConfirm} onChange={e => { setNewPinConfirm(e.target.value.replace(/\D/g,'').slice(0,8)); setPinError(''); }}
                placeholder="Confirmar nuevo PIN" style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${pinError ? 'var(--color-danger)' : 'var(--color-gray-300)'}`, letterSpacing: '4px', fontSize: '18px', textAlign: 'center' }} />
              {pinError   && <p className="text-danger" style={{ fontSize: '13px' }}>❌ {pinError}</p>}
              {pinSuccess && <p className="text-success" style={{ fontSize: '13px' }}>✅ {pinSuccess}</p>}
              <button className="btn btn-primary" style={{ padding: '10px' }} onClick={handleSavePin} disabled={newPin.length < 4}>
                <KeyRound size={16} /> Guardar PIN
              </button>
            </div>

            {/* Gestión de Actividades */}
            <div className="card flex-col gap-3">
              <div className="flex-row justify-between">
                <div className="flex-row gap-2"><Settings size={20} className="text-primary" /><h3>Misiones</h3></div>
                <button
                  onClick={() => setShowAddActivity(v => !v)}
                  style={{ background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showAddActivity ? <X size={16} /> : <Plus size={16} />}
                </button>
              </div>

              {showAddActivity && (
                <AddActivityForm onAdd={addActivity} onCancel={() => setShowAddActivity(false)} />
              )}

              {activities.filter(a => a.isPositive).length === 0 && (
                <p className="text-muted" style={{ fontSize: '13px', textAlign: 'center' }}>No hay misiones. ¡Agrega una!</p>
              )}
              {activities.filter(a => a.isPositive).map(act => (
                <div key={act.id} className="flex-row justify-between" style={{ padding: '8px', background: 'var(--color-gray-100)', borderRadius: '10px' }}>
                  <div className="flex-row gap-2">
                    <span style={{ fontSize: '22px' }}>{act.icon}</span>
                    <div>
                      <span className="font-bold" style={{ fontSize: '14px' }}>{act.title}</span>
                      <p className="text-success" style={{ fontSize: '12px' }}>+{act.coins} 🪙</p>
                    </div>
                  </div>
                  <button onClick={() => { if (window.confirm(`¿Eliminar "${act.title}"?`)) removeActivity(act.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Gestión de Recompensas */}
            <div className="card flex-col gap-3">
              <div className="flex-row justify-between">
                <div className="flex-row gap-2"><Settings size={20} style={{ color: 'var(--color-purple)' }} /><h3>Recompensas</h3></div>
                <button
                  onClick={() => setShowAddReward(v => !v)}
                  style={{ background: 'var(--color-purple)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showAddReward ? <X size={16} /> : <Plus size={16} />}
                </button>
              </div>

              {showAddReward && (
                <AddRewardForm onAdd={addReward} onCancel={() => setShowAddReward(false)} />
              )}

              {rewards.length === 0 && (
                <p className="text-muted" style={{ fontSize: '13px', textAlign: 'center' }}>No hay recompensas. ¡Agrega una!</p>
              )}
              {rewards.map(r => (
                <div key={r.id} className="flex-row justify-between" style={{ padding: '8px', background: 'var(--color-gray-100)', borderRadius: '10px' }}>
                  <div className="flex-row gap-2">
                    <span style={{ fontSize: '22px' }}>{r.icon}</span>
                    <div>
                      <span className="font-bold" style={{ fontSize: '14px' }}>{r.title}</span>
                      <p style={{ fontSize: '12px', color: 'var(--color-purple)' }}>{r.coinsCost} 🪙{r.duration > 0 ? ` · ${r.duration} min pantalla` : ''}</p>
                    </div>
                  </div>
                  <button onClick={() => { if (window.confirm(`¿Eliminar "${r.title}"?`)) removeReward(r.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </>
  );
};

export default ParentDashboard;
