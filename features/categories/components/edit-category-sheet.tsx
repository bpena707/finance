import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,} from "@/components/ui/sheet"
import {CategoryForm} from "@/features/categories/components/category-form";
import {insertCategorySchema} from "@/db/schema";
import {z} from "zod";
import {useOpenCategory} from "@/features/categories/hooks/use-open-category";
import {useGetCategory} from "@/features/categories/api/use-get-category";
import {Loader2} from "lucide-react";
import {useEditCategory} from "@/features/categories/api/use-edit-category";
import {useDeleteCategory} from "@/features/categories/api/use-delete-category";
import {useConfirm} from "@/hooks/use-confirm";

const formSchema = insertCategorySchema.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>

export const EditCategorySheet = () => {
    const {isOpen, onClose, id} = useOpenCategory()

    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure you want to delete this category?',
        "You are about to delete a category. This action cannot be undone."
    )

    const categoryQuery = useGetCategory(id)
    const editMutation = useEditCategory(id)
    const deleteMutation = useDeleteCategory(id)

    const isPending = editMutation.isPending || deleteMutation.isPending

    const isLoading = categoryQuery.isLoading

    // the mutation hook will handle the form submission. object is used to continue on success and close sheet
    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    // the default values are set to the account name if the account exists
    const defaultValues = categoryQuery.data ? {
        name: categoryQuery.data.name
    } :{
        name: ''
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
                      <SheetTitle>Edit Category</SheetTitle>
                      <SheetDescription>
                          Edit an existing category
                      </SheetDescription>
                  </SheetHeader>
                  {isLoading ? (
                      <div className='absolute inset-0 flex items-center'>
                          <Loader2 className='size-4 text-muted-foreground animate-spin' />
                      </div>
                  ) : (
                      <CategoryForm
                          id={id}
                          onSubmit={onSubmit}
                          disabled={isPending}
                          defaultValues={defaultValues}
                          onDelete={onDelete}
                      />
                  )
                  }
              </SheetContent>
          </Sheet>
      </>
  )
}