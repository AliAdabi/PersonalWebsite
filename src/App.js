import './App.css';
import ThreeJSViewer from './Components/ThreeJSViewer';

function App() {
  return (
    <div className="App">
      <ThreeJSViewer />
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 10,
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '300px',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>3D Model Viewer</h2>
        <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
          <p style={{ margin: '5px 0' }}><strong>🖱️ Left Click + Drag:</strong> Rotate around model</p>
          <p style={{ margin: '5px 0' }}><strong>🖱️ Right Click + Drag:</strong> Pan camera</p>
          <p style={{ margin: '5px 0' }}><strong>🎯 Mouse Wheel:</strong> Zoom in/out</p>
          <p style={{ margin: '5px 0' }}><strong>📱 Touch:</strong> Multi-touch gestures supported</p>
        </div>
      </div>
    </div>
  );
}

export default App;
