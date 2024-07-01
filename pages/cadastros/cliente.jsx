import { useState, useEffect } from "react";

//Third party libraries
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { NumericFormat } from "react-number-format";
import InputMask from "react-input-mask";
import moment from "moment";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

//Mui components
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

//Custom components
import ContentWrapper from "@/components/templates/ContentWrapper";
import CustomTextField from "@/components/CustomTextField";
import DatepickerField from "@/components/DatepickerField";
import BackdropLoadingScreen from "@/components/BackdropLoadingScreen";

//Utils
import {
  converterDataParaJS,
  formatarCPFSemAnonimidade,
} from "@/helpers/utils";

import { UF_ARRAY } from "@/helpers/constants";

//Icons
import SaveIcon from "@mui/icons-material/Save";

export default function CadastrarCliente() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (session?.user.token) {
      if (id) {
        retrieveData(id);
      } else {
        clearStatesAndErrors();
      }
    }
  }, [id]);

  //States de formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState(null);
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [uf, setUf] = useState("");
  const [isBlacklisted, setIsBlacklisted] = useState("");

  //States de controle de UI
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  //const [erroViaCep, setErroViaCep] = useState(false);

  function getPayload() {
    const payload = {
      cpf: cpf.replace(/\D/g, ""),
      nome: nome.toUpperCase(),
      dt_nascimento: dataNascimento
        ? moment(dataNascimento).format("YYYY-MM-DD")
        : null,
      telefone: telefone.replace(/\D/g, ""),
      cep: cep.replace(/\D/g, ""),
      logradouro: logradouro,
      complemento: complemento,
      bairro: bairro,
      cidade: cidade,
      uf: uf,
      is_blacklisted: isBlacklisted == "sim" ? true : false,
      observacoes: observacoes,
    };

    return payload;
  }

  async function update() {
    setLoadingButton(true);
    const payload = getPayload();

    const response = await fetch(`/api/cadastros/cliente/?id=${id}`, {
      method: "PUT",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Operação realizada com sucesso");
    } else {
      toast.error("Erro na operação");
    }

    setLoadingButton(false);
  }

  async function save() {
    setLoadingButton(true);
    const payload = getPayload();

    const response = await fetch("/api/cadastros/cliente", {
      method: "POST",
      headers: {
        Authorization: session?.user?.token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Operação realizada com sucesso");
      clearStatesAndErrors();
    } else {
      toast.error("Erro na operação");
    }

    setLoadingButton(false);
  }

  async function retrieveData(id) {
    setOpenBackdrop(true);

    const response = await fetch(`/api/cadastros/cliente/?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: session?.user?.token,
      },
    });

    if (response.status == 200) {
      const json = await response.json();
      setDataForEdit(json);
    } else {
      toast.error("Aconteceu algum erro");
    }

    setOpenBackdrop(false);
  }

  function populateAddressStates(data) {
    setLogradouro(data.logradouro);
    setComplemento(data.complemento);
    setBairro(data.bairro);
    setCidade(data.localidade);
    setUf(data.uf);
  }

  const getAddressViaPostalCode = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      if (response.ok) {
        const data = await response.json();

        if (data.erro) {
          //setErroViaCep(true);
        } else {
          populateAddressStates(data);
        }
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };

  function clearStatesAndErrors() {
    setNome("");
    setCpf("");
    setDataNascimento(null);
    setTelefone("");
    setCep("");
    setLogradouro("");
    setComplemento("");
    setBairro("");
    setCidade("");
    setUf("");
    setIsBlacklisted("");
  }

  function setDataForEdit(data) {
    setNome(data.nome);
    setCpf(data.cpf);
    setDataNascimento(
      data.dt_nascimento ? converterDataParaJS(data.dt_nascimento) : null
    );
    setTelefone(data.telefone);
    setCep(data.cep);
    setLogradouro(data.logradouro);
    setComplemento(data.complemento);
    setBairro(data.bairro);
    setCidade(data.cidade);
    setUf(data.uf);
    setIsBlacklisted(data.is_blacklisted ? "sim" : "nao");
  }

  return (
    <ContentWrapper
      title={id ? "Editar dados do cliente" : "Cadastrar cliente"}
    >
      <Toaster position="bottom-center" reverseOrder={true} />
      <BackdropLoadingScreen open={openBackdrop} />

      {id && (
        <Link href="/relatorios/clientes">
          <Button variant="outlined" sx={{ mt: 2 }}>
            VOLTAR
          </Button>
        </Link>
      )}

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={nome}
            setValue={setNome}
            label="Cliente"
            placeholder="Insira o nome do cliente"
            numbersNotAllowed
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <InputMask
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
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <DatepickerField
            label="Data de nascimento"
            value={dataNascimento}
            onChange={setDataNascimento}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <InputMask
            mask="(99) 9 9999-9999"
            maskChar={null}
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
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
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <InputMask
            mask="99999-999"
            maskChar={null}
            value={cep}
            onChange={(e) => {
              const rawCep = e.target.value.replace("-", ""); // Remove o hífen para obter o CEP puro
              setCep(e.target.value);

              if (rawCep.length === 8) {
                getAddressViaPostalCode(rawCep);
              }
            }}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                variant="outlined"
                size="small"
                fullWidth
                label="CEP"
                placeholder="00000-000"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={logradouro}
            setValue={setLogradouro}
            label="Logradouro"
            maxLength={120}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={bairro}
            setValue={setBairro}
            label="Bairro"
            maxLength={60}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={complemento}
            setValue={setComplemento}
            label="Complemento"
            maxLength={120}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <CustomTextField
            value={cidade}
            setValue={setCidade}
            label="Cidade"
            maxLength={60}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <TextField
            select
            fullWidth
            label="UF"
            size="small"
            value={uf}
            onChange={(e) => {
              setUf(e.target.value);
            }}
          >
            {UF_ARRAY?.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Está na blacklist?</FormLabel>
            <RadioGroup
              row
              value={isBlacklisted}
              onChange={(e) => {
                setIsBlacklisted(e.target.value);
              }}
            >
              <FormControlLabel value="sim" control={<Radio />} label="Sim" />
              <FormControlLabel value="nao" control={<Radio />} label="Não" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            multiline
            rows={3}
            size="small"
            label="Observações"
            value={observacoes}
            onChange={(e) => {
              setObservacoes(e.target.value);
            }}
            placeholder="Insira observações se necessário..."
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <LoadingButton
            variant="contained"
            endIcon={<SaveIcon />}
            disableElevation
            loading={loadingButton}
            onClick={() => {
              id ? update() : save();
            }}
          >
            {id ? "ATUALIZAR" : "CADASTRAR"}
          </LoadingButton>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
}
