import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {useNewAccount} from "@/features/hooks/use-new-account";
import {AccountForm} from "@/features/accounts/components/account-form";
import {insertAccountSchema} from "@/db/schema";
import {z} from "zod";
import {useCreateAccount} from "@/features/hooks/use-create-account";

const formSchema = insertAccountSchema.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>

export const NewAccountSheet = () => {
    const {isOpen, onClose} = useNewAccount()

    const mutation = useCreateAccount()

    // the mutation hook will handle the form submission. object is used to continue on success and close sheet
    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
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
                    defaultValues={{name: ''}}
                />
          </SheetContent>
      </Sheet>
  )
}