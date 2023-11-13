import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export const useAppQueryString = () => {
  const searchParams = useSearchParams()!;

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return {
    createQueryString,
    searchParams,
  };
};
