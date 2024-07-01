import { useState, useEffect } from "react";

//Third party libraries
import moment from "moment";

import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { NumericFormat } from "react-number-format";
import InputMask from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import Link from "next/link";

//Mui components
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

//Custom components
import ContentWrapper from "@/components/templates/ContentWrapper";
import CustomTextField from "@/components/CustomTextField";
import DatepickerFieldWithValidation from "@/components/DatepickerFieldWithValidation";
import BackdropLoadingScreen from "@/components/BackdropLoadingScreen";

//Constants
import { QTD_PARCELAS } from "@/helpers/constants";

//Utils
import { formatarCPFSemAnonimidade } from "@/helpers/utils";

//Icons
import SaveIcon from "@mui/icons-material/Save";

//Schema
import { acordo } from "@/schemas/acordo";

export default function CadastrarAcordo() {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    id,
    nome: nomeQuery,
    cpf: cpfQuery,
    telefone: telefoneQuery,
    vl_emprestimo: vlEmprestimoQuery,
  } = router.query;

  const {
    register,
    setValue,
    reset,
    resetField,
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(acordo),
  });

  //States de formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [vlEmprestimo, setVlEmprestimo] = useState("");
  const [vlJurosAdicional, setVlJurosAdicional] = useState("");
  const [qtParcela, setQtParcela] = useState("");
  const [vlParcela, setVlParcela] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [dtAcordo, setDtAcordo] = useState(null);
  const [dtCobranca, setDtCobranca] = useState(null);
  const [emprestimoReferencia, setEmprestimoReferencia] = useState("");
  const [vlCapitalGiro, setVlCapitalGiro] = useState("");

  //States de controle de UI
  const [loadingButton, setLoadingButton] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  useEffect(() => {
    if (vlJurosAdicional && qtParcela && vlEmprestimo) {
      const valorParcela = Math.ceil(
        (vlEmprestimo + vlJurosAdicional) / qtParcela
      );
      setVlParcela(valorParcela);
      setValue("vl_parcela", valorParcela);
    } else if (!vlJurosAdicional || !vlEmprestimo) {
      setVlParcela("");
      resetField("vl_parcela");
    }
  }, [vlJurosAdicional, qtParcela, vlEmprestimo]);

  useEffect(() => {
    if (vlEmprestimo && qtParcela) {
      const valorCapitalGiro = Math.ceil(vlEmprestimo / qtParcela);

      setVlCapitalGiro(valorCapitalGiro);
      setValue("vl_capital_giro", valorCapitalGiro);
    } else if (!vlEmprestimo || !qtParcela) {
      setVlCapitalGiro("");
      resetField("vl_capital_giro");
    }
  }, [vlEmprestimo, qtParcela]);

  useEffect(() => {
    if (nomeQuery) {
      setNome(nomeQuery);
      setValue("nome", nomeQuery);
    }

    if (cpfQuery) {
      setCpf(cpfQuery);
      setValue("cpf", formatarCPFSemAnonimidade(cpfQuery));
    }

    if (telefoneQuery) {
      setTelefone(telefoneQuery);
      setValue("telefone", telefoneQuery);
    }

    if (id) {
      setEmprestimoReferencia(id);
    }

    if (vlEmprestimoQuery) {
      setVlEmprestimo(vlEmprestimoQuery);
      setValue("vl_emprestimo", vlEmprestimoQuery);
    }
  }, [nomeQuery, cpfQuery, telefoneQuery, id]);

  function getPayload() {
    const payload = {
      cpf: cpf.replace(/\D/g, ""),
      nome: nome.toUpperCase(),
      vl_emprestimo: parseFloat(vlEmprestimo),
      telefone: telefone.replace(/\D/g, ""),
      vl_juros_adicional: parseFloat(vlJurosAdicional),
      qt_parcela: parseInt(qtParcela),
      vl_parcela: parseFloat(vlParcela),
      observacoes: observacoes,
      dt_acordo: dtAcordo ? moment(dtAcordo).format("YYYY-MM-DD") : null,
      emprestimo_referencia: emprestimoReferencia ? emprestimoReferencia : null,
      dt_cobranca: dtCobranca ? moment(dtCobranca).format("YYYY-MM-DD") : null,
      vl_capital_giro: parseInt(vlCapitalGiro),
      status: "andamento",
    };

    return payload;
  }

  async function save() {
    setLoadingButton(true);
    const payload = getPayload();

    const response = await fetch(
      `/api/cadastros/acordo/?id_emprestimo=${id ? id : ""}`,
      {
        method: "POST",
        headers: {
          Authorization: session?.user?.token,
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      toast.success("Operação realizada com sucesso");
      clearStatesAndErrors();
    } else {
      toast.error("Erro na operação");
    }

    setLoadingButton(false);
  }

  const limparParametrosDaUrl = () => {
    router.replace("/cadastros/acordo", undefined, { shallow: true });
  };

  function clearStatesAndErrors() {
    clearErrors();
    reset();
    limparParametrosDaUrl();

    setNome("");
    setCpf("");
    setVlEmprestimo("");
    setVlJurosAdicional("");
    setQtParcela("");
    setVlParcela("");
    setObservacoes("");
    setTelefone("");
    setDtAcordo(null);
    setDtCobranca(null);
    setVlCapitalGiro("");
    setEmprestimoReferencia("");
  }

  return (
    <ContentWrapper title="Cadastrar acordo">
      <Toaster position="bottom-center" reverseOrder={true} />

      <BackdropLoadingScreen open={openBackdrop} />

      {/* {uuid && (
        <Link href="/relatorios/emprestimos">
          <Button variant="outlined" sx={{ mt: 2 }}>
            VOLTAR
          </Button>
        </Link>
      )} */}

      <Grid
        container
        spacing={2}
        sx={{ mt: 1 }}
        component="form"
        onSubmit={handleSubmit(() => {
          save();
        })}
      >
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={nome}
            setValue={setNome}
            label="Cliente"
            placeholder="Insira o nome do cliente"
            validateFieldName="nome"
            control={control}
            lettersAndSpecialChars
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <InputMask
            {...register("cpf")}
            error={Boolean(errors.cpf)}
            mask="999.999.999-99"
            maskChar={null}
            value={cpf}
            onChange={(e) => {
              setCpf(e.target.value);
            }}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                variant="outlined"
                size="small"
                fullWidth
                label="CPF"
                placeholder="000.000.000-000"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                helperText={errors.cpf?.message}
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <InputMask
            {...register("telefone")}
            error={Boolean(errors.telefone)}
            mask="(99) 9 9999-9999"
            maskChar={null}
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                variant="outlined"
                size="small"
                fullWidth
                label="Telefone"
                placeholder="00 00000-0000"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                helperText={errors.telefone?.message}
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="vl_emprestimo"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <NumericFormat
                {...field}
                customInput={TextField}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale={true}
                prefix="R$ "
                onValueChange={(values) => {
                  setVlEmprestimo(values?.floatValue);
                }}
                error={Boolean(errors.vl_emprestimo)}
                size="small"
                label="Valor do empréstimo"
                placeholder="R$ 0,00"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                fullWidth
                inputProps={{ maxLength: 16 }}
              />
            )}
          />

          <Typography
            sx={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: "14px" }}
          >
            {errors.vl_emprestimo?.message}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="vl_juros_adicional"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <NumericFormat
                {...field}
                customInput={TextField}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale={true}
                prefix="R$ "
                onValueChange={(values) => {
                  setVlJurosAdicional(values?.floatValue);
                }}
                error={Boolean(errors.vl_juros_adicional)}
                size="small"
                label="Valor juros adicional"
                placeholder="R$ 0,00"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                fullWidth
                inputProps={{ maxLength: 16 }}
              />
            )}
          />
          <Typography
            sx={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: "14px" }}
          >
            {errors.vl_juros_adicional?.message}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <TextField
            {...register("qt_parcela")}
            error={Boolean(errors.qt_parcela)}
            select
            fullWidth
            label="Qtd. de parcelas"
            size="small"
            value={qtParcela}
            helperText={errors.qt_parcela?.message}
            onChange={(e) => {
              setQtParcela(e.target.value);
            }}
          >
            {QTD_PARCELAS?.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="vl_parcela"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <NumericFormat
                {...field}
                value={vlParcela}
                customInput={TextField}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale={true}
                prefix="R$ "
                onValueChange={(values) => {
                  setVlParcela(values?.floatValue);
                }}
                error={Boolean(errors.vl_parcela)}
                size="small"
                label="Valor da parcela"
                placeholder="R$ 0,00"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                fullWidth
                inputProps={{ maxLength: 16 }}
              />
            )}
          />

          <Typography
            sx={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: "14px" }}
          >
            {errors.vl_parcela?.message}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="vl_capital_giro"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <NumericFormat
                {...field}
                customInput={TextField}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale={true}
                prefix="R$ "
                onValueChange={(values) => {
                  setVlCapitalGiro(values?.floatValue);
                }}
                error={Boolean(errors.vl_capital_giro)}
                size="small"
                label="Valor do capital de giro"
                placeholder="R$ 0,00"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                fullWidth
                inputProps={{ maxLength: 16 }}
              />
            )}
          />

          <Typography
            sx={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: "14px" }}
          >
            {errors.vl_capital_giro?.message}
          </Typography>
        </Grid>

        <Box width="100%" />

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="dt_acordo"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatepickerFieldWithValidation
                label="Data do acordo"
                value={dtAcordo}
                onChange={(newDate) => {
                  field.onChange(newDate);
                  setDtAcordo(newDate);
                }}
                error={error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="dt_cobranca"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatepickerFieldWithValidation
                label="Data da cobrança"
                value={dtCobranca}
                onChange={(newDate) => {
                  field.onChange(newDate);
                  setDtCobranca(newDate);
                }}
                error={error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            multiline
            rows={3}
            size="small"
            label="Observações"
            value={observacoes}
            onChange={(e) => {
              setObservacoes(e.target.value);
            }}
            placeholder="Insira observações se necessário..."
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <LoadingButton
            type="submit"
            variant="contained"
            endIcon={<SaveIcon />}
            disableElevation
            loading={loadingButton}
          >
            CADASTRAR
          </LoadingButton>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
}
