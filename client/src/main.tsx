import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { register, createOfflineIndicator } from "./lib/serviceWorker";
import "./utils/offlineTest";

// Register service worker for offline functionality
register({
  onSuccess: () => {
    console.log('App is now available offline!');
  },
  onUpdate: () => {
    console.log('New app version available. Refresh to update.');
  },
  onOfflineReady: () => {
    console.log('App is ready to work offline');
    // Show offline indicator when offline
    createOfflineIndicator();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
