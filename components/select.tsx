//generic reusable select component to list and use to create new items

'use client'

import {useMemo} from "react";
import {SingleValue} from "react-select";
import CreatableSelect from "react-select/creatable";
import {base} from "next/dist/build/webpack/config/blocks/base";

type Props = {
    options?: { label: string; value: string }[];
    value?: string | null | undefined;
    onChange: (value?: string) => void;
    onCreate?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export const Select = ({
        options = [],
        value,
        onChange,
        onCreate,
        disabled,
        placeholder
    }: Props) => {

    const onSelect = (
        option: SingleValue<{ label: string, value: string }>
    ) => {
        onChange(option?.value)
    }

    const formattedValue = useMemo(() => {
        return options.find((option) => option.value === value)
    }, [options, value])


    return(
        <CreatableSelect
            placeholder={placeholder}
            className="text-sm h-10"
            styles={{
                control: base => ({
                    ...base,
                    borderColor: '#e2e8f0',
                    "hover": {
                        borderColor: '#e2e8f0'
                    }
                })
            }}
            value={formattedValue}
            onChange={onSelect}
            options={options}
            onCreateOption={onCreate}
            isDisabled={disabled}
        />
    )
}