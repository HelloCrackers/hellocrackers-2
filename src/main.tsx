import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force rebuild and cache clear
createRoot(document.getElementById("root")!).render(<App />);
