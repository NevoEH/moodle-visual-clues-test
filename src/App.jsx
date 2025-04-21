import React, { useState, useEffect } from 'react';

const tasks = [
  { id: 1, target: 'סילבוס', imageBase: 'img1' },
  { id: 2, target: 'תיבת הגשה', imageBase: 'img2' },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [responses, setResponses] = useState([]);
  const [finished, setFinished] = useState(false);
  const [lastReactionTime, setLastReactionTime] = useState(null);
  const [condition, setCondition] = useState(() => (Math.random() < 0.5 ? 'with' : 'nohint'));

  useEffect(() => {
    if (started && currentIndex < tasks.length) {
      setStartTime(Date.now());
    }
  }, [currentIndex, started]);

  const handleFound = () => {
    const endTime = Date.now();
    const reactionTime = endTime - startTime;
    setLastReactionTime(reactionTime);

    const newResponse = {
      taskId: tasks[currentIndex].id,
      target: tasks[currentIndex].target,
      condition,
      reactionTime,
    };

    setResponses((prev) => [...prev, newResponse]);

    if (currentIndex + 1 < tasks.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const exportToGoogleSheets = async () => {
    const webhookUrl = 'https://script.google.com/macros/s/AKfycbwvd07946uJX54e9RzrNdBr3smGcz5l2IdQFhli4AhbIbq4J33WlWskF3SOHBDvno-Q/exec'; // החלף ב-URL שקיבלת מ-Google Apps Script
  
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        body: JSON.stringify(responses),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      alert('הנתונים נשלחו בהצלחה!');
    } catch (error) {
      alert('שגיאה בשליחת הנתונים: ' + error.message);
    }
  };

  if (!started) {
    return (
      <div style={{ direction: 'rtl', padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>🎓 ניסוי בנושא ממשק משתמש במערכת Moodle</h1>
        <p>שלום! תודה שהצטרפת לניסוי קצר בנושא ממשק משתמש.
        במסגרת הניסוי תוצג לך תמונה מתוך מערכת Moodle, ותתבקש/י לאתר פריט מסוים (כמו הסילבוס או תיבת הגשה).</p>
        <p>יש ללחוץ על כפתור "מצאתי" ברגע שמצאת את הפריט המבוקש.</p>
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

  if (finished) {
    return (
      <div style={{ direction: 'rtl', padding: '2rem', fontFamily: 'sans-serif' }}>
        <h2>👏 תודה שהשתתפת בניסוי!</h2>
        <p>הנה התוצאות שלך:</p>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '1rem',
          fontSize: '1rem'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>#</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>היעד</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>תנאי</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>זמן (שניות)</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((r, index) => (
              <tr key={r.taskId}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{r.target}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {r.condition === 'with' ? 'עם רמז' : 'בלי רמז'}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {(r.reactionTime / 1000).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ marginTop: '2rem' }}>אנא תשמרו את תוצאות הניסוי שלכם</p>
        <button onClick={exportToGoogleSheets} style={{
          marginTop: '1rem',
          padding: '0.8rem 1.5rem',
          fontSize: '1rem',
          background: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          שמור תוצאות
        </button>
      </div>
    );
  }

  const task = tasks[currentIndex];
  const imgName = `${task.imageBase}_${condition === 'with' ? 'withhint' : 'nohint'}.png`;
  const imgUrl = `/images/${imgName}`;

  return (
    <div style={{ direction: 'rtl', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>🔍 משימה {currentIndex + 1} מתוך {tasks.length}</h2>
      <p>אנא מצא/י את: <strong>{task.target}</strong></p>
      <img src={imgUrl} alt="תמונה מתוך Moodle" style={{ width: '850px', height: 'auto' }} />
      <br />
      <button onClick={handleFound} style={{
        marginTop: '1rem',
        padding: '0.8rem 1.5rem',
        fontSize: '1rem',
        background: '#673AB7',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>
        מצאתי!
      </button>
      {lastReactionTime && currentIndex > 0 && (
        <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#555' }}>
          זמן שמציאת הפריט הקודם: {(lastReactionTime / 1000).toFixed(1)} שניות
        </p>
      )}
    </div>
  );
}