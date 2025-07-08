import { customerManagementStore } from "@/app/stores/customerManagementStore";
import { formaterDate } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  BanknoteArrowUp,
  BanknoteX,
  CreditCard,
  HandCoins,
  Mail,
  MapPinHouse,
  MessageCircle,
  Phone,
  ShoppingCart,
  SquareUser,
  Wallet,
} from "lucide-react";
import { useCustomerStore } from "@/app/stores/customers/customerStore";
import { useNavigate } from "react-router-dom";

export const ServiceDetails = () => {
  const { selectedService, setIsOpenManagement } = customerManagementStore();
  const {fetchCustomerByDocument} = useCustomerStore()
  const navigate = useNavigate()

  const isExpiring = selectedService.purchase.days_remaining < 10;
  const borderColor = isExpiring ? "border-destructive" : "border-primary";
  const backgroundColor = isExpiring ? "bg-destructive" : "bg-primary";

  const handleNewPurchaseWithCustomer = async () => {
    try{
      await fetchCustomerByDocument(selectedService.customer.customer_document);
      navigate(`/nueva-compra/${selectedService.customer.customer_document}`);
    }catch (error) {
      console.error("Error al crear una nueva compra con el cliente:", error);
      // Aquí podrías mostrar un mensaje de error al usuario si es necesario
    }
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-8 gap-5 w-full overflow-y-auto p-2">
      <article
        className={`col-span-1 lg:col-span-2 xl:col-span-2 border-t-4 ${borderColor} rounded shadow p-4`}
      >
        <header className="mb-4">
          <p className="text-xs text-muted-foreground">
            {selectedService.customer.branch_name}
          </p>
          <h2 className="font-medium text-lg">
            {selectedService.customer.customer_full_name}
          </h2>
        </header>

        <address className="grid grid-cols-2 not-italic text-xs">
          <div className="text-muted-foreground space-y-2">
            <InfoLabel icon={<Phone className="h-4 w-4" />} text="Teléfono" />
            <InfoLabel icon={<Mail className="h-4 w-4" />} text="Correo" />
            <InfoLabel icon={<MapPinHouse className="h-4 w-4" />} text="Dirección" />
            <InfoLabel icon={<SquareUser className="h-4 w-4" />} text="Documento" />
          </div>
          <div className="space-y-2 font-medium">
            <p>{selectedService.customer.phone_number}</p>
            <p className="truncate">{selectedService.customer.email}</p>
            <p className="truncate">{selectedService.customer.home_address}</p>
            <p>{selectedService.customer.customer_document}</p>
          </div>
        </address>

        <div className="flex justify-end items-end py-4 gap-2">
          <Button onClick={() => setIsOpenManagement()} className="rounded-full" variant="outline" size="icon">
            <MessageCircle />
          </Button>
          <Button 
            onClick={handleNewPurchaseWithCustomer}
            className="rounded-full" 
            variant="default" 
            size="icon">
            <ShoppingCart />
          </Button>
        </div>
      </article>

      <article
        className={`col-span-1 lg:col-span-2 xl:col-span-2 border-t-4 ${borderColor} rounded shadow`}
      >
        <header className="flex items-center justify-between p-4 mb-4">
          <div>
            <h2 className="font-bold text-lg">Seguimiento</h2>
            <p className="text-xs text-muted-foreground">
              Fecha: {formaterDate(selectedService.purchase.purchase_date)}
            </p>
          </div>
          <div className={`h-12 w-8 rounded text-center text-white ${backgroundColor}`}>
            <span className="text-xl block">{selectedService.purchase.days_remaining}</span>
            <p className="text-xs">Días</p>
          </div>
        </header>

        <Separator />

        <dl className="grid grid-cols-2 gap-y-2 p-4 text-xs">
          <div className="text-muted-foreground space-y-2">
            <InfoLabel icon={<HandCoins className="h-4 w-4" />} text="Estado pago" />
            <InfoLabel icon={<CreditCard className="h-4 w-4" />} text="Tipo pago" />
            <InfoLabel icon={<BanknoteX className="h-4 w-4" />} text="Subtotal sin IVA" />
            <InfoLabel icon={<BanknoteArrowUp className="h-4 w-4" />} text="Total con IVA" />
          </div>
          <div className="space-y-2 font-medium">
            <p>{selectedService.purchase.payment_status}</p>
            <p className="truncate">{selectedService.purchase.payment_type}</p>
            <p className="truncate">{formatCurrency(selectedService.purchase.subtotal_without_vat)}</p>
            <p>{formatCurrency(selectedService.purchase.total)}</p>
          </div>
        </dl>
      </article>

      <article
        className={`col-span-1 lg:col-span-4 xl:col-span-4 border-t-4 ${borderColor} rounded shadow`}
      >
        <div className="p-2">
          <header className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Ventas totales</h2>
            <Badge
              variant="outline"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <Wallet className="h-4 w-4" />
              {formatCurrency(selectedService.last_purchases.historical_purchases)}
            </Badge>
          </header>

          <ScrollArea className="h-[200px] px-2">
            <Accordion type="single" collapsible className="w-full">
              {selectedService.last_purchases.purchases.map((purchase) => (
                <AccordionItem key={purchase.id_purchase} value={purchase.id_purchase}>
                  <AccordionTrigger className="flex items-center justify-start">
                    <span>{formaterDate(purchase.purchase_date)}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(purchase.total_purchase)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-wrap gap-2">
                    {purchase.products.map((product) => (
                      <Badge key={product.id_product} variant="outline">
                        <span>{product.product_name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {product.unit_quantity}
                        </span>
                      </Badge>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
      </article>
    </section>
  );
};

const InfoLabel = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <p className="flex items-center gap-2">{icon}{text}</p>
);
