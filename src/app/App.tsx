
import { useAuthCheck } from "@/app/stores/authStore";
import { RouterProvider } from "react-router-dom";
import router from "@/app/routes/routes.tsx";
import { Toaster } from "@/components/ui/sonner";
import { CustomerDialog } from "@/features/customer/components/customerDialog";

const App = () => {
  useAuthCheck()

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        expand={false}
        position="bottom-right"
      />
      <CustomerDialog />

    </>
  );
};

export default App;
