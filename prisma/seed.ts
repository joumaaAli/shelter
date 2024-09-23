const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Seeding data for Specialty
  const specialties = [
    "Rééducation de la personne âgée et perte d’autonomie",
    "Soins Palliatifs et accompagnement",
    "Activité physique adaptée / Sport santé",
    "Kinésithérapie du sport",
    "Rééducation neurologique",
    "Prise en charge de la douleur chronique",
    "Rééducation vestibulaire et des troubles de l’équilibre",
    "Kinésithérapie du cancer du sein",
    "Rééducation abdominale du post partum",
    "Rééducation périnéo-sphincterienne femme",
    "Rééducation périnéo-sphincterienne homme",
    "Rééducation périnéo-sphincterienne pédiatrique",
    "Rééducation pédiatrique orthopédique",
    "Rééducation pédiatrique des troubles du neuro-développement",
    "Rééducation respiratoire pédiatrique",
    "Rééducation respiratoire adulte",
    "Rééducation cardiorespiratoire",
    "Rééducation des troubles vasculaires et lymphatiques, Drainage lymphatique manuel",
    "Rééducation orthopédique et traumatique",
    "Rééducation de la main",
    "Rééducation de l’épaule",
    "Rééducation du genou",
    "Thérapie manuelle orthopédique",
    "Rééducation maxillo-faciale et de la déglutition",
    "Rééducation posturale globale, chaines musculaires",
    "Kinésithérapie des lésions cutanées et des cicatrices",
    "Education à la santé / Prévention",
    "Bilans ergonomiques",
    "Rééducation et santé mentale",
  ];

  for (const name of specialties) {
    await prisma.specialty.create({
      data: { name },
    });
  }

  // Seeding data for Materiel
  const materials = [
    "Balnéothérapie",
    "Ondes de choc",
    "Cryothérapie",
    "Echographie",
    "Pressothérapie",
    "Dépressothérapie",
    "Ondes courtes",
    "Laser",
  ];

  for (const name of materials) {
    await prisma.materiel.create({
      data: { name },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
