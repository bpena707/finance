'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useNewAccount} from "@/features/hooks/use-new-account";


const AccountsPage = () => {
    const newAccount = useNewAccount()
  return (
      <div className='max-w-2xl mx-auto w-full pb-10 -mt-24'>
          <Card className='border-none drop-shadow-sm'>
              <CardHeader className='gap-y-2 lg:flex-row lg:justify-between'>
                  <CardTitle className='text-xl line-clamp-1'>
                      Accounts Page
                  </CardTitle>
                  <Button
                      onClick={newAccount.onOpen}
                      size='sm'
                  >
                      <Plus className='size-4 mr-2' />
                      Add new
                  </Button>

              </CardHeader>
              <CardContent>
                  <p>Card Content</p>
              </CardContent>
              <CardFooter>
                  <p>Card Footer</p>
              </CardFooter>
          </Card>

      </div>
  )
}

export default AccountsPage