"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button";
import {Edit, MoreHorizontal, Trash} from "lucide-react";
import {useOpenTransaction} from "@/features/transactions/hooks/use-open-transaction";
import {useDeleteTransaction} from "@/features/transactions/api/use-delete-transaction";
import {useConfirm} from "@/hooks/use-confirm";


type Props = {
    id: string;
}

export const Actions = ({id}: Props) => {
    const {onOpen} = useOpenTransaction()
    const deleteMutation = useDeleteTransaction(id)
    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure you want to delete this transaction?',
        "You are about to delete a transaction. This action cannot be undone."
    )

    const handleDelete = async () => {
        const ok = await confirm()

        if(ok) {
            deleteMutation.mutate()
        }
    }



    return (
        <>
            <ConfirmDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className="size-8 p-0">
                        <MoreHorizontal size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={() => onOpen(id)}
                    >
                        <Edit className="size-4 mr-2" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={handleDelete}
                    >
                        <Trash className="size-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}