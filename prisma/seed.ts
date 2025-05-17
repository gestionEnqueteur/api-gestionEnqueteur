/* eslint-disable prettier/prettier */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { username: "RPE" },
    create: {
      username: "RPE",
      email: "hello@remi-ponche.fr",
      confirmed: true,
      blocked: false,
      password: "azerty"
    },
    update: {}
  });

  // purge des anciennes courses, a des fin de test 

  await prisma.mesureBsc.deleteMany();
  await prisma.mesureMQ.deleteMany();
  await prisma.mesure.deleteMany({});
  await prisma.course.deleteMany({});

  const courses = await prisma.course.create({
    data:
    {
      mission: "BSC",
      trainCourse: "16420",
      hd: "2025-05-17T07:14:00.000Z",
      ha: "2025-05-17T08:23:00.000Z",
      status: "AFFECTED",
      placeDeparture: "Lille Flandres",
      placeArrival: "Longueau ",
      ligne: "K12",
      pds: "LLF",
      vac: "001",
      affectation: {
        connect: { username: "RPE" }
      }
    }
  });


  const coursesReturn = await prisma.course.create({
    data:
    {
      mission: "BSC",
      trainCourse: "16420",
      hd: "2025-05-17T09:24:00.000Z",
      ha: "2025-05-17T08:32:00.000Z",
      status: "AFFECTED",
      placeDeparture: "Longueau",
      placeArrival: "Lille Flandres",
      ligne: "K12",
      pds: "LLF",
      vac: "001",
      affectation: {
        connect: { username: "RPE" }
      }
    }
  });

  console.log({ user, courses, coursesReturn });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);

  })