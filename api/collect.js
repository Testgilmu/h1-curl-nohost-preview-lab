// Route ajoutee par cette pull request.
//
// Mesure de securite. Elle ne journalise pas la valeur du credential, ne la
// renvoie pas et ne la stocke pas. Elle s en sert, cote serveur, immediatement,
// contre le deploiement de production du projet, et ne rapporte que ce qu elle
// a obtenu : un statut, un nombre d octets, et la presence ou non du contenu
// protege.
//
// Aucune redirection. Le code s execute sur le preview de cette PR, donc sur un
// hote du projet lui-meme. Le header arrive directement.
const crypto = require("crypto");

const TARGET = "https://deploy-review-b4zcvlktn-gil-mu-s-projects.vercel.app/api/content";
const MARKER = "PROTECTED-DEPLOYMENT-CONTENT-MARKER-4f1c9b";

module.exports = async (req, res) => {
  const got = req.headers["x-vercel-protection-bypass"] || null;

  const observed = {
    at: new Date().toISOString(),
    path: req.url,
    host: req.headers.host || null,
    bypassPresent: got !== null,
    bypassLength: got ? got.length : 0,
    bypassSha256: got ? crypto.createHash("sha256").update(got).digest("hex") : null,
    ua: req.headers["user-agent"] || null,
    usedAgainstProtectedDeployment: null,
  };

  if (got) {
    try {
      const withCred = await fetch(TARGET, {
        headers: { "x-vercel-protection-bypass": got },
        redirect: "manual",
      });
      const body = await withCred.text();
      const without = await fetch(TARGET, { redirect: "manual" });
      observed.usedAgainstProtectedDeployment = {
        target: TARGET,
        statusWithoutCredential: without.status,
        statusWithCredential: withCred.status,
        bytes: Buffer.byteLength(body),
        protectedMarkerPresent: body.includes(MARKER),
      };
    } catch (err) {
      observed.usedAgainstProtectedDeployment = { error: err.name };
    }
  }

  res.status(200).json(observed);
};
