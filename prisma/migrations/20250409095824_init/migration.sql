-- CreateEnum
CREATE TYPE "TypeMesure" AS ENUM ('BSC', 'MQ');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "roles" TEXT[],
    "expoPushToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vacation" (
    "id" SERIAL NOT NULL,
    "pds" TEXT,
    "vac" TEXT,
    "userID" INTEGER NOT NULL,
    "createdAd" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vacation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "mission" TEXT NOT NULL,
    "trainCourse" TEXT NOT NULL,
    "commentaire" TEXT,
    "ligne" TEXT,
    "objectif" INTEGER,
    "service" TEXT,
    "hd" TIMESTAMP(3) NOT NULL,
    "ha" TIMESTAMP(3) NOT NULL,
    "departureTimeOrigin" TIMESTAMP(3),
    "arrivalTimeTerminus" TIMESTAMP(3),
    "placeDeparture" TEXT NOT NULL,
    "placeArrival" TEXT NOT NULL,
    "vacationId" INTEGER NOT NULL,
    "mesureId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatadAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mesure" (
    "id" SERIAL NOT NULL,
    "type" "TypeMesure" NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mesure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MesureBsc" (
    "id" SERIAL NOT NULL,
    "mesureId" INTEGER NOT NULL,
    "composition" TEXT NOT NULL,
    "numMaterial" TEXT NOT NULL,
    "distrbutedQuestionnaire" INTEGER NOT NULL,
    "emptyQuestionnaire" INTEGER NOT NULL,
    "invalidQuestionnaire" INTEGER NOT NULL,
    "validQuestionnnaire" INTEGER NOT NULL,
    "lateDeparture" INTEGER NOT NULL,
    "lateArrived" INTEGER NOT NULL,
    "departureStation" TEXT NOT NULL,
    "arrivalStation" TEXT NOT NULL,

    CONSTRAINT "MesureBsc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MesureMQ" (
    "id" SERIAL NOT NULL,
    "mesureId" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "numberPlate" TEXT NOT NULL,
    "busBrand" TEXT NOT NULL,
    "driverBadge" BOOLEAN NOT NULL,
    "usb" BOOLEAN NOT NULL,
    "onBoardConfort" BOOLEAN NOT NULL,
    "ticketCheck" BOOLEAN NOT NULL,
    "applicationLocaliTER" BOOLEAN NOT NULL,
    "destinationDisplay" BOOLEAN NOT NULL,
    "routeIndicator" BOOLEAN NOT NULL,
    "wheelchairRamp" BOOLEAN NOT NULL,
    "busLoad" BOOLEAN NOT NULL,
    "outdoorCleanliness" BOOLEAN NOT NULL,
    "intdoorCleanliness" BOOLEAN NOT NULL,
    "intdoorState" BOOLEAN NOT NULL,
    "outdoorState" BOOLEAN NOT NULL,
    "ontimeDeparture" BOOLEAN NOT NULL,
    "itinerary" BOOLEAN NOT NULL,
    "availabilityAtThePlatform" BOOLEAN NOT NULL,
    "commercialBehavior" BOOLEAN NOT NULL,
    "uniform" BOOLEAN NOT NULL,
    "drivingBehavior" BOOLEAN NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "MesureMQ_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MesureBsc_mesureId_key" ON "MesureBsc"("mesureId");

-- CreateIndex
CREATE UNIQUE INDEX "MesureMQ_mesureId_key" ON "MesureMQ"("mesureId");

-- AddForeignKey
ALTER TABLE "Vacation" ADD CONSTRAINT "Vacation_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_vacationId_fkey" FOREIGN KEY ("vacationId") REFERENCES "Vacation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_mesureId_fkey" FOREIGN KEY ("mesureId") REFERENCES "Mesure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MesureBsc" ADD CONSTRAINT "MesureBsc_mesureId_fkey" FOREIGN KEY ("mesureId") REFERENCES "Mesure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MesureMQ" ADD CONSTRAINT "MesureMQ_mesureId_fkey" FOREIGN KEY ("mesureId") REFERENCES "Mesure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
