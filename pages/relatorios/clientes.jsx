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
  formatarCEP,
  formatarTelefone,
  formatarCPFSemAnonimidade,
} from "@/helpers/utils";

//Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FileUploadIcon from "@mui/icons-material/FileUpload";

var DATA_HOJE = new Date();

export default function RelatorioClientes() {
  const { data: session } = useSession();

  const [dataSet, setDataset] = useState([]);
  console.log(dataSet);
  const [dataInicio, setDataInicio] = useState(DATA_HOJE.setDate(1));
  const [dataFim, setDataFim] = useState(new Date());
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [idCliente, setIdCliente] = useState("");

  useEffect(() => {
    if (session?.user.token) {
      list();
    }
  }, [session?.user]);

  async function list() {
    try {
      const response = await fetch(
        `/api/relatorios/clientes/?dt_inicio=${moment(dataInicio).format(
          "YYYY-MM-DD"
        )}&dt_final=${moment(dataFim).format("YYYY-MM-DD")}&user_id=${
          session?.user.id
        }`,
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
    setIdCliente("");
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
            <Tooltip title="Editar" placement="top">
              <Link href={`/cadastros/cliente/?id=${params.value}`}>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Link>
            </Tooltip>

            <Tooltip title="Deletar" placement="top">
              <IconButton
                color="error"
                sx={{ ml: 1 }}
                onClick={() => {
                  setIdCliente(params.value);
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
      headerName: "NOME CLIENTE",
      renderHeader: (params) => <strong>NOME CLIENTE</strong>,
      minWidth: 300,
      align: "left",
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
      field: "cep",
      headerName: "CEP",
      renderHeader: (params) => <strong>CEP</strong>,
      minWidth: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return formatarCEP(params.value);
        }
      },
    },
    {
      field: "logradouro",
      headerName: "LOGRADOURO",
      renderHeader: (params) => <strong>LOGRADOURO</strong>,
      minWidth: 350,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "complemento",
      headerName: "COMPLEMENTO",
      renderHeader: (params) => <strong>COMPLEMENTO</strong>,
      minWidth: 300,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "bairro",
      headerName: "BAIRRO",
      renderHeader: (params) => <strong>BAIRRO</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cidade",
      headerName: "CIDADE",
      renderHeader: (params) => <strong>CIDADE</strong>,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "uf",
      headerName: "UF",
      renderHeader: (params) => <strong>UF</strong>,
      minWidth: 120,
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
    {
      field: "is_blacklisted",
      headerName: "ESTÁ NA BLACKLIST?",
      renderHeader: (params) => <strong>ESTÁ NA BLACKLIST?</strong>,
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
  ];

  return (
    <ContentWrapper title="Relação de clientes">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Box sx={{ width: "100%" }}>
        <DataTable rows={dataSet} columns={columns} />
      </Box>

      <DialogDeletarRegistro
        open={openDialogDelete}
        close={setOpenDialogDelete}
        id={idCliente}
        token={session?.user.token}
        onFinishDelete={actionsAfterDelete}
      />
    </ContentWrapper>
  );
}

function DialogDeletarRegistro({ open, close, id, token, onFinishDelete }) {
  const [loading, setLoading] = useState(false);

  async function destroy() {
    try {
      setLoading(true);
      const response = await fetch(`/api/relatorios/clientes/?id=${id}`, {
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
        Deseja deletar o cliente?
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
