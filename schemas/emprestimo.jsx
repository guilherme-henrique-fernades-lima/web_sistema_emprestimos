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
  vl_emprestimo: yup.string().required("Insira o valor do empréstimo"),
  vl_capital_giro: yup.string().required("Insira o valor do capital de giro"),
  perc_juros: yup.string().required("Insira o percentual(%) de juros"),
  qt_parcela: yup.string().required("Insira a quantidade de parcelas"),
  vl_parcela: yup.string().required("Insira o valor da parcela"),
  dt_cobranca: yup.string().required("Insira a data da cobrança"),
});
