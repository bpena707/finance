import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {AccountForm} from "@/features/accounts/components/account-form";
import {insertAccountSchema} from "@/db/schema";
import {z} from "zod";
import {useCreateAccount} from "@/features/accounts/api/use-create-account";
import {useOpenAccount} from "@/features/hooks/use-open-account";
import {useGetAccount} from "@/features/accounts/api/use-get-account";
import {Loader2} from "lucide-react";
import {useEditAccount} from "@/features/accounts/api/use-edit-account";
import {useDeleteAccount} from "@/features/accounts/api/use-delete-account";

const formSchema = insertAccountSchema.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>

export const EditAccountSheet = () => {
    const {isOpen, onClose, id} = useOpenAccount()

    const accountQuery = useGetAccount(id)
    const editMutation = useEditAccount(id)
    const deleteMutation = useDeleteAccount(id)

    const isPending = editMutation.isPending || deleteMutation.isPending

    const isLoading = accountQuery.isLoading

    // the mutation hook will handle the form submission. object is used to continue on success and close sheet
    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    // the default values are set to the account name if the account exists
    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } :{
        name: ''
    }

  return(
      <Sheet open={isOpen} onOpenChange={onClose} >
          <SheetContent className='space-y-4'>
              <SheetHeader>
                  <SheetTitle>Edit Account</SheetTitle>
                  <SheetDescription>
                      Edit an existing account
                  </SheetDescription>
              </SheetHeader>
              {isLoading ? (
                  <div className='absolute inset-0 flex items-center'>
                      <Loader2 className='size-4 text-muted-foreground animate-spin' />
                  </div>
              ) : (
                  <AccountForm
                      id={id}
                      onSubmit={onSubmit}
                      disabled={isPending}
                      defaultValues={defaultValues}
                      onDelete={() => deleteMutation.mutate()}
                  />
              )
              }
          </SheetContent>
      </Sheet>
  )
}