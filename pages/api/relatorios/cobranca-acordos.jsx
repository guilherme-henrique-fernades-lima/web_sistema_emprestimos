async function list(req, res) {
  const token = req.headers.authorization;
  const dt_inicio = req.query.dt_inicio ?? "";
  const dt_final = req.query.dt_final ?? "";
  const tipo_parcela = req.query.tipo_parcela ?? "";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/emprestimos/parcelas-acordo/?dt_inicio=${dt_inicio}&dt_final=${dt_final}&tipo_parcela=${tipo_parcela}`,
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

async function update(req, res) {
  const token = req.headers.authorization;
  const data = req.body;
  const id = req.query.id ?? "";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/emprestimos/parcelas-acordo/${id}/`,
    {
      method: "PUT",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
      body: data,
    }
  );

  const json = await result.json();

  return res.status(result.status).json(json);
}

export default async function handler(req, res) {
  if (req.method == "GET") {
    list(req, res);
  } else if (req.method == "PUT") {
    update(req, res);
  } else {
    res.status(405).send();
  }
}
