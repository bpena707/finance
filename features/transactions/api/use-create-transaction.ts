import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import {toast} from "sonner";

// The request type is inferred from the client.api.accounts.$post function either gives an error or data
type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
// this is what is accepteb by the endpoint. json gets the zValidator from the accounts.ts file
type RequestType = InferRequestType<typeof client.api.transactions.$post>["json"];

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
  >({
      mutationFn: async (json) => {
          const response = await client.api.transactions.$post({json});
          return await response.json();

      },
      onSuccess: () => {
          //refetch all accounts after creating a new account
          toast.success("Transaction created successfully");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
      onError: () => {
          toast.error("Failed to create transactions");
      }
  });
  return mutation;
};