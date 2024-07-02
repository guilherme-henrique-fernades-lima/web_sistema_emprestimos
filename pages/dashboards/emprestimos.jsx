import { useState, useEffect } from "react";

//Third party libraries
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { NumericFormat } from "react-number-format";
import InputMask from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import Link from "next/link";

//Mui components
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

//Custom components
import ContentWrapper from "@/components/templates/ContentWrapper";
import CustomTextField from "@/components/CustomTextField";
import DatepickerFieldWithValidation from "@/components/DatepickerFieldWithValidation";
import BackdropLoadingScreen from "@/components/BackdropLoadingScreen";

export default function DashboardEmprestimos() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.token) {
      list();
    }
  }, [session?.user]);

  //States de controle de UI
  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState([]);

  console.log(dataset);

  async function list() {
    setLoading(true);
    try {
      const response = await fetch(`/api/dashboards/emprestimos`, {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      });

      if (response.ok) {
        const json = await response.json();
        console.log("json: ", json);
        setDataset(json);
      } else {
        toast.error("Sem dados encontrados");
        setDataset([]);
      }
    } catch (error) {
      console.error("Erro ao obter dados", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ContentWrapper title="Dashboard de empréstimos">
      <Toaster position="bottom-center" reverseOrder={true} />
    </ContentWrapper>
  );
}
