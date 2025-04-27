import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  KeyboardEvent,
  FocusEvent,
  useId,
} from 'react';
import './AutoComplete.css';
import { ReactComponent as CloseIcon } from './CloseIcon.svg';
import { AutoCompleteProps, OptionItem } from './types';

export function AutoComplete<T>(props: AutoCompleteProps<T>) {
  const {
    items,

    id,
    value,
    onInputChange,
    label = 'Fruits',
    placeholder = 'Search...',

    debounceTime = 300,
    minChars = 1,
    maxResults = 10,
    dataSourceUrl = '/data/suggestions.json',

    className = '',
    inputClassName = '',
    listClassName = '',
    itemClassName = 'option-content',
    clearButtonClassName = '',
    
    renderOption,
    loadingComponent,
    noResultsComponent,

    iconPosition = 'left',

    onSelect,
    onError,
    onFocus,
    onBlur,
  } = props;

  const generatedId = useId();
  const inputId = id ?? `autocomplete-${generatedId}`;
  const listId = `${inputId}-list`;

  const [internalQuery, setInternalQuery] = useState('');
  const query = value !== undefined ? value : internalQuery;

  const [options, setOptions] = useState<OptionItem<T>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState<OptionItem<T> | null>(null);
  const [open, setOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const timer = useRef<number>(undefined);
  const abortRef = useRef<AbortController>(undefined);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
      abortRef.current?.abort();
    };
  }, []);

  const clearAll = useCallback(() => {
    clearTimeout(timer.current);
    abortRef.current?.abort();
    setLoading(false);
    setError(null);
    setOptions([]);
    setActiveIndex(-1);
    setOpen(false);
    setHasFetched(false);
    setSelectedOption(null);
    if (value === undefined) setInternalQuery('');
  }, [value]);

  useEffect(() => {
    clearAll()
  }, [items, dataSourceUrl, clearAll]);

  const formatItems = useCallback(
    (raw: string[] | OptionItem<T>[]): OptionItem<T>[] =>
      raw.map(x =>
        typeof x === 'string' ? { label: x, value: x as any } : x
      ),
    []
  );

  const filterList = useCallback(
    (list: OptionItem<T>[], q: string) =>
      list
        .filter(opt =>
          opt.label
            .toLocaleLowerCase()
            .includes(q.toLocaleLowerCase())
        )
        .slice(0, maxResults),
    [maxResults]
  );

  const fetchOptions = useCallback(
    async (q: string) => {
      setHasFetched(false);
      if (q.length < minChars) {
        setOptions([]);
        setHasFetched(true);
        return;
      }
      setLoading(true);
      setError(null);
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (items) {
        try {
          const list = formatItems(items);
          setOptions(filterList(list, q));
        } catch (e: any) {
          setError(e.message);
          onError?.(e);
        } finally {
          setLoading(false);
          setHasFetched(true);
        }
        return;
      }

      try {
        const res = await fetch(
          `${dataSourceUrl}?q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: string[] | OptionItem<T>[] = await res.json();
        const list = formatItems(data as any);
        setOptions(filterList(list, q));
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error fetching');
          onError?.(err);
        }
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    },
    [items, dataSourceUrl, formatItems, filterList, minChars, onError]
  );

  const moveActive = useCallback(
    (delta: number) =>
      setActiveIndex(prev =>
        Math.max(0, Math.min(prev + delta, options.length - 1))
      ),
    [options.length]
  );

  const handleSelect = useCallback(
    (opt: OptionItem<T>) => {
      setSelectedOption(opt);
      if (value === undefined) setInternalQuery(opt.label);
      setOpen(false);
      onSelect?.(opt);
    },
    [onSelect, value]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (value === undefined) setInternalQuery(val);
      onInputChange?.(val);
      setSelectedOption(null);
      setOpen(!!val);
      setActiveIndex(-1);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(
        () => fetchOptions(val),
        debounceTime
      );
    },
    [debounceTime, fetchOptions, onInputChange, value]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!open) return;
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
          if (options.length === 1) handleSelect(options[0]);
          else if (activeIndex >= 0) handleSelect(options[activeIndex]);
          break;
        case 'Escape':
          setOpen(false);
          break;
      }
    },
    [activeIndex, handleSelect, moveActive, open, options]
  );

  const defaultRender = useCallback(
    (opt: OptionItem<T>, isActive: boolean) => {
      const lowerLabel = opt.label.toLocaleLowerCase();
      const lowerQuery = query.toLocaleLowerCase();
      const idx = lowerLabel.indexOf(lowerQuery);
      const before = idx >= 0 ? opt.label.slice(0, idx) : opt.label;
      const match = idx >= 0 ? opt.label.slice(idx, idx + query.length) : '';
      const after = idx >= 0 ? opt.label.slice(idx + query.length) : '';
      const iconNode = (
        <div className={`image-container ${iconPosition}`}>
          {opt.icon && (
            <span className={`icon ${iconPosition}`} aria-hidden>
              {opt.icon}
            </span>
          )}
          {opt.imageUrl && (
            <img
              src={opt.imageUrl}
              alt=""
              className={`image ${iconPosition}`}
            />
          )}
        </div>
      );
      return (
        <>
          {iconPosition === 'left' && iconNode}
          <div className={`label-${iconPosition}`} title={opt.label}>
            {before}
            {match && <strong>{match}</strong>}
            {after}
          </div>
          {iconPosition === 'right' && iconNode}
        </>
      );
    },
    [iconPosition, query]
  );

  const onFocusInternal = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      onFocus?.(e);
      if (query) setOpen(true);
    },
    [onFocus, query]
  );

  const onBlurInternal = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      setTimeout(() => setOpen(false), 100);
    },
    [onBlur]
  );

  const optionElements = useMemo(
    () =>
      options.map((opt, idx) => {
        const isActive = idx === activeIndex;

        const content = renderOption
          ? renderOption(opt, isActive)
          : defaultRender(opt, isActive);


        const key =
          typeof opt.value === 'string'
            ? `${opt.value}-${idx}`
            : `${JSON.stringify(opt.value)}-${idx}`;

        return (
          <li
            key={key}
            id={`${inputId}-item-${idx}`}
            role="option"
            aria-selected={isActive}
            className={isActive ? `active ${itemClassName}` : itemClassName}
            onMouseDown={() => handleSelect(opt)}
          >
            {content}
          </li>
        );
      }),
    [activeIndex, defaultRender, handleSelect, inputId, itemClassName, options, renderOption]
  );

  return (
    <div className={`App ${className}`}>  
      <header className="App-header">
        <label htmlFor={inputId}>{label}</label>
        <div className="autocomplete">
          <div className="input-wrapper">
            {selectedOption && iconPosition === 'left' && (
              <span className="input-icon icon left">
                {selectedOption.icon}
              </span>
            )}
            {selectedOption?.imageUrl && iconPosition === 'left' && (
              <img
                src={selectedOption.imageUrl}
                alt=""
                className="input-icon image left"
              />
            )}
            <input
              id={inputId}
              className={`autocomplete-input ${inputClassName} ${
                selectedOption ? `has-icon-${iconPosition}` : ''
              }`}
              placeholder={placeholder}
              role="combobox"
              aria-haspopup="listbox"
              aria-controls={listId}
              aria-expanded={open}
              aria-activedescendant={
                activeIndex >= 0 ? `${inputId}-item-${activeIndex}` : undefined
              }
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={onFocusInternal}
              onBlur={onBlurInternal}
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                className={`clear-btn ${clearButtonClassName}`}
                onClick={clearAll}
                aria-label="Clear search"
              >
                <CloseIcon className="clear-btn-icon" />
              </button>
            )}
            {selectedOption && iconPosition === 'right' && (
              <span className="input-icon icon right">
                {selectedOption.icon}
              </span>
            )}
            {selectedOption?.imageUrl && iconPosition === 'right' && (
              <img
                src={selectedOption.imageUrl}
                alt=""
                className="input-icon image right"
              />
            )}
          </div>
          {open && (
            <ul
              id={listId}
              role="listbox"
              className={`autocomplete-list ${listClassName}`}
            >
              {loading && (
                <li className="loading">
                  {loadingComponent || 'Loading...'}
                </li>
              )}
              {error && (
                <li className="error">
                  Error: {error}{' '}
                  <button onClick={() => fetchOptions(query)}>
                    Retry
                  </button>
                </li>
              )}
              {!loading && !error && hasFetched && options.length === 0 && (
                <li className="no-results">
                  {noResultsComponent || 'No results'}
                </li>
              )}
              {optionElements}
            </ul>
          )}
        </div>
      </header>
    </div>
  );
}
