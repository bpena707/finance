import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {useNewCategory} from "@/features/categories/hooks/use-new-category";
import {CategoryForm} from "@/features/categories/components/category-form";
import {insertCategorySchema} from "@/db/schema";
import {z} from "zod";
import {useCreateCategory} from "@/features/categories/api/use-create-category";

const formSchema = insertCategorySchema.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>

export const NewCategorySheet = () => {
    const {isOpen, onClose} = useNewCategory()

    const mutation = useCreateCategory()

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
                  <SheetTitle>New Category</SheetTitle>
                  <SheetDescription>
                      Create a new category to organize transactions.
                  </SheetDescription>
              </SheetHeader>
                <CategoryForm
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaultValues={{name: ''}}
                />
          </SheetContent>
      </Sheet>
  )
}