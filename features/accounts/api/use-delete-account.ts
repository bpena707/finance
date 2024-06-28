import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import {toast} from "sonner";

// only the ResponseType is needed to delete
type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
      ResponseType,
      Error
  >({
      mutationFn: async () => {
          //only relying on the param object to pass the idand delete the account
          const response = await client.api.accounts[":id"]["$delete"]({
                param: { id },
          })
          return await response.json();

      },
      onSuccess: () => {
          //refetch all accounts after creating a new account
          toast.success("Account deleted successfully");
          //primary update account with id as key and all accounts
          queryClient.invalidateQueries({ queryKey: ["account", { id }] });
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
          queryClient.invalidateQueries({ queryKey: ["transactions"] })
      },
      onError: () => {
          toast.error("Failed to delete account");
      }
  });

  return mutation;
};