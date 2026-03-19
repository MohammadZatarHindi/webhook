-- Table: pipelines
CREATE TABLE pipelines (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,          -- unique names help avoid confusion
  action_type TEXT NOT NULL,          -- 'log', 'uppercase', 'reverse'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: webhooks
-- Stores all incoming webhook events from external sources

--CREATE TABLE webhooks (
--id SERIAL PRIMARY KEY,                 -- Unique identifier for each webhook event
--source_name TEXT NOT NULL,             -- Source of the webhook (e.g., 'GitHub', 'Stripe')
--payload JSONB NOT NULL,                -- The actual webhook data
--received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the webhook was received
--status TEXT DEFAULT 'pending'          -- Status: 'pending', 'processed', 'failed'
--);

-- Table: subscribers
-- Stores subscriber URLs for each pipeline
CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  pipeline_id INT REFERENCES pipelines(id) ON DELETE CASCADE,
  url TEXT NOT NULL
);

-- Table: events
-- Stores queued jobs to process asynchronously
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  pipeline_id INT REFERENCES pipelines(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',      -- pending / processing / success / failed
  attempts INT DEFAULT 0,             -- retry attempts
  error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_attempt TIMESTAMP
);