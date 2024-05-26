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
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import {columns} from "@/app/(dashboard)/categories/columns";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import {Skeleton} from "@/components/ui/skeleton";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";


const CategoriesPage = () => {
    const newCategory = useNewCategory()
    const categoriesQuery = useGetCategories()
    const categories = categoriesQuery.data || []
    const deleteCategories = useBulkDeleteCategories()

    const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending

    if(categoriesQuery.isLoading){
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
                      onClick={newCategory.onOpen}
                      size='sm'
                  >
                      <Plus className='size-4 mr-2' />
                      Add new
                  </Button>

              </CardHeader>
              <CardContent>
                  <DataTable
                      columns={columns}
                      data={categories}
                      filterKey='name'
                      onDelete={(row) => {
                          const ids = row.map((r) => r.original.id)
                          deleteCategories.mutate({ids})
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