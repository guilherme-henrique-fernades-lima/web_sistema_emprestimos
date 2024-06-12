import { useEffect, useState } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import moment from "moment";
import { useRouter } from "next/router";
import Link from "next/link";

//Custom componentes
import ContentWrapper from "../../components/templates/ContentWrapper";
import DataTable from "@/components/Datatable";
import DatepickerField from "@/components/DatepickerField";

//Mui components
import Box from "@mui/material/Box";

//Mui components
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

//Utils
import {
  formatarData,
  formatarCPFSemAnonimidade,
  formatarValorBRL,
  formatarDataComHora,
  formatarReal,
} from "@/helpers/utils";

//Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FileUploadIcon from "@mui/icons-material/FileUpload";

var DATA_HOJE = new Date();

export default function RelatorioClientes() {
  const { data: session } = useSession();

  const [dataSet, setDataset] = useState([]);
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [idFuturoContrato, setIdFuturoContrato] = useState("");

  useEffect(() => {
    if (session?.user.token) {
      list();
    }
  }, [session?.user]);

  async function list() {
    try {
      const response = await fetch(
        `/api/relatorios/futuros-contratos/?dt_inicio=${moment(
          dataInicio
        ).format("YYYY-MM-DD")}&dt_final=${moment(dataFim).format(
          "YYYY-MM-DD"
        )}&user_id=${session?.user.id}`,
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
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
    }
  }

  function actionsAfterDelete() {
    setOpenDialogDelete(false);
    list();
    setIdFuturoContrato("");
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
            <Tooltip title="Editar futuro-contrato" placement="top">
              <Link href={`/cadastros/futuros-contratos/?id=${params.value}`}>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Link>
            </Tooltip>

            <Tooltip title="Deletar futuro-contrato" placement="top">
              <IconButton
                color="error"
                sx={{ ml: 1 }}
                onClick={() => {
                  setIdFuturoContrato(params.value);
                  setOpenDialogDelete(true);
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
      field: "nome_cliente",
      headerName: "NOME CLIENTE",
      renderHeader: (params) => <strong>NOME CLIENTE</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cpf_cliente",
      headerName: "CPF CLIENTE",
      renderHeader: (params) => <strong>CPF CLIENTE</strong>,
      minWidth: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nome_rep_legal",
      headerName: "NOME REPRESENTANTE LEGAL",
      renderHeader: (params) => <strong>NOME REPRESENTANTE LEGAL</strong>,
      minWidth: 350,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "cpf_rep_legal",
      headerName: "CPF REPRESENTANTE LEGAL",
      renderHeader: (params) => <strong>CPF REPRESENTANTE LEGAL</strong>,
      minWidth: 300,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "nome_convenio",
      headerName: "CONVÊNIO",
      renderHeader: (params) => <strong>CONVÊNIO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nome_operacao",
      headerName: "OPERAÇÃO",
      renderHeader: (params) => <strong>OPERAÇÃO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nome_banco",
      headerName: "BANCO",
      renderHeader: (params) => <strong>BANCO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vl_contrato",
      headerName: "VLR. DO CONTRATO",
      renderHeader: (params) => <strong>VLR. DO CONTRATO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarValorBRL(parseFloat(params.value));
        }
      },
    },
    {
      field: "dt_concessao_beneficio",
      headerName: "DATA CONCESSÃO DO BENEFÍCIO",
      renderHeader: (params) => <strong>DATA CONCESSÃO DO BENEFÍCIO</strong>,
      minWidth: 350,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
    {
      field: "dt_efetivacao_emprestimo",
      headerName: "DATA EFETIVAÇÃO DO BENEFÍCIO",
      renderHeader: (params) => <strong>DATA EFETIVAÇÃO DO BENEFÍCIO</strong>,
      minWidth: 350,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarData(params.value);
        }
      },
    },
    {
      field: "representante_legal",
      headerName: "REPRESENTANTE LEGAL?",
      renderHeader: (params) => <strong>REPRESENTANTE LEGAL?</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value === true) {
          return "SIM";
        } else if (params.value === false) {
          return "NÃO";
        }
      },
    },
    {
      field: "iletrado",
      headerName: "ILETRADO?",
      renderHeader: (params) => <strong>ILETRADO?</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value === true) {
          return "SIM";
        } else if (params.value === false) {
          return "NÃO";
        }
      },
    },
    {
      field: "tipo_contrato",
      headerName: "TIPO DO CONTRATO",
      renderHeader: (params) => <strong>TIPO DO CONTRATO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value == "fisico") {
          return "FÍSICO";
        } else if (params.value == "digital") {
          return "DIGITAL";
        }
      },
    },
    {
      field: "observacoes",
      headerName: "OBSERVAÇÕES",
      renderHeader: (params) => <strong>OBSERVAÇÕES</strong>,
      minWidth: 350,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <ContentWrapper title="Relação de clientes">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Grid container spacing={1} sx={{ mt: 1, mb: 2 }}>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
          <DatepickerField
            label="Início"
            value={dataInicio}
            onChange={setDataInicio}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
          <DatepickerField label="Fim" value={dataFim} onChange={setDataFim} />
        </Grid>

        <Grid item xs={12} sm={12} md={2} lg={2} xl={1}>
          <Button variant="contained" disableElevation fullWidth onClick={list}>
            PESQUISAR
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ width: "100%" }}>
        <DataTable rows={dataSet} columns={columns} />
      </Box>

      <DialogExcluirFuturoContrato
        open={openDialogDelete}
        close={setOpenDialogDelete}
        id={idFuturoContrato}
        token={session?.user.token}
        onFinishDelete={actionsAfterDelete}
      />
    </ContentWrapper>
  );
}

function DialogExcluirFuturoContrato({
  open,
  close,
  id,
  token,
  onFinishDelete,
}) {
  const [loading, setLoading] = useState(false);

  async function deletarPreContrato() {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/relatorios/futuros-contratos/?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

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
        Deseja deletar o futuro contrato?
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
          onClick={deletarPreContrato}
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
