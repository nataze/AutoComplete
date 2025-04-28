
import { AutoCompleteInputProps } from '../types';
import { ReactComponent as CloseIcon } from './CloseIcon.svg';


export function AutoCompleteInput<T>(props: AutoCompleteInputProps<T>) {
  const {
    open,
    selectedOption,
    iconPosition,
    inputId,
    inputClassName,
    placeholder,
    listId,
    activeIndex,
    query,
    handleInputChange,
    handleKeyDown,
    onFocusInternal,
    onBlurInternal,
    clearButtonClassName,
    clearAll,
  } = props
  
  return (
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
  )
}