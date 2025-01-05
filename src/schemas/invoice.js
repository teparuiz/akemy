const yup = require("yup");

const invoiceSchema = yup.object({
  customer: yup
    .object({
      legal_name: yup.string().required("El nombre es obligatorio."),
      tax_id: yup
        .string()
        .required("El RFC es obligatorio.")
        .length(
          12 || 13,
          "Debe tener 12 carácteres si es persona moral o 13 carácteres si es persona física."
        ),
      address: yup
        .object()
        .shape({
          zip: yup
            .string()
            .required("El código postal es obligatorio.")
            .length(5, "El código postal debe tener 5 carácteres."),
          state: yup.string().required("El estado es obligatorio."),
        })

        .required("La dirección es obligatoria."),
    })
    .required("El cliente es obligatorio."),
  invoice_row_invoice_id: yup.number().nullable(),
  created_at: yup.date().default(() => new Date()),
  status: yup.string().required("El estado es obligatorio."),
  date: yup.date().required("La fecha es obligatoria."),
  type: yup.string().required("El tipo es obligatorio."),
  descripcion: yup.string().nullable(),
  discount: yup.number().min(0).required("El descuento es obligatorio."),
  tax: yup.number().min(0).required("El impuesto es obligatorio."),
  total: yup.number().min(0).required("El total es obligatorio."),
  payment_form: yup.string().required("La forma de pago es obligatoria."),
  uuid: yup.string().uuid("Debe ser un UUID válido.").nullable(),
  currency: yup.string().length(3, "Debe tener 3 caracteres.").nullable(),
  items: yup
    .array()
    .of(
      yup.object().shape({
        quantity: yup.number().min(0).required("La cantidad es obligatoria."),
        price: yup.number().min(0).required("El precio es obligatorio."),
        discount: yup.number().min(0).required("El descuento es obligatorio."),
        description: yup.string().required("La descripción es obligatoria."),
        tax: yup.number().min(0).required("El impuesto es obligatorio."),
        total: yup.number().min(0).required("El total es obligatorio."),
      })
    )
    .required("Los items son obligatorios."),
});

module.exports = invoiceSchema;
