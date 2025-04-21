import React, { useState, useEffect } from 'react';

const tasks = [
  { id: 1, target: 'סילבוס', imageBase: 'img1' },
  { id: 2, target: 'תיבת הגשה', imageBase: 'img2' },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [condition, setCondition] = useState(null); // 'with' or 'nohint'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [responses, setResponses] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (started) {
      const random = Math.random() < 0.5 ? 'with' : 'nohint';
      setCondition(random);
    }
  }, [started]);

  useEffect(() => {
    if (started && currentIndex < tasks.length) {
      setStartTime(Date.now());
    }
  }, [currentIndex, started]);

  const handleFound = () => {
    const endTime = Date.now();
    const reactionTime = endTime - startTime;

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

  const exportCSV = () => {
    const header = 'taskId,target,condition,reactionTime(ms)\n';
    const rows = responses
      .map((r) => `${r.taskId},${r.target},${r.condition},${r.reactionTime}`)
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'results.csv';
    link.click();
  };

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

  if (finished) {
    return (
      <div style={{ direction: 'rtl', padding: '2rem', fontFamily: 'sans-serif' }}>
        <h2>👏 תודה שסיימת את הניסוי!</h2>
        <p>ניתן להוריד את תוצאות הניסוי כקובץ CSV:</p>
        <button onClick={exportCSV} style={{
          marginTop: '1rem',
          padding: '0.8rem 1.5rem',
          fontSize: '1rem',
          background: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          הורד תוצאות
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
      <img
        src={imgUrl}
        alt="תמונה מתוך Moodle"
        style={{ maxWidth: '100%', border: '1px solid #ccc', marginTop: '1rem' }}
      />
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
    </div>
  );
}
