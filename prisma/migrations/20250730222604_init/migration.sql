-- CreateTable
CREATE TABLE "Role" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "role_id" INTEGER NOT NULL,
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "AuthAccount" (
    "account_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "AuthAccount_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "TwoFactorAuth" (
    "tfa_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "secret_key" TEXT NOT NULL,
    "backup_codes" TEXT[],
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TwoFactorAuth_pkey" PRIMARY KEY ("tfa_id")
);

-- CreateTable
CREATE TABLE "PoliceStation" (
    "station_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "contact_number" TEXT,

    CONSTRAINT "PoliceStation_pkey" PRIMARY KEY ("station_id")
);

-- CreateTable
CREATE TABLE "Case" (
    "case_id" SERIAL NOT NULL,
    "police_case_number" TEXT NOT NULL,
    "case_date" TIMESTAMP(3) NOT NULL,
    "station_id" INTEGER NOT NULL,
    "case_type" TEXT NOT NULL DEFAULT 'Rape',

    CONSTRAINT "Case_pkey" PRIMARY KEY ("case_id")
);

-- CreateTable
CREATE TABLE "StorageLocation" (
    "location_id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "cabinet" TEXT,
    "rack" TEXT,
    "shelf" TEXT,
    "freezer_unit" TEXT,
    "temperature_zone" TEXT,

    CONSTRAINT "StorageLocation_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "Report" (
    "report_id" SERIAL NOT NULL,
    "case_id" INTEGER NOT NULL,
    "report_received_date" TIMESTAMP(3) NOT NULL,
    "report_delivery_date" TIMESTAMP(3),
    "sample_type" TEXT,
    "lab_register_number" TEXT,
    "scientific_officer_id" INTEGER NOT NULL,
    "storage_location_id" INTEGER NOT NULL,
    "barcode" TEXT NOT NULL,
    "archive_entry_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "ReportMovement" (
    "movement_id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "action_type" TEXT NOT NULL,
    "performed_by" INTEGER NOT NULL,
    "reason" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expected_return_date" TIMESTAMP(3),
    "returned_date" TIMESTAMP(3),

    CONSTRAINT "ReportMovement_pkey" PRIMARY KEY ("movement_id")
);

-- CreateTable
CREATE TABLE "DnaSample" (
    "sample_id" SERIAL NOT NULL,
    "case_id" INTEGER NOT NULL,
    "sample_type" TEXT NOT NULL,
    "sample_source" TEXT NOT NULL,
    "collection_date" TIMESTAMP(3) NOT NULL,
    "received_date" TIMESTAMP(3) NOT NULL,
    "lab_register_number" TEXT,
    "scientific_officer_id" INTEGER NOT NULL,
    "storage_location_id" INTEGER NOT NULL,
    "barcode" TEXT NOT NULL,
    "packaging_info" TEXT,
    "expiry_date" TIMESTAMP(3),

    CONSTRAINT "DnaSample_pkey" PRIMARY KEY ("sample_id")
);

-- CreateTable
CREATE TABLE "SampleMovement" (
    "movement_id" SERIAL NOT NULL,
    "sample_id" INTEGER NOT NULL,
    "action_type" TEXT NOT NULL,
    "performed_by" INTEGER NOT NULL,
    "reason" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expected_return_date" TIMESTAMP(3),
    "returned_date" TIMESTAMP(3),
    "disposal_method" TEXT,
    "disposal_authority" TEXT,

    CONSTRAINT "SampleMovement_pkey" PRIMARY KEY ("movement_id")
);

-- CreateTable
CREATE TABLE "AuditTrail" (
    "audit_id" SERIAL NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "performed_by" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" JSONB NOT NULL,

    CONSTRAINT "AuditTrail_pkey" PRIMARY KEY ("audit_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_name_key" ON "Role"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AuthAccount_provider_provider_account_id_key" ON "AuthAccount"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorAuth_user_id_key" ON "TwoFactorAuth"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_barcode_key" ON "Report"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "DnaSample_barcode_key" ON "DnaSample"("barcode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthAccount" ADD CONSTRAINT "AuthAccount_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TwoFactorAuth" ADD CONSTRAINT "TwoFactorAuth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "PoliceStation"("station_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case"("case_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_scientific_officer_id_fkey" FOREIGN KEY ("scientific_officer_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_storage_location_id_fkey" FOREIGN KEY ("storage_location_id") REFERENCES "StorageLocation"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMovement" ADD CONSTRAINT "ReportMovement_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("report_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMovement" ADD CONSTRAINT "ReportMovement_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DnaSample" ADD CONSTRAINT "DnaSample_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case"("case_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DnaSample" ADD CONSTRAINT "DnaSample_scientific_officer_id_fkey" FOREIGN KEY ("scientific_officer_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DnaSample" ADD CONSTRAINT "DnaSample_storage_location_id_fkey" FOREIGN KEY ("storage_location_id") REFERENCES "StorageLocation"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleMovement" ADD CONSTRAINT "SampleMovement_sample_id_fkey" FOREIGN KEY ("sample_id") REFERENCES "DnaSample"("sample_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleMovement" ADD CONSTRAINT "SampleMovement_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditTrail" ADD CONSTRAINT "AuditTrail_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
