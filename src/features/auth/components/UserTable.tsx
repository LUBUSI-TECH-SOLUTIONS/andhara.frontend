import { useRegisterStore } from "@/app/stores/registerStore"
import { useEffect } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

const UserTable = () => {
  const { getUsers, users, isLoading } = useRegisterStore()
  useEffect(() => {
    getUsers()
  }, [getUsers])

  return (
    <Table className="container h-full w-full overflow-hidden">
      <TableCaption>Lista de usuarios</TableCaption>
      <TableHeader>
        <TableRow>
          {isLoading ? (
            <Skeleton className="h-4 w-1/3" />
          ) : (
            <>
              <TableHead className="text-left font-semibold">Correo</TableHead>
              <TableHead className="text-left font-bold">Rol</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user) => (
          isLoading ? (
            <TableRow key={user.id}>
              <TableCell>
                <Skeleton className="h-4 w-1/3" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-1/3" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-1/3" />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell >
                {user.role}
              </TableCell>
              <TableCell className="text-center">
              </TableCell>
            </TableRow>
          )
        ))}
      </TableBody>
    </Table>
  )
}

export default UserTable