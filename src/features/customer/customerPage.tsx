import { CostumerTable } from "@/features/customer/customerTable";
import { CustomersFilters } from "@/features/customer/components/custumerFilters";
import { ProductTableToolbar } from "@/features/customer/components/customerTableToolbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/features/customer/components/pagination"
import { CustomerSheet } from "@/features/customer/components/customerSheet";


const CustomerPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Clientes</CardTitle>
      </CardHeader>
      <CardContent className="grid">
        <CustomersFilters />
        <ProductTableToolbar />
        <CostumerTable />
        <Pagination />
        <CustomerSheet />
      </CardContent>
    </Card>
  );
}

export default CustomerPage;