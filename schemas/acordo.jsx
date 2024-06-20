import * as yup from "yup";

export const acordo = yup.object().shape({
  cpf: yup
    .string()
    .required("Informe um CPF válido")
    .min(14, "O CPF precisa ter pelo menos 11 digitos"),
  nome: yup
    .string()
    .required("O nome do cliente é obrigatório")
    .matches(/\S/, "O campo não pode conter apenas espaços em branco"),
  telefone: yup.string().required("Informe um telefone válido"),
  vl_emprestimo: yup.string().required("Insira o valor do empréstimo"),
  vl_cobrado: yup.string().required("Insira o valor cobrado"),
  qt_parcela: yup.string().required("Insira a quantidade de parcelas"),
  //vl_parcela: yup.string().required("Insira o valor da parcela"),
  dt_acordo: yup.string().required("Insira a data do acordo"),
});
