import * as yup from "yup";

export const clienteCallCenterSchema = yup.object().shape({
  cpf: yup
    .string()
    .required("Informe um CPF válido")
    .min(14, "O CPF precisa ter pelo menos 11 digitos"),
  telefoneUm: yup.string().required("Informe um telefone válido"),
  nome: yup.string().required("O nome do cliente é obrigatório"),
  convenio: yup.string(),
  especieInss: yup
    .string()
    .nullable()
    .test({
      name: "required-if-convenio-is-5",
      exclusive: true,
      message: "Selecione uma espécie do INSS",
      test: function (value) {
        const { convenio } = this.parent;
        if (convenio === "5") {
          return !!value;
        }
        return true;
      },
    }),
});
