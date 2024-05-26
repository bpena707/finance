import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import {toast} from "sonner";

// The request type is inferred from the client.api.accounts.$post function either gives an error or data
type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;
// this is what is accepteb by the endpoint. json gets the zValidator from the accounts.ts file
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"]

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
  >({
      mutationFn: async (json) => {
          //rather than just needing json as a parameter, the id is also needed which is passed in the param object
          const response = await client.api.categories[":id"]["$patch"]({
                param: { id },
                json
          })
          return await response.json();

      },
      onSuccess: () => {
          //refetch all accounts after creating a new account
          toast.success("Category updated successfully");
          //primary update account with id as key and all accounts
          queryClient.invalidateQueries({ queryKey: ["category", { id }] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
      onError: () => {
          toast.error("Failed to edit category");
      }
  });

  return mutation;


};