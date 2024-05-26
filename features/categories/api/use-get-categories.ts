//hook that communicates the accounts.ts file in the route api
//type safe RPC is used to make sure the route is typed correctly. types are also automatically inferred

import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";

export function useGetCategories() {
    const query = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            // unlike axios or fetch, the client.api is a type safe RPC client and doesnt automatically need try catch
            const response = await client.api.categories.$get()

            if (!response.ok) {
                throw new Error('Failed to fetch categories')
            }

            // data object is returned from accounts.ts
            const { data } = await response.json()
            return data
        }
    })
    return query
}