# AutoComplete Component

A flexible, accessible, and high-performance React autocomplete input. It supports both static arrays and remote data sources, offers built-in caching and abortable fetches, debounced requests, customizable rendering, controlled or uncontrolled modes, and full keyboard & ARIA support.

---

## Features

- **Static or Remote Data**  
  Pass an `items` array or a `dataSourceUrl` for live fetching.

- **Debounce & Throttling**  
  Control requester load with `debounceTime`, `minChars`, and `maxResults`.

- **Race-Safe Fetching**  
  Uses `AbortController` to cancel stale requests and avoid out-of-order results.

- **Unmount Cleanup**  
  Clears timers and aborts in-flight fetches on unmount.

- **Controlled / Uncontrolled**  
  Use `value` + `onInputChange` for controlled forms, or let it manage its own state.

- **Custom Rendering**  
  - `renderOption(opt, isActive)` to override how each dropdown item renders.  
  - `loadingComponent` / `noResultsComponent` to swap default messages.

- **Icon & Image Support**  
  Show an emoji/SVG or image on the left or right of each item and the input, with ellipsis & tooltip.

- **Full Accessibility**  
  WAI-ARIA combobox roles, `aria-activedescendant`, proper `<label>` associations.

---

## Props (Performance & Behavior)

```ts
interface AutoCompleteProps<T> {
  // Data sources
  items?: Array<string | OptionItem<T>>;
  dataSourceUrl?: string;

  // Controlled mode
  value?: string;
  onInputChange?: (value: string) => void;

  // Labels & placeholders
  label?: string;
  placeholder?: string;
  iconPosition?: 'left' | 'right';

  // Debouncing & limits
  debounceTime?: number;    // ms before firing filter/fetch
  minChars?: number;        // minimum input length to query
  maxResults?: number;      // maximum suggestions shown

  // Custom renderers
  renderOption?: (opt: OptionItem<T>, isActive: boolean) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  noResultsComponent?: React.ReactNode;

  // Callbacks
  onSelect?: (opt: OptionItem<T>) => void;
  onError?: (err: Error) => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;

  // Styling overrides
  className?: string;
  inputClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  clearButtonClassName?: string;

  // ARIA: supply a unique id if needed
  id?: string;
}
```

## Getting Started

This project uses Create React App:

```bash
npm install
npm start
```

Open http://localhost:3000 in your browser.

## Scenarios & `index.tsx`

The demo in `index.tsx` lets you switch among five data scenarios—Fruits, Languages, Countries, Users, Teams—via the top nav:

- Click a scenario button to swap the `items` prop or trigger a fetch.  
- Toggle the switch to flip `iconPosition` between left and right.  
- The Teams scenario uses a custom `renderOption` to show “Team — Division Division.”

This showcases static lists, remote fetching, images/icons, and full custom rendering.

Countries and Users use a public API to fetch data remotely.

## Running Unit Tests
We use Jest and React Testing Library:

```bash
npm test
```
Tests cover filtering, icon rendering, controlled vs. uncontrolled behavior, fetch loading & retry, keyboard navigation, and custom rendering—without external jest-dom matchers.


## Best Practices & Interview Notes

- Race-safe fetching with `AbortController`.  
- Clean unmount clears timers & aborts any in-flight request.  
- Fallbacks for error states and empty results keep the UI predictable.  
- ARIA roles & proper labels ensure screen-reader compatibility.  
- Extensible via `renderOption` and slot props for maximum reuse.  

Feel free to clone, tweak props, or swap in new data sources