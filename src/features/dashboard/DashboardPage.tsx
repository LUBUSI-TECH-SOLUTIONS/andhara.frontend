import { useCustomerStore } from "@/app/stores/customers/customerStore";
import { customerManagementStore } from "@/app/stores/customerManagementStore";
import { CustomerDialog } from "@/features/customer/components/customerDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Plus, ShoppingCart } from "lucide-react";
import { ServiceTable } from "@/features/dashboard/components/serviceTable";
import { ServiceDetails } from "@/features/dashboard/components/serviceTable/serviceDetails";
import { SkeletonServiceTable } from "@/features/dashboard/components/serviceTable/skeleton";
import { ManagementDialog } from "@/features/dashboard/components/managmeService/managmeDialog";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { selectedService, isLoading } = customerManagementStore();
  const { openNewDialog } = useCustomerStore();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Dashboard</CardTitle>
        <CardDescription className="text-sm">
          Aquí puedes gestionar tus ventas y clientes.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading
          ? <SkeletonServiceTable />
          : selectedService.id_customer_service && <ServiceDetails />}
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-2 py-4">
          <Button
            onClick={() => navigate("/nueva-compra")}
            variant="default"
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Nueva Venta
          </Button>

          <Button variant="outline" onClick={openNewDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo cliente
          </Button>
          <CustomerDialog />
        </div>
        <ServiceTable />
        {
          selectedService.id_customer_service && <ManagementDialog />
        }
      </CardContent>
    </Card>
  );
};

export default DashboardPage;
