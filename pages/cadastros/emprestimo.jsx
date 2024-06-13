import { useState, useEffect } from "react";

//Third party libraries
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { NumericFormat } from "react-number-format";
import InputMask from "react-input-mask";
import moment from "moment";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

//Mui components
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

//Custom components
import ContentWrapper from "@/components/templates/ContentWrapper";
import CustomTextField from "@/components/CustomTextField";
import DatepickerField from "@/components/DatepickerField";
import BackdropLoadingScreen from "@/components/BackdropLoadingScreen";
import DatepickerFieldWithValidation from "@/components/DatepickerFieldWithValidation";

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
  const router = useRouter();
  const { id } = router.query;

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

  useEffect(() => {
    if (session?.user.token) {
      if (id) {
        retrieveData(id);
      } else {
        clearStatesAndErrors();
      }
    }
  }, [id]);

  //States de formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [vlEmprestimo, setVlEmprestimo] = useState("");
  const [vlCapitalGiro, setVlCapitalGiro] = useState("");
  const [percJuros, setPercJuros] = useState("");
  const [qtParcela, setQtParcela] = useState("");
  const [vlParcela, setVlParcela] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [dtEmprestimo, setDtEmprestimo] = useState(null);
  const [dtCobranca, setDtCobranca] = useState(null);

  //States de controle de UI
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  function getPayload() {
    const payload = {
      cpf: cpf.replace(/\D/g, ""),
      nome: nome.toUpperCase(),
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
    };

    return payload;
  }

  async function update() {
    setLoadingButton(true);
    const payload = getPayload();

    const response = await fetch(`/api/cadastros/emprestimo/?id=${id}`, {
      method: "PUT",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Operação realizada com sucesso");
    } else {
      toast.error("Erro na operação");
    }

    setLoadingButton(false);
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

  async function retrieveData(id) {
    setOpenBackdrop(true);

    const response = await fetch(`/api/cadastros/emprestimo/?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.status == 200) {
      const json = await response.json();
      console.log(json);
      setDataForEdit(json);
    } else {
      toast.error("Aconteceu algum erro");
    }

    setOpenBackdrop(false);
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
    setDtEmprestimo(null);
    setDtCobranca(null);
  }

  function setDataForEdit(data) {
    setNome(data.nome);
    setCpf(data.cpf);
    setVlEmprestimo(data.vl_emprestimo);
    setVlCapitalGiro(data.vl_capital_giro);
    setPercJuros(data.perc_juros);
    setQtParcela(data.qt_parcela);
    setVlParcela(data.vl_parcela);
    setObservacoes(data.observacoes);
    setDtEmprestimo(
      data.dt_emprestimo ? converterDataParaJS(data.dt_emprestimo) : null
    );
    setDtCobranca(
      data.dt_cobranca ? converterDataParaJS(data.dt_cobranca) : null
    );

    setValue("cpf", formatarCPFSemAnonimidade(data.cpf));
    setValue("nome", data.nome);
    setValue("vl_emprestimo", parseFloat(data.vl_emprestimo));
    setValue("vl_capital_giro", parseFloat(data.vl_capital_giro));
    setValue("perc_juros", parseFloat(data.perc_juros));
    setValue("qt_parcela", parseInt(data.qt_parcela));
    setValue("vl_parcela", parseFloat(data.vl_parcela));
    setValue("dt_cobranca", data.dt_cobranca);
  }

  return (
    <ContentWrapper
      title={id ? "Editar dados do empréstimo" : "Cadastrar empréstimo"}
    >
      <Toaster position="bottom-center" reverseOrder={true} />
      <BackdropLoadingScreen open={openBackdrop} />

      {id && (
        <Link href="/relatorios/emprestimos">
          <Button variant="outlined" sx={{ mt: 2 }}>
            VOLTAR
          </Button>
        </Link>
      )}

      <Grid
        container
        spacing={2}
        sx={{ mt: 1 }}
        component="form"
        onSubmit={handleSubmit(() => {
          id ? update() : save();
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
            numbersNotAllowed
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
                decimalScale={2}
                fixedDecimalScale={true}
                decimalSeparator=","
                isNumericString
                suffix="%"
                allowEmptyFormatting
                onValueChange={(values) => {
                  setPercJuros(values?.floatValue);
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
          <CustomTextField
            value={qtParcela}
            setValue={setQtParcela}
            label="Qtd. de parcelas"
            validateFieldName="qt_parcela"
            control={control}
            maxLength={2}
          />
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

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <DatepickerField
            label="Data do empréstimo"
            value={dtEmprestimo}
            onChange={setDtEmprestimo}
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
            {id ? "ATUALIZAR" : "CADASTRAR"}
          </LoadingButton>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
}
