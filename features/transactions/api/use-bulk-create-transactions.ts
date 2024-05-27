import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import {toast} from "sonner";

// The ResponseType uses the array of the bulk delete to access the accounts
type ResponseType = InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>;
// this is what is accepteb by the endpoint. json gets the zValidator from the accounts.ts file
type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>["json"];

export const useBulkCreateTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-create"].$post({json});
            return await response.json();

        },
        onSuccess: () => {
            //refetch all accounts after creating a new account
            toast.success("Transactions created successfully");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        //     TODO: Also invalidate summary
        },
        onError: () => {
            toast.error("Failed to create transactions");
        }
    });
    return mutation;
};