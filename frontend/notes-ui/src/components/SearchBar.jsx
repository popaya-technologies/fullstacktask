import { useEffect, useState } from 'react';

export default function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  // Sync parent value into local state (e.g. when clear button is used)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce: fire onChange 300ms after the user stops typing
  useEffect(() => {
    const delay = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [localValue, value, onChange]);

  return (
    <div className='search-bar'>
      <input
        type='text'
        placeholder='Search notes by title or content...'
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className='search-input'
      />
      {localValue && (
        <button
          className='search-clear'
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
}
