async function list(req, res) {
  const token = req.headers.authorization;

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/emprestimos/clientes`,
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

async function destroy(req, res) {
  const token = req.headers.authorization;
  const id = req.query.id ?? "";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/emprestimos/clientes/${id}/`,
    {
      method: "DELETE",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.status(result.status).json({ message: "deletado com sucesso" });
}

export default async function handler(req, res) {
  if (req.method == "GET") {
    list(req, res);
  } else if (req.method == "DELETE") {
    destroy(req, res);
  } else {
    res.status(405).send();
  }
}
