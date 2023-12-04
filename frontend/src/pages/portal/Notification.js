import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notification = () => {
  const [showBox, setShowBox] = useState(true);

  // FILLER

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* NOTI BOX */}
      <div style={{ position: 'absolute', top: 125, left: '50%', transform: 'translateX(-50%)', padding: '225px 100px 225px 100px', background: 'rgba(0, 0, 0, 0.8)', color: '#fff' }}>
        <p style={{ textAlign: 'left', top: 0 }}>NOTIFICATION LIST</p>
      </div>
    </div>
  );
}

export default Notification;
