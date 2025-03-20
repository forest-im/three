import { useState } from 'react';
import AnimationCanvas from './AnimationCanvas';
import './App.css';

function App() {
  const [selected, setSelected] = useState<number>(0);

  return (
    <div style={{position:'relative'}}>
      {/* <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <button onClick={() => setSelected(0)} style={{ pointerEvents: 'auto' }}>Spoon Element</button>
        <button onClick={() => setSelected(1)} style={{ pointerEvents: 'auto' }}>Animation</button>
      </div> */}
      <AnimationCanvas />
    </div>
  )
}

export default App
