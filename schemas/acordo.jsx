import * as yup from "yup";
import moment from "moment";

const isValidDate = (value, format) => {
  console.log(`Validando valor: ${value} com formato: ${format}`);
  const isValid = moment(value, format, true).isValid();
  console.log(`Resultado da validação: ${isValid}`);
  return isValid;
};

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
  vl_juros_adicional: yup.string().required("Insira o valor cobrado"),
  qt_parcela: yup.string().required("Insira a quantidade de parcelas"),
  vl_parcela: yup.string().required("Insira o valor da parcela"),
  dt_acordo: yup.string().required("Insira a data do acordo"),
  // .test(
  //   "is-valid-date",
  //   "Insira uma data válida no formato YYYY/MM/DD",
  //   (value) => {
  //     if (!value) return false;
  //     const parsedDate = moment(value).format("YYYY-MM-DD");

  //     console.log(parsedDate);
  //     return isValid(parsedDate);
  //   }
  // ),
  dt_cobranca: yup
    .string()
    .required("Insira a data do acordo")
    .test(
      "is-valid-date",
      "Insira uma data válida no formato YYYY-MM-DD",
      (value) => {
        const formattedValue = moment(value).format("YYYY-MM-DD");
        return isValidDate(formattedValue, "YYYY-MM-DD");
      }
    ),
});
