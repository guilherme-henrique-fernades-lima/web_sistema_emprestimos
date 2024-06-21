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
  //States de controle de UI
  const [loadingButton, setLoadingButton] = useState(false);

  return (
    <ContentWrapper title="Dashboard de empréstimos">
      <Toaster position="bottom-center" reverseOrder={true} />
    </ContentWrapper>
  );
}
