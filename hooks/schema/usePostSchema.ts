import { useState, useCallback } from "react";
import axios from "axios";
import useAuthenticatedToken from "../auth/useAuthenticatedToken";
import { BlogData } from "@/schemas/blogSchema";
import { useRefetch } from "@/context/RefetchContext";
import { ProfileData } from "@/schemas/profileSchema";
import { RoleData } from "@/schemas/roleSchema";

const usePostSchema = (etid: number) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const token = useAuthenticatedToken();
  const { triggerRefetch } = useRefetch();

  const postSchema = useCallback(
    async (data: BlogData | ProfileData | RoleData) => {
      setLoading(true);

      try {
        const res = await axios.post(
          `${String(process.env.NEXT_PUBLIC_EC2_WALACOR)}/api/envelopes/submit`,
          { Data: [data] },
          {
            headers: {
              ETId: etid,
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setResponse(res.data);
        triggerRefetch();
      } catch (err) {
        console.log(err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [token, etid, triggerRefetch]
  );

  return { response, error, loading, postSchema };
};

export default usePostSchema;
