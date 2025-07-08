import { AlertCircle, AlertTriangle, XCircle } from "lucide-react";

export const getTooltipContent = (days: number) => {
  const isNegative = days < 0;
  const isUrgent = days >= 0 && days < 10;

  if (isNegative) {
    return (
      <div className="flex items-center gap-2">
        <XCircle className="h-4 w-4" />
        <span className="font-medium text-white">¡CRÍTICO!</span>
        <p className="text-sm text-white">El cliente se ha pasado del plazo en {-days} días</p>
      </div>
    );
  }

  if (isUrgent) {
    return (
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-medium">¡Urgente!</span>
        <p className="text-sm">El cliente necesita ser contactado en {days} días</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      <span className="font-medium">Pendiente</span>
      <p className="text-sm">El cliente necesita ser contactado en {days} días</p>
    </div>
  );
};