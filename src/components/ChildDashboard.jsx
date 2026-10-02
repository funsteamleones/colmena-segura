import { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { LogOut, Coins, Clock, Globe, Star, PlayCircle } from 'lucide-react';

const ChildDashboard = () => {
  const { childData, activities, rewards, setDeviceMode, claimReward, completeActivity } = useAppContext();
  const [activeTab, setActiveTab] = useState('missions'); // 'missions' | 'rewards'

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h} h ${m} min`;
    return `${m} min`;
  };

  return (
    <>
      <div className="flex-row justify-between">
        <div>
          <h1 className="text-primary" style={{ fontSize: '28px' }}>¡Hola {childData.name}! 🐝</h1>
          <p className="text-muted flex-row gap-1 mt-2">
            <Star size={16} className="text-warning" /> Nivel {childData.level} (Abeja Exploradora)
          </p>
        </div>
        <button 
          className="btn-outline" 
          style={{ padding: '8px 12px', width: 'auto', borderRadius: '12px' }}
          onClick={() => setDeviceMode('parent_device')}
        >
          <LogOut size={20} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="card text-center" style={{ background: 'var(--color-primary)', color: 'white' }}>
          <Coins size={28} style={{ margin: '0 auto', marginBottom: '8px' }} />
          <h2>{childData.coins} 🪙</h2>
          <p style={{ opacity: 0.8 }}>Monedas</p>
        </div>
        <div className="card text-center" style={{ background: 'var(--color-purple)', color: 'white' }}>
          <Clock size={28} style={{ margin: '0 auto', marginBottom: '8px' }} />
          <h2>{formatTime(childData.screenTimeAvailable)}</h2>
          <p style={{ opacity: 0.8 }}>Disponibles</p>
        </div>
      </div>

      <div className="card text-center" style={{ background: 'var(--color-success-light)', color: 'white' }}>
        <Globe size={28} style={{ margin: '0 auto', marginBottom: '8px' }} />
        <h2 style={{ fontSize: '24px' }}>{formatTime(childData.screenTimeSaved)}</h2>
        <p className="font-bold">¡Tiempo recuperado fuera de pantalla!</p>
      </div>

      <div className="flex-row gap-2" style={{ background: 'var(--color-gray-200)', padding: '4px', borderRadius: '20px' }}>
        <button 
          className="btn"
          style={{ background: activeTab === 'missions' ? 'var(--card-bg)' : 'transparent', color: activeTab === 'missions' ? 'var(--color-primary)' : 'var(--text-muted)' }}
          onClick={() => setActiveTab('missions')}
        >
          Mis Misiones
        </button>
        <button 
          className="btn"
          style={{ background: activeTab === 'rewards' ? 'var(--card-bg)' : 'transparent', color: activeTab === 'rewards' ? 'var(--color-purple)' : 'var(--text-muted)' }}
          onClick={() => setActiveTab('rewards')}
        >
          Mis Recompensas
        </button>
      </div>

      <div className="flex-col gap-3">
        {activeTab === 'missions' && activities.filter(a => a.isPositive).map(activity => (
          <div key={activity.id} className="card flex-row justify-between" style={{ alignItems: 'center' }}>
            <div className="flex-row gap-3">
              <span style={{ fontSize: '32px' }}>{activity.icon}</span>
              <div>
                <h3>{activity.title}</h3>
                <p className="text-success font-bold">+{activity.coins} 🪙</p>
              </div>
            </div>
            <button 
              className="btn btn-outline" 
              style={{ padding: '8px', width: 'auto', borderRadius: '50%' }}
              onClick={() => {
                completeActivity(activity);
                alert(`¡Misión completada! Has ganado ${activity.coins} monedas.`);
              }}
            >
              <PlayCircle size={24} className="text-primary" />
            </button>
          </div>
        ))}

        {activeTab === 'rewards' && rewards.map(reward => (
          <div key={reward.id} className="card flex-row justify-between" style={{ alignItems: 'center' }}>
            <div className="flex-row gap-3">
              <span style={{ fontSize: '32px' }}>{reward.icon}</span>
              <div>
                <h3>{reward.title}</h3>
                <p className="text-purple font-bold">Cuesta {reward.coinsCost} 🪙</p>
              </div>
            </div>
            <button 
              className="btn" 
              style={{ padding: '12px 16px', width: 'auto', background: childData.coins >= reward.coinsCost ? 'var(--color-purple)' : 'var(--color-gray-300)', color: 'white' }}
              disabled={childData.coins < reward.coinsCost}
              onClick={() => {
                if (claimReward(reward)) {
                  alert(`¡Canjeaste ${reward.title} exitosamente!`);
                }
              }}
            >
              Canjear
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChildDashboard;
