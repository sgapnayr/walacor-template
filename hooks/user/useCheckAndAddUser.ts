import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useGetUser } from "@/hooks/user/useGetUser";
import { useAddUser } from "@/hooks/user/useAddUser";

export const useCheckAndAddUser = () => {
  const { user } = useUser();
  const { data, getUser, loading: loadingGet } = useGetUser();
  const { addUser, loading: loadingAdd } = useAddUser();
  const [userChecked, setUserChecked] = useState(false);

  useEffect(() => {
    if (user && !userChecked) {
      const checkAndAddUser = async () => {
        await getUser({ UserName: user.fullName || user.id });

        // Ensure `data` is populated after calling `getUser`
        if (data && data.length === 0) {
          await addUser();
        }

        setUserChecked(true); // Mark that the user has been checked to prevent further loops
      };

      checkAndAddUser();
    }
  }, [user, userChecked, getUser, addUser, data]);

  return { loading: loadingGet || loadingAdd };
};