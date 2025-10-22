
import { useAuthCheck } from "@/app/stores/authStore";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { CustomerDialog } from "@/features/customer/components/customerDialog";
import router from "@/app/routes/routes.tsx";

const App = () => {
  useAuthCheck()

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        expand={false}
        position="top-center"
      />
      <CustomerDialog />
    </>
  );
};

export default App;
