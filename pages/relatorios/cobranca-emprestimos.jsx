import { useEffect, useState } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import moment from "moment";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";
import DatepickerField from "@/components/DatepickerField";
import CustomTextField from "@/components/CustomTextField";
import DateRangePicker from "@/components/DateRangePicker";

//Mui components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

//Utils
import {
  formatarData,
  renderSituacaoParcela,
  formatarCEP,
  formatarTelefone,
  formatarCPFSemAnonimidade,
} from "@/helpers/utils";

//Icons
import BeenhereRoundedIcon from "@mui/icons-material/BeenhereRounded";

var DATA_HOJE = new Date();
var DATA_HOJE_FORMATTED = moment(DATA_HOJE).format("YYYY-MM-DD");

export default function RelatorioCobrancaEmprestimos() {
  const { data: session } = useSession();

  const [dataSet, setDataset] = useState([]);
  //console.log("🚀 ~ RelatorioCobrancaEmprestimos ~ dataSet:", dataSet);
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [tipoPagamentoParcela, setTipoPagamentoParcela] = useState("");
  const [valorParcial, setValorParcial] = useState("");
  const [idParcela, setIdParcela] = useState("");

  const [dadosParcela, setDadosParcela] = useState({});

  useEffect(() => {
    if (session?.user.token) {
      list();
    }
  }, [session?.user]);

  async function list() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/relatorios/cobranca-emprestimos/?dt_inicio=${moment(
          dataInicio
        ).format("YYYY-MM-DD")}&dt_final=${moment(dataFim).format(
          "YYYY-MM-DD"
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setDataset(json);
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
      setLoading(false);
    }
  }

  function handleClose() {
    setOpenModal(false);
    setTipoPagamentoParcela("");
    setValorParcial("");
    setIdParcela("");
    setDadosParcela({});
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
            <Tooltip title="Ação" placement="top">
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => {
                  setOpenModal(true);
                  setDadosParcela(params.row);
                }}
              >
                <BeenhereRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },

    {
      field: "nr_parcela",
      headerName: "NR. PARCELA",
      renderHeader: (params) => <strong>NR. PARCELA</strong>,
      minWidth: 140,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dt_vencimento_copy",
      headerName: "SITUAÇÃO DA PARCELA",
      renderHeader: (params) => <strong>SITUAÇÃO DA PARCELA</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        renderSituacaoParcela(DATA_HOJE_FORMATTED, params.row.dt_vencimento),
    },
    {
      field: "dt_vencimento",
      headerName: "DATA DO VENCIMENTO",
      renderHeader: (params) => <strong>DATA DO VENCIMENTO</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
    {
      field: "dt_pagamento",
      headerName: "DATA DO PAGAMENTO",
      renderHeader: (params) => <strong>DATA DO PAGAMENTO</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
    {
      field: "tp_pagamento",
      headerName: "TIPO PAGAMENTO",
      renderHeader: (params) => <strong>TIPO PAGAMENTO</strong>,
      minWidth: 220,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "status_pagamento",
      headerName: "STATUS DO PAGAMENTO",
      renderHeader: (params) => <strong>STATUS DO PAGAMENTO</strong>,
      minWidth: 220,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vl_parcial",
      headerName: "VLR. PARCIAL",
      renderHeader: (params) => <strong>VLR. PARCIAL</strong>,
      minWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarReal(parseFloat(params.value));
        }
      },
    },
  ];

  return (
    <ContentWrapper title="Cobrança das parcelas dos empréstimos">
      <Toaster position="bottom-center" reverseOrder={true} />

      <DateRangePicker
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFinal={dataFim}
        setDataFinal={setDataFim}
        handleSearch={list}
        loading={loading}
      />

      <Box sx={{ width: "100%" }}>
        <DataTable rows={dataSet} columns={columns} />
      </Box>

      <ModalAcaoDetalhes
        open={openModal}
        handleClose={handleClose}
        tipoPagamentoParcela={tipoPagamentoParcela}
        setTipoPagamentoParcela={setTipoPagamentoParcela}
        dadosParcela={dadosParcela}
      />
    </ContentWrapper>
  );
}

function ModalAcaoDetalhes({
  open,
  handleClose,
  tipoPagamentoParcela,
  setTipoPagamentoParcela,
  dadosParcela,
}) {
  //   {
  //     "id": 28,
  //     "nr_parcela": "3",
  //     "dt_vencimento": "2024-09-01",
  //     "dt_pagamento": null,
  //     "tp_pagamento": "parcela",
  //     "status_pagamento": "pendente",
  //     "vl_parcial": null,
  //     "emprestimo": 23
  // }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 400,
            maxHeight: 600,
            //height: "100%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: 1,
            overflowY: "auto",

            ["@media (max-width:1200px)"]: {
              width: "90%",
            },
          }}
        >
          <Grid container rowSpacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControl component="fieldset">
                <RadioGroup
                  value={tipoPagamentoParcela}
                  onChange={(e) => {
                    setTipoPagamentoParcela(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value="vlr_total"
                    control={<Radio />}
                    label="Valor total"
                  />
                  <FormControlLabel
                    value="juros"
                    control={<Radio />}
                    label="Somente juros"
                  />
                  <FormControlLabel
                    value="parcial"
                    control={<Radio />}
                    label="Valor parcial"
                  />
                </RadioGroup>
              </FormControl>

              {tipoPagamentoParcela === "parcial" && (
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <CustomTextField
                    value={""}
                    setValue={""}
                    label="Valor parcial"
                    placeholder="Insira o valor"
                    numbersNotAllowed
                    // validateFieldName="nome"
                    // control={control}
                  />
                </Grid>
              )}

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Typography>Valor da parcela:</Typography>
                <Typography>R$ 0,00</Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography>Valor parcial:</Typography>
                <Typography>R$ 0,00</Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                  borderTop: "1px solid #a1a1a1",
                }}
              >
                <Typography>Valor total:</Typography>
                <Typography sx={{ fontWeight: 700 }}>R$ 0,00</Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container columnSpacing={1}>
                <Grid item xs={6}>
                  <Button
                    disableElevation
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={handleClose}
                  >
                    CANCELAR
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <LoadingButton disableElevation variant="contained" fullWidth>
                    SALVAR
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
}
