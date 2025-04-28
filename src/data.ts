import { OptionItem, Scenario, ScenarioDef } from "./types";


export const labels = {
  fruits: 'Fruits',
  languages: 'Programming Languages',
  countries: 'Countries',
  users: 'Users',
  teams: 'Sport Teams'
}

// Static data

export const fruitList = [
  'Apple',
  'Apricot',
  'Banana',
  'Cherry',
  'Grape',
  'Orange',
  'Strawberry',
  'Blueberry',
  'Raspberry',
  'Watermelon',
  'Mango',
  'Pineapple',
  'Peach',
  'Pear',
  'Kiwi',
  'Plum',
  'Grapefruit',
  'Lemon',
  'Lime',
  'Pomegranate',
  'Papaya',
  'Dragonfruit',
  'Lychee',
  'Fig',
  'Guava',
  'Cantaloupe',
  'Honeydew',
  'Blackberry',
  'Cranberry',
  'Passionfruit'
];

export const languageList: OptionItem<string>[] = [
  { label: 'JavaScript', value: 'js', icon: '🟨' },
  { label: 'Python',     value: 'py', icon: '🐍' },
  { label: 'Go',         value: 'go', icon: '🐹' },
  { label: 'Rust',       value: 'rs', icon: '🦀' },
  { label: 'TypeScript',  value: 'ts',     icon: '🔷' },
  { label: 'Java',        value: 'java',   icon: '☕' },
  { label: 'C',           value: 'c',      icon: '🔧' },
  { label: 'C++',         value: 'cpp',    icon: '➕➕' },
  { label: 'C#',          value: 'csharp', icon: '♯' },
  { label: 'Ruby',        value: 'rb',     icon: '💎' },
  { label: 'PHP',         value: 'php',    icon: '🐘' },
  { label: 'Swift',       value: 'swift',  icon: '🕊️' },
  { label: 'Kotlin',      value: 'kt',     icon: '🅺' },
  { label: 'Dart',        value: 'dart',   icon: '🎯' },
  { label: 'Scala',       value: 'scala',  icon: '🔺' },
  { label: 'Elixir',      value: 'ex',     icon: '💧' },
  { label: 'Erlang',      value: 'erl',    icon: '💡' },
  { label: 'Haskell',     value: 'hs',     icon: 'λ' },
  { label: 'Clojure',     value: 'clj',    icon: '🍵' },
  { label: 'Perl',        value: 'pl',     icon: '🐪' },
  { label: 'Lua',         value: 'lua',    icon: '🌙' },
  { label: 'R',           value: 'r',      icon: '📊' },
  { label: 'MATLAB',      value: 'matlab', icon: '🧮' },
  { label: 'Elm',         value: 'elm',    icon: '🍃' },
  { label: 'F#',          value: 'fs',     icon: '🎵' },
  { label: 'SQL',         value: 'sql',    icon: '🗄️' },
  { label: 'HTML',        value: 'html',   icon: '🌐' },
  { label: 'CSS',         value: 'css',    icon: '🎨' },
  { label: 'Bash',        value: 'bash',   icon: '🐚' },
  { label: 'PowerShell',  value: 'ps',     icon: '⚡' },
  { label: 'Groovy',      value: 'groovy', icon: '☕' },
  { label: 'Shell',       value: 'sh',     icon: '🐚' },
];

export const teamList: Array<OptionItem<number> & { division: string }> = [
  { label: 'Manchester City',      value:  1, division: 'Premier League' },
  { label: 'Liverpool',            value:  2, division: 'Premier League' },
  { label: 'Chelsea',              value:  3, division: 'Premier League' },
  { label: 'Arsenal',              value:  4, division: 'Premier League' },
  { label: 'Manchester United',    value:  5, division: 'Premier League' },

  { label: 'Real Madrid',          value:  6, division: 'La Liga' },
  { label: 'Barcelona',            value:  7, division: 'La Liga' },
  { label: 'Atlético Madrid',      value:  8, division: 'La Liga' },
  { label: 'Sevilla',              value:  9, division: 'La Liga' },

  { label: 'Bayern Munich',        value: 10, division: 'Bundesliga' },
  { label: 'Borussia Dortmund',    value: 11, division: 'Bundesliga' },
  { label: 'RB Leipzig',           value: 12, division: 'Bundesliga' },

  { label: 'Juventus',             value: 13, division: 'Serie A' },
  { label: 'AC Milan',             value: 14, division: 'Serie A' },
  { label: 'Inter Milan',          value: 15, division: 'Serie A' },

  { label: 'Paris Saint-Germain',  value: 16, division: 'Ligue 1' },
  { label: 'Olympique Lyonnais',   value: 17, division: 'Ligue 1' },
  { label: 'Marseille',            value: 18, division: 'Ligue 1' },

  { label: 'Los Angeles Lakers',   value: 19, division: 'NBA' },
  { label: 'Golden State Warriors',value: 20, division: 'NBA' },
  { label: 'Boston Celtics',       value: 21, division: 'NBA' },

  { label: 'New England Patriots', value: 22, division: 'NFL' },
  { label: 'Kansas City Chiefs',   value: 23, division: 'NFL' },
  { label: 'Dallas Cowboys',       value: 24, division: 'NFL' },

  { label: 'New York Yankees',     value: 25, division: 'MLB' },
  { label: 'Los Angeles Dodgers',  value: 26, division: 'MLB' },
  { label: 'Chicago Cubs',         value: 27, division: 'MLB' },

  { label: 'Toronto Maple Leafs',  value: 28, division: 'NHL' },
  { label: 'Tampa Bay Lightning',  value: 29, division: 'NHL' },
  { label: 'Montreal Canadiens',   value: 30, division: 'NHL' },
];
