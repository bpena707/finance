import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

type Props = {
    headers: string[];
    body: string[][];
    selectedColumns: Record<string, string | null>
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void
}

export const ImportTable = ({
    headers,
    body,
    selectedColumns,
    onTableHeadSelectChange
}: Props) => {
    return (
        <div className='rounded-md border overflow-hidden'>
            <Table>
                <TableHeader className='bg-muted'>
                    <TableRow>
                        {/*skip item and just use index*/}
                        {headers.map((_item, index) => (
                            <TableHead key={index}>
                                {index}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body.map((row: string[], index) => (
                        <TableRow key={index}>
                            {row.map((cell, index) => (
                                <TableCell key={index}>
                                    {cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
