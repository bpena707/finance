'use client'

import {useMemo} from "react";
import {SingleValue} from "react-select";
import CreatableSelect from "react-select/creatable";

type Props = {
    options: { label: string; value: string }[];
    value: string | null | undefined;
    onChange: (value: string) => void;
    onCreate?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}