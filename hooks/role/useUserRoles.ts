import { useState, useCallback } from "react";
import axios from "axios";
import useAuthenticatedToken from "@/hooks/auth/useAuthenticatedToken";

type UserRole = {
  _id: string;
  UID: string;
  RoleID: string;
  UserUID: string;
  IsDeleted: boolean;
  CreatedAt: number;
  UpdatedAt: number;
  EId: string;
  SV: number;
  LastModifiedBy: string;
};

export const useUserRoles = () => {
  const [data, setData] = useState<UserRole[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const token = useAuthenticatedToken();

  const getUserRoles = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${String(
          process.env.NEXT_PUBLIC_EC2_WALACOR
        )}/api/query/get?fromSummary=true`,
        {},
        {
          headers: {
            ETId: 16,
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setData(res.data.data);
      } else {
        setError(new Error("Unexpected response structure"));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { data, error, loading, getUserRoles };
};
