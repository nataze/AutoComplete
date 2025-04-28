import { AutoCompleteDropdownProps } from "../types";

export function AutoCompleteDropdown<T>(props: AutoCompleteDropdownProps<T>) {
  const {
    loading,
    loadingComponent,
    error,
    query,
    fetchOptions,
    hasFetched,
    options,
    noResultsComponent,
    activeIndex,
    renderOption,
    handleSelect,
    inputId,
    itemClassName,
  } = props

  if (loading) {
    return (
      <li className="loading">
      {loadingComponent || 'Loading...'}
    </li>
    )
  }

  if (error) {
    return (
      <li className="error">
        Error: {error}{' '}
        <button onClick={() => fetchOptions(query)}>
          Retry
        </button>
      </li>
    )
  }

  if (!loading && !error && hasFetched && options.length === 0 ) {
    return (
      <li className="no-results">
        {noResultsComponent || 'No results'}
      </li>
    )
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
            {renderOption(opt, isActive)}
          </li>
        );
      })}
    </>
  )
}