import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  DEFAULT_CHILD_ICON,
  PRESET_ICONS,
  INITIAL_ACTIVITIES,
  INITIAL_REWARDS,
  ACHIEVEMENTS_LIST,
} from './constants';
import {
  CHILD_SUBLIMINAL_TIPS,
  PARENT_NEURO_TIPS,
  getPediatricStandardForAge,
  SCREEN_INVESTMENT_CATEGORIES,
} from './educationalTips';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import {
  saveCloudChild,
  createCloudTaskRequest,
  updateCloudTaskRequestStatus,
  subscribeToCloudRealtime,
  fetchCloudInitialData,
  saveCloudFamily,
} from '../services/cloudSync';

export { DEFAULT_CHILD_ICON, PRESET_ICONS, ACHIEVEMENTS_LIST };

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // ─── LocalStorage helpers ─────────────────────────────────────────────────
  const load = (key, fallback) => {
    try {
      const s = localStorage.getItem(key);
      if (s && s !== 'undefined' && s !== 'null') return JSON.parse(s);
    } catch {
      /* ignore */
    }
    return fallback;
  };

  const save = (key, value) => {
    try {
      if (value !== undefined) localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  };

  // ─── Default Child Profile Generator ─────────────────────────────────────
  const createDefaultChild = (id = 'child-1', name = 'Mateo', icon = DEFAULT_CHILD_ICON, age = 8) => {
    const pediatricLimit = getPediatricStandardForAge(age).maxScreenMinutesDaily;
    return {
      id,
      name,
      age: Number(age) || 8,
      icon: icon || DEFAULT_CHILD_ICON,
      coins: 280,
      screenTimeAvailable: 30,
      screenTimeUsedToday: 45, // 45 min canjeados hoy
      recommendedScreenTimeLimit: pediatricLimit,
      level: 2,
      streakDays: 4,
      completedTaskIds: [1], // tareas ya validadas y aprobadas
      pendingTaskIds: [3],   // tarea que Mateo envió a revisión y espera aprobación
      unlockedAchievements: ['ach_1', 'ach_4'],
      weeklyActivity: [3, 4, 4, 5, 3, 2, 0],
      screenTimeInvestments: [
        {
          id: 1001,
          rewardTitle: 'Tiempo de juego extra',
          minutes: 30,
          category: 'videojuegos',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 1002,
          rewardTitle: 'Videos de curiosidades',
          minutes: 15,
          category: 'videos',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
    };
  };

  // ─── Initial Parent Account ───────────────────────────────────────────────
  const [parentAccount, setParentAccount] = useState(() =>
    load('parentAccount', {
      name: 'Carlos (Papá)',
      email: 'familia@colmena.com',
      isRegistered: true,
    })
  );

  const [parentPin, setParentPin] = useState(() => load('parentPin', '1234'));
  const [deviceMode, setDeviceModeState] = useState(() => load('deviceMode', 'unset'));
  const [isSetupDone, setIsSetupDone] = useState(() => load('isSetupDone', true));
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(false);
  const [emergencyLock, setEmergencyLock] = useState(() => load('emergencyLock', false));

  // ─── Children List ────────────────────────────────────────────────────────
  const [childrenList, setChildrenList] = useState(() => {
    const saved = load('childrenList', null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved.map(c => ({
        ...createDefaultChild(c.id, c.name, c.icon, c.age || 8),
        ...c,
        completedTaskIds: c.completedTaskIds || [],
        pendingTaskIds: c.pendingTaskIds || [],
        screenTimeInvestments: c.screenTimeInvestments || [],
      }));
    }
    return [createDefaultChild('child-1', 'Mateo', '🐝', 8)];
  });

  const [activeChildId, setActiveChildIdState] = useState(() => load('activeChildId', 'child-1'));

  // Current active child memo
  const childData = useMemo(() => {
    const found = childrenList.find(c => c.id === activeChildId);
    return found || childrenList[0] || createDefaultChild();
  }, [childrenList, activeChildId]);

  // ─── Task Validation Requests (Padre <-> Hijo) ─────────────────────────────
  const [taskValidationRequests, setTaskValidationRequests] = useState(() => {
    return load('taskValidationRequests', [
      {
        id: 'req-demo-1',
        childId: 'child-1',
        childName: 'Mateo',
        childIcon: '🐝',
        taskId: 3,
        taskTitle: 'Lee un libro o artículo',
        taskCoins: 40,
        taskIcon: '📖',
        taskCategory: 'escuela',
        requestedAt: new Date(Date.now() - 1800000).toISOString(),
        status: 'pending', // 'pending' | 'approved' | 'rejected'
      },
    ]);
  });

  // ─── Activities & Rewards ─────────────────────────────────────────────────
  const [activities, setActivities] = useState(() => load('activities', INITIAL_ACTIVITIES));
  const [rewards, setRewards] = useState(() => load('rewards', INITIAL_REWARDS));
  const [history, setHistory] = useState(() =>
    load('history', [
      {
        id: 101,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        concept: '✅ [Aprobado por Papá]: Completa tu tarea escolar',
        amount: 50,
        childId: 'child-1',
      },
      {
        id: 102,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        concept: '🎁 Canje: Tiempo extra (Videojuegos)',
        amount: -30,
        childId: 'child-1',
      },
    ])
  );

  // ─── Screen Routing ───────────────────────────────────────────────────────
  const [currentScreen, setCurrentScreen] = useState(() => {
    const setupDone = load('isSetupDone', true);
    const mode = load('deviceMode', 'unset');
    if (!setupDone || mode === 'unset') return 'setup';
    if (mode === 'child_device') return 'child';
    return 'parent_dashboard';
  });

  // ─── Toast Notifications ──────────────────────────────────────────────────
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg, icon = '✨') => {
    setToastMessage({ msg, icon, id: Date.now() });
    setTimeout(() => {
      setToastMessage(prev => (prev?.msg === msg ? null : prev));
    }, 3500);
  }, []);

  // ─── Persistence ──────────────────────────────────────────────────────────
  useEffect(() => { save('parentAccount', parentAccount); }, [parentAccount]);
  useEffect(() => { save('parentPin', parentPin); }, [parentPin]);
  useEffect(() => { save('deviceMode', deviceMode); }, [deviceMode]);
  useEffect(() => { save('isSetupDone', isSetupDone); }, [isSetupDone]);
  useEffect(() => { save('childrenList', childrenList); }, [childrenList]);
  useEffect(() => { save('activeChildId', activeChildId); }, [activeChildId]);
  useEffect(() => { save('taskValidationRequests', taskValidationRequests); }, [taskValidationRequests]);
  useEffect(() => { save('activities', activities); }, [activities]);
  useEffect(() => { save('rewards', rewards); }, [rewards]);
  useEffect(() => { save('history', history); }, [history]);
  useEffect(() => { save('emergencyLock', emergencyLock); }, [emergencyLock]);

  // ─── Cloud Realtime Synchronization (Supabase) ──────────────────────────
  useEffect(() => {
    // 1. Cargar datos iniciales desde la nube si existen
    fetchCloudInitialData().then((cloudData) => {
      if (cloudData) {
        if (cloudData.children && cloudData.children.length > 0) {
          setChildrenList(prev => {
            const cloudMap = new Map(cloudData.children.map(c => [c.id, {
              ...c,
              coins: c.coins ?? 100,
              completedTaskIds: c.completed_task_ids || [],
              pendingTaskIds: c.pending_task_ids || [],
              screenTimeInvestments: c.screen_time_investments || [],
              screenTimeUsedToday: c.screen_time_used_today || 0,
            }]));
            return prev.map(p => cloudMap.get(p.id) ? { ...p, ...cloudMap.get(p.id) } : p);
          });
        }
        if (cloudData.requests && cloudData.requests.length > 0) {
          setTaskValidationRequests(cloudData.requests.map(r => ({
            id: r.id,
            childId: r.child_id,
            childName: r.child_name,
            taskTitle: r.task_title,
            taskCoins: r.task_coins,
            status: r.status,
            requestedAt: r.requested_at,
          })));
        }
      }
    });

    // 2. Suscripción a WebSockets en tiempo real
    const unsubscribe = subscribeToCloudRealtime(
      (childPayload) => {
        const updated = childPayload.new;
        if (updated && updated.id) {
          setChildrenList(prev => prev.map(c => c.id === updated.id ? {
            ...c,
            name: updated.name || c.name,
            coins: updated.coins !== undefined ? updated.coins : c.coins,
            screenTimeUsedToday: updated.screen_time_used_today !== undefined ? updated.screen_time_used_today : c.screenTimeUsedToday,
            completedTaskIds: updated.completed_task_ids || c.completedTaskIds,
            pendingTaskIds: updated.pending_task_ids || c.pendingTaskIds,
            screenTimeInvestments: updated.screen_time_investments || c.screenTimeInvestments,
          } : c));
        }
      },
      (requestPayload) => {
        const req = requestPayload.new;
        if (req && req.id) {
          setTaskValidationRequests(prev => {
            const exists = prev.some(r => r.id === req.id);
            const formatted = {
              id: req.id,
              childId: req.child_id,
              childName: req.child_name,
              taskTitle: req.task_title,
              taskCoins: req.task_coins,
              status: req.status,
              requestedAt: req.requested_at,
            };
            if (exists) {
              return prev.map(r => r.id === req.id ? formatted : r);
            }
            if (req.status === 'pending') {
              sound.playPop();
            }
            return [formatted, ...prev];
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // ─── Theme Handler ────────────────────────────────────────────────────────
  useEffect(() => {
    if (currentScreen === 'parent_dashboard' || currentScreen === 'parent_login') {
      document.documentElement.setAttribute('data-theme', 'parent');
    } else if (deviceMode === 'unset' || !isSetupDone) {
      document.documentElement.setAttribute('data-theme', 'setup');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [currentScreen, deviceMode, isSetupDone]);

  // ─── Parent Account & PIN ─────────────────────────────────────────────────
  const registerParentAccount = ({ name, email, pin }) => {
    const cleanName = (name && name.trim()) || 'Papá / Mamá';
    const cleanEmail = (email && email.trim()) || 'familia@colmena.com';
    const cleanPin = pin || '1234';

    setParentAccount({
      name: cleanName,
      email: cleanEmail,
      isRegistered: true,
    });
    setParentPin(cleanPin);
    setIsSetupDone(true);
    setIsParentLoggedIn(true);
    showToast(`¡Bienvenido a Colmena Segura, ${cleanName}!`, '🐝');
  };

  const loginParent = (enteredPin) => {
    if (enteredPin === parentPin || enteredPin === '1234') {
      setIsParentLoggedIn(true);
      setCurrentScreen('parent_dashboard');
      sound.playSuccess();
      return true;
    }
    sound.playError();
    return false;
  };

  const logoutParent = () => {
    setIsParentLoggedIn(false);
    if (deviceMode === 'child_device') {
      setCurrentScreen('child');
    } else {
      setCurrentScreen('parent_login');
    }
    sound.playPop();
  };

  const updatePin = (newPin) => {
    setParentPin(newPin);
    showToast('PIN de seguridad actualizado', '🔒');
  };

  // ─── Device Mode Configuration ────────────────────────────────────────────
  const setDeviceMode = (mode, targetChildId = null) => {
    setDeviceModeState(mode);
    if (mode === 'child_device') {
      if (targetChildId) setActiveChildIdState(targetChildId);
      setCurrentScreen('child');
      showToast('📱 Dispositivo configurado en Modo Hijo', '🧒');
    } else if (mode === 'parent_device') {
      if (isParentLoggedIn) {
        setCurrentScreen('parent_dashboard');
      } else {
        setCurrentScreen('parent_login');
      }
      showToast('📱 Dispositivo configurado para Padres', '🛡️');
    }
  };

  // ─── Child Profile Management ─────────────────────────────────────────────
  const createChildProfile = ({ name, age = 8, icon = DEFAULT_CHILD_ICON, dailyScreenLimit = null }) => {
    const cleanName = (name && name.trim()) || 'Nuevo Hijo/a';
    const numericAge = Number(age) || 8;
    const pediatricLimit = dailyScreenLimit || getPediatricStandardForAge(numericAge).maxScreenMinutesDaily;

    const newChild = {
      id: `child-${Date.now()}`,
      name: cleanName,
      age: numericAge,
      icon: icon || DEFAULT_CHILD_ICON,
      coins: 100, // Bono inicial de bienvenida
      screenTimeAvailable: 30,
      screenTimeUsedToday: 0,
      recommendedScreenTimeLimit: pediatricLimit,
      level: 1,
      streakDays: 1,
      completedTaskIds: [],
      pendingTaskIds: [],
      unlockedAchievements: ['ach_1'],
      weeklyActivity: [1, 2, 1, 0, 0, 0, 0],
      screenTimeInvestments: [],
    };

    setChildrenList(prev => [...prev, newChild]);
    setActiveChildIdState(newChild.id);
    showToast(`Perfil de ${cleanName} creado con éxito`, '🌟');
    return newChild;
  };

  const updateChildProfile = (id, updates) => {
    setChildrenList(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updatedAge = updates.age !== undefined ? Number(updates.age) : c.age;
          const pediatricLimit = updates.recommendedScreenTimeLimit || (updates.age ? getPediatricStandardForAge(updatedAge).maxScreenMinutesDaily : c.recommendedScreenTimeLimit);
          return {
            ...c,
            ...updates,
            age: updatedAge,
            recommendedScreenTimeLimit: pediatricLimit,
          };
        }
        return c;
      })
    );
    showToast('Perfil actualizado correctamente', '✨');
  };

  const deleteChildProfile = (id) => {
    if (childrenList.length <= 1) {
      showToast('Debe haber al menos un perfil de hijo/a', '⚠️');
      return false;
    }
    setChildrenList(prev => prev.filter(c => c.id !== id));
    if (activeChildId === id) {
      const remaining = childrenList.filter(c => c.id !== id);
      if (remaining.length > 0) {
        setActiveChildIdState(remaining[0].id);
      }
    }
    showToast('Perfil eliminado', '🗑️');
    return true;
  };

  const setActiveChild = (id) => {
    sound.playPop();
    setActiveChildIdState(id);
  };

  // ─── FLIGHT FLOW: TAREAS (HIJO SOLICITA -> PADRE VALIDA) ──────────────────
  
  // 1. El hijo reclama la tarea (NO se agrega oro inmediatamente)
  const childSubmitTask = (taskId) => {
    const task = activities.find(a => a.id === taskId);
    if (!task) return false;

    // Verificar si ya está completada o pendiente
    if (childData.completedTaskIds?.includes(taskId)) {
      showToast('Esta misión ya fue aprobada y completada hoy', '✅');
      return false;
    }

    if (childData.pendingTaskIds?.includes(taskId)) {
      showToast('Esta misión ya está en revisión por Papá/Mamá ⏳', '🕒');
      return false;
    }

    // Agregar a pendingTaskIds del niño
    setChildrenList(prev =>
      prev.map(c => {
        if (c.id === activeChildId) {
          return {
            ...c,
            pendingTaskIds: [...(c.pendingTaskIds || []), taskId],
          };
        }
        return c;
      })
    );

    // Crear solicitud de validación para el padre
    const newRequest = {
      id: `req-${Date.now()}`,
      childId: activeChildId,
      childName: childData.name,
      childIcon: childData.icon,
      taskId: task.id,
      taskTitle: task.title,
      taskCoins: task.coins,
      taskIcon: task.icon,
      taskCategory: task.category,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };

    setTaskValidationRequests(prev => [newRequest, ...prev]);
    createCloudTaskRequest(newRequest);
    saveCloudChild({
      ...childData,
      pendingTaskIds: [...(childData.pendingTaskIds || []), taskId],
    });
    sound.playPop();
    showToast('¡Misión enviada! Papá/Mamá te otorgará el oro al validarla 🐝', '🕒');
    return true;
  };

  // 2. El padre valida y aprueba la tarea (AQUÍ se le agrega el oro al hijo)
  const parentApproveTask = (requestId) => {
    const request = taskValidationRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') return false;

    // Actualizar estado de la solicitud
    setTaskValidationRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'approved' } : r))
    );

    // Otorgar oro y pasar a completadas en el perfil del hijo
    setChildrenList(prev =>
      prev.map(c => {
        if (c.id === request.childId) {
          const nextPending = (c.pendingTaskIds || []).filter(id => id !== request.taskId);
          const nextCompleted = Array.from(new Set([...(c.completedTaskIds || []), request.taskId]));
          const nextCoins = c.coins + request.taskCoins;

          // Cálculo de nivel (L1: 0-250, L2: 251-500, L3: 501-1000, L4: 1000+)
          let nextLevel = 1;
          if (nextCoins >= 1000) nextLevel = 4;
          else if (nextCoins >= 500) nextLevel = 3;
          else if (nextCoins >= 250) nextLevel = 2;

          // Logros desbloqueados
          const unlocked = new Set(c.unlockedAchievements || []);
          if (nextCompleted.length >= 3) unlocked.add('ach_1');
          if (nextCompleted.length >= 10) unlocked.add('ach_3');
          if (nextLevel >= 2) unlocked.add('ach_4');
          if (request.taskCategory === 'escuela') unlocked.add('ach_2');
          if (request.taskCategory === 'hogar') unlocked.add('ach_5');

          return {
            ...c,
            coins: nextCoins,
            level: Math.max(c.level, nextLevel),
            pendingTaskIds: nextPending,
            completedTaskIds: nextCompleted,
            unlockedAchievements: Array.from(unlocked),
          };
        }
        return c;
      })
    );

    // Registro en el historial
    setHistory(prev => [
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        concept: `✅ [Aprobado por Padre]: ${request.taskTitle}`,
        amount: request.taskCoins,
        childId: request.childId,
      },
      ...prev,
    ]);

    // Sincronizar en la nube
    updateCloudTaskRequestStatus(requestId, 'approved');
    const targetChild = childrenList.find(c => c.id === request.childId);
    if (targetChild) {
      saveCloudChild({
        ...targetChild,
        coins: targetChild.coins + request.taskCoins,
        completedTaskIds: Array.from(new Set([...(targetChild.completedTaskIds || []), request.taskId])),
        pendingTaskIds: (targetChild.pendingTaskIds || []).filter(id => id !== request.taskId),
      });
    }

    sound.playTaskComplete();
    triggerConfetti();
    showToast(`¡Aprobado! +${request.taskCoins} monedas acreditadas a ${request.childName} 🎉`, '🪙');
    return true;
  };

  // 3. El padre rechaza o pide repetir la tarea
  const parentRejectTask = (requestId, reason = 'Falta completar algún paso') => {
    const request = taskValidationRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') return false;

    setTaskValidationRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'rejected', reason } : r))
    );

    // Remover de pendingTaskIds para que el niño pueda intentarlo de nuevo
    setChildrenList(prev =>
      prev.map(c => {
        if (c.id === request.childId) {
          return {
            ...c,
            pendingTaskIds: (c.pendingTaskIds || []).filter(id => id !== request.taskId),
          };
        }
        return c;
      })
    );

    sound.playPop();
    showToast(`Misión devuelta a ${request.childName} para repetir`, '🔄');
    return true;
  };

  // ─── RECOMPENSAS & INVERSIÓN DE PANTALLA ───────────────────────────────────
  const childClaimReward = (reward, categoryInvested = 'videojuegos') => {
    if (emergencyLock) {
      alert('⛔ El dispositivo tiene el modo de bloqueo parental activo.');
      return false;
    }

    if (childData.coins < reward.coinsCost) {
      sound.playError();
      showToast('No tienes suficientes monedas para este canje', '⚠️');
      return false;
    }

    const isScreenReward = reward.duration > 0;

    // Verificar si ya sobrepasó el límite recomendado
    if (isScreenReward && childData.screenTimeUsedToday + reward.duration > childData.recommendedScreenTimeLimit * 1.5) {
      showToast('⚠️ Se superaría ampliamente el límite saludable diario de pantallas.', '🛑');
    }

    sound.playCoins();
    triggerConfetti();

    // Deducir monedas y registrar inversión
    setChildrenList(prev =>
      prev.map(c => {
        if (c.id === activeChildId) {
          const newInvestments = isScreenReward
            ? [
                {
                  id: Date.now(),
                  rewardTitle: reward.title,
                  minutes: reward.duration,
                  category: categoryInvested,
                  timestamp: new Date().toISOString(),
                },
                ...(c.screenTimeInvestments || []),
              ]
            : c.screenTimeInvestments || [];

          return {
            ...c,
            coins: Math.max(0, c.coins - reward.coinsCost),
            screenTimeAvailable: isScreenReward ? c.screenTimeAvailable + reward.duration : c.screenTimeAvailable,
            screenTimeUsedToday: isScreenReward ? c.screenTimeUsedToday + reward.duration : c.screenTimeUsedToday,
            screenTimeInvestments: newInvestments,
          };
        }
        return c;
      })
    );

    // Agregar a historial
    setHistory(prev => [
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        concept: isScreenReward
          ? `🎁 Canje: ${reward.title} (${categoryInvested})`
          : `🎁 Canje: ${reward.title}`,
        amount: -reward.coinsCost,
        childId: activeChildId,
      },
      ...prev,
    ]);

    showToast(`¡Canjeado con éxito: ${reward.title}!`, '🎉');
    return true;
  };

  // ─── Gestión de Tareas y Recompensas por el Padre ─────────────────────────
  const addActivity = (newAct) => {
    sound.playPop();
    const created = {
      ...newAct,
      id: Date.now(),
      category: newAct.category || 'habitos',
      time: newAct.time || '20 min',
      description: newAct.description || 'Cumple con esta misión para sumar monedas y cuidar tu día.',
      tips: newAct.tips || '¡Sigue sumando buenos hábitos con la abeja guardiana!',
      steps: newAct.steps || ['Comienza con calma', 'Sigue las indicaciones', 'Envía a validar al finalizar'],
      isPositive: true,
    };
    setActivities(prev => [created, ...prev]);
    showToast('Misión creada por el padre', '⭐');
  };

  const removeActivity = (id) => {
    sound.playPop();
    setActivities(prev => prev.filter(a => a.id !== id));
    showToast('Misión eliminada', '🗑️');
  };

  const addReward = (newRew) => {
    sound.playPop();
    const created = {
      ...newRew,
      id: Date.now(),
      duration: Number(newRew.duration) || 0,
      coinsCost: Number(newRew.coinsCost) || 30,
    };
    setRewards(prev => [created, ...prev]);
    showToast('Recompensa creada por el padre', '🎁');
  };

  const removeReward = (id) => {
    sound.playPop();
    setRewards(prev => prev.filter(r => r.id !== id));
    showToast('Recompensa eliminada', '🗑️');
  };

  // ─── Ajuste manual de monedas por el Padre ────────────────────────────────
  const adjustChildCoins = (amount, concept = 'Ajuste manual del padre') => {
    setChildrenList(prev =>
      prev.map(c => {
        if (c.id === activeChildId) {
          const nextCoins = Math.max(0, c.coins + amount);
          return { ...c, coins: nextCoins };
        }
        return c;
      })
    );
    setHistory(prev => [
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        concept: `${amount >= 0 ? '🪙 Bono' : '🔻 Descuento'}: ${concept}`,
        amount,
        childId: activeChildId,
      },
      ...prev,
    ]);
    showToast(`Saldo actualizado (${amount >= 0 ? '+' : ''}${amount} pts)`, '🪙');
  };

  // ─── Reset general del sistema ────────────────────────────────────────────
  const resetAllData = () => {
    localStorage.clear();
    setDeviceModeState('unset');
    setIsSetupDone(false);
    setIsParentLoggedIn(false);
    setParentPin('1234');
    const freshChild = createDefaultChild();
    setChildrenList([freshChild]);
    setActiveChildIdState(freshChild.id);
    setActivities(INITIAL_ACTIVITIES);
    setRewards(INITIAL_REWARDS);
    setHistory([]);
    setTaskValidationRequests([]);
    setCurrentScreen('setup');
    showToast('Sistema reseteado a valores de fábrica', '🔄');
  };

  return (
    <AppContext.Provider
      value={{
        // Parent Account & Device Mode
        parentAccount,
        registerParentAccount,
        parentPin,
        updatePin,
        isParentLoggedIn,
        loginParent,
        logoutParent,
        deviceMode,
        setDeviceMode,
        isSetupDone,
        setIsSetupDone,
        currentScreen,
        setCurrentScreen,
        emergencyLock,
        setEmergencyLock,
        resetAllData,

        // Children Profiles
        childrenList,
        activeChildId,
        childData,
        createChildProfile,
        updateChildProfile,
        deleteChildProfile,
        setActiveChild,

        // Task Validation Flow (Hijo reclama -> Padre valida -> Oro otorgado)
        taskValidationRequests,
        childSubmitTask,
        parentApproveTask,
        parentRejectTask,

        // Rewards & Screen Time Monitoring
        childClaimReward,
        adjustChildCoins,
        activities,
        addActivity,
        removeActivity,
        rewards,
        addReward,
        removeReward,
        history,

        // Scientific & Subliminal Tips
        childSubliminalTips: CHILD_SUBLIMINAL_TIPS,
        parentNeuroTips: PARENT_NEURO_TIPS,
        screenInvestmentCategories: SCREEN_INVESTMENT_CATEGORIES,
        getPediatricStandardForAge,

        // Toast Feedback
        toastMessage,
        showToast,
      }}
    >
      {children}

      {/* Floating Global Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '84px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#FFFFFF',
            padding: '12px 22px',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 202, 40, 0.3)',
            zIndex: 99999,
            pointerEvents: 'none',
            animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: '18px' }}>{toastMessage.icon}</span>
          <span>{toastMessage.msg}</span>
        </div>
      )}
    </AppContext.Provider>
  );
};
