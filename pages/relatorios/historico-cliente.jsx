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
import CustomTextField from "@/components/CustomTextField";

//Mui components
import Box from "@mui/material/Box";
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

export default function RelatorioHistoricoCliente() {
  const { data: session } = useSession();

  const [cpfSearch, setCpfSearch] = useState("");

  useEffect(() => {
    if (session?.user.token) {
    }
  }, [session?.user]);

  return (
    <ContentWrapper title="Histórico de cliente">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={cpfSearch}
            setValue={setCpfSearch}
            label="CPF"
            placeholder="Insira o CPF para pesquisa"
            onlyNumbers
            maxLength={11}
          />
        </Grid>
      </Grid>
    </ContentWrapper>
  );
}
