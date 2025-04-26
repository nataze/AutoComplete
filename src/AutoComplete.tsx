import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './AutoComplete.css';
import { getCached, setCached } from './cache';
import { ReactComponent as CloseIcon } from './CloseIcon.svg';

interface AutoCompleteProps {
  placeholder?: string;
  debounceTime?: number;
  minChars?: number;
  maxResults?: number;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  placeholder = 'Search...',
  debounceTime = 300,
  minChars = 1,
  maxResults = 10,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showList, setShowList] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const clearInput = () => {
    clearTimeout(timer.current);
    setQuery('');
    setSuggestions([]);
    setActiveIndex(-1);
    setShowList(false);
    setError(null);
  };

  const fetchSuggestions = async (q: string) => {
    if (q.length < minChars) return;
    setLoading(true);
    setError(null);

    const cached = getCached<string[]>(q);
    if (cached) {
      setSuggestions(cached.slice(0, maxResults));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/data/suggestions.json?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const list: string[] = await res.json();
      const filtered = list.filter(item =>
        item.toLowerCase().includes(q.toLowerCase())
      );
      const sliced = filtered.slice(0, maxResults);
      setCached(q, sliced);
      setSuggestions(sliced);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const moveActive = (delta: number) =>
    setActiveIndex(prev =>
      Math.max(0, Math.min(prev + delta, suggestions.length - 1))
    );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setShowList(!!val);
    setActiveIndex(-1);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (val) fetchSuggestions(val);
      else setSuggestions([]);
    }, debounceTime);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showList) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveActive(-1);
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions.length === 1) {
          clearInput();
          setQuery(suggestions[0]);
        } else if (activeIndex >= 0) {
          clearInput();
          setQuery(suggestions[activeIndex]);
        }
        break;
      case 'Escape':
        setShowList(false);
        break;
    }
  };

  const selectSuggestion = (val: string) => {
    setQuery(val);
    setShowList(false);
  };

  const highlight = (item: string) => {
    const idx = item.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{item}</>;
    return (
      <>
        {item.slice(0, idx)}
        <strong>{item.slice(idx, idx + query.length)}</strong>
        {item.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="autocomplete">
          <input
            type="text"
            className="autocomplete-input"
            placeholder={placeholder}
            aria-autocomplete="list"
            aria-expanded={showList}
            value={query}
            onChange={onChange}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-controls="autocomplete-list"
            aria-activedescendant={
              activeIndex >= 0 ? `item-${activeIndex}` : undefined
            }
          />
          {query && (
            <button
              type="button"
              className="clear-btn"
              onClick={clearInput}
              aria-label="Clear search"
            >
              <CloseIcon className="clear-icon" />
            </button>
          )}

          {showList && (
            <ul
              id="autocomplete-list"
              role="listbox"
              className="autocomplete-list"
            >
              {loading && <li className="loading">Loading...</li>}
              {error && <li className="error">{error}</li>}
              {!loading && !error && suggestions.length === 0 && (
                <li className="no-results">No results</li>
              )}
              {!loading &&
                !error &&
                suggestions.map((item, idx) => (
                  <li
                    key={item}
                    id={`item-${idx}`}
                    role="option"
                    aria-selected={activeIndex === idx}
                    className={activeIndex === idx ? 'active' : ''}
                    onMouseDown={() => selectSuggestion(item)}
                  >
                    {highlight(item)}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </header>
    </div>
  );
};
