import React, { useState, useEffect } from 'react';

const tasks = [
  { id: 1, target: 'סילבוס', imageBase: 'img1' },
  { id: 2, target: 'תיבת הגשה', imageBase: 'img2' },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [reactionTime, setReactionTime] = useState(null); // 🆕 תצוגת זמן סיום
  const [responses, setResponses] = useState([]);
  const [finished, setFinished] = useState(false);

  // כשמתחילים - גריל תנאי לכל משימה
  useEffect(() => {
    if (started) {
      const randomized = tasks.map(() => (Math.random() < 0.5 ? 'with' : 'nohint'));
      setConditions(randomized);
    }
  }, [started]);

  // אתחל טיימר בכל משימה
  useEffect(() => {
    if (started && currentIndex < tasks.length) {
      setStartTime(Date.now());
      setElapsed(0);
      setReactionTime(null);
    }
  }, [currentIndex, started]);

  // טיימר בלייב
  useEffect(() => {
    let timer;
    if (started && !finished && startTime !== null) {
      timer = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [startTime, started, finished]);

  const handleFound = () => {
    const endTime = Date.now();
    const rt = endTime - startTime;

    const condition = conditions[currentIndex];
    const newResponse = {
      taskId: tasks[currentIndex].id,
      target: tasks[currentIndex].target,
      condition,
      reactionTime: rt,
    };

    setResponses((prev) => [...prev, newResponse]);
    setReactionTime(rt); // שמור להצגה

    setTimeout(() => {
      if (currentIndex + 1 < tasks.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setFinished(true);
      }
    }, 1200); // השהייה להצגת הזמן
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
        <h2>👏 תודה שהשתתפת בניסוי!</h2>
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
  const condition = conditions[currentIndex];
  const imgName = `${task.imageBase}_${condition === 'with' ? 'withhint' : 'nohint'}.png`;
  const imgUrl = `/images/${imgName}`;

  return (
    <div style={{ direction: 'rtl', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>🔍 משימה {currentIndex + 1} מתוך {tasks.length}</h2>
      <p>אנא מצא/י את: <strong>{task.target}</strong></p>

      <p style={{ fontSize: '1.1rem', color: '#555' }}>
        ⏱ זמן שחלף: {(elapsed / 1000).toFixed(1)} שניות
      </p>

      <img
        src={imgUrl}
        alt="תמונה מתוך Moodle"
        style={{ width: '700px', height: 'auto' }}
      />
      <br />
      <button onClick={handleFound} disabled={reactionTime !== null} style={{
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

      {reactionTime !== null && (
        <p style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#009688' }}>
          ✅ לקח לך {(reactionTime / 1000).toFixed(1)} שניות
        </p>
      )}
    </div>
  );
}
