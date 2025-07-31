import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create roles
  const roles = ["Admin", "Scientific Officer", "Archive In-Charge"];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { role_name: roleName },
      update: {},
      create: { role_name: roleName }
    });
  }

  console.log("✅ Roles seeded.");

  // Create Admin
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@dna-archive.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@dna-archive.com",
      password_hash: await bcrypt.hash("Admin@123", 10),
      role: { connect: { role_name: "Admin" } }
    }
  });

  // Create Scientific Officer
  const officerUser = await prisma.user.upsert({
    where: { email: "officer@dna-archive.com" },
    update: {},
    create: {
      name: "Scientific Officer",
      email: "officer@dna-archive.com",
      password_hash: await bcrypt.hash("Officer@123", 10),
      role: { connect: { role_name: "Scientific Officer" } }
    }
  });

  // Create Archive In-Charge
  const archiveUser = await prisma.user.upsert({
    where: { email: "archive@dna-archive.com" },
    update: {},
    create: {
      name: "Archive Manager",
      email: "archive@dna-archive.com",
      password_hash: await bcrypt.hash("Archive@123", 10),
      role: { connect: { role_name: "Archive In-Charge" } }
    }
  });

  console.log("✅ Users seeded.");

  // Create Police Station
  const station = await prisma.policeStation.create({
    data: {
      name: "Central Police Station",
      address: "123 Forensic St",
      contact_number: "123-456-7890"
    }
  });

  console.log("✅ Police station seeded.");

  // Create Storage Locations
  const storageReport = await prisma.storageLocation.create({
    data: { type: "report", cabinet: "C1", rack: "R1", shelf: "S1" }
  });

  const storageSample = await prisma.storageLocation.create({
    data: { type: "sample", freezer_unit: "F1", rack: "R2", shelf: "S2", temperature_zone: "-20C" }
  });

  console.log("✅ Storage locations seeded.");

  // Create Cases, Reports, Samples, Movements, Audit
  for (let i = 1; i <= 3; i++) {
    const caseData = await prisma.case.create({
      data: {
        police_case_number: `CASE-${1000 + i}`,
        case_date: new Date(),
        station_id: station.station_id,
        case_type: "Rape"
      }
    });

    // Reports + Movements
    for (let j = 1; j <= 2; j++) {
      const report = await prisma.report.create({
        data: {
          case_id: caseData.case_id,
          report_received_date: new Date(),
          sample_type: "Blood",
          lab_register_number: `LR-${i}${j}`,
          scientific_officer_id: officerUser.user_id,
          storage_location_id: storageReport.location_id,
          barcode: `RPT-${i}${j}${Date.now()}`,
          archive_entry_date: new Date()
        }
      });

      // Movements for Report
      await prisma.reportMovement.createMany({
        data: [
          {
            report_id: report.report_id,
            action_type: "IN",
            performed_by: archiveUser.user_id,
            reason: "Initial archiving",
            date: new Date()
          },
          {
            report_id: report.report_id,
            action_type: "OUT",
            performed_by: officerUser.user_id,
            reason: "Court submission",
            date: new Date(new Date().setDate(new Date().getDate() - 2)),
            expected_return_date: new Date(new Date().setDate(new Date().getDate() + 3))
          }
        ]
      });

      // Audit for report
      await prisma.auditTrail.create({
        data: {
          entity_type: "Report",
          entity_id: report.report_id,
          action: "Report Created",
          performed_by: adminUser.user_id,
          details: { info: "Report created with initial archiving" }
        }
      });
    }

    // Samples + Movements
    for (let k = 1; k <= 3; k++) {
      const sample = await prisma.dnaSample.create({
        data: {
          case_id: caseData.case_id,
          sample_type: k % 2 === 0 ? "Semen" : "Blood",
          sample_source: k % 2 === 0 ? "Victim" : "Suspect",
          collection_date: new Date(),
          received_date: new Date(),
          lab_register_number: `SR-${i}${k}`,
          scientific_officer_id: officerUser.user_id,
          storage_location_id: storageSample.location_id,
          barcode: `SMP-${i}${k}${Date.now()}`,
          packaging_info: "Sealed Bag",
          expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        }
      });

      // Movements for Sample
      await prisma.sampleMovement.createMany({
        data: [
          {
            sample_id: sample.sample_id,
            action_type: "IN",
            performed_by: archiveUser.user_id,
            reason: "Initial archiving",
            date: new Date()
          },
          {
            sample_id: sample.sample_id,
            action_type: "OUT",
            performed_by: officerUser.user_id,
            reason: "Re-analysis",
            date: new Date(new Date().setDate(new Date().getDate() - 4)),
            expected_return_date: new Date(new Date().setDate(new Date().getDate() - 1)) // overdue
          }
        ]
      });

      // Audit for sample
      await prisma.auditTrail.create({
        data: {
          entity_type: "Sample",
          entity_id: sample.sample_id,
          action: "Sample Created",
          performed_by: adminUser.user_id,
          details: { info: "Sample created with initial archiving" }
        }
      });
    }
  }

  console.log("✅ Seed completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
