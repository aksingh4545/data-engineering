-- =====================================================================
-- 03_snowflake_sql.sql
-- Master SQL Scripts for Snowflake Interview Preparation & Enterprise Scenarios
-- =====================================================================

-- ---------------------------------------------------------------------
-- SCENARIO 1: FLATTENING NESTED JSON (Extremely popular in Snowflake interviews!)
-- Scenario: Raw application logs are ingested into a VARIANT column named "RAW_PAYLOAD".
-- We need to extract nested columns and flatten variable JSON arrays.
-- ---------------------------------------------------------------------

-- Create a mock table simulating raw ingestion
CREATE OR REPLACE TEMPORARY TABLE raw_logs (
    raw_payload VARIANT,
    ingested_at TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP()
);

-- Ingest mock JSON log containing nested metadata and array of updates
INSERT INTO raw_logs (raw_payload)
SELECT PARSE_JSON('{
    "event_id": "evt_998811",
    "meta": {
        "source": "kafka_clickstream",
        "version": "1.4"
    },
    "user_actions": [
        {"action": "login", "duration": 12},
        {"action": "view_dashboard", "duration": 45},
        {"action": "export_csv", "duration": 150}
    ]
}');

-- Select and flatten query
SELECT
    raw_payload:event_id::STRING AS event_id,
    raw_payload:meta.source::STRING AS event_source,
    raw_payload:meta.version::FLOAT AS schema_version,
    -- Flattening the user_actions array
    action_item.value:action::STRING AS action_name,
    action_item.value:duration::INT AS action_duration_secs,
    ingested_at
FROM raw_logs,
LATERAL FLATTEN(input => raw_payload:user_actions) action_item;


-- ---------------------------------------------------------------------
-- SCENARIO 2: SLOWLY CHANGING DIMENSIONS (SCD TYPE 2) MERGE
-- Scenario: Track customer profile changes over time with start_date, end_date,
-- and an active_flag. We perform a MERGE to handle upserting updates.
-- ---------------------------------------------------------------------

-- Create Dimension target table
CREATE OR REPLACE TABLE dim_customers (
    customer_key NUMBER AUTOINCREMENT,
    customer_id INT,
    email STRING,
    membership_tier STRING,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN
);

-- Ingest baseline data
INSERT INTO dim_customers (customer_id, email, membership_tier, start_date, end_date, is_active)
VALUES 
(5001, 'john.doe@gmail.com', 'Bronze', '2026-01-01', NULL, TRUE),
(5002, 'jane.smith@yahoo.com', 'Gold', '2026-02-15', NULL, TRUE);

-- Create source table representing landing/staging data (e.g. today's delta file)
CREATE OR REPLACE TEMPORARY TABLE staging_customers (
    customer_id INT,
    email STRING,
    membership_tier STRING,
    update_date DATE
);

-- Simulate John Doe upgrading to Gold membership today (2026-05-26)
INSERT INTO staging_customers (customer_id, email, membership_tier, update_date)
VALUES (5001, 'john.doe@gmail.com', 'Gold', '2026-05-26');

-- SCD Type 2 MERGE execution:
-- Step A: Set old record active state to FALSE and set end_date = update_date for changed records.
-- Step B: Insert the new record with start_date = update_date and is_active = TRUE.
MERGE INTO dim_customers TARGET
USING (
    -- Identify staging records that exist in target and have a Tier change
    SELECT 
        s.customer_id, 
        s.email, 
        s.membership_tier, 
        s.update_date
    FROM staging_customers s
    UNION ALL
    -- Double-join staging records to serve as the new insert records
    SELECT 
        s.customer_id, 
        s.email, 
        s.membership_tier, 
        NULL AS update_date -- NULL update_date signals insertion
    FROM staging_customers s
    JOIN dim_customers t
      ON s.customer_id = t.customer_id
     WHERE t.is_active = TRUE 
       AND t.membership_tier != s.membership_tier
) SOURCE
ON TARGET.customer_id = SOURCE.customer_id 
   AND TARGET.is_active = TRUE 
   AND SOURCE.update_date IS NOT NULL -- Matches existing active record to expire
WHEN MATCHED AND TARGET.membership_tier != SOURCE.membership_tier THEN
    -- Deactivate the old active row
    UPDATE SET 
        TARGET.end_date = SOURCE.update_date,
        TARGET.is_active = FALSE
WHEN NOT MATCHED THEN
    -- Insert the new active row
    INSERT (customer_id, email, membership_tier, start_date, end_date, is_active)
    VALUES (
        SOURCE.customer_id, 
        SOURCE.email, 
        SOURCE.membership_tier, 
        COALESCE(SOURCE.update_date, CURRENT_DATE()), 
        NULL, 
        TRUE
    );

-- Verify results: 
-- John Doe (5001) should now have two entries:
-- 1. Bronze tier (Inactive, ended 2026-05-26)
-- 2. Gold tier (Active, started 2026-05-26)
SELECT * FROM dim_customers ORDER BY customer_id, start_date;


-- ---------------------------------------------------------------------
-- SCENARIO 3: INCREMENTAL INGESTION MERGE (High volume load optimization)
-- Scenario: Upserting millions of user log events into target analytics table.
-- Prevents duplicating records on secondary runs using unique keys.
-- ---------------------------------------------------------------------
-- MERGE INTO target_table t
-- USING staging_table s
-- ON t.event_id = s.event_id
-- WHEN MATCHED THEN
--   UPDATE SET t.click_count = t.click_count + s.click_count, t.updated_at = CURRENT_TIMESTAMP()
-- WHEN NOT MATCHED THEN
--   INSERT (event_id, user_id, click_count, created_at)
--   VALUES (s.event_id, s.user_id, s.click_count, CURRENT_TIMESTAMP());
