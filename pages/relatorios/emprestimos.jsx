import { useEffect, useState } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import moment from "moment";
// import { useRouter } from "next/router";
// import Link from "next/link";

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

// Utils
import {
  formatarData,
  formatarCPFSemAnonimidade,
  formatarReal,
  formatarPorcentagem,
  renderStatusPagamento,
} from "@/helpers/utils";

//Icons

import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// import EditIcon from "@mui/icons-material/Edit";

var DATA_HOJE = new Date();

export default function RelatorioEmprestimos() {
  const { data: session } = useSession();

  const [dataSet, setDataset] = useState([]);
  const [parcelas, setParcelas] = useState([]);
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [idEmprestimo, setIdEmprestimo] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (session?.user.token) {
  //     list();
  //   }
  // }, [session?.user]);

  async function list() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/relatorios/emprestimos/?dt_inicio=${moment(dataInicio).format(
          "YYYY-MM-DD"
        )}&dt_final=${moment(dataFim).format("YYYY-MM-DD")}`,
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
            {/* <Tooltip title="Editar" placement="top">
              <Link href={`/cadastros/cliente/?id=${params.value}`}>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Link>
            </Tooltip> */}

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

            <Tooltip title="Ver parcelas" placement="top">
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => {
                  setOpenModal(true);
                  getParcelasEmprestimo(params.value);
                }}
              >
                <ContentPasteSearchIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
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
      headerName: "% DE JUROS",
      renderHeader: (params) => <strong>% DE JUROS</strong>,
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
      field: "qt_parcela",
      headerName: "QTD DE PARCELAS",
      renderHeader: (params) => <strong>QTD DE PARCELAS</strong>,
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
      field: "status",
      headerName: "STATUS",
      renderHeader: (params) => <strong>STATUS</strong>,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
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

      <Box sx={{ width: "100%" }}>
        <DataTable rows={dataSet} columns={columns} />
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

function ModalParcelasEmprestimo({ open, handleClose, parcelas }) {
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
          <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "#292929",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    SEQ.
                  </TableCell>
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
                    TIPO PAGAMENTO
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
                        <TableCell align="center">{index + 1}</TableCell>
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
                          {parcela.tp_pagamento}
                        </TableCell>
                        <TableCell align="center">
                          {renderStatusPagamento(parcela.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <>
                    {[1, 2, 3, 4, 5, 6].map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
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
        </Box>
      </Fade>
    </Modal>
  );
}