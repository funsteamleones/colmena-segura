import { useEffect, useState, useRef } from 'react';

/**
 * VersionWatcher: Monitorea continuamente la versión del servidor en /version.json.
 * Al desplegar una nueva versión, detecta el cambio automáticamente en todos
 * los celulares y navegadores abiertos y fuerza la recarga limpia instantánea.
 */
export default function VersionWatcher() {
  const [updating, setUpdating] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const localVersionRef = useRef(null);

  const checkForUpdate = async (isManual = false) => {
    try {
      const res = await fetch(`/version.json?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      if (!data || !data.version) return;

      // Primera vez que se detecta la versión en esta sesión
      if (!localVersionRef.current) {
        const stored = localStorage.getItem('colmena_active_version');
        if (!stored) {
          localStorage.setItem('colmena_active_version', data.version);
          localVersionRef.current = data.version;
          return;
        }

        // Si ya había una versión guardada y es diferente a la del servidor recién cargada:
        if (stored !== data.version) {
          triggerUpdate(data);
          return;
        }

        localVersionRef.current = data.version;
        return;
      }

      // Si la versión del servidor es diferente a la que está corriendo en memoria:
      if (data.version !== localVersionRef.current) {
        triggerUpdate(data);
      }
    } catch (err) {
      // Ignorar fallas silenciosas de red (modo offline temporal)
      console.debug('Error comprobando versión:', err.message);
    }
  };

  const triggerUpdate = async (serverData) => {
    setUpdating(true);
    setUpdateInfo(serverData);

    try {
      // 1. Limpiar caches de la PWA para evitar que el navegador use archivos JS viejos
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }

      // 2. Desregistrar Service Workers obsoletos si existieran
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }

      // 3. Guardar la nueva versión activa
      localStorage.setItem('colmena_active_version', serverData.version);
    } catch (e) {
      console.warn('Error durante purga de caché:', e);
    }

    // 4. Forzar recarga con bypass de caché tras 1.2 segundos para que el usuario vea la animación
    setTimeout(() => {
      const targetUrl = window.location.origin + window.location.pathname + '?v=' + (serverData.timestamp || Date.now());
      window.location.replace(targetUrl);
    }, 1200);
  };

  useEffect(() => {
    // 1. Revisar de inmediato al abrir la aplicación
    checkForUpdate();

    // 2. Intervalo periódico cada 30 segundos
    const interval = setInterval(() => {
      checkForUpdate();
    }, 30000);

    // 3. Revisar cada vez que el celular se desbloquea o el usuario vuelve a la app (visibilidad)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdate();
      }
    };

    // 4. Revisar al recuperar foco y al recuperar conexión a internet
    const handleFocus = () => checkForUpdate();
    const handleOnline = () => checkForUpdate();

    // 5. Escuchar eventos manuales emitidos desde la interfaz (p. ej. botón "Buscar actualizaciones")
    const handleManualCheck = () => checkForUpdate(true);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);
    window.addEventListener('check-app-update', handleManualCheck);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('check-app-update', handleManualCheck);
    };
  }, []);

  if (!updating) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        color: '#FFFFFF',
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #FFB300, #FF6F00)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '54px',
          boxShadow: '0 20px 40px rgba(255, 179, 0, 0.4)',
          marginBottom: '24px',
          animation: 'bounce 1s infinite alternate',
        }}
      >
        🐝
      </div>

      <h2
        style={{
          fontSize: '24px',
          fontWeight: 800,
          color: '#FFCA28',
          marginBottom: '12px',
          letterSpacing: '-0.5px',
        }}
      >
        Actualizando Colmena Segura
      </h2>

      <p
        style={{
          fontSize: '15px',
          color: '#CBD5E1',
          maxWidth: '340px',
          lineHeight: '1.5',
          marginBottom: '24px',
        }}
      >
        Detectamos una nueva versión en el servidor. Reiniciando el dispositivo para aplicar las últimas mejoras y sincronizaciones...
      </p>

      {/* Spinner & Progress */}
      <div
        style={{
          width: '200px',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '60%',
            background: 'linear-gradient(90deg, #FFCA28, #FF6F00)',
            borderRadius: '999px',
            animation: 'updateShimmer 1s infinite linear',
          }}
        />
      </div>

      <span style={{ fontSize: '12px', color: '#64748B', marginTop: '16px' }}>
        Versión: {updateInfo?.version || 'Última'}
      </span>

      <style>{`
        @keyframes updateShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
