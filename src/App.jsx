
import React, { useState } from 'react';

export default function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div style={{ direction: 'rtl', padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>🎓 ניסוי בנושא ממשק משתמש במערכת Moodle</h1>
        <p>
          שלום! תודה שהצטרפת לניסוי קצר בנושא ממשק משתמש.
          במסגרת הניסוי תוצג לך תמונה מתוך מערכת Moodle, ותתבקש/י לאתר פריט מסוים (כמו הסילבוס או תיבת הגשה).
        </p>
        <p>
          יש ללחוץ על כפתור "מצאתי" ברגע שמצאת את הפריט המבוקש.
        </p>
        <button onClick={() => setStarted(true)} style={{
          marginTop: '2rem',
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          התחל ניסוי
        </button>
      </div>
    );
  }

  return (
    <div style={{ direction: 'rtl', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>כאן יתחיל החלק של הניסוי 🎯</h2>
    </div>
  );
}
