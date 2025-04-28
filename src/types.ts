import { ReactNode, FocusEvent, KeyboardEvent } from "react";

export interface OptionItem<T = any> {
  label: string;
  value: T;
  icon?: ReactNode;
  imageUrl?: string;
  [key: string]: any;
}


/**
 * Generic option type for the autocomplete.
 */
export interface AutoCompleteProps<T> {
  // Static list of items. If omitted, fetch from dataSourceUrl
  items?: string[] | OptionItem<T>[];

  // Unique input id for accessibility. Generated if not provided
  id?: string;

  // Controlled input value; enables controlled mode if provided
  value?: string;

  // Callback when input text changes (controlled mode)
  onInputChange?: (value: string) => void;

  // Text label for the input
  label?: string;

  // Placeholder text
  placeholder?: string;

  // Debounce delay in ms before fetching/filtering
  debounceTime?: number;

  // Minimum characters to trigger filtering or fetch
  minChars?: number;

  // Max number of results to display
  maxResults?: number;

  // URL to fetch suggestions when items is undefined
  dataSourceUrl?: string;

  // CSS class for root container
  className?: string;

  // CSS class for the input element
  inputClassName?: string;

  // CSS class for the suggestion list
  listClassName?: string;

  // CSS class for each suggestion item
  itemClassName?: string;

  // CSS class for the clear button
  clearButtonClassName?: string;

  // Custom renderer for options: (opt, query, isActive) => ReactNode
  renderOption?: (
    opt: OptionItem<T>,
    isActive: boolean
  ) => React.ReactNode;

  // Custom loading indicator node
  loadingComponent?: React.ReactNode;

  // Custom "no results" node
  noResultsComponent?: React.ReactNode;

  // Icon or image position inside items: 'left' or 'right'
  iconPosition?: 'left' | 'right';

  // Callback when an option is selected
  onSelect?: (opt: OptionItem<T>) => void;

  // Callback on fetch/render errors
  onError?: (err: Error) => void;

  // Called when input gains focus
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;

  // Called when input loses focus
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}


export type ScenarioKey = 'fruits' | 'languages' | 'countries' | 'users' | 'teams';
export interface Scenario {
  id: ScenarioKey;
  name: string;
}


export interface AutoCompleteInputProps<T> {
  open: boolean;
  selectedOption: OptionItem<T> | null;
  iconPosition: 'left' | 'right';
  inputId?: string;
  inputClassName?: string;
  placeholder?: string;
  listId?: string;
  activeIndex: number;
  query: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocusInternal: (e: FocusEvent<HTMLInputElement>) => void;
  onBlurInternal: (e: FocusEvent<HTMLInputElement>) => void;
  clearButtonClassName?: string;
  clearAll: () => void;
}

export interface AutoCompleteDropdownProps<T> {
  loading: boolean;
  loadingComponent?: React.ReactNode;
  error: string | null;
  query: string;
  fetchOptions: (query: string) => Promise<void>;
  hasFetched: boolean;
  options: OptionItem<T>[];
  noResultsComponent?: React.ReactNode;
  renderOption: (opt: OptionItem<T>, isActive: boolean) => React.ReactNode;
  activeIndex: number;
  handleSelect: (opt: OptionItem<T>) => void;
  inputId?: string;
  itemClassName?: string;
}