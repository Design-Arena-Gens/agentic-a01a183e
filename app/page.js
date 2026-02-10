'use client';

import { useState, useEffect } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EXERCISE_CATEGORIES = {
  'Upper Body': ['Push-ups', 'Pull-ups', 'Bench Press', 'Shoulder Press', 'Bicep Curls', 'Tricep Dips'],
  'Lower Body': ['Squats', 'Lunges', 'Deadlifts', 'Leg Press', 'Calf Raises', 'Leg Curls'],
  'Core': ['Planks', 'Crunches', 'Russian Twists', 'Mountain Climbers', 'Leg Raises', 'Bicycle Crunches'],
  'Cardio': ['Running', 'Cycling', 'Jump Rope', 'Burpees', 'High Knees', 'Jumping Jacks'],
  'Flexibility': ['Yoga', 'Stretching', 'Foam Rolling', 'Dynamic Stretches']
};

export default function WorkoutPlanner() {
  const [schedule, setSchedule] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [showExercises, setShowExercises] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('workoutSchedule');
    if (saved) {
      setSchedule(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workoutSchedule', JSON.stringify(schedule));
  }, [schedule]);

  const addExercise = (day, category, exercise) => {
    const newExercise = {
      id: Date.now(),
      category,
      name: exercise,
      sets: 3,
      reps: 10,
      duration: 30,
      completed: false
    };

    setSchedule(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), newExercise]
    }));
  };

  const removeExercise = (day, exerciseId) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter(ex => ex.id !== exerciseId)
    }));
  };

  const toggleComplete = (day, exerciseId) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].map(ex =>
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      )
    }));
  };

  const updateExercise = (day, exerciseId, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].map(ex =>
        ex.id === exerciseId ? { ...ex, [field]: parseInt(value) || 0 } : ex
      )
    }));
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>💪 Workout Planner</h1>
        <p style={styles.subtitle}>Plan your weekly fitness routine</p>
      </header>

      <div style={styles.weekView}>
        {DAYS.map(day => {
          const dayExercises = schedule[day] || [];
          const completedCount = dayExercises.filter(ex => ex.completed).length;
          const totalCount = dayExercises.length;

          return (
            <div
              key={day}
              style={styles.dayCard}
              onClick={() => {
                setSelectedDay(day);
                setShowExercises(false);
              }}
            >
              <div style={styles.dayHeader}>
                <h3 style={styles.dayName}>{day.slice(0, 3)}</h3>
                {totalCount > 0 && (
                  <span style={styles.badge}>{completedCount}/{totalCount}</span>
                )}
              </div>
              <div style={styles.exerciseCount}>
                {totalCount === 0 ? 'Rest day' : `${totalCount} exercise${totalCount !== 1 ? 's' : ''}`}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div style={styles.modal} onClick={() => setSelectedDay(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{selectedDay}</h2>
              <button style={styles.closeBtn} onClick={() => setSelectedDay(null)}>✕</button>
            </div>

            <button
              style={styles.addBtn}
              onClick={() => setShowExercises(!showExercises)}
            >
              + Add Exercise
            </button>

            {showExercises && (
              <div style={styles.exerciseSelector}>
                {Object.entries(EXERCISE_CATEGORIES).map(([category, exercises]) => (
                  <div key={category} style={styles.category}>
                    <h4 style={styles.categoryTitle}>{category}</h4>
                    <div style={styles.exerciseGrid}>
                      {exercises.map(exercise => (
                        <button
                          key={exercise}
                          style={styles.exerciseBtn}
                          onClick={() => {
                            addExercise(selectedDay, category, exercise);
                            setShowExercises(false);
                          }}
                        >
                          {exercise}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={styles.exerciseList}>
              {(schedule[selectedDay] || []).map(exercise => (
                <div key={exercise.id} style={styles.exerciseItem}>
                  <div style={styles.exerciseTop}>
                    <input
                      type="checkbox"
                      checked={exercise.completed}
                      onChange={() => toggleComplete(selectedDay, exercise.id)}
                      style={styles.checkbox}
                    />
                    <div style={styles.exerciseInfo}>
                      <div style={{...styles.exerciseName, textDecoration: exercise.completed ? 'line-through' : 'none'}}>
                        {exercise.name}
                      </div>
                      <div style={styles.categoryLabel}>{exercise.category}</div>
                    </div>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => removeExercise(selectedDay, exercise.id)}
                    >
                      🗑️
                    </button>
                  </div>
                  <div style={styles.exerciseDetails}>
                    <div style={styles.detailGroup}>
                      <label style={styles.label}>Sets</label>
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(selectedDay, exercise.id, 'sets', e.target.value)}
                        style={styles.input}
                        min="1"
                      />
                    </div>
                    <div style={styles.detailGroup}>
                      <label style={styles.label}>Reps</label>
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(selectedDay, exercise.id, 'reps', e.target.value)}
                        style={styles.input}
                        min="1"
                      />
                    </div>
                    <div style={styles.detailGroup}>
                      <label style={styles.label}>Min</label>
                      <input
                        type="number"
                        value={exercise.duration}
                        onChange={(e) => updateExercise(selectedDay, exercise.id, 'duration', e.target.value)}
                        style={styles.input}
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!schedule[selectedDay] || schedule[selectedDay].length === 0) && (
                <p style={styles.emptyState}>No exercises planned. Add some above!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    paddingBottom: '40px'
  },
  header: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '30px',
    paddingTop: '20px'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '32px',
    fontWeight: '700'
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.9
  },
  weekView: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '15px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  dayCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 12px rgba(0,0,0,0.15)'
    }
  },
  dayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  dayName: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#333'
  },
  badge: {
    background: '#667eea',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  exerciseCount: {
    fontSize: '14px',
    color: '#666'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'white',
    borderRadius: '24px 24px 0 0',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '85vh',
    overflow: 'auto',
    padding: '24px',
    animation: 'slideUp 0.3s ease-out'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  modalTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    color: '#333'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px 8px',
    color: '#666'
  },
  addBtn: {
    width: '100%',
    padding: '16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  exerciseSelector: {
    marginBottom: '20px',
    maxHeight: '300px',
    overflow: 'auto',
    padding: '10px',
    background: '#f7f7f7',
    borderRadius: '12px'
  },
  category: {
    marginBottom: '20px'
  },
  categoryTitle: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase'
  },
  exerciseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '8px'
  },
  exerciseBtn: {
    padding: '10px',
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '500'
  },
  exerciseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  exerciseItem: {
    background: '#f9f9f9',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #eee'
  },
  exerciseTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    marginTop: '2px'
  },
  exerciseInfo: {
    flex: 1
  },
  exerciseName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px'
  },
  categoryLabel: {
    fontSize: '12px',
    color: '#666',
    background: '#e0e0e0',
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'inline-block'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px'
  },
  exerciseDetails: {
    display: 'flex',
    gap: '12px'
  },
  detailGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  label: {
    fontSize: '12px',
    color: '#666',
    fontWeight: '500'
  },
  input: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box'
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    padding: '40px 20px',
    fontSize: '14px'
  }
};
