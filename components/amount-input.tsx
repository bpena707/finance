import CurrencyInput from "react-currency-input-field";
import {Info, MinusCircle, PlusCircle} from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {parse} from "date-fns";
import {cn} from "@/lib/utils";


type Props = {
    value: string
    onChange: (value: string | undefined) => void
    disabled?: boolean
    placeholder?: string
}

export const AmountInput = ({
    value,
    onChange,
    disabled,
    placeholder,
}: Props) => {
    //the parsed value is used to determine if the value is an income or expense based on if greater than or less than 0
    const parsedValue = parseFloat(value)
    const isIncome = parsedValue > 0
    const isExpense = parsedValue < 0

    //this function is used to reverse the value from a negative to positive or positive to negative so that user can easily switch between income and expense
    const onReverseValue = () => {
        if (!value) return
        const newValue = parseFloat(value) * -1
        onChange((parseFloat(value) * -1).toString())

    }

    return (
        <div className='relative'>
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <button
                            type='button'
                            onClick={onReverseValue}
                            className={cn(
                                "bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition",
                                isIncome && 'bg-emerald-500 hover:bg-emerald-600',
                                isExpense && 'bg-rose-500 hover:bg-rose-600',

                            )}
                        >
                            {!parsedValue && <Info className='size-3 text-white' />}
                            {isIncome && <PlusCircle className='size-3 text-white' />}
                            {isExpense && <MinusCircle className='size-3 text-white' />}

                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Use [+] to add income and [-] to add expenses
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput
                placeholder={placeholder}
                className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={value}
                decimalScale={2}
                decimalsLimit={2}
                onValueChange={onChange}
                disabled={disabled}
                prefix="$"
            />
            <p className='text-xs text-muted-foreground mt-2'>
                {isIncome && "Income"}
                {isExpense && "Expense"}
            </p>
        </div>

    )
}