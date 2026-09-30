import { useEffect, useState } from "react";
import { apiRequest, type Patient } from "../lib/api";

export function usePatient(id = "demo-patient") {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    apiRequest<Patient>(`/patients/${encodeURIComponent(id)}`)
      .then((result) => { if (active) setPatient(result); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Unable to load patient.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  return { patient, loading, error };
}