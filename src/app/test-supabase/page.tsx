"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function TestSupabasePage() {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("about").select("*").limit(1);

      if (error) {
        setError(error.message);
        setData(null);
      } else {
        setData(data);
        setError(null);
      }

      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
