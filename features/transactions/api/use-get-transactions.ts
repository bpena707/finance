//hook that communicates the accounts.ts file in the route api
//type safe RPC is used to make sure the route is typed correctly. types are also automatically inferred

import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export function useGetTransactions() {
    const params = useSearchParams()
    const from = params.get('from') || ''
    const to = params.get('to') || ''
    const accountId = params.get('accountId') || ''

    const query = useQuery({
        queryKey: ["transactions", {from, to, accountId }],
        queryFn: async () => {
            // unlike axios or fetch, the client.api is a type safe RPC client and doesnt automatically need try catch
            const response = await client.api.transactions.$get({
                query: {
                    from,
                    to,
                    accountId
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch transactions')
            }

            // data object is returned from accounts.ts
            const { data } = await response.json()
            return data
        }
    })
    return query
}