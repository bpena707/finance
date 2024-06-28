import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import {toast} from "sonner";

// only the ResponseType is needed to delete
type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>;

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
      ResponseType,
      Error
  >({
      mutationFn: async () => {
          //only relying on the param object to pass the idand delete the account
          const response = await client.api.categories[":id"]["$delete"]({
                param: { id },
          })
          return await response.json();

      },
      onSuccess: () => {
          //refetch all accounts after creating a new account
          toast.success("Category deleted successfully");
          //primary update account with id as key and all accounts
          queryClient.invalidateQueries({ queryKey: ["category", { id }] });
          queryClient.invalidateQueries({ queryKey: ["categories"] });
          queryClient.invalidateQueries({ queryKey: ["transactions"] })
      },
      onError: () => {
          toast.error("Failed to delete category");
      }
  });

  return mutation;
};