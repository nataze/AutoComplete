import { useEffect, useMemo, useState } from "react";
import { ScenarioKey } from "../types";
import { SCENARIOS } from "..";

export function useScenario(scenarioId: ScenarioKey) {
  const scenario = useMemo(
    () => SCENARIOS.find(s => s.id === scenarioId)!,
    [scenarioId]
  );
  const [items, setItems] = useState(scenario.items ?? []);
  const [loading, setLoading] = useState(!scenario.items);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scenario.items) {
      setItems(scenario.items);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    scenario.fetcher!()
      .then(list => setItems(list))
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [scenario]);

  return {
    items,
    loading,
    error,
    placeholder: scenario.placeholder,
    renderOption: scenario.renderOption,
  };
}