import { useState, useEffect } from "react";

//Third party libraries
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import moment from "moment";

//Mui components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";

//Constants
import { ESPECIES_INSS } from "@/helpers/constants";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";
import {
  formatarData,
  formatarValorBRL,
  converterDataParaJS,
  formatarCPFSemAnonimidade,
  formatarTelefone,
} from "@/helpers/utils";
import Spinner from "@/components/Spinner";

//Icons
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

//Schema validation
import { clienteCallCenterSchema } from "@/schemas/clienteCallCenterSchema";

var DATA_HOJE = new Date();

export default function CadastrarCliente() {
  const { data: session } = useSession();
  const [clientes, setClientes] = useState([]);

  const [showEditForm, setShowEditForm] = useState(false);
  const [openDialogExcluir, setOpenDialogExcluir] = useState(false);

  const [loadingButton, setLoadingButton] = useState(false);
  const [id, setId] = useState("");
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState(null);
  const [especieInss, setEspecieInss] = useState(null);
  const [matricula, setMatricula] = useState("");
  const [telefoneUm, setTelefoneUm] = useState("");
  const [telefoneDois, setTelefoneDois] = useState("");
  const [telefoneTres, setTelefoneTres] = useState("");
  const [observacao, setObservacao] = useState("");
  const [convenio, setConvenio] = useState("");

  // Picklists
  const [convenioPicklist, setConvenioPicklist] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(clienteCallCenterSchema),
  });

  useEffect(() => {
    if (session?.user?.token) {
      getClientes();
    }
  }, [session?.user, showEditForm]);

  useEffect(() => {
    if (session?.user?.token) {
      getConveniosPicklist();
    }
  }, [session?.user?.token]);

  async function getConveniosPicklist() {
    try {
      const response = await fetch(
        "/api/configuracoes/picklists/convenios/?ativas=true",
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setConvenioPicklist(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleOpenDialogExcluir = () => {
    setOpenDialogExcluir(!openDialogExcluir);
  };

  async function excluirCliente() {
    setLoadingButton(true);

    const response = await fetch(`/api/relatorios/clientes/?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.ok) {
      toast.success("Cliente excluído com sucesso");
      getClientes();
      setId("");
      handleOpenDialogExcluir();
    } else {
      toast.error("Erro ao excluir cliente");
    }

    setLoadingButton(false);
  }

  async function getClientes() {
    const response = await fetch("/api/relatorios/clientes", {
      method: "GET",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.ok) {
      const json = await response.json();
      setClientes(json);
    }
  }

  async function editarDadosCliente() {
    setLoadingButton(true);

    const payload = getPayload();

    const response = await fetch(
      `/api/cadastros/cliente/?cpf=${cpf.replace(/\D/g, "")}`,
      {
        method: "PUT",
        headers: {
          Authorization: session?.user?.token,
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      toast.success("Dados atualizados com sucesso!");
      clearStatesAndErrors();
      setLoadingButton(false);

      setTimeout(() => {
        router.push("/relatorios/clientes");
      }, 500);
    } else {
      toast.error("Erro ao atualizar dados!");
      setLoadingButton(false);
    }
  }

  function getPayload() {
    const payload = {
      id: id,
      cpf: cpf.replace(/\D/g, ""),
      nome: nome.toUpperCase(),
      dt_nascimento: dataNascimento
        ? moment(dataNascimento).format("YYYY-MM-DD")
        : null,
      especie: convenio == 5 && especieInss ? especieInss?.especie : null,
      matricula: matricula.toUpperCase(),
      telefone1: telefoneUm.replace(/\D/g, ""),
      telefone2: telefoneDois.replace(/\D/g, ""),
      telefone3: telefoneTres.replace(/\D/g, ""),
      observacoes: observacao,
      convenio: convenio == "" ? null : convenio,
    };

    return payload;
  }

  function clearStatesAndErrors() {
    clearErrors();
    reset();

    setId("");
    setCpf("");
    setNome("");
    setDataNascimento(null);
    setEspecieInss(null);
    setMatricula("");
    setTelefoneUm("");
    setTelefoneDois("");
    setTelefoneTres("");
    setObservacao("");
    setConvenio("");
  }

  function getDataForEdit(data) {
    clearErrors();
    setValue("nome", data.nome);
    setValue("cpf", formatarCPFSemAnonimidade(data.cpf));
    setValue("telefoneUm", data.telefone1);
    setValue("especieInss", data.especie);

    setId(data.id);
    setCpf(formatarCPFSemAnonimidade(data.cpf));
    setNome(data.nome);
    setDataNascimento(
      data.dt_nascimento ? converterDataParaJS(data.dt_nascimento) : null
    );
    setEspecieInss(
      data.especie
        ? {
            especie: data.especie,
          }
        : null
    );
    setMatricula(data.matricula);
    setTelefoneUm(data.telefone1 ? data.telefone1 : "");
    setTelefoneDois(data.telefone2 ? data.telefone2 : "");
    setTelefoneTres(data.telefone3 ? data.telefone3 : "");
    setObservacao(data.observacoes);
    setConvenio(data.convenio);
  }

  async function editarDadosCliente() {
    setLoadingButton(true);

    const payload = getPayload();

    const response = await fetch(
      `/api/cadastros/cliente/?cpf=${cpf.replace(/\D/g, "")}`,
      {
        method: "PUT",
        headers: {
          Authorization: session?.user?.token,
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      toast.success("Dados atualizados com sucesso!");
      clearStatesAndErrors();
    } else {
      toast.error("Erro ao atualizar dados!");
    }
    setLoadingButton(false);
  }

  const columns = [
    {
      field: "id",
      headerName: "AÇÃO",
      renderHeader: (params) => <strong>AÇÃO</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Stack direction="row">
            <Tooltip title="Editar cliente" placement="top">
              <IconButton
                onClick={() => {
                  setShowEditForm(!showEditForm);
                  getDataForEdit(params.row);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Deletar cliente" placement="top">
              <IconButton
                color="error"
                sx={{ ml: 1 }}
                onClick={() => {
                  setId(params.value);
                  handleOpenDialogExcluir();
                }}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
    {
      field: "cpf",
      headerName: "CPF",
      renderHeader: (params) => <strong>CPF</strong>,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nome",
      headerName: "NOME",
      renderHeader: (params) => <strong>NOME</strong>,
      flex: 1,
      minWidth: 350,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dt_nascimento",
      headerName: "DATA NASCIMENTO",
      renderHeader: (params) => <strong>DATA NASCIMENTO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
    {
      field: "especie",
      headerName: "ESPÉCIE",
      renderHeader: (params) => <strong>ESPÉCIE</strong>,
      minWidth: 450,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "matricula",
      headerName: "MATRÍCULA",
      renderHeader: (params) => <strong>MATRÍCULA</strong>,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "telefone1",
      headerName: "TELEFONE UM",
      renderHeader: (params) => <strong>TELEFONE UM</strong>,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => formatarTelefone(params.value),
    },
    {
      field: "telefone2",
      headerName: "TELEFONE DOIS",
      renderHeader: (params) => <strong>TELEFONE DOIS</strong>,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => formatarTelefone(params.value),
    },
    {
      field: "telefone3",
      headerName: "TELEFONE TRÊS",
      renderHeader: (params) => <strong>TELEFONE TRÊS</strong>,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => formatarTelefone(params.value),
    },
    {
      field: "observacoes",
      headerName: "OBSERVAÇÃO",
      renderHeader: (params) => <strong>OBSERVAÇÃO</strong>,
      minWidth: 450,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "convenio",
      headerName: "COD. CONVÊNIO",
      renderHeader: (params) => <strong>COD. CONVÊNIO</strong>,
      minWidth: 450,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nome_convenio",
      headerName: "CONVÊNIO",
      renderHeader: (params) => <strong>CONVÊNIO</strong>,
      minWidth: 450,
      align: "center",
      headerAlign: "center",
    },
  ];

  console.log(clientes);

  try {
    var rows = clientes?.map((row) => {
      return {
        id: row.id,
        cpf: formatarCPFSemAnonimidade(row.cpf),
        nome: row.nome,
        dt_nascimento: row.dt_nascimento,
        especie: row.especie,
        matricula: row.matricula,
        telefone1: row.telefone1,
        telefone2: row.telefone2,
        telefone3: row.telefone3,
        observacoes: row.observacoes,
        convenio: row.convenio,
        nome_convenio: row.nome_convenio,
      };
    });
  } catch (err) {
    console.log(err);
    var rows = [];
  }

  return (
    <ContentWrapper title="Relação de clientes">
      <Toaster position="bottom-center" reverseOrder={true} />

      {showEditForm && (
        <Fade in={showEditForm}>
          <Button
            disableElevation
            variant="outlined"
            onClick={() => {
              setShowEditForm(!showEditForm);
              clearStatesAndErrors();
              setLoadingButton(false);
            }}
            sx={{ mt: 2 }}
            startIcon={<ArrowBackIosRoundedIcon />}
          >
            VOLTAR
          </Button>
        </Fade>
      )}

      <Fade in={showEditForm}>
        <Box
          sx={{
            display: showEditForm ? "flex" : "none",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "column",
            width: "100%",
            mt: 4,
          }}
          component="form"
          onSubmit={handleSubmit(() => {
            editarDadosCliente();
          })}
        >
          <Grid container spacing={1}>
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
                    // onInput={(e) =>
                    //   (e.target.value = e.target.value
                    //     .replace(/[^0-9.]/g, "")
                    //     .replace(/(\..*?)\..*/g, "$1"))
                    // }
                  />
                )}
              </InputMask>
              <Typography sx={{ color: "#f00", fontSize: "12px" }}>
                {errors.cpf?.message}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
              <TextField
                {...register("nome")}
                error={Boolean(errors.nome)}
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value.replace(/[^A-Za-z\s]/g, ""));
                }}
                size="small"
                label="Nome"
                placeholder="Insira o nome completo"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                fullWidth
              />
              <Typography sx={{ color: "#f00", fontSize: "12px" }}>
                {errors.nome?.message}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                <DesktopDatePicker
                  leftArrowButtonText="Mês anterior"
                  rightArrowButtonText="Próximo mês"
                  label="Data de nascimento"
                  onChange={(newValue) => {
                    setDataNascimento(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      // {...register("dataNascimento")}
                      // error={Boolean(errors.dataNascimento)}
                      {...params}
                      fullWidth
                      size="small"
                      autoComplete="off"
                    />
                  )}
                  value={dataNascimento}
                  disableHighlightToday
                />
              </LocalizationProvider>
              {/* <Typography sx={{ color: "#f00", fontSize: "12px" }}>
              {errors.dataNascimento?.message}
            </Typography> */}
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
              <Autocomplete
                options={ESPECIES_INSS}
                autoHighlight
                getOptionLabel={(option) => option?.especie}
                value={especieInss}
                onChange={(event, newValue) => {
                  setEspecieInss(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Espécie INSS"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
              <TextField
                size="small"
                label="Matrícula"
                value={matricula}
                onChange={(e) => {
                  setMatricula(e.target.value);
                }}
                placeholder="Insira a matrícula"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
              <InputMask
                {...register("telefoneUm")}
                error={Boolean(errors.telefoneUm)}
                mask="(99) 9 9999-9999"
                maskChar={null}
                value={telefoneUm}
                onChange={(e) => setTelefoneUm(e.target.value)}
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
                  />
                )}
              </InputMask>
              <Typography sx={{ color: "#f00", fontSize: "12px" }}>
                {errors.telefoneUm?.message}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
              <InputMask
                mask="(99) 9 9999-9999"
                maskChar={null}
                value={telefoneDois}
                onChange={(e) => setTelefoneDois(e.target.value)}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    variant="outlined"
                    size="small"
                    fullWidth
                    label="Telefone dois"
                    placeholder="00 00000-0000"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="off"
                  />
                )}
              </InputMask>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
              <InputMask
                mask="(99) 9 9999-9999"
                maskChar={null}
                value={telefoneTres}
                onChange={(e) => setTelefoneTres(e.target.value)}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    variant="outlined"
                    size="small"
                    fullWidth
                    label="Telefone três"
                    placeholder="00 00000-0000"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="off"
                  />
                )}
              </InputMask>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
              <TextField
                {...register("convenio")}
                select
                fullWidth
                label="Convênio"
                size="small"
                value={convenio}
                onChange={(e) => {
                  setConvenio(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>Nenhum convênio</em>
                </MenuItem>
                {convenioPicklist?.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {convenio == 5 && (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                <Autocomplete
                  options={ESPECIES_INSS}
                  autoHighlight
                  getOptionLabel={(option) => option?.especie}
                  value={especieInss}
                  onChange={(event, newValue) => {
                    setEspecieInss(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...register("especieInss")}
                      label="Espécie INSS"
                      size="small"
                      fullWidth
                      error={Boolean(errors?.especieInss)}
                      helperText={errors?.especieInss?.message}
                    />
                  )}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <TextField
                multiline
                rows={3}
                size="small"
                label="Observações"
                value={observacao}
                onChange={(e) => {
                  setObservacao(e.target.value);
                }}
                placeholder="Insira a matrícula"
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
                // fullWidth
              >
                SALVAR
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      <Fade in={!showEditForm}>
        <Box sx={{ width: "100%", display: !showEditForm ? "block" : "none" }}>
          {clientes.length == 0 ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 5,
                mb: 5,
              }}
            >
              <Spinner />
            </Box>
          ) : (
            <DataTable rows={rows} columns={columns} />
          )}
        </Box>
      </Fade>

      <Dialog
        open={openDialogExcluir}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700 }}>
          Deseja deletar o cliente?
        </DialogTitle>

        <DialogActions>
          <Button
            onClick={() => {
              handleOpenDialogExcluir();
              setId("");
            }}
          >
            CANCELAR
          </Button>

          <LoadingButton
            onClick={excluirCliente}
            color="error"
            variant="contained"
            disableElevation
            loading={loadingButton}
          >
            EXCLUIR
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </ContentWrapper>
  );
}
