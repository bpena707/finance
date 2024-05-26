import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import {toast} from "sonner";

// The ResponseType uses the array of the bulk delete to access the accounts
type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;
// this is what is accepteb by the endpoint. json gets the zValidator from the accounts.ts file
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteCategories = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories["bulk-delete"].$post({json});
            return await response.json();

        },
        onSuccess: () => {
            //refetch all accounts after creating a new account
            toast.success("Categories deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        //     TODO: Also invalidate summary
        },
        onError: () => {
            toast.error("Failed to delete categories");
        }
    });

    return mutation;


};