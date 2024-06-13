//Icons
import SubjectIcon from "@mui/icons-material/Subject";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SettingsIcon from "@mui/icons-material/Settings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const ROUTES = [
  {
    id: 1,
    title: "Cadastros",
    routes: [
      {
        id: 1,
        title: "Clientes",
        url: "/cadastros/cliente",
        // perm: "",
      },
      {
        id: 2,
        title: "Empréstimo",
        url: "/cadastros/emprestimo",
        // perm: "",
      },
    ],
    icon: <AddCircleOutlineIcon />,
    // perm: "",
  },
  {
    id: 2,
    title: "Relatórios",
    routes: [
      {
        id: 1,
        title: "Clientes",
        url: "/relatorios/clientes",
        // perm: "",
      },
    ],
    icon: <SubjectIcon />,
    // perm: "",
  },
];

function permsApps(array) {
  var perms = {};
  for (var i = 0; i < array.length; i = i + 1) {
    for (var j = 0; j < array[i].routes.length; j = j + 1) {
      perms[array[i].routes[j].url] = array[i].routes[j].perm;
    }
  }

  return perms;
}

const rotas = permsApps(ROUTES);

export { ROUTES, rotas };
