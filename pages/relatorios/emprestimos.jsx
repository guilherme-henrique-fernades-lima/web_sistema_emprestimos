import { useEffect, useState } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import moment from "moment";
// import { useRouter } from "next/router";
import Link from "next/link";

// Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";
import DateRangePicker from "@/components/DateRangePicker";

// Mui components
import Box from "@mui/material/Box";

// Mui components
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";

// Utils
import {
  formatarData,
  formatarCPFSemAnonimidade,
  formatarReal,
  formatarPorcentagem,
  renderStatusPagamento,
  formatarTelefone,
  getDiaDaCobranca,
  renderSituacaoParcela,
  formatarStatusDoEmprestimo,
} from "@/helpers/utils";

//Icons
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import GavelIcon from "@mui/icons-material/Gavel";

var DATA_HOJE = new Date();
var DATA_HOJE_FORMATTED = moment(DATA_HOJE).format("YYYY-MM-DD");
var ULTIMO_DIA_MES = new Date(
  DATA_HOJE.getFullYear(),
  DATA_HOJE.getMonth() + 1,
  0
);

export default function RelatorioEmprestimos() {
  const { data: session } = useSession();

  const [dataSet, setDataset] = useState({
    data: [],
    indicadores: {
      vl_emprestimo: 0,
      vl_capital_giro: 0,
      vl_tt_juros: 0,
      vl_tt_juros_a: 0,
      vl_tt_juros_b: 0,
      vl_capital_giro_corrente: 0,
      qtd_emprestimos: {
        total: 0,
        acordo: 0,
        andamento: 0,
        quitado: 0,
      },
    },
  });

  const [parcelas, setParcelas] = useState([]);
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(ULTIMO_DIA_MES);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [idEmprestimo, setIdEmprestimo] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dadosEmprestimo, setDadosEmprestimo] = useState({});
  const [showAcordo, setShowAcordo] = useState("nao");

  const [dataFilterEmprestimo, setDataFilterEmprestimo] =
    useState("dt_cobranca");

  async function list() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/relatorios/emprestimos/?dt_inicio=${moment(dataInicio).format(
          "YYYY-MM-DD"
        )}&dt_final=${moment(dataFim).format(
          "YYYY-MM-DD"
        )}&dt_filter=${dataFilterEmprestimo}&has_acordo=${showAcordo}`,
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
      } else {
        toast.error("Sem dados encontrados");
        setDataset({
          data: [],
          indicadores: {
            vl_emprestimo: 0,
            vl_capital_giro: 0,
            vl_tt_juros: 0,
            vl_tt_juros_a: 0,
            vl_tt_juros_b: 0,
            vl_capital_giro_corrente: 0,
            qtd_emprestimos: {
              total: 0,
              acordo: 0,
              andamento: 0,
              quitado: 0,
            },
          },
        });
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function getParcelasEmprestimo(id) {
    try {
      const response = await fetch(`/api/relatorios/parcelas/?id=${id}`, {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setParcelas(json);
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
    }
  }

  function actionsAfterDelete() {
    setOpenDialogDelete(false);
    list();
    setIdEmprestimo("");
  }

  function handleClose() {
    setOpenModal(false);
    setTimeout(() => {
      setDadosEmprestimo({});
      setParcelas([]);
    }, 500);
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
            {params.row.status == "acordo" || params.row.status == "quitado" ? (
              <IconButton disabled>
                <DeleteForeverIcon />
              </IconButton>
            ) : (
              <Tooltip title="Deletar" placement="top">
                <IconButton
                  color="error"
                  onClick={() => {
                    setIdEmprestimo(params.value);
                    setOpenDialogDelete(true);
                  }}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Ver parcelas" placement="top">
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => {
                  setOpenModal(true);
                  getParcelasEmprestimo(params.value);
                  setDadosEmprestimo(params.row);
                }}
              >
                <ContentPasteSearchIcon />
              </IconButton>
            </Tooltip>
            {params.row.status == "acordo" || params.row.status == "quitado" ? (
              <IconButton sx={{ ml: 1 }} disabled>
                <GavelIcon />
              </IconButton>
            ) : (
              <Tooltip title="Criar acordo" placement="top">
                <Link
                  href={`/cadastros/acordo/?id=${params.value}&nome=${params.row.nome}&cpf=${params.row.cpf}&telefone=${params.row.telefone}&vl_emprestimo=${params.row.vl_emprestimo}`}
                >
                  <IconButton sx={{ ml: 1 }}>
                    <GavelIcon />
                  </IconButton>
                </Link>
              </Tooltip>
            )}
          </Stack>
        );
      },
    },
    {
      field: "status",
      headerName: "STATUS",
      renderHeader: (params) => <strong>STATUS</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return formatarStatusDoEmprestimo(params.value);
      },
    },
    {
      field: "dt_emprestimo",
      headerName: "DATA DO EMPRÉSTIMO",
      renderHeader: (params) => <strong>DATA DO EMPRÉSTIMO</strong>,
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
      field: "dt_cobranca",
      headerName: "DATA DA COBRANÇA",
      renderHeader: (params) => <strong>DATA DA COBRANÇA</strong>,
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
      field: "cpf",
      headerName: "CPF",
      renderHeader: (params) => <strong>CPF</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarCPFSemAnonimidade(params.value);
        }
      },
    },
    {
      field: "nome",
      headerName: "NOME DO CLIENTE",
      renderHeader: (params) => <strong>NOME DO CLIENTE</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "telefone",
      headerName: "TELEFONE",
      renderHeader: (params) => <strong>TELEFONE</strong>,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarTelefone(params.value);
        }
      },
    },
    {
      field: "vl_emprestimo",
      headerName: "VLR. EMPRÉSTIMO",
      renderHeader: (params) => <strong>VLR. EMPRÉSTIMO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarReal(parseFloat(params.value));
        }
      },
    },
    {
      field: "vl_capital_giro",
      headerName: "VLR. CAPITAL DE GIRO",
      renderHeader: (params) => <strong>VLR. CAPITAL DE GIRO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarReal(parseFloat(params.value));
        }
      },
    },
    {
      field: "perc_juros",
      headerName: "% DE JUROS TOTAL",
      renderHeader: (params) => <strong>% DE JUROS TOTAL</strong>,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarPorcentagem(parseFloat(params.value));
        }
      },
    },
    {
      field: "perc_juros_a",
      headerName: "% DE JUROS A",
      renderHeader: (params) => <strong>% DE JUROS A</strong>,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return formatarPorcentagem(parseFloat(params.row.perc_juros / 2));
      },
    },
    {
      field: "perc_juros_b",
      headerName: "% DE JUROS B",
      renderHeader: (params) => <strong>% DE JUROS B</strong>,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return formatarPorcentagem(parseFloat(params.row.perc_juros / 2));
      },
    },

    {
      field: "qt_parcela",
      headerName: "QTD DE PARCELAS",
      renderHeader: (params) => <strong>QTD DE PARCELAS</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "parcelas_pagas",
      headerName: "QTD. PARC. PAGAS",
      renderHeader: (params) => <strong>QTD. PARC. PAGAS</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "parcelas_nao_pagas",
      headerName: "QTD. PARC. NÃO PAGAS",
      renderHeader: (params) => <strong>QTD. PARC. NÃO PAGAS</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vl_parcela",
      headerName: "VLR. PARCELA",
      renderHeader: (params) => <strong>VLR. PARCELA</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarReal(parseFloat(params.value));
        }
      },
    },

    {
      field: "observacoes",
      headerName: "OBSERVAÇÕES",
      renderHeader: (params) => <strong>OBSERVAÇÕES</strong>,
      minWidth: 350,
      align: "left",
      headerAlign: "center",
    },
  ];

  return (
    <ContentWrapper title="Relação de empréstimos">
      <Toaster position="bottom-center" reverseOrder={true} />

      <DateRangePicker
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFinal={dataFim}
        setDataFinal={setDataFim}
        handleSearch={list}
        loading={loading}
      />

      <FormControl component="fieldset">
        <FormLabel id="demo-radio-buttons-group-label">
          Filtrar por data de:
        </FormLabel>
        <RadioGroup
          row
          value={dataFilterEmprestimo}
          onChange={(e) => {
            setDataFilterEmprestimo(e.target.value);
          }}
        >
          <FormControlLabel
            value="dt_cobranca"
            control={<Radio />}
            label="Cobrança"
          />
          <FormControlLabel
            value="dt_emprestimo"
            control={<Radio />}
            label="Empréstimo"
          />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel id="demo-radio-buttons-group-label">
          Exibir acordos?
        </FormLabel>
        <RadioGroup
          row
          value={showAcordo}
          onChange={(e) => {
            setShowAcordo(e.target.value);
          }}
        >
          <FormControlLabel value="nao" control={<Radio />} label="Não" />
          <FormControlLabel value="sim" control={<Radio />} label="Sim" />
        </RadioGroup>
      </FormControl>

      <Box
        container
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
          // border: "2px solid #ccc",
          backgroundColor: "#efefef",
          padding: 1,
          width: "100%",
          maxWidth: 400,
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            Valor total do empréstimo:
          </Typography>
          <Typography>
            {formatarReal(dataSet?.indicadores.vl_emprestimo)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            Valor total do capital de giro corrente:
          </Typography>
          <Typography>
            {formatarReal(dataSet?.indicadores.vl_capital_giro_corrente)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            Valor total do juros:
          </Typography>
          <Typography>
            {formatarReal(dataSet?.indicadores.vl_tt_juros)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>Em andamento:</Typography>
          <Typography>
            {dataSet?.indicadores.qtd_emprestimos.andamento}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>Quitados:</Typography>
          <Typography>
            {dataSet?.indicadores.qtd_emprestimos.quitado}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>Acordos:</Typography>
          <Typography>{dataSet?.indicadores.qtd_emprestimos.acordo}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>Quantidade total:</Typography>
          <Typography>{dataSet?.indicadores.qtd_emprestimos.total}</Typography>
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>
        <DataTable rows={dataSet?.data} columns={columns} />
      </Box>

      <DialogDeletarRegistro
        open={openDialogDelete}
        close={setOpenDialogDelete}
        id={idEmprestimo}
        token={session?.user.token}
        onFinishDelete={actionsAfterDelete}
      />
      <ModalParcelasEmprestimo
        open={openModal}
        handleClose={handleClose}
        parcelas={parcelas}
        dadosEmprestimo={dadosEmprestimo}
      />
    </ContentWrapper>
  );
}

function DialogDeletarRegistro({ open, close, id, token, onFinishDelete }) {
  const [loading, setLoading] = useState(false);

  async function destroy() {
    try {
      setLoading(true);
      const response = await fetch(`/api/relatorios/emprestimos/?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        toast.success("Excluído");
        onFinishDelete();
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
    }

    setLoading(false);
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700, mb: 1 }}>
        Deseja deletar o empréstimo?
      </DialogTitle>

      <DialogActions>
        <Button
          onClick={() => {
            close(false);
          }}
        >
          CANCELAR
        </Button>

        <LoadingButton
          onClick={destroy}
          color="error"
          variant="contained"
          disableElevation
          loading={loading}
        >
          EXCLUIR
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

function ModalParcelasEmprestimo({
  open,
  handleClose,
  parcelas,
  dadosEmprestimo,
}) {
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
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 1200,
            maxHeight: 600,
            //height: "100%",
            bgcolor: "background.paper",
            boxShadow: 24,
            //p: 3,
            //borderRadius: 2,
            overflowY: "auto",

            ["@media (max-width:1200px)"]: {
              width: "90%",
            },
          }}
        >
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 0 }}
            //elevation={0}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {/* <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "#292929",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    SEQ.
                  </TableCell> */}
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "#292929",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    N° PARCELA
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "#292929",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    DT. VENCIMENTO
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "#292929",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    VLR. PARCELA
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "#292929",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    DT. PAGAMENTO
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "#292929",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    STATUS DO PRAZO
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "#292929",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    STATUS PAGAMENTO
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {parcelas?.length > 1 ? (
                  <>
                    {parcelas?.map((parcela, index) => (
                      <TableRow
                        key={parcela.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {/* <TableCell align="center">{index + 1}</TableCell> */}
                        <TableCell align="center">
                          {parcela.nr_parcela}
                        </TableCell>
                        <TableCell align="center">
                          {parcela.dt_vencimento &&
                            formatarData(parcela.dt_vencimento)}
                        </TableCell>
                        <TableCell align="center">
                          {parcela.vl_parcela &&
                            formatarReal(parseFloat(parcela.vl_parcela))}
                        </TableCell>
                        <TableCell align="center">
                          {parcela.dt_pagamento &&
                            formatarData(parcela.dt_pagamento)}
                        </TableCell>
                        <TableCell align="center">
                          {dadosEmprestimo.status === "acordo" ? (
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
                              ACORDO
                            </Typography>
                          ) : (
                            <>
                              {parcela.status_pagamento != "pago" &&
                                renderSituacaoParcela(
                                  DATA_HOJE_FORMATTED,
                                  parcela.dt_vencimento
                                )}
                            </>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {renderStatusPagamento(
                            parcela.vl_parcial,
                            parcela.dt_pagamento,
                            parcela.tp_pagamento,
                            parcela.status_pagamento
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <>
                    {[1, 2, 3, 4, 5, 6].map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {/* <TableCell component="th" scope="row">
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={20}
                          />
                        </TableCell> */}
                        <TableCell align="right">
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={20}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={20}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={20}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={20}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={20}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={20}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              padding: 2,

              width: {
                xs: "100%",
                sm: "100%",
                md: "70%",
                lg: "60%",
                xl: "50%",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>CPF:</Typography>
              <Typography>
                {dadosEmprestimo?.cpf &&
                  formatarCPFSemAnonimidade(dadosEmprestimo?.cpf)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>Nome do cliente:</Typography>
              <Typography>{dadosEmprestimo?.nome}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>Telefone:</Typography>
              <Typography>
                {dadosEmprestimo?.telefone
                  ? formatarTelefone(dadosEmprestimo?.telefone)
                  : "-"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>
                Valor do empréstimo:
              </Typography>
              <Typography>
                {dadosEmprestimo?.vl_emprestimo &&
                  formatarReal(parseFloat(dadosEmprestimo?.vl_emprestimo))}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>Qtd. parcelas:</Typography>
              <Typography>{dadosEmprestimo?.qt_parcela}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>Valor parcela:</Typography>
              <Typography>
                {dadosEmprestimo?.vl_parcela &&
                  formatarReal(dadosEmprestimo?.vl_parcela)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>
                Valor capital de giro:
              </Typography>
              <Typography>
                {dadosEmprestimo?.vl_capital_giro &&
                  formatarReal(parseFloat(dadosEmprestimo?.vl_capital_giro))}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>% de Juros:</Typography>
              <Typography>
                {dadosEmprestimo?.perc_juros &&
                  formatarPorcentagem(dadosEmprestimo?.perc_juros)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>Observações:</Typography>
              <Typography>{dadosEmprestimo?.observacoes}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>
                Data do empréstimo:
              </Typography>
              <Typography>
                {dadosEmprestimo?.dt_emprestimo &&
                  formatarData(dadosEmprestimo?.dt_emprestimo)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>
                Dia escolhido para vencimento:
              </Typography>
              <Typography>
                {dadosEmprestimo?.dt_cobranca &&
                  getDiaDaCobranca(dadosEmprestimo?.dt_cobranca)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
