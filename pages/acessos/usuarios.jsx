import React, { useState, useEffect } from "react";

//Third party libraries
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

//Mui components
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import LoadingButton from "@mui/lab/LoadingButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";

//Custom components
import ContentWrapper from "../../components/templates/ContentWrapper";
import CustomTextField from "@/components/CustomTextField";
import Spinner from "@/components/Spinner";

//Icons
import LockPersonIcon from "@mui/icons-material/LockPerson";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

//Rotas da aplicacao
import { ROUTES } from "@/helpers/routes";

export default function Usuarios() {
  const { data: session } = useSession();

  const [dataset, setDataset] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDetailsUser, setOpenDetailsUser] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  //Estados para a atualização
  const [userSelected, setUserSelected] = useState({
    user_id: "",
    is_active: false,
    perms: {},
  });

  const handleModal = () => setOpen((open) => !open);

  const handleModalDetailsUser = (user) => {
    setUserSelected({
      user_id: user.id,
      is_active: user.is_active,
      perms: user.perms,
    });
    if (openDetailsUser == true) {
      setUserSelected({
        user_id: "",
        is_active: false,
        perms: {},
      });
    }
    setOpenDetailsUser((openDetailsUser) => !openDetailsUser);
  };

  useEffect(() => {
    if (session?.user) {
      getAllData();
    }
  }, [session?.user]);

  function getPayload() {
    const payload = {
      username: username,
      email: email,
    };

    return payload;
  }

  async function getAllData() {
    setLoadingUsers(true);
    try {
      const response = await fetch("/api/acessos/usuarios", {
        method: "GET",
        headers: {
          Authorization: session?.user?.token,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setDataset(json);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingUsers(false);
    }
  }

  async function save() {
    try {
      setLoading(true);
      const payload = getPayload();

      const response = await fetch("/api/acessos/usuarios", {
        method: "POST",
        headers: {
          Authorization: session?.user?.token,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Cadastrado com sucesso!");
        clearStatesAndErrors();
        setLoading(false);
        getAllData();
      } else {
        toast.error("Erro ao cadastrar");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getPayloadPermsUpdate() {
    const payload = {
      user_id: userSelected.user_id,
      is_active: userSelected.is_active,
      permissions: userSelected?.perms,
    };

    return payload;
  }

  async function updatePerms() {
    try {
      setLoading(true);
      const payload = getPayloadPermsUpdate();

      const response = await fetch("/api/acessos/permissoes/", {
        method: "POST",
        headers: {
          Authorization: session?.user?.token,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Atualizado com sucesso!");
        //clearStatesAndErrors();
        setLoading(false);
        getAllData();
      } else {
        toast.error("Erro");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function clearStatesAndErrors() {
    setUsername("");
    setEmail("");
    handleModal();
  }

  const handleCheckBoxPermission = (perm) => {
    setUserSelected((prevPermissions) => ({
      ...prevPermissions,
      perms: {
        ...prevPermissions.perms,
        [`${perm}`]: !prevPermissions.perms[perm],
      },
    }));
  };

  const handleActiveUserSwitch = (event) => {
    setUserSelected((prevState) => ({
      ...prevState,
      is_active: event.target.checked,
    }));
  };

  return (
    <ContentWrapper title="Controle de usuários">
      <Toaster position="bottom-center" reverseOrder={true} />

      <Button
        variant="contained"
        disableElevation
        endIcon={<PersonAddAltIcon />}
        sx={{ mt: 2 }}
        onClick={handleModal}
      >
        Criar usuário
      </Button>

      <Box
        sx={{
          width: "100%",
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {loadingUsers ? (
          <>
            <Box sx={{ mt: 3 }} />
            <Spinner />
            <Box sx={{ mb: 3 }} />
          </>
        ) : (
          <>
            {dataset?.map((item, index) => (
              <>
                {item?.id != 23 && (
                  <CardUser
                    key={index}
                    user={item}
                    handleOpenModalDetailsUser={() =>
                      handleModalDetailsUser(item)
                    }
                  />
                )}
              </>
            ))}
          </>
        )}
      </Box>

      <ModalCreateUser open={openDetailsUser} setOpen={handleModalDetailsUser}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          Editar permissões do usuário
        </Typography>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={userSelected.is_active}
                onChange={handleActiveUserSwitch}
              />
            }
            label={userSelected.is_active ? "Ativo" : "Inativo"}
          />
        </FormGroup>

        {ROUTES?.map((route) => (
          <React.Fragment key={route.id}>
            <FormGroup sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userSelected?.perms[route?.perm] ? true : false}
                    onChange={() => handleCheckBoxPermission(route?.perm)}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 700 }}>
                    {route?.title.toUpperCase()}
                  </Typography>
                }
                key={route?.id}
              />
            </FormGroup>

            <Box
              sx={{ borderTop: "1px solid #ccc", width: "100%", mb: 2, mt: -1 }}
            />

            <FormGroup>
              {route?.routes?.map((url) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={userSelected?.perms[url?.perm] ? true : false}
                      onChange={() => handleCheckBoxPermission(url?.perm)}
                    />
                  }
                  label={url?.title}
                  key={url?.id}
                />
              ))}
            </FormGroup>
          </React.Fragment>
        ))}

        <LoadingButton
          disableElevation
          variant="contained"
          endIcon={<SaveIcon />}
          fullWidth
          sx={{ mt: 2 }}
          onClick={updatePerms}
          loading={loading}
        >
          Salvar
        </LoadingButton>
      </ModalCreateUser>

      <ModalCreateUser open={open} setOpen={setOpen}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          Cadastrar novo usuário
        </Typography>
        <CustomTextField
          value={username}
          setValue={setUsername}
          label="Nome de usuário"
          // numbersNotAllowed
          //helperText="O nome de usuário é obrigatório"
          placeholder="Insira o nome"
          //validateFieldName={}
          //errorFlag={}
          //maskFieldFlag={}
        />

        <Box sx={{ mt: 2 }} />

        <CustomTextField
          value={email}
          setValue={setEmail}
          label="E-mail"
          //helperText="O nome de usuário é obrigatório"
          placeholder="Insira o e-mail do usuário"
          //validateFieldName={}
          //errorFlag={}
          //maskFieldFlag={}
        />

        <LoadingButton
          disableElevation
          variant="contained"
          endIcon={<PersonAddAltIcon />}
          fullWidth
          sx={{ mt: 2 }}
          loading={loading}
          onClick={save}
        >
          Criar usuário
        </LoadingButton>
      </ModalCreateUser>
    </ContentWrapper>
  );
}

function CardUser({ user, handleOpenModalDetailsUser }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        minHeight: 70,
        backgroundColor: "#f6f6f6",
        mt: 1,
        borderRadius: 2,
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          flexDirection: "column",
          ml: 2,
        }}
      >
        <Typography
          variant="span"
          sx={{
            color: "#242424",
            fontFamily: "Lato, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          <strong>Email:</strong> {user?.email}
        </Typography>
        <Typography
          variant="span"
          sx={{
            color: "#242424",
            fontFamily: "Lato, sans-serif",
            fontSize: "16px",
          }}
        >
          <strong>Nome de usuário:</strong> {user?.username?.toUpperCase()}{" "}
        </Typography>

        {user.is_active ? (
          <Typography
            variant="span"
            sx={{
              color: "#155e03",
              fontFamily: "Lato, sans-serif",
              fontSize: "12px",
              border: "2px solid #155e03",
              borderRadius: "4px",
              fontWeight: "bold",
              padding: "3px 5px",
              mt: 1,
            }}
          >
            ATIVO
          </Typography>
        ) : (
          <Typography
            variant="span"
            sx={{
              color: "#970b06",
              fontFamily: "Lato, sans-serif",
              fontSize: "12px",
              border: "2px solid #970b06",
              borderRadius: "4px",
              fontWeight: "bold",
              padding: "3px 5px",
              mt: 1,
            }}
          >
            INATIVO
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          mr: 2,
        }}
      >
        <Tooltip title="Editar permissões" placement="top">
          <IconButton onClick={handleOpenModalDetailsUser}>
            <LockPersonIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

function ModalCreateUser({ open, setOpen, children }) {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
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
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 420,
            //height: "100%",
            maxHeight: 420,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            overflowY: "auto",
          }}
        >
          <IconButton
            color="error"
            onClick={handleClose}
            sx={{ position: "absolute", top: 15, right: 15 }}
          >
            <CloseIcon />
          </IconButton>
          {children}
        </Box>
      </Fade>
    </Modal>
  );
}
