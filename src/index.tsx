import { useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AutoComplete } from './AutoComplete/AutoComplete';
import { IconPosition, OptionItem, ScenarioDef, ScenarioKey } from './types';
import { fruitList, labels, languageList, teamList } from './data';
import { useScenario } from './hooks/useScenario';


export const SCENARIOS: ScenarioDef<any>[] = [
  {
    id: 'fruits',
    name: 'Fruits',
    placeholder: 'Search fruits…',
    items: fruitList,
  },
  {
    id: 'languages',
    name: 'Languages',
    placeholder: 'Search languages…',
    items: languageList,
  },
  {
    id: 'teams',
    name: 'Teams',
    placeholder: 'Search teams…',
    items: teamList,
    renderOption: (
      opt: OptionItem<{
        label: string;
        division: string;
      }>,
      isActive: boolean
    ) => (
      <div
        style={{ fontWeight: isActive ? 'bold' : 'normal' }}
        className="label-right"
        title={`${opt.label} — ${opt.division} Division`}
      >
        {opt.label} — <small>{opt.division} Division</small>
      </div>
    ),
  },
  {
    id: 'countries',
    name: 'Countries',
    placeholder: 'Search countries…',
    fetcher: async () => {
      const res = await fetch('https://restcountries.com/v3.1/all');
      // no proper error handling for sample requests
      // since it wasn't core part of component
      if (!res.ok) {
        console.error(`Error ${res.status}`);
        return
      }

      const data = await res.json();
      return data.map((c: any) => ({
        label: c.name.common,
        value: c.cca2,
        imageUrl: c.flags.png,
      }));
    },
  },
  {
    id: 'users',
    name: 'Users',
    placeholder: 'Search users…',
    fetcher: async () => {
      const res = await fetch('https://dummyjson.com/users');
      if (!res.ok) {
        console.error(`Error ${res.status}`);
        return
      }

      const { users } = await res.json();
      return users.map((u: any) => ({
        label: `${u.firstName} ${u.lastName}`,
        value: u.id,
        imageUrl: u.image,
      }));
    },
  },
];

function App() {
  const [scenario, setScenario] = useState<ScenarioKey>('fruits');
  const [iconPosition, setIconPosition] = useState<IconPosition>('left');

  const { items, loading, error, placeholder, renderOption } = useScenario(scenario);

  // split into groups
  const staticScenarios = useMemo(
    () => SCENARIOS.filter(s => !!s.items),
    []
  );
  const remoteScenarios = useMemo(
    () => SCENARIOS.filter(s => !!s.fetcher),
    []
  );

  const handleToggleIcon = useCallback(() => {
    setIconPosition((pos: IconPosition) => (pos === 'left' ? 'right' : 'left'));
  }, []);

  return (
    <div className="app-container">
      {/* Nav is not mobile friendly since it wasn't core part of component */}
      <nav className="scenario-nav">
        <div className="scenario-group">
          <span className="group-label">Static Lists</span>
          <div className="group-buttons">
            {staticScenarios.map(s => (
              <button
                key={s.id}
                className={`scenario-btn ${scenario === s.id ? 'active' : ''}`}
                onClick={() => setScenario(s.id)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="scenario-group">
          <span className="group-label">Remote Fetch</span>
          <div className="group-buttons">
            {remoteScenarios.map(s => (
              <button
                key={s.id}
                className={`scenario-btn ${scenario === s.id ? 'active' : ''}`}
                onClick={() => setScenario(s.id)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="icon-toggle">
          <button
            role="switch"
            aria-checked={iconPosition === 'right'}
            className={`toggle-switch ${iconPosition}`}
            onClick={handleToggleIcon}
          >
            <span className="switch-thumb" />
          </button>
          <span className="toggle-label">
            Icon on {iconPosition.charAt(0).toUpperCase() + iconPosition.slice(1)}
          </span>
        </div>
      </nav>

      {error && <div className="scenario-error">Error loading items: {error}</div>}

      <AutoComplete
        items={loading ? [] : items}
        label={labels[scenario]}
        placeholder={placeholder}
        renderOption={renderOption}
        iconPosition={iconPosition}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);
