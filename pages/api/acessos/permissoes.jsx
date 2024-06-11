async function update(req, res) {
  const token = req.headers.authorization;
  const data = req.body;

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/auth/register/update-perms/`,
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

export default async function handler(req, res) {
  if (req.method == "POST") {
    update(req, res);
  } else {
    res.status(405).send();
  }
}
