import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  FocusEvent,
  useId,
} from 'react';
import './AutoComplete.css';

import { AutoCompleteProps, OptionItem } from '../types';
import { AutoCompleteInput } from './AutoCompleteInput';
import { AutoCompleteDropdown } from './AutoCompleteDropdown';

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

    className = '',
    inputClassName = '',
    listClassName = '',
    itemClassName = 'option-content',
    clearButtonClassName = '',
    
    renderOption,
    formatOptions,
    loadingComponent,
    noResultsComponent,

    iconPosition = 'left',

    onSelect,
    onFocus,
    onBlur,
  } = props;

  // ids for accessibility
  const generatedId = useId();
  const inputId = id ?? `autocomplete-${generatedId}`;
  const listId = `${inputId}-list`;

  const [internalQuery, setInternalQuery] = useState('');
  const query = value !== undefined ? value : internalQuery;

  const [options, setOptions] = useState<OptionItem<T>[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState<OptionItem<T> | null>(null);
  const [open, setOpen] = useState(false);

  const timer = useRef<number>(undefined);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const clearAll = useCallback(() => {
    clearTimeout(timer.current);
    setLoading(false);
    setOptions([]);
    setActiveIndex(-1);
    setOpen(false);
    setSelectedOption(null);
    setHasSearched(false);
    if (value === undefined) setInternalQuery('');
    onInputChange?.('')
  }, [value, onInputChange]);

  useEffect(() => {
    clearAll()
  }, [items, clearAll]);

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
      if (q.length < minChars) {
        setOptions([]);
        return;
      }

      try {
        const list = formatOptions ? formatOptions(items) : formatItems(items);
        setOptions(filterList(list, q));
      } catch (e: any) {
        setOptions([]);
        console.error(e)
      } finally {
        setLoading(false);
      }
    },
    [items, formatItems, formatOptions, filterList, minChars]
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

      if (val.length < minChars) {
        setHasSearched(false);
      } else {
        setLoading(true)
      }

      clearTimeout(timer.current);
      timer.current = window.setTimeout(
        () => {
          if (val.length >= minChars) {
            setHasSearched(true);
            fetchOptions(val);
          } else {
            setOptions([]);
          }
        },
        debounceTime
      );
    },
    [debounceTime, fetchOptions, onInputChange, value, minChars]
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
          {iconPosition === 'left' && opt.icon && iconNode}
          <div className={`label-${iconPosition}`} title={opt.label}>
            {before}
            {match && <strong>{match}</strong>}
            {after}
          </div>
          {iconPosition === 'right' && opt.icon && iconNode}
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

  return (
    <div className={`App ${className}`}>  
      <header className="App-header">
        <label htmlFor={inputId}>{label}</label>
        <div className="autocomplete">
          <AutoCompleteInput
            open={open}
            selectedOption={selectedOption}
            iconPosition={iconPosition}
            inputId={inputId}
            inputClassName={inputClassName}
            placeholder={placeholder}
            listId={listId}
            activeIndex={activeIndex}
            query={query}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            onFocusInternal={onFocusInternal}
            onBlurInternal={onBlurInternal}
            clearAll={clearAll}
            clearButtonClassName={clearButtonClassName}
          />
          {open && (
            <ul
              id={listId}
              role="listbox"
              className={`autocomplete-list ${listClassName}`}
            >
              <AutoCompleteDropdown
                inputId={inputId}
                loading={loading}
                loadingComponent={loadingComponent}
                options={options}
                noResultsComponent={noResultsComponent}
                activeIndex={activeIndex}
                renderOption={renderOption ?? defaultRender}
                handleSelect={handleSelect}
                itemClassName={itemClassName}
                hasSearched={hasSearched} 
              />
            </ul>
          )}
        </div>
      </header>
    </div>
  );
}
