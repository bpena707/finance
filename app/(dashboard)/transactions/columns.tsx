"use client"

import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {Button} from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"

import {format} from "date-fns";
import {formatCurrency} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {AccountColumn} from "@/app/(dashboard)/transactions/account-column";
import {CategoryColumn} from "@/app/(dashboard)/transactions/category-column";
import {useOpenTransaction} from "@/features/transactions/hooks/use-open-transaction";
import {Actions} from "./actions";

// this is a type definition for the data that will be returned from the API part of the github v4.3 doc
export type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0]

export const columns: ColumnDef<ResponseType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("date") as Date

            return(
                <span>
                    {format(date, "dd MMM, yyyy")}
                </span>
            )
        }
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("date") as Date
            return(
               <CategoryColumn id={row.original.id } category={row.original.category} categoryId={row.original.categoryId} />
            )
        }
    },
    {
        accessorKey: "payee",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Payee
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))

            return(
                <Badge
                    variant={amount < 0 ? "destructive" : "primary"}
                    className='text-xs font-medium px-3.5 py-2.5'
                >
                    {formatCurrency(amount)}
                </Badge>
            )
        }
    },
    {
        accessorKey: "account",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Account
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("date") as Date
            return(
                <span>
                    <AccountColumn
                        account={row.original.account}
                        accountId={row.original.accountId}
                    />
                </span>
            )
        }
    },


    {
        id: "actions",
        cell: ({ row }) => <Actions id={row.original.id} />
    }

]
