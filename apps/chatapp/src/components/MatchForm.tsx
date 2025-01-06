// components/MatchForm.tsx
import React, { useState } from 'react';

interface MatchFormProps {
  onMatchMaking: (preferences: string) => void;
}

const MatchForm: React.FC<MatchFormProps> = ({ onMatchMaking }) => {
  const [preferences, setPreferences] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preferences) {
      onMatchMaking(preferences);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="preferences">Choose your preferences:</label>
      <select
        id="preferences"
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
      >
        <option value="">Select an option</option>
        <option value="Movies">Movies</option>
        <option value="Music">Music</option>
        <option value="Science">Science</option>
        <option value="Technology">Technology</option>
        <option value="Sports">Sports</option>
      </select>
      <button type="submit" disabled={!preferences}>
        Find and Talk
      </button>
    </form>
  );
};

export default MatchForm;
