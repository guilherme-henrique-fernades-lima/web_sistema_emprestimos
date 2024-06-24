import { useState } from "react";

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
import Typography from "@mui/material/Typography";

// Utils
import {
  formatarData,
  formatarCPFSemAnonimidade,
  formatarReal,
  formatarTelefone,
} from "@/helpers/utils";

//Icons
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

var DATA_HOJE = new Date();
// var DATA_HOJE_FORMATTED = moment(DATA_HOJE).format("YYYY-MM-DD");

export default function RelatorioAcordos() {
  const { data: session } = useSession();

  const [dataSet, setDataset] = useState([]);

  const [parcelas, setParcelas] = useState([]);
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [idAcordo, setIdAcordo] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dadosAcordo, setDadosAcordo] = useState({});

  async function list() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/relatorios/acordos/?dt_inicio=${moment(dataInicio).format(
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
      } else {
        setDataset([]);
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function getParcelasAcordo(id) {
    try {
      const response = await fetch(
        `/api/relatorios/parcelas-acordo/?id=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: session?.user?.token,
          },
        }
      );

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
    setIdAcordo("");
  }

  function handleClose() {
    setOpenModal(false);
    setTimeout(() => {
      setDadosAcordo({});
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
            <Tooltip title="Deletar" placement="top">
              <IconButton
                color="error"
                onClick={() => {
                  setIdAcordo(params.value);
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
                  getParcelasAcordo(params.value);
                  setDadosAcordo(params.row);
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
      field: "cpf",
      headerName: "CPF",
      renderHeader: (params) => <strong>CPF</strong>,
      minWidth: 220,
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
      headerName: "NOME",
      renderHeader: (params) => <strong>NOME</strong>,
      minWidth: 260,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "telefone",
      headerName: "TELEFONE",
      renderHeader: (params) => <strong>TELEFONE</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarTelefone(params.value);
        }
      },
    },
    {
      field: "dt_acordo",
      headerName: "DATA DO ACORDO",
      renderHeader: (params) => <strong>DATA DO ACORDO</strong>,
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
      field: "vl_emprestimo",
      headerName: "VLR. EMPRÉSTIMO",
      renderHeader: (params) => <strong>VLR. EMPRÉSTIMO</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarReal(parseFloat(params.value));
        }
      },
    },
    {
      field: "vl_cobrado",
      headerName: "VLR. COBRADO",
      renderHeader: (params) => <strong>VLR. COBRADO</strong>,
      minWidth: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarReal(parseFloat(params.value));
        }
      },
    },
    {
      field: "qt_parcela",
      headerName: "QTD. PARCELAS",
      renderHeader: (params) => <strong>QTD. PARCELAS</strong>,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vl_parcela",
      headerName: "VLR. PARCELA",
      renderHeader: (params) => <strong>VLR. PARCELA</strong>,
      minWidth: 220,
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
    <ContentWrapper title="Relação de acordos">
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
        id={idAcordo}
        token={session?.user.token}
        onFinishDelete={actionsAfterDelete}
      />
      <ModalParcelasAcordo
        open={openModal}
        handleClose={handleClose}
        parcelas={parcelas}
        dadosAcordo={dadosAcordo}
      />
    </ContentWrapper>
  );
}

function DialogDeletarRegistro({ open, close, id, token, onFinishDelete }) {
  const [loading, setLoading] = useState(false);

  async function destroy() {
    try {
      setLoading(true);
      const response = await fetch(`/api/relatorios/acordos/?id=${id}`, {
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
        Deseja deletar o acordo?
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

function ModalParcelasAcordo({ open, handleClose, parcelas, dadosAcordo }) {
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
          <Box
            sx={{
              padding: 2,
              width: "100%",
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
                {dadosAcordo?.cpf &&
                  formatarCPFSemAnonimidade(dadosAcordo?.cpf)}
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
              <Typography>{dadosAcordo?.nome}</Typography>
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
                {dadosAcordo?.telefone
                  ? formatarTelefone(dadosAcordo?.telefone)
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
                {dadosAcordo?.vl_emprestimo &&
                  formatarReal(parseFloat(dadosAcordo?.vl_emprestimo))}
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
              <Typography sx={{ fontWeight: 700 }}>Valor cobrado:</Typography>
              <Typography>
                {dadosAcordo?.vl_cobrado &&
                  formatarReal(parseFloat(dadosAcordo?.vl_cobrado))}
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
              <Typography>{dadosAcordo?.qt_parcela}</Typography>
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
                {dadosAcordo?.vl_parcela &&
                  formatarReal(parseFloat(dadosAcordo?.vl_parcela))}
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
              <Typography>{dadosAcordo?.observacoes}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>Data do acordo:</Typography>
              <Typography>
                {dadosAcordo?.dt_acordo && formatarData(dadosAcordo?.dt_acordo)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
