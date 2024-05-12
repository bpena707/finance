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
import {insertAccountSchema} from "@/db/schema";

const formSchema = insertAccountSchema.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>

type Props ={
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
}


export const AccountForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={disabled}
                                    placeholder="e.g. Cash, Bank, Credit Card"
                                    {...field} //handles all of the event handlers such as onChange, onBlur, value
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className='w-full' disabled={disabled}>
                    {id ? 'Save' : 'Create'}
                </Button>
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
            </form>
        </Form>
    )
}
