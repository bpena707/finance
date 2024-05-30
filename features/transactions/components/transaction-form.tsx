'use client'

import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {zodResolver} from "@hookform/resolvers/zod";
import {insertAccountSchema, insertTransactionSchema} from "@/db/schema";
import {Select} from "@/components/select";

const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional(),
})

const apiSchema = insertTransactionSchema.omit({
    id:true
})

// two types of form values for specific values and the regular values from insert
type FormValues = z.input<typeof formSchema>
type ApiFormValues = z.input<typeof apiSchema>

type Props ={
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    accountOptions: {label: string, value: string}[]
    categoryOptions: {label: string, value: string}[]
    onCreateAccount: (name: string) => void
    onCreateCategory: (name: string) => void
}

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory
}: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const handleSubmit = (values: FormValues) => {
        console.log({ values })
    }

    const handleDelete = () => {
        onDelete?.()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account</FormLabel>
                            <FormControl>
                                <Select
                                    options={accountOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onCreate={onCreateAccount}
                                    placeholder="Select an account"
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className='w-full' disabled={disabled}>
                    {id ? 'Save changes' : 'Create account'}
                </Button>
                {id && (
                    <Button
                        type='button'
                        disabled={disabled}
                        onClick={handleDelete}
                        className='w-full'
                        variant='outline'
                    >
                        <Trash className='size-4 mr-2' />
                        Delete Account
                    </Button>
                )}
            </form>
        </Form>
    )
}
