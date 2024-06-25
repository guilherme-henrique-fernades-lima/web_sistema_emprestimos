import { useState, useEffect } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { NumericFormat } from "react-number-format";
import InputMask from "react-input-mask";
import moment from "moment";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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
import BackdropLoadingScreen from "@/components/BackdropLoadingScreen";
import DatepickerFieldWithValidation from "@/components/DatepickerFieldWithValidation";

//Constants
import { QTD_PARCELAS } from "@/helpers/constants";

//Utils
import {
  converterDataParaJS,
  formatarCPFSemAnonimidade,
} from "@/helpers/utils";

//Icons
import SaveIcon from "@mui/icons-material/Save";

//Schema
import { emprestimo } from "@/schemas/emprestimo";

export default function CadastrarEmprestimo() {
  const { data: session } = useSession();

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
    resolver: yupResolver(emprestimo),
  });

  //States de formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [vlEmprestimo, setVlEmprestimo] = useState("");
  const [vlCapitalGiro, setVlCapitalGiro] = useState("");
  const [percJuros, setPercJuros] = useState("");
  const [qtParcela, setQtParcela] = useState("");
  const [telefone, setTelefone] = useState("");
  const [vlParcela, setVlParcela] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [dtCobranca, setDtCobranca] = useState(null);
  const [dtEmprestimo, setDtEmprestimo] = useState(null);
  const [valorJuros, setValorJuros] = useState("");

  //States de controle de UI
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    //Calcular o capital de giro automaticamente
    if (vlEmprestimo && qtParcela) {
      const valorCapitalGiro = vlEmprestimo / qtParcela;
      setValue("vl_capital_giro", valorCapitalGiro);
      setVlCapitalGiro(valorCapitalGiro);
    } else if (!vlEmprestimo || !qtParcela) {
      resetField("vl_capital_giro");
      setVlCapitalGiro("");
    }
  }, [vlEmprestimo, qtParcela]);

  useEffect(() => {
    //Calcular o valor da parcela automaticamente
    if (vlCapitalGiro && valorJuros) {
      const valorParcela = valorJuros + vlCapitalGiro;
      setVlParcela(valorParcela);
      setValue("vl_parcela", valorParcela);
    } else if (!valorJuros || !vlCapitalGiro) {
      resetField("vl_parcela");
      setVlParcela("");
    }
  }, [vlCapitalGiro, valorJuros]);

  useEffect(() => {
    //Calcular o valor do juros automaticamente
    if (vlEmprestimo && percJuros) {
      const valorJuros = percJuros * vlEmprestimo;
      setValorJuros(valorJuros);
    } else if (!vlEmprestimo || !percJuros) {
      setValorJuros("");
    }
  }, [vlEmprestimo, percJuros]);

  function getPayload() {
    const payload = {
      cpf: cpf.replace(/\D/g, ""),
      nome: nome.toUpperCase(),
      telefone: telefone.replace(/\D/g, ""),
      vl_emprestimo: parseFloat(vlEmprestimo),
      vl_capital_giro: parseFloat(vlCapitalGiro),
      perc_juros: parseFloat(percJuros),
      qt_parcela: parseInt(qtParcela),
      vl_parcela: parseFloat(vlParcela),
      observacoes: observacoes,
      dt_emprestimo: dtEmprestimo
        ? moment(dtEmprestimo).format("YYYY-MM-DD")
        : null,
      dt_cobranca: dtCobranca ? moment(dtCobranca).format("YYYY-MM-DD") : null,
      status: "andamento",
    };

    return payload;
  }

  async function save() {
    setLoadingButton(true);
    const payload = getPayload();

    const response = await fetch("/api/cadastros/emprestimo", {
      method: "POST",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Operação realizada com sucesso");
      clearStatesAndErrors();
    } else {
      toast.error("Erro na operação");
    }

    setLoadingButton(false);
  }

  function clearStatesAndErrors() {
    clearErrors();
    reset();

    setNome("");
    setCpf("");
    setVlEmprestimo("");
    setVlCapitalGiro("");
    setPercJuros("");
    setQtParcela("");
    setVlParcela("");
    setObservacoes("");
    setTelefone("");
    setDtCobranca(null);
    setDtEmprestimo(null);
  }

  return (
    <ContentWrapper title="Cadastrar empréstimo">
      <Toaster position="bottom-center" reverseOrder={true} />

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

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="perc_juros"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <NumericFormat
                {...field}
                customInput={TextField}
                decimalScale={0}
                fixedDecimalScale={true}
                decimalSeparator=","
                isNumericString
                suffix="%"
                allowEmptyFormatting
                onValueChange={(values) => {
                  const scaledValue = values?.floatValue
                    ? values.floatValue * 0.01
                    : 0;
                  setPercJuros(scaledValue);
                  //setPercJuros(values?.floatValue);
                }}
                error={Boolean(errors.perc_juros)}
                size="small"
                label="(%) Porcentagem de juros"
                placeholder="% de juros"
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
            {errors.perc_juros?.message}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          {/* <Controller
            name="vl_capital_giro"
            control={control}
            defaultValue=""
            render={({ field }) => ( */}
          <NumericFormat
            // {...field}
            customInput={TextField}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale={true}
            prefix="R$ "
            onValueChange={(values) => {
              setValorJuros(values?.floatValue);
            }}
            value={valorJuros}
            size="small"
            label="Valor do juros"
            placeholder="R$ 0,00"
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
            fullWidth
            inputProps={{ maxLength: 16 }}
          />
          {/* )}
          /> */}

          {/* <Typography
            sx={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: "14px" }}
          >
            {errors.vl_capital_giro?.message}
          </Typography> */}
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="vl_parcela"
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
            {errors.vl_capital_giro?.message}
          </Typography>
        </Grid>

        <Box width="100%" />

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Controller
            name="dt_emprestimo"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatepickerFieldWithValidation
                label="Data de empréstimo"
                value={dtEmprestimo}
                onChange={(newDate) => {
                  field.onChange(newDate);
                  setDtEmprestimo(newDate);
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
                label="Data de cobrança"
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
