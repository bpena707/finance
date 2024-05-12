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

export const NewAccountSheet = () => {
    const {isOpen, onClose} = useNewAccount()

  return(
      <Sheet open={isOpen} onOpenChange={onClose} >
          <SheetContent className='space-y-4'>
              <SheetHeader>
                  <SheetTitle>New Account</SheetTitle>
                  <SheetDescription>
                      Create a new account to track your transactions.
                  </SheetDescription>
              </SheetHeader>
                <AccountForm onSubmit={() => {}} disabled={false} />
          </SheetContent>
      </Sheet>
  )
}