import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import {toast} from "sonner";

// The request type is inferred from the client.api.accounts.$post function either gives an error or data
type ResponseType = InferResponseType<typeof client.api.categories.$post>;
// this is what is accepteb by the endpoint. json gets the zValidator from the accounts.ts file
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
  >({
      mutationFn: async (json) => {
          const response = await client.api.categories.$post({json});
          return await response.json();

      },
      onSuccess: () => {
          //refetch all accounts after creating a new account
          toast.success("Category created successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
      onError: () => {
          toast.error("Failed to create category");
      }
  });

  return mutation;


};