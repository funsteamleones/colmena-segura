import { useAppContext } from './store/AppContext';
import DeviceSetup    from './components/DeviceSetup';
import Onboarding     from './components/Onboarding';
import ParentLogin    from './components/ParentLogin';
import ParentDashboard from './components/ParentDashboard';
import ChildDashboard  from './components/ChildDashboard';

function App() {
  const { deviceMode, isSetupDone, isParentLoggedIn } = useAppContext();

  // 1. First ever launch — choose device role
  if (deviceMode === 'unset') return <div className="app-container"><DeviceSetup /></div>;

  // 2. Device chosen but not configured yet
  if (!isSetupDone) return <div className="app-container"><Onboarding /></div>;

  // ── PARENT DEVICE ──────────────────────────────────────────────────────────
  if (deviceMode === 'parent_device') {
    if (!isParentLoggedIn) return <div className="app-container"><ParentLogin /></div>;
    return <div className="app-container"><ParentDashboard /></div>;
  }

  // ── CHILD DEVICE ───────────────────────────────────────────────────────────
  if (deviceMode === 'child_device') {
    return <div className="app-container"><ChildDashboard /></div>;
  }

  return null;
}

export default App;
