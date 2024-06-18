//Mui components
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

//Third libs
import moment from "moment";

export function formatarData(data) {
  const partes = data.split("-");
  const ano = partes[0];
  const mes = partes[1];
  const dia = partes[2];
  const dataFormatada = `${dia}/${mes}/${ano}`;
  return dataFormatada;
}

export function formatarValorBRL(valor) {
  const options = {
    style: "currency",
    currency: "BRL",
  };
  const valorFormatado = valor.toLocaleString("pt-BR", options);
  return valorFormatado;
}

export function formatarCPFSemAnonimidade(cpf) {
  // Remove todos os caracteres que não sejam números
  cpf = cpf.replace(/\D/g, "");

  // Aplica a formatação
  cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

  return cpf;
}

export function formatarTelefone(telefone) {
  // Removendo caracteres não numéricos do telefone
  const numeroLimpo = telefone.replace(/\D/g, "");

  if (!telefone) {
    return "";
  }

  // Verificando se o número tem 11 dígitos (incluindo o DDD)
  if (numeroLimpo.length === 11) {
    // Formato com DDD, 9 e 4 primeiros dígitos após o DDD
    return `${numeroLimpo.slice(0, 2)} ${numeroLimpo.slice(
      2,
      3
    )} ${numeroLimpo.slice(3, 7)}-${numeroLimpo.slice(7)}`;
  } else if (numeroLimpo.length === 10) {
    // Formato com DDD e 4 primeiros dígitos após o DDD
    return `${numeroLimpo.slice(0, 2)} ${numeroLimpo.slice(
      2,
      6
    )}-${numeroLimpo.slice(6)}`;
  } else {
    // Caso não corresponda a nenhum padrão conhecido, retornar o número original
    return telefone;
  }
}

export function converterDataParaJS(dataNoFormatoYYYYMMDD) {
  const partesDaData = dataNoFormatoYYYYMMDD.split("-");
  const ano = parseInt(partesDaData[0]);
  const mes = parseInt(partesDaData[1]) - 1;
  const dia = parseInt(partesDaData[2]);

  return new Date(ano, mes, dia);
}

export function formatarCEP(cep) {
  cep = cep.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
  if (cep.length === 8) {
    cep = cep.replace(/(\d{5})(\d{3})/, "$1-$2"); // Formata o CEP no padrão xxxxx-xxx
    return cep;
  } else {
    return "CEP inválido";
  }
}

export function formatarReal(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarDataComHora(date) {
  return moment(date).format("DD/MM/YYYY - HH:mm");
}

export function formatarPorcentagem(valor) {
  const numero = parseFloat(valor);
  if (isNaN(numero)) {
    return "Valor inválido";
  }
  return numero.toLocaleString("pt-BR", {
    style: "percent",
    minimumFractionDigits: 0,
  });
}

export function renderStatusPagamento(status) {
  if (status === "pendente" || !status) {
    return (
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          display: "inline-block",
          padding: "2px 4px",
          color: "#fff",
          backgroundColor: "#9e9e9e",
        }}
      >
        PENDENTE
      </Typography>
    );
  } else if (status === "pago") {
    return (
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          display: "inline-block",
          padding: "2px 4px",
          color: "#fff",
          backgroundColor: "#009d1a",
        }}
      >
        PAGO
      </Typography>
    );
  } else {
    return status;
  }
}

export function renderSituacaoParcela(today, dateToVerify) {
  var DATA_VERIFY = moment(dateToVerify).format("YYYY-MM-DD");

  if (moment(DATA_VERIFY).isBefore(today)) {
    return (
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          display: "inline-block",
          padding: "2px 4px",
          color: "#fff",
          backgroundColor: "#d51d1d",
        }}
      >
        ATRASADA
      </Typography>
    );
  } else if (moment(DATA_VERIFY).isSame(today)) {
    return (
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,

          display: "inline-block",
          padding: "2px 4px",
          color: "#fff",
          backgroundColor: "#9e9e9e",
        }}
      >
        VENCIMENTO HOJE
      </Typography>
    );
  } else if (moment(DATA_VERIFY).isAfter(today)) {
    return (
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,

          display: "inline-block",
          padding: "2px 4px",
          color: "#fff",
          backgroundColor: "#009d1a",
        }}
      >
        EM DIAS
      </Typography>
    );
  }
}
