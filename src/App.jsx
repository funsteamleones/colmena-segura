import { useAppContext } from './store/AppContext';
import DeviceSetup from './components/DeviceSetup';
import ParentLogin from './components/ParentLogin';
import ParentDashboard from './components/ParentDashboard';
import ChildDashboard from './components/ChildDashboard';
import ProfileSelector from './components/ProfileSelector';

function App() {
  const { deviceMode, isSetupDone, currentScreen, isParentLoggedIn } = useAppContext();

  // 1. Initial configuration: Setup parent account, child profile and device role
  if (deviceMode === 'unset' || !isSetupDone) {
    return (
      <div className="app-container">
        <DeviceSetup />
      </div>
    );
  }

  // 2. Child Device Mode (Locked strictly to Child View as requested)
  if (deviceMode === 'child_device' && currentScreen === 'child') {
    return <ChildDashboard />;
  }

  // 3. Screen Routing
  if (currentScreen === 'select_profile') {
    return <ProfileSelector />;
  }

  if (currentScreen === 'parent_login') {
    return (
      <div className="app-container">
        <ParentLogin />
      </div>
    );
  }

  if (currentScreen === 'parent_dashboard') {
    if (!isParentLoggedIn) {
      return (
        <div className="app-container">
          <ParentLogin />
        </div>
      );
    }
    return <ParentDashboard />;
  }

  if (currentScreen === 'child') {
    return <ChildDashboard />;
  }

  // Default fallback
  return <ChildDashboard />;
}

export default App;
