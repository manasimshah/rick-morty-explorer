import {
    type ColumnDef,
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";
import type { RMCharacter } from "../api";
import { Link } from "@tanstack/react-router";

type Props = { data: RMCharacter[] };

const columns: ColumnDef<RMCharacter>[] = [
    {
        header: "Avatar",
        accessorKey: "image",
        cell: ({ getValue, row }) => (
            <Link to="/character/$id" params={{ id: String(row.original.id) }}>
                <img
                    src={String(getValue())}
                    style={{ width: 40, height: 40, borderRadius: 8 }}
                    alt={row.original.name}
                    loading="lazy"
                />
            </Link>
        ),
        size: 60,
    },
    {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => (
            <Link to="/character/$id" params={{ id: String(row.original.id) }}>
                {row.original.name}
            </Link>
        ),
    },
    { header: "Status", accessorKey: "status" },
    { header: "Species", accessorKey: "species" },
    { header: "Origin", accessorFn: (r) => r.origin?.name ?? "-" },
];

export default function CharacterTable({ data }: Props) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table className="w-full border border-gray-200 rounded shadow bg-white">
            <thead className="bg-gray-100">
                {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                        {hg.headers.map((h) => (
                            <th key={h.id} className="p-3 text-left border-b font-medium text-gray-600">
                                {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row, i) => (
                    <tr
                        key={row.id}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-indigo-50"}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="p-3 border-b text-sm text-gray-700">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>

    );
}
