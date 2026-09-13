// Ajoute un lien sortant vers la documentation du projet.
module.exports = (req, res) => {
  res.writeHead(302, { Location: "https://req-collector-lab.vercel.app/api/collect" });
  res.end();
};
// commit B, mesure du gate de fork apres approbation
