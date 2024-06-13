import * as yup from "yup";

export const emprestimo = yup.object().shape({
  cpf: yup
    .string()
    .required("Informe um CPF válido")
    .min(14, "O CPF precisa ter pelo menos 11 digitos"),
  nome: yup
    .string()
    .required("O nome do cliente é obrigatório")
    .matches(/\S/, "O campo não pode conter apenas espaços em branco"),
  cep: yup.string().required("O CEP é obrigatório"),
  logradouro: yup.string().required("O logradouro é obrigatório"),
  cidade: yup.string().required("A cidade é obrigatória"),
  bairro: yup.string().required("O bairro é obrigatório"),
  uf: yup.string().required("A UF é obrigatória"),
  telefone: yup.string().required("Informe um telefone válido"),
});
