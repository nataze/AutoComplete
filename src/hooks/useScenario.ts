import { useEffect, useMemo, useState } from "react";
import { ScenarioKey } from "../types";
import { SCENARIOS } from "..";

export function useScenario<T>(scenarioId: ScenarioKey) {
  const scenarioDefinition = useMemo(
    () => SCENARIOS.find(s => s.id === scenarioId)!,
    [scenarioId]
  );
  const [items, setItems] = useState(scenarioDefinition.items ?? []);
  const [loading, setLoading] = useState(!scenarioDefinition.items);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scenarioDefinition.items) {
      setItems(scenarioDefinition.items);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    scenarioDefinition.fetcher!()
      .then(list => setItems(list))
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [scenarioDefinition]);

  return {
    items,
    loading,
    error,
    placeholder: scenarioDefinition.placeholder,
    renderOption: scenarioDefinition.renderOption,
  };
}