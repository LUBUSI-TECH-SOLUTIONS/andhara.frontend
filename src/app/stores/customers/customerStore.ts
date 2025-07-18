import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createCoreSlice, CustomerCoreSlice } from "@/app/stores/customers/slices/customerCoreSlice";
import { createFilterSlice, CustomerFiltersSlice } from "@/app/stores/customers/slices/customerFIltersSlice";
import { createPaginationSlice, CustomerPaginationSlice } from "@/app/stores/customers/slices/customerPaginationSlice";
import { createDialogSlice, CustomerDialogSlice } from "@/app/stores/customers/slices/customerDialogSlice";
import { createActionsSlice, CustomerActionsSlice } from "@/app/stores/customers/slices/customerActionsSlice";

export type CustomerStore = CustomerCoreSlice &
  CustomerFiltersSlice &
  CustomerPaginationSlice &
  CustomerDialogSlice &
  CustomerActionsSlice;

export const useCustomerStore = create<CustomerStore>()(
  devtools((...a) => ({
    ...createCoreSlice(...a),
    ...createFilterSlice(...a),
    ...createPaginationSlice(...a),
    ...createDialogSlice(...a),
    ...createActionsSlice(...a)
  }))
)