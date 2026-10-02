-- Run against the existing application database after confirming the selected schema.
-- donation_logs is polymorphic (no FK to donation tables): remove only UPI log rows.
START TRANSACTION;
DELETE FROM donation_logs WHERE donation_type = 'upi';
COMMIT;

-- These tables/columns belong only to the retired monetary/event flows.
DROP TABLE IF EXISTS upi_donations;
DROP TABLE IF EXISTS impact_photos;
ALTER TABLE donation_logs MODIFY donation_type ENUM('item') NOT NULL;
ALTER TABLE item_donations DROP COLUMN campaign;
