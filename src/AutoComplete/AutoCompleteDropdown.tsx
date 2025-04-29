import { useCallback } from "react";
import { AutoCompleteDropdownProps, OptionItem } from "../types";

export function AutoCompleteDropdown<T>(props: AutoCompleteDropdownProps<T>) {
  const {
    loading,
    loadingComponent,
    options,
    noResultsComponent,
    activeIndex,
    renderOption,
    handleSelect,
    inputId,
    itemClassName,
    hasSearched,
    query,
    iconPosition,
  } = props

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
            {iconPosition === 'left' && (opt.icon || opt.imageUrl) && iconNode}
            <div className={`label-${iconPosition}`} title={opt.label}>
              {before}
              {match && <strong>{match}</strong>}
              {after}
            </div>
            {iconPosition === 'right' && (opt.icon || opt.imageUrl) && iconNode}
          </>
        );
      },
      [iconPosition, query]
    );

  if (loading) {
    return (
      <li className="loading">
      {loadingComponent || 'Loading...'}
    </li>
    )
  }

  if (options.length === 0 && hasSearched) {
    return (
      <li className="no-results">
        {noResultsComponent || 'No results'}
      </li>
    );
  }

  return (
    <>
      {options.map((opt, idx) => {
        const isActive = idx === activeIndex;

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
            {renderOption ? renderOption(opt, isActive) : defaultRender(opt, isActive)}
          </li>
        );
      })}
    </>
  )
}