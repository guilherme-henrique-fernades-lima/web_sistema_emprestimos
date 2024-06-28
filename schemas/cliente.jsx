import * as yup from "yup";

export const cliente = yup.object().shape({
  cpf: yup
    .string()
    .required("Informe um CPF válido")
    .min(14, "O CPF precisa ter pelo menos 11 digitos"),
  nome: yup
    .string()
    .required("O nome do cliente é obrigatório")
    .matches(/\S/, "O campo não pode conter apenas espaços em branco"),
  cep: yup
    .string()
    .required("O CEP é obrigatório")
    .test(
      "is-valid-cep",
      "O CEP deve conter exatamente 8 dígitos",
      function (value) {
        if (!value) return false;
        const cleanedValue = value.replace(/\D/g, "");
        return cleanedValue.length === 8;
      }
    ),
  logradouro: yup
    .string()
    .required("O logradouro é obrigatório")
    .matches(/\S/, "O campo não pode conter apenas espaços em branco"),
  cidade: yup
    .string()
    .required("A cidade é obrigatória")
    .matches(/\S/, "O campo não pode conter apenas espaços em branco"),
  bairro: yup
    .string()
    .required("O bairro é obrigatório")
    .matches(/\S/, "O campo não pode conter apenas espaços em branco"),
  uf: yup.string().required("A UF é obrigatória"),
  telefone: yup
    .string()
    .required("Informe um telefone válido")
    .test(
      "is-valid-phone",
      "O CEP deve conter exatamente 8 dígitos",
      function (value) {
        if (!value) return false;
        const cleanedValue = value.replace(/\D/g, "");
        return cleanedValue.length === 11;
      }
    ),
});
