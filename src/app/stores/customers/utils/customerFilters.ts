import { Customer, CustomerTableFilters } from "@/features/customer/types/customerTypes";

export const filterByBranch = (
  customers: Customer[],
  branch: CustomerTableFilters["branch"]
) => {
  let result = [...customers]
  if (branch?.id_branch?.trim()) {
    result = result.filter(c =>
      c.branch?.id_branch
        .toLowerCase()
        .includes(branch.id_branch.toLowerCase())
    )
  }
  if (branch?.branch_name?.trim()) {
    result = result.filter(c =>
      c.branch?.branch_name
        .toLowerCase()
        .includes(branch.branch_name.toLowerCase())
    )
  }
  return result;
}