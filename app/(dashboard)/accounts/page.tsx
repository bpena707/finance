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
import {DataTable} from "@/components/ui/data-table";
import {Plus} from "lucide-react";
import {useNewAccount} from "@/features/hooks/use-new-account";
import {Payment, columns} from "@/app/(dashboard)/accounts/columns";

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },

        // ...
    ]
}

const data: Payment[] = [
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "a@example.com",
    },
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
    },
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
    },
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
    },
    // ...
]


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
                  <DataTable columns={columns} data={data} filterKey='email' onDelete={()=>{}} disabled={false}/>
              </CardContent>
              <CardFooter>
                  <p>Card Footer</p>
              </CardFooter>
          </Card>

      </div>
  )
}

export default AccountsPage