import { FocusEvent, ReactNode } from "react";

/**
 * Generic option type for the autocomplete.
 */
export interface OptionItem<T = any> {
  label: string;
  value?: T;
  icon?: ReactNode;
  imageUrl?: string;
  [key: string]: any;
}

export interface AutoCompleteProps<T = any> {
  /** Local list of options to suggest */
  items?: OptionItem<T>[];
  /** URL to fetch suggestions from */
  dataSourceUrl?: string;
  /** Custom render for each option */
  renderOption?: (
    item: OptionItem<T>,
    isActive: boolean,
    query: string
  ) => ReactNode;
  /** Called when an option is selected */
  onSelect?: (item: OptionItem<T>) => void;

  placeholder?: string;
  debounceTime?: number;
  minChars?: number;
  maxResults?: number;
  loadingText?: string;
  noResultsText?: string;
  errorText?: string;

  className?: string;
  inputClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  clearButtonClassName?: string;

  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}