import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { Wifi, WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const { isOffline, wasOffline } = useOfflineStatus();

  if (!isOffline && !wasOffline) {
    return null;
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 ${
        isOffline
          ? 'bg-orange-500 text-white'
          : 'bg-green-500 text-white'
      }`}
    >
      <div className="flex items-center gap-2">
        {isOffline ? (
          <>
            <WifiOff size={16} />
            <span>Offline Mode</span>
          </>
        ) : (
          <>
            <Wifi size={16} />
            <span>Back Online</span>
          </>
        )}
      </div>
    </div>
  );
}

export default OfflineIndicator;