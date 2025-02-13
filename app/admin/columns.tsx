import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const createColumns = (type: 'users' | 'groups' | 'resources'): ColumnDef<any>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: type === 'users' ? "email" : "name",
    header: type === 'users' ? "Email" : "Name",
  },
  {
    accessorKey: type === 'users' ? "role" : (type === 'groups' ? "members" : "type"),
    header: type === 'users' ? "Role" : (type === 'groups' ? "Members" : "Type"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id.toString())}>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const columns = {
  users: createColumns('users'),
  groups: createColumns('groups'),
  resources: createColumns('resources'),
}

