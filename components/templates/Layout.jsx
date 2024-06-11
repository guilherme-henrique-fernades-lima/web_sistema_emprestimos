import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

//Third party libraries
import { useSession, signOut } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

//Mui components
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

//Icons
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ExpandLess from "@mui/icons-material/ExpandLess";
import LockResetIcon from "@mui/icons-material/LockReset";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

//Custom components
import { ROUTES } from "@/helpers/routes";
// import { ProtectedRoute } from "@/components/templates/ProtectedRoute";
import CustomTextField from "@/components/CustomTextField";

//Schema
import { resetPassword } from "@/schemas/resetPassword";

export default function Layout({ children }) {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [openModalResetPassword, setOpenModalResetPassword] = useState(false);

  const handleDrawerCloseOpen = () => {
    setOpen((open) => !open);
  };

  const handleLogout = async () => {
    const data = await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  function capitalizarPrimeirasLetras(str) {
    return str.toLowerCase().replace(/(^|\s)\S/g, function (l) {
      return l.toUpperCase();
    });
  }

  const handleModalResetPassword = () =>
    setOpenModalResetPassword(
      (openModalResetPassword) => !openModalResetPassword
    );

  return (
    <>
      {session?.user ? (
        <Box sx={{ display: "flex" }}>
          <AppBar position="fixed" open={open} elevation={0}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerCloseOpen}
                edge="start"
                sx={{ mr: 2 }}
              >
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>

              {/* <LogoCedulaPromotora /> */}
            </Toolbar>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DropdownMenu
                username={capitalizarPrimeirasLetras(session?.user.username)}
                handleOpenModal={handleModalResetPassword}
                handleLogout={handleLogout}
              />
            </Box>
          </AppBar>
          <Drawer
            sx={{
              width: DRAWER_WIDTH,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader></DrawerHeader>
            <Divider />
            <MenuOptions perms={session?.user?.perms} />
            {/* <Divider /> */}
          </Drawer>
          <Main open={open}>
            <DrawerHeader />
            {/* <ProtectedRoute perms={session?.user?.perms}> */}
            {children}
            {/* </ProtectedRoute> */}
          </Main>
        </Box>
      ) : (
        // <ProtectedRoute>
        <>{children}</>
        // </ProtectedRoute>
      )}

      <ModalChangePassword
        open={openModalResetPassword}
        setOpen={handleModalResetPassword}
      >
        <ChangePasswordForm
          user_id={session?.user?.id}
          token={session?.user?.token}
        />
      </ModalChangePassword>
      <Toaster position="bottom-center" reverseOrder={true} />
    </>
  );
}

const DRAWER_WIDTH = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    backgroundColor: "#e8e8e8",
    minHeight: "100vh",
    width: "100%",
    padding: theme.spacing(3),

    ["@media (max-width:780px)"]: {
      padding: theme.spacing(1),
    },
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${DRAWER_WIDTH}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: "row",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: `${DRAWER_WIDTH}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

function TitleTypography({ children }) {
  return (
    <Typography
      variant="span"
      component="span"
      sx={{
        fontWeight: 700,
        fontSize: { xs: 12, sm: 14, md: 14, lg: 16, xl: 16 },
        color: "#212121",
      }}
    >
      {children}
    </Typography>
  );
}

function LogoCedulaPromotora() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Link href="/">
        <Image
          src="/img/logotipo.png"
          width={160}
          height={56}
          alt="Logo da Cédula Promotora"
          priority
        />
      </Link>
    </Box>
  );
}

function MenuOptions({ perms }) {
  const [dropDownOption, setDropdownOption] = useState(false);

  const handleDropdownToggle = (index) => {
    setDropdownOption((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <List>
      {ROUTES.map((option, index) => (
        <React.Fragment key={option.id}>
          <ListItem
            key={option.id}
            disablePadding
            onClick={() => handleDropdownToggle(index)}
            sx={{
              transition: "all 0.3s ease",
              backgroundColor:
                dropDownOption === index ? "#292929" : "transparent",
            }}
          >
            <ListItemButton>
              <ListItemIcon
                sx={{ color: dropDownOption === index ? "#fff" : "#747474" }}
              >
                {option.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="span"
                    component="span"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: 12, sm: 14, md: 14, lg: 16, xl: 16 },
                      color: dropDownOption === index ? "#fff" : "#212121",
                    }}
                  >
                    {option.title}
                  </Typography>
                }
              />
              <ExpandLess
                sx={{
                  fontSize: "20px",
                  transition: "all 0.3s ease",
                  transform:
                    dropDownOption === index ? "rotate(180deg)" : "none",
                  color: dropDownOption === index ? "#fff" : "#212121",
                }}
              />
            </ListItemButton>
          </ListItem>

          <Collapse in={dropDownOption === index} timeout="auto" unmountOnExit>
            <List component="nav" disablePadding>
              {option.routes.map((route) => (
                <Link href={route.url} key={route.id}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon sx={{ pl: 3 }}>
                        <FiberManualRecordIcon sx={{ fontSize: "8px" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <TitleTypography>{route.title}</TitleTypography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
}

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function DropdownMenu({ username, handleOpenModal, handleLogout }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ mr: 3 }}
      >
        {username}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleOpenModal();
            handleClose();
          }}
        >
          <LockResetIcon />
          Alterar senha
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon />
          Sair
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

function ModalChangePassword({ open, setOpen, children }) {
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

function ChangePasswordForm({ user_id, token }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(resetPassword),
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleClickShowPassword = (passwordField) => {
    if (passwordField === "newPassword") {
      setShowNewPassword((showPassword) => !showPassword);
    } else {
      setShowConfirmNewPassword((showNewPassword) => !showNewPassword);
    }
  };

  function clearStatesAndErrors() {
    reset();
    setNewPassword("");
    setConfirmNewPassword("");
  }

  async function alterarSenha() {
    try {
      setLoading(true);

      const payload = {
        user_id: user_id,
        password: newPassword,
      };

      const response = await fetch("/api/acessos/change-password", {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Alterado com sucesso!");
        clearStatesAndErrors();
        setLoading(false);
      } else {
        toast.error("Erro ao alterar");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(alterarSenha)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{ fontWeight: 700, mb: 2, textAlign: "left", width: "100%" }}
      >
        Alterar a senha
      </Typography>

      <Box sx={{ mt: 2 }} />

      <CustomTextField
        value={newPassword}
        setValue={setNewPassword}
        label="Nova senha"
        placeholder="Insira a nova senha"
        validateFieldName="newPassword"
        type={showNewPassword ? "text" : "password"}
        control={control}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => handleClickShowPassword("newPassword")}
                size="small"
              >
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ mt: 2 }} />

      <CustomTextField
        value={confirmNewPassword}
        setValue={setConfirmNewPassword}
        label="Repita a senha"
        placeholder="Repita a senha"
        validateFieldName="confirmNewPassword"
        type={showConfirmNewPassword ? "text" : "password"}
        control={control}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} size="small">
                {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        type="submit"
        variant="contained"
        endIcon={<SaveIcon />}
        disableElevation
        loading={loading}
        fullWidth
        //onClick={alterarSenha}
        sx={{ mt: 2 }}
      >
        ALTERAR
      </LoadingButton>
    </Box>
  );
}
