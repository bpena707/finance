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
import {useCreateAccount} from "@/features/hooks/use-create-account";
import {useOpenAccount} from "@/features/hooks/use-open-account";
import {useGetAccount} from "@/features/accounts/api/use-get-account";

const formSchema = insertAccountSchema.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>

export const EditAccountSheet = () => {
    const {isOpen, onClose, id} = useOpenAccount()

    const accountQuery = useGetAccount(id)
    const mutation = useCreateAccount()

    // the mutation hook will handle the form submission. object is used to continue on success and close sheet
    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
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
                  <SheetTitle>New Account</SheetTitle>
                  <SheetDescription>
                      Create a new account to track your transactions.
                  </SheetDescription>
              </SheetHeader>
                <AccountForm
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaultValues={defaultValues}
                />
          </SheetContent>
      </Sheet>
  )
}