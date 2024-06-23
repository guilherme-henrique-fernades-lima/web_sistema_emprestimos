//Icons
import SubjectIcon from "@mui/icons-material/Subject";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LineAxisOutlinedIcon from "@mui/icons-material/LineAxisOutlined";

const ROUTES = [
  {
    id: 1,
    title: "Cadastros",
    routes: [
      {
        id: 1,
        title: "Acordo",
        url: "/cadastros/acordo",
        // perm: "",
      },
      {
        id: 2,
        title: "Clientes",
        url: "/cadastros/cliente",
        // perm: "",
      },
      {
        id: 3,
        title: "Empréstimo",
        url: "/cadastros/emprestimo",
        // perm: "",
      },
    ],
    icon: <AddCircleOutlineIcon />,
    // perm: "",
  },
  {
    id: 1,
    title: "Dashboards",
    routes: [
      {
        id: 1,
        title: "Empréstimos",
        url: "/dashboards/emprestimos",
        // perm: "",
      },
    ],
    icon: <LineAxisOutlinedIcon />,
    // perm: "",
  },
  {
    id: 2,
    title: "Relatórios",
    routes: [
      {
        id: 1,
        title: "Acordos",
        url: "/relatorios/acordos",
        // perm: "",
      },
      {
        id: 2,
        title: "Clientes",
        url: "/relatorios/clientes",
        // perm: "",
      },
      {
        id: 3,
        title: "Cobrança de empréstimos",
        url: "/relatorios/cobranca-emprestimos",
        // perm: "",
      },
      {
        id: 4,
        title: "Cobrança de acordos",
        url: "/relatorios/cobranca-acordos",
        // perm: "",
      },
      {
        id: 5,
        title: "Empréstimos",
        url: "/relatorios/emprestimos",
        // perm: "",
      },
      {
        id: 6,
        title: "Histórico de cliente",
        url: "/relatorios/historico-cliente",
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
