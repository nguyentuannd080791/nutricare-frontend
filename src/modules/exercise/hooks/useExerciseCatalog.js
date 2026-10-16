import { useEffect, useState } from "react";
import { exerciseApi } from "../api/exerciseApi";

export function useExerciseCatalog() {
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    let cancelled = false;
    exerciseApi
      .catalog()
      .then((list) => {
        if (!cancelled) setCatalog(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return catalog;
}
