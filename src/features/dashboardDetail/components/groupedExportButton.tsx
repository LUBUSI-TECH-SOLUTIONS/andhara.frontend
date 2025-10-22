import { incomesStore } from "@/app/stores/dashboard_detail/dashboardDetailStore";
import { Button } from "@/components/ui/button";
import { Download} from "lucide-react";

export const ReportsButton = () => {
  const { downoladReport, isLoading } = incomesStore();

  const handleDownloadReport = async () => {
    await downoladReport();
  }

  return (
    <Button
      variant="default"
      onClick={handleDownloadReport}
      disabled={isLoading}
    >
      <Download className="mr-2 h-4 w-4" />
      Descargar Reporte
    </Button>
  )
}