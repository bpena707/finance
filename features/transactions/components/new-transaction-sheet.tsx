import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import {AccountForm} from "@/features/accounts/components/account-form";
import {insertAccountSchema, insertTransactionSchema} from "@/db/schema";
import {z} from "zod";
import {useCreateTransaction} from "@/features/transactions/api/use-create-transaction";
import {useCreateCategory} from "@/features/categories/api/use-create-category";
import {useGetCategories} from "@/features/categories/api/use-get-categories";
import {useCreateAccount} from "@/features/accounts/api/use-create-account";
import {useGetAccounts} from "@/features/accounts/api/use-get-accounts";
import {TransactionForm} from "@/features/transactions/components/transaction-form";
import {Loader2} from "lucide-react";

const formSchema = insertTransactionSchema.omit({
    id: true,
})

type FormValues = z.input<typeof formSchema>

export const NewTransactionSheet = () => {
    const {isOpen, onClose} = useNewTransaction()

    const createMutation = useCreateTransaction()



    // category and account options are loaded onto this sheet instead of directly on the form and are passed to the transaction form
    // fetches the options each user will have
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

    // disables the form
    const isPending = createMutation.isPending || accountMutation.isPending || categoryMutation.isPending

    // will not show the form
    const isLoading = categoryQuery.isLoading || accountQuery.isLoading

    // the mutation hook will handle the form submission. object is used to continue on success and close sheet
    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

  return(
      <Sheet open={isOpen} onOpenChange={onClose} >
          <SheetContent className='space-y-4'>
              <SheetHeader>
                  <SheetTitle>New Transaction</SheetTitle>
                  <SheetDescription>
                      Add a new transaction to your account
                  </SheetDescription>
              </SheetHeader>
              {isLoading ?
                  (
                      <div className='absolute inset-0 flex items-center'>
                          <Loader2 className='size-4 text-muted-foreground animate-spin' />
                      </div>
                  ) :
                  (
                      <TransactionForm
                          disabled={isPending}
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
  )
}