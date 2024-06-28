import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {AccountForm} from "@/features/accounts/components/account-form";
import {insertTransactionSchema} from "@/db/schema";
import {z} from "zod";
import {useCreateAccount} from "@/features/accounts/api/use-create-account";
import {useOpenTransaction} from "@/features/transactions/hooks/use-open-transaction";
import {useGetTransaction} from "@/features/transactions/api/use-get-transaction";
import {Loader2} from "lucide-react";
import {useEditTransaction} from "@/features/transactions/api/use-edit-transaction";
import {useDeleteTransaction} from "@/features/transactions/api/use-delete-transaction";
import {useConfirm} from "@/hooks/use-confirm";
import {TransactionForm} from "@/features/transactions/components/transaction-form";
import {useGetAccounts} from "@/features/accounts/api/use-get-accounts";
import {useCreateCategory} from "@/features/categories/api/use-create-category";
import {useGetCategories} from "@/features/categories/api/use-get-categories";

const formSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>

export const EditTransactionSheet = () => {
    const {isOpen, onClose, id} = useOpenTransaction()

    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure you want to delete this transaction?',
        "You are about to delete an transaction. This action cannot be undone."
    )

    const transactionQuery = useGetTransaction(id)
    const editMutation = useEditTransaction(id)
    const deleteMutation = useDeleteTransaction(id)

    const accountMutation = useCreateAccount()
    const accountQuery = useGetAccounts()
    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    })
    // if there is no data work with an empty array. the category api route returns the id and the name which is mapped below
    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    }))

    const categoryMutation = useCreateCategory()
    const categoryQuery = useGetCategories()
    const onCreateCategory = (name: string) => categoryMutation.mutate({
        name
    })
    // if there is no data work with an empty array. the category api route returns the id and the name which is mapped below
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id
    }))

    const isPending = editMutation.isPending || deleteMutation.isPending || accountMutation.isPending || categoryMutation.isPending || transactionQuery.isLoading

    const isLoading = transactionQuery.isLoading || accountQuery.isLoading || categoryQuery.isLoading

    // the mutation hook will handle the form submission. object is used to continue on success and close sheet
    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    // the default values are set to the account name if the account exists
    const defaultValues = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
    } :{
        accountId: '',
        categoryId: '',
        amount: '',
        date: new Date(),
        payee: '',
        notes: '',
    }

    const onDelete = async () => {
        const ok = await confirm()

        if(ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose()
                }
            })
        }
    }

  return(
      <>
          <ConfirmDialog />
          <Sheet open={isOpen} onOpenChange={onClose} >
              <SheetContent className='space-y-4'>
                  <SheetHeader>
                      <SheetTitle>Edit Transaction</SheetTitle>
                      <SheetDescription>
                          Edit an existing transaction
                      </SheetDescription>
                  </SheetHeader>
                  {isLoading ? (
                      <div className='absolute inset-0 flex items-center'>
                          <Loader2 className='size-4 text-muted-foreground animate-spin' />
                      </div>
                  ) : (
                      <TransactionForm
                          id={id}
                          defaultValues={defaultValues}
                          disabled={isPending}
                          onDelete={onDelete}
                          categoryOptions={categoryOptions}
                          onCreateCategory={onCreateCategory}
                          accountOptions={accountOptions}
                          onCreateAccount={onCreateAccount}
                          onSubmit={onSubmit}
                      />
                  )
                  }
              </SheetContent>
          </Sheet>
      </>
  )
}