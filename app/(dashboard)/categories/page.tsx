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
import {Loader2, Plus} from "lucide-react";
import {useNewAccount} from "@/features/hooks/use-new-account";
import {columns} from "@/app/(dashboard)/accounts/columns";
import {useGetAccounts} from "@/features/accounts/api/use-get-accounts";
import {Skeleton} from "@/components/ui/skeleton";
import {useBulkDeleteAccounts} from "@/features/accounts/api/use-bulk-delete";


const CategoriesPage = () => {
    const newAccount = useNewAccount()
    const accountsQuery = useGetAccounts()
    const accounts = accountsQuery.data || []
    const deleteAccounts = useBulkDeleteAccounts()

    const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending

    if(accountsQuery.isLoading){
        return (
            <div>
                <Card className='w-full pb-10'>
                    <CardHeader className='gap-y-2 lg:flex-row lg:justify-between'>
                        <Skeleton className='h-8 w-48' />
                    </CardHeader>
                    <CardContent>
                        <div className='h-[500px] w-full flex items-center'>
                            <Loader2 className='size-6 text-slate-300 animate-spin' />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
      <div className='max-w-2xl mx-auto w-full pb-10 -mt-24'>
          <Card className='border-none drop-shadow-sm'>
              <CardHeader className='gap-y-2 lg:flex-row lg:justify-between'>
                  <CardTitle className='text-xl line-clamp-1'>
                      Categories Page
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
                  <DataTable
                      columns={columns}
                      data={accounts}
                      filterKey='email'
                      onDelete={(row) => {
                          const ids = row.map((r) => r.original.id)
                          deleteAccounts.mutate({ids})
                      }}
                      disabled={isDisabled}/>
              </CardContent>
              <CardFooter >
                  <p>Card Footer</p>
              </CardFooter>
          </Card>

      </div>
  )
}

export default CategoriesPage