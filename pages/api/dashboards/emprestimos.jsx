async function list(req, res) {
  const token = req.headers.authorization;
  // const dt_inicio = req.query.dt_inicio ?? "";
  // const dt_final = req.query.dt_final ?? "";

  const dt_inicio = "2024-01-01";
  const dt_final = "2024-12-31";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/emprestimos/emprestimos/dashboard/?dt_inicio=${dt_inicio}&dt_final=${dt_final}`,
    {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json = await result.json();

  return res.status(result.status).json(json);
}

export default async function handler(req, res) {
  if (req.method == "GET") {
    list(req, res);
  } else {
    res.status(405).send();
  }
}
