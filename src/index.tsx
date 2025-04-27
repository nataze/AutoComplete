import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { AutoComplete } from './AutoComplete';
import { OptionItem, ScenarioKey } from './types';
import { fruitList, labels, languageList, SCENARIOS, teamList } from './data';


function App() {
  const [scenario, setScenario] = useState<ScenarioKey>('fruits');
  const [items, setItems] = useState<string[] | OptionItem<any>[]>(fruitList);
  const [placeholder, setPlaceholder] = useState('Search fruits…');
  const [iconPosition, setIconPosition] = useState<'left' | 'right'>('left');


  useEffect(() => {
    setItems([]);
    switch (scenario) {
      case 'fruits':
        setItems(fruitList);
        setPlaceholder('Search…');
        break;
      case 'languages':
        setItems(languageList);
        setPlaceholder('Search…');
        break;
      case 'countries':
        setItems([]);
        setPlaceholder('Search…');
        fetch('https://restcountries.com/v3.1/all')
          .then(res => res.json())
          .then((data: any[]) => {
            const list = data.map(c => ({
              label: c.name.common,
              value: c.cca2,
              imageUrl: c.flags.png,
            }));
            setItems(list);
          })
          .catch(console.error);
        break;
      case 'users':
        setItems([]);
        setPlaceholder('Search…');
        fetch('https://dummyjson.com/users')
          .then(res => res.json())
          .then((data: any) => {
            const list = data.users.map((u: any) => ({
              label: `${u.firstName} ${u.lastName}`,
              value: u.id,
              imageUrl: u.image,
            }));
            setItems(list);
          })
          .catch(console.error);
        break;
      case 'teams':
        setItems(teamList);
        setPlaceholder('Search…');
        break;
    }
  }, [scenario]);

  const RenderTeamOption = useCallback(
    (opt: OptionItem<any>, isActive: boolean) => {
      return (
        <div
          style={{ fontWeight: isActive ? 'bold' : 'normal' }}
          className="label-right"
          title={`${opt.label} - ${opt.division}`}
        >
          {opt.label} — <small>{opt.division} Division</small>
        </div>
      );
    },
    []
  );

  return (
    <div className="app-container">
      <nav className="scenario-nav">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            className={`scenario-btn ${scenario === s.id ? 'active' : ''}`}
            onClick={() => setScenario(s.id)}
          >
            {s.name}
          </button>
        ))}
        <div className="icon-toggle">
          <button
            role="switch"
            aria-checked={iconPosition === 'right'}
            className={`toggle-switch ${iconPosition}`}
            onClick={() => setIconPosition(pos => (pos === 'left' ? 'right' : 'left'))}
          >
            <span className="switch-thumb" />
          </button>
          <span className="toggle-label">
            Icon on {iconPosition.charAt(0).toUpperCase() + iconPosition.slice(1)}
          </span>
        </div>
      </nav>

      <AutoComplete
        items={items}
        label={labels[scenario]}
        placeholder={placeholder}
        renderOption={scenario === 'teams' ? RenderTeamOption : undefined}
        iconPosition={iconPosition}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
