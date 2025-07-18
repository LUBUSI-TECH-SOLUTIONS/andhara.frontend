import { Row } from "@tanstack/react-table"
import { CustomerService } from "@/features/dashboard/types/purchaseTypes"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AlertCircle } from "lucide-react"

interface ServiceTooltipCommentProps {
  row: Row<CustomerService>
}

export const TooltipComment = ({row}: ServiceTooltipCommentProps) => {
  const { contact_comment } = row.original;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AlertCircle className="h-4 w-4 cursor-pointer text-primary" />
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={5} align="end" alignOffset={-5}>
          <span className="font-medium">Comentario</span>
          <p className="text-sm">{contact_comment}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}