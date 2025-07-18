import { Branch } from "@/features/customer/types/customerTypes";

export interface Department {
  id_departament: string;
  departamnet_name: string;
}

export const departmentStatic: Department[] = [
  { id_departament: "0e939e27-4a74-4b2f-8d98-e64151b6f643", departamnet_name: "Cesar" },
  { id_departament: "ef8bb068-b929-422c-876f-07a4ebfc855f", departamnet_name: "Cundinamarca" },
  { id_departament: "fbe8ffca-6b52-4148-91af-d5dbdf566775", departamnet_name: "Valle del Cauca" },
];

export interface City {
  id_city: string;
  id_department: string;
  city_name: string;
}

export const cityStatic: City[] = [
  { id_city: "29e859fd-90ca-4f21-9989-b7746368ae19", id_department: "0e939e27-4a74-4b2f-8d98-e64151b6f643", city_name: "Valledupar" },
  { id_city: "3fb4c103-be97-4743-8b33-2b4f8076da15", id_department: "ef8bb068-b929-422c-876f-07a4ebfc855f", city_name: "Bogota D.C," },
  { id_city: "aae64782-7591-43b8-a5c2-75707be424fb", id_department: "fbe8ffca-6b52-4148-91af-d5dbdf566775", city_name: "Palmira" },
];


export type DocumentType = 'CC' | 'TI' | 'CE' | 'PASS' | 'NIT' | 'all';
  
export const branchesStatic: Branch[] = [
  { id_branch: "885d040f-272c-43f4-b5e3-33cbc7692fd0", branch_name: "Sede Valledupar", manager_name: "Carlos Méndez", branch_address: "calle 73 a #17a - 20", city_name: "Valledupar", department_name: "Cesar" },
  { id_branch: "90a2fc99-1ada-4797-b6c0-b132c5430f90", branch_name: "Sede Bogota", manager_name: "Carlos Méndez", branch_address: "calle 73 a #17a - 20", city_name: "Bogota D.C,", department_name: "Cundinamarca" },
  { id_branch: "fffe60df-52d8-4717-949e-58ed108f998e", branch_name: "Sede Palmira", manager_name: "Carlos Méndez", branch_address: "calle 73 a #17a - 20", city_name: "Palmira", department_name: "Valle del Cauca" },
];

export interface Supplier {
  id: string;
  supplier_name: string;
}

export const supplierStatic: Supplier[] = [
  { id: "46f5570f-2e8e-485a-aff0-6be65e64fc4d", supplier_name: "Bioralfa" },
  { id: "578687aa-134a-42a3-822f-52f7365b2fb7", supplier_name: "IPCA" },
  { id: "8881a754-bcc1-4264-ab8e-c4ada2e5835a", supplier_name: "USA" },
  { id: "b756839d-0dc4-4b8d-b68c-24b7c8e13151", supplier_name: "Pharmalab" },
  { id: "b9808fb2-a041-46f4-9487-e9f8c6f293dc", supplier_name: "Forever" }
];

export const typesDocument = [
  { id: 'CC', name: 'Cédula de Ciudadanía' },
  { id: 'TI', name: 'Tarjeta de Identidad' },
  { id: 'CE', name: 'Cédula de Extranjería' },
  { id: 'PASS', name: 'Pasaporte' },
  { id: 'NIT', name: 'Número de Identificación Tributaria' },
]

export type LocationName = "Sede Valledupar" | "Sede Bogota" | "Sede Palmira"
export interface BranchInter {
  id_branch: string
  name: LocationName
}

export const BRANCHES: BranchInter[] = [
  { id_branch: "885d040f-272c-43f4-b5e3-33cbc7692fd0", name: "Sede Bogota" },
  { id_branch: "90a2fc99-1ada-4797-b6c0-b132c5430f90", name: "Sede Valledupar" },
  { id_branch: "fffe60df-52d8-4717-949e-58ed108f998e", name: "Sede Palmira" },
]


export const DELIVERY_TYPES = [
  { name: "Recoger en Sede" },
  { name: "Domicilio Bogotá" },
  { name: "Servientrega" },
  { name: "Rappi" },
  { name: "Otro" } 
]

export const PAYMENT_TYPES = [
  { name: "Efectivo" },
  { name: "Transferencia" },
  { name: "Datafono" },
  { name: "Nequi / Daviplata" },
  { name: "Otro" } 
]

export const PAYMENT_STATUS = [
  { name: "Pago Pendiente" },
  { name: "Pago Completado" },
  { name: "En Proceso" },
]