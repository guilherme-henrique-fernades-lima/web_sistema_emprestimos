async function save(req, res) {
  const token = req.headers.authorization;
  const data = req.body;
  const id_emprestimo = req.query.id_emprestimo ?? "";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/emprestimos/acordos/?id_emprestimo=${id_emprestimo}`,
    {
      method: "POST",
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

async function update(req, res) {
  const token = req.headers.authorization;
  const data = req.body;
  const id = req.query.id ?? "";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/emprestimos/acordos/${id}/`,
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

async function retrieve(req, res) {
  const token = req.headers.authorization;

  const id = req.query.id ?? "";

  const response = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/emprestimos/acordos/${id}/`,
    {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json = await response.json();

  return res.status(response.status).json(json);
}

export default async function handler(req, res) {
  if (req.method == "POST") {
    save(req, res);
  } else if (req.method == "PUT") {
    update(req, res);
  } else if (req.method == "GET") {
    retrieve(req, res);
  } else {
    res.status(405).send();
  }
}
