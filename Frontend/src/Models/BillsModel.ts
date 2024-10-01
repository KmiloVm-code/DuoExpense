export interface Bill {
  id_gasto?: number;
  id_usuario?: string;
  concepto?: string;
  fecha?: string;
  descripcion?: string;
  id_metodo_pago?: number;
  id_tarjeta?: number | null;
  cuotas?: number | null;
  valor?: number;
  gasto_fijo?: boolean;
  id_categoria?: number;
  empresa?: string;
}
