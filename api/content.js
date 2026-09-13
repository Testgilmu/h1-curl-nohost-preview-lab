// Contenu qui n existe que derriere la protection de deploiement.
module.exports = (req, res) => {
  res.status(200).send("PROTECTED-DEPLOYMENT-CONTENT-MARKER-4f1c9b\n");
};
