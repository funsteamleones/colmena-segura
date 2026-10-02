import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {

  // ─── Defaults ─────────────────────────────────────────────────────────────
  const defaultChildData = {
    name: 'Mi Hijo/a',
    coins: 0,
    screenTimeAvailable: 30,
    screenTimeUsed: 0,
    recommendedScreenTimeLimit: 120,
    screenTimeSaved: 0,
    level: 1,
    appUsage: []
  };

  const defaultActivities = [
    { id: 1, title: 'Ordenar habitación',  coins: 20, isPositive: true, icon: '🏠' },
    { id: 2, title: 'Leer 20 minutos',     coins: 15, isPositive: true, icon: '📚' },
    { id: 3, title: 'Jugar al aire libre', coins: 20, isPositive: true, icon: '🌳' },
    { id: 4, title: 'Ayudar en casa',      coins: 10, isPositive: true, icon: '🍽️' },
  ];

  const defaultRewards = [
    { id: 1, title: 'Tiempo libre (30 min)', coinsCost: 50,  duration: 30, icon: '🎮' },
    { id: 2, title: 'Elegir la cena',         coinsCost: 80,  duration: 0,  icon: '🍕' },
    { id: 3, title: 'Película familiar',      coinsCost: 150, duration: 0,  icon: '🍿' },
  ];

  // ─── localStorage helpers ─────────────────────────────────────────────────
  const load = (key, fallback) => {
    try {
      const s = localStorage.getItem(key);
      if (s && s !== 'undefined' && s !== 'null') return JSON.parse(s);
    } catch { /* ignore */ }
    return fallback;
  };

  const save = (key, value) => {
    try {
      if (value !== undefined) localStorage.setItem(key, JSON.stringify(value));
    } catch { /* ignore */ }
  };

  // ─── State ────────────────────────────────────────────────────────────────
  // deviceMode: 'unset' | 'parent_device' | 'child_device'
  const [deviceMode,  setDeviceModeState] = useState(() => load('deviceMode', 'unset'));
  const [isSetupDone, setIsSetupDone]     = useState(() => load('isSetupDone', false));
  const [parentPin,   setParentPin]       = useState(() => load('parentPin', null));
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(false); // session only, not persisted

  const [childData,  setChildData]  = useState(() => load('childData',  defaultChildData));
  const [activities, setActivities] = useState(() => load('activities', defaultActivities));
  const [rewards,    setRewards]    = useState(() => load('rewards',    defaultRewards));
  const [history,    setHistory]    = useState(() => load('history',    []));

  // ─── Apply theme on load ──────────────────────────────────────────────────
  useEffect(() => {
    const dm = load('deviceMode', 'unset');
    if (dm === 'parent_device') {
      document.documentElement.setAttribute('data-theme', 'parent');
    } else if (dm === 'unset') {
      document.documentElement.setAttribute('data-theme', 'setup');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  // ─── Persist ──────────────────────────────────────────────────────────────
  useEffect(() => { save('deviceMode',  deviceMode);  }, [deviceMode]);
  useEffect(() => { save('isSetupDone', isSetupDone); }, [isSetupDone]);
  useEffect(() => { save('parentPin',   parentPin);   }, [parentPin]);
  useEffect(() => { save('childData',   childData);   }, [childData]);
  useEffect(() => { save('activities',  activities);  }, [activities]);
  useEffect(() => { save('rewards',     rewards);     }, [rewards]);
  useEffect(() => { save('history',     history);     }, [history]);

  // ─── Actions: Device Mode ─────────────────────────────────────────────────
  const setDeviceMode = (mode) => {
    setDeviceModeState(mode);
    if (mode === 'parent_device') {
      document.documentElement.setAttribute('data-theme', 'parent');
    } else if (mode === 'child_device') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'setup');
    }
  };

  const resetDevice = () => {
    // Full factory reset
    localStorage.clear();
    setDeviceModeState('unset');
    setIsSetupDone(false);
    setParentPin(null);
    setIsParentLoggedIn(false);
    setChildData(defaultChildData);
    setActivities(defaultActivities);
    setRewards(defaultRewards);
    setHistory([]);
    document.documentElement.setAttribute('data-theme', 'setup');
  };

  // ─── Actions: Setup ───────────────────────────────────────────────────────
  /** Called from Onboarding on parent device */
  const saveParentSetup = ({ childName, pin }) => {
    setChildData(prev => ({ ...prev, name: childName.trim() }));
    setParentPin(pin);
    setIsSetupDone(true);
    setIsParentLoggedIn(true); // auto-login after setup
  };

  /** Called from Onboarding on child device */
  const saveChildSetup = ({ childName }) => {
    setChildData(prev => ({ ...prev, name: childName.trim() }));
    setIsSetupDone(true);
  };

  // ─── Actions: Parent Session ──────────────────────────────────────────────
  const loginParent = (pin) => {
    if (pin === parentPin) {
      setIsParentLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutParent = () => setIsParentLoggedIn(false);

  // ─── Actions: Settings ────────────────────────────────────────────────────
  const updateChildName = (name) => setChildData(prev => ({ ...prev, name: name.trim() }));
  const updatePin = (newPin) => setParentPin(newPin);

  // ─── Actions: Coins ───────────────────────────────────────────────────────
  const addCoins = (amount, concept) => {
    setChildData(prev => ({ ...prev, coins: Math.max(0, prev.coins + amount) }));
    setHistory(prev => [
      { id: Date.now(), timestamp: new Date().toISOString(), concept, amount },
      ...prev,
    ]);
  };

  const resetCoins = () => {
    setChildData(prev => ({ ...prev, coins: 0 }));
    setHistory(prev => [
      { id: Date.now(), timestamp: new Date().toISOString(), concept: '🔄 Monedas reseteadas', amount: 0 },
      ...prev,
    ]);
  };

  // ─── Actions: Rewards ─────────────────────────────────────────────────────
  const claimReward = (reward) => {
    if (childData.coins >= reward.coinsCost) {
      addCoins(-reward.coinsCost, `🎁 Canje: ${reward.title}`);
      if (reward.duration > 0) {
        setChildData(prev => ({ ...prev, screenTimeAvailable: prev.screenTimeAvailable + reward.duration }));
      }
      return true;
    }
    return false;
  };

  const addReward    = (r) => setRewards(prev => [...prev, { ...r, id: Date.now() }]);
  const removeReward = (id) => setRewards(prev => prev.filter(r => r.id !== id));

  // ─── Actions: Activities ──────────────────────────────────────────────────
  const completeActivity = (activity) => addCoins(activity.coins, `✅ ${activity.title}`);
  const addActivity      = (a)  => setActivities(prev => [...prev, { ...a, id: Date.now() }]);
  const removeActivity   = (id) => setActivities(prev => prev.filter(a => a.id !== id));

  // ─── Provider ─────────────────────────────────────────────────────────────
  return (
    <AppContext.Provider value={{
      // Device
      deviceMode, setDeviceMode, resetDevice,
      // Setup
      isSetupDone,
      saveParentSetup,
      saveChildSetup,
      // Parent session
      parentPin,
      isParentLoggedIn,
      loginParent,
      logoutParent,
      // Data
      childData,
      activities,
      rewards,
      history,
      // Settings
      updateChildName,
      updatePin,
      // Coins
      addCoins,
      resetCoins,
      // Rewards
      claimReward,
      addReward,
      removeReward,
      // Activities
      completeActivity,
      addActivity,
      removeActivity,
    }}>
      {children}
    </AppContext.Provider>
  );
};
