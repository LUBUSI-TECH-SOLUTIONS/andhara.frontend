import { useRegisterStore } from "@/app/stores/registerStore"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash } from "lucide-react"

interface DeleteUserProps {
  userId: string
}

export const DeleteUser = ({userId}: DeleteUserProps) =>{
  const { success, deleteUser, isLoading, error } = useRegisterStore()
  const handleDelete = () => {
    try {
      deleteUser(userId)
      if (success) {
        toast.success(success, {
          duration: 3000,
        })
      }
      if (error) {
        toast.error(error, {
          duration: 3000,
        })
      }
    }catch (error) {
      toast.error("Error deleting user", {
        duration: 3000,
      })
      console.error("Error deleting user:", error)
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
          <Trash className="h-4 w-4 text-destructive"/>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isLoading}
          >Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
