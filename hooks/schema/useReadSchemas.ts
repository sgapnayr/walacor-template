import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import useAuthenticatedToken from "../auth/useAuthenticatedToken";
import { BlogData } from "@/schemas/blogSchema";
import { useRefetch } from "@/context/RefetchContext";

export const useReadSchemas = (etid: number) => {
  const [data, setData] = useState<BlogData[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const token = useAuthenticatedToken();
  const { shouldRefetch, resetRefetch } = useRefetch();

  const readSchemas = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${String(process.env.NEXT_PUBLIC_EC2_WALACOR)}/api/query/getcomplex`,
        {},
        {
          headers: {
            ETId: etid,
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setData(res.data.data);
        setError(null);
      } else {
        setError(new Error("Unexpected response structure"));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [token, etid]);

  useEffect(() => {
    if (token) {
      readSchemas();
    }
  }, [readSchemas, token]);

  useEffect(() => {
    if (shouldRefetch) {
      readSchemas().then(resetRefetch);
    }
  }, [shouldRefetch, readSchemas, resetRefetch]);

  return { data, error, loading, readSchemas };
};
