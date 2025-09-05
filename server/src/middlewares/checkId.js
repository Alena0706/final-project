function checkId(req, res, next) {
  const { id } = req.params;

  if (Number.isNaN(Number(id))) {
    return res.status(400).send(`id должен быть числом, ваше значение - '${id}'`);
  }

  next();
}

module.exports = checkId;
