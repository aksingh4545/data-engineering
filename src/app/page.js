'use client';

import React, { useState, useEffect, useRef } from 'react';
import alasql from 'alasql';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  Layers,
  Terminal,
  Database,
  Cpu,
  HelpCircle,
  FileText,
  Settings as SettingsIcon,
  Play,
  CheckCircle,
  AlertTriangle,
  Send,
  Plus,
  Trash2,
  Download,
  BookOpen,
  Sparkles,
  Flame,
  Award,
  Clock,
  Check,
  RefreshCw,
  Search,
  ExternalLink,
  Menu,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  X,
  MessageSquare
} from 'lucide-react';
import { pysparkConcepts, pysparkChallenges } from './pysparkData';
import { pythonExercises } from './pythonExerciseData';

const roadmapChapters = [
  {
    id: 1,
    title: "1. Setup & Paths",
    desc: "Data Engineers must write robust, cross-platform paths (Windows, Linux, macOS) cleanly. `pathlib` is the modern industry standard for secure path management.",
    code: `import pandas as pd
import numpy as np
from pathlib import Path

# Define relative path
data_path = Path("data")
csv_file = data_path / "employees.csv"

# Safe directory creation
data_path.mkdir(exist_ok=True)
print(f"Target CSV file path: {csv_file}")
print("Directory 'data' verified/created.")`,
    quiz: {
      question: "Which of the following is the most robust, cross-platform method to create a folder only if it does not already exist?",
      options: [
        "os.mkdir('data')",
        "Path('data').mkdir(exist_ok=True)",
        "Path('data').mkdir(parents=True)",
        "os.system('mkdir data')"
      ],
      correctIndex: 1,
      explanation: "Using Path.mkdir(exist_ok=True) is the robust, cross-platform standard in Python 3. It will not throw an error if the directory already exists."
    }
  },
  {
    id: 2,
    title: "2. Reading Data",
    desc: "Data ingestion is the first step of any ETL pipeline. Pandas supports reading from CSV, Excel, JSON, and directly from SQL databases.",
    code: `# Reading data with custom separators & column limits
# df = pd.read_csv("employees.csv", sep=",", usecols=["name", "salary"], nrows=5)

# Read from SQL example
import sqlite3
conn = sqlite3.connect("company.db")
# df = pd.read_sql("SELECT * FROM employees", conn)
print("Pandas ingestion pipelines are configured and ready.")`,
    quiz: {
      question: "To save memory when reading a 10GB CSV file with 50 columns, which parameter should you use in pd.read_csv to ingest only 2 specific columns?",
      options: [
        "nrows=['col1', 'col2']",
        "usecols=['col1', 'col2']",
        "skiprows=48",
        "chunksize=2"
      ],
      correctIndex: 1,
      explanation: "The `usecols` parameter allows you to load only a subset of columns, significantly reducing memory consumption during execution."
    }
  },
  {
    id: 3,
    title: "3. Writing Data",
    desc: "After cleaning/transforming data, Data Engineers load it into databases or output standard data files. E.g., `.to_csv()` or `.to_sql()`.",
    code: `# Loading transformed DataFrame to SQL DB
# df.to_sql("employees", conn, if_exists="replace")

# Note: if_exists options:
# 'replace' -> Overwrite existing table
# 'append'  -> Add data to the end
print("ETL Target write structures configured. Ready to load to Snowflake or SQL targets.")`,
    quiz: {
      question: "When using df.to_sql(), what happens if you set the parameter if_exists='append'?",
      options: [
        "It will drop the table and create a new one.",
        "It will insert the new rows into the existing table.",
        "It will throw an error if the table already exists.",
        "It will merge the rows based on the primary key."
      ],
      correctIndex: 1,
      explanation: "if_exists='append' inserts the new rows into the existing table without altering the existing schema or deleting the old records."
    }
  },
  {
    id: 4,
    title: "4. Viewing Data",
    desc: "Before writing transformations, always inspect dataset shapes, columns, data types, and null configurations using summary tools.",
    code: `# Create a quick sample DataFrame
df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie", "David"],
    "age": [25, 30, 35, 40],
    "salary": [70000, 80000, 90000, 95000]
})

print("Shape:", df.shape)
print("Data Types:\\n", df.dtypes)
print("Summary stats:\\n", df.describe())`,
    quiz: {
      question: "Which Pandas method provides the most comprehensive overview of a DataFrame, including row count, column data types, non-null counts, and memory usage?",
      options: [
        "df.describe()",
        "df.dtypes",
        "df.info()",
        "df.head()"
      ],
      correctIndex: 2,
      explanation: "df.info() displays critical metadata: column names, data types, non-null counts, index types, and total memory footprint."
    }
  },
  {
    id: 5,
    title: "5. Selecting Data",
    desc: "Mastering index-based `.loc[]` (label selection) and `.iloc[]` (integer-position selection) is fundamental for slicing matrices.",
    code: `df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie"],
    "age": [25, 30, 35],
    "salary": [50000, 60000, 70000]
})

# Select columns
# print(df[["name", "salary"]])

# Select row 0 and 1, plus specific columns using label slicing
sub_df = df.loc[0:1, ["name", "salary"]]
print("Selected Slice:\\n", sub_df)`,
    quiz: {
      question: "What is the key difference between df.loc[] and df.iloc[]?",
      options: [
        "df.loc is for column selection, df.iloc is for row selection.",
        "df.loc uses labels/indexes for selection, while df.iloc uses integer positions (0-indexed).",
        "df.loc is slower than df.iloc.",
        "df.loc creates a copy, while df.iloc creates a view."
      ],
      correctIndex: 1,
      explanation: "`.loc` is label-based (using row indices or column name strings), whereas `.iloc` is integer-position-based (slicing rows/columns by their numeric indices)."
    }
  },
  {
    id: 6,
    title: "6. Add / Update / Delete",
    desc: "Feature engineering requires adding calculated columns, updating values conditionally, or dropping columns/rows.",
    code: `df = pd.DataFrame({
    "name": ["A", "B", "C"],
    "age": [25, 30, 35],
    "salary": [50000, 60000, 70000]
})

# Add calculated column
df["bonus"] = df["salary"] * 0.10

# Conditional update: give employees over 30 a raise
df.loc[df["age"] > 30, "salary"] = 80000

# Drop column (axis=1 means column)
df.drop("bonus", axis=1, inplace=True)
print(df)`,
    quiz: {
      question: "To delete a column named 'temp_data' from a DataFrame in-place (updating the original variable directly), which command is correct?",
      options: [
        "df.drop('temp_data')",
        "df.drop('temp_data', axis=0)",
        "df.drop('temp_data', axis=1, inplace=True)",
        "df.delete('temp_data')"
      ],
      correctIndex: 2,
      explanation: "To drop a column, you must set axis=1 (columns) and set inplace=True to modify the active DataFrame directly."
    }
  },
  {
    id: 7,
    title: "7. Sorting & Unique Values",
    desc: "Sorting pipelines and analyzing high-cardinality keys are standard daily engineering routines.",
    code: `df = pd.DataFrame({
    "name": ["A", "B", "C", "D"],
    "age": [25, 30, 25, 35],
    "salary": [50000, 70000, 60000, 70000]
})

# Sort by multiple columns
sorted_df = df.sort_values(by=["age", "salary"], ascending=[True, False])
print("Sorted DataFrame:\\n", sorted_df)

print("Unique ages:", df["age"].unique())
print("Value counts for salary:\\n", df["salary"].value_counts())`,
    quiz: {
      question: "Which method is used to count the occurrences of each unique value within a specific DataFrame column?",
      options: [
        "df['column'].unique()",
        "df['column'].nunique()",
        "df['column'].value_counts()",
        "df['column'].count_values()"
      ],
      correctIndex: 2,
      explanation: "`.value_counts()` returns a Series containing counts of unique values in descending order, making it perfect for frequency profiling."
    }
  },
  {
    id: 8,
    title: "8. Filtering Data",
    desc: "Filtering allows extracting data subsets based on complex boolean conditions. In Pandas, combine filters using bitwise operators `&` and `|`.",
    code: `df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie", "David"],
    "age": [24, 32, 28, 41],
    "salary": [50000, 80000, 62000, 95000]
})

# Filter: age > 25 AND salary > 60000
# Remember to wrap each condition in parentheses!
filtered = df[(df["age"] > 25) & (df["salary"] > 60000)]
print("Filtered high earners:\\n", filtered)

# Filter by name matching in a list
names_filtered = df[df["name"].isin(["Alice", "David"])]
print("Names match:\\n", names_filtered)`,
    quiz: {
      question: "When writing a compound filter in Pandas (e.g., age > 30 and salary > 50k), why must you wrap individual conditions in parentheses?",
      options: [
        "It is not required, it just looks cleaner.",
        "To avoid Python syntax warnings.",
        "Due to operator precedence: bitwise operators (&, |) have higher precedence than comparison operators (>, <).",
        "It is a required syntax feature of lambda functions."
      ],
      correctIndex: 2,
      explanation: "Because bitwise operators (`&`, `|`) have higher operator precedence than comparisons (`>`, `<`), parentheses are strictly required to ensure correct logical evaluation."
    }
  },
  {
    id: 9,
    title: "9. Cleaning Data",
    desc: "Data pipelines must clean raw databases. This includes handling missing values (NaNs), removing duplicates, and renaming columns.",
    code: `df = pd.DataFrame({
    "name": ["Alice", "Bob", "Alice"],
    "age": [25, np.nan, 25],
    "salary": [60000, 70000, 60000]
})

# Count null values per column
print("Null count:\\n", df.isnull().sum())

# Drop duplicates
df_clean = df.drop_duplicates()

# Fill missing numerical values with average
mean_age = df_clean["age"].mean()
df_clean["age"] = df_clean["age"].fillna(mean_age)
print("Cleaned data:\\n", df_clean)`,
    quiz: {
      question: "What is the best way to fill missing values in a numerical column like 'salary' with the average value of that column?",
      options: [
        "df['salary'].dropna()",
        "df['salary'].fillna(df['salary'].mean())",
        "df['salary'].fillna(0)",
        "df['salary'].replace(np.nan, 'Mean')"
      ],
      correctIndex: 1,
      explanation: "df['salary'].fillna(df['salary'].mean()) replaces all NaN cells in the 'salary' column with the mean average salary of the dataset."
    }
  },
  {
    id: 10,
    title: "10. Changing Data Types",
    desc: "Data Warehouses expect strict schema mappings. We must explicitly cast types using `.astype()` or parsing dates with `pd.to_datetime()`.",
    code: `df = pd.DataFrame({
    "name": ["A", "B"],
    "age": ["25", "30"],
    "date_str": ["2026-05-01", "2026-05-15"]
})

# Cast age string to integer
df["age"] = df["age"].astype(int)

# Cast string date to Datetime object
df["date"] = pd.to_datetime(df["date_str"])

print(df.dtypes)`,
    quiz: {
      question: "Which function should you use to convert a column containing dates formatted as strings (e.g., '2026-05-26') into proper datetime objects?",
      options: [
        "df['date'].astype('datetime')",
        "pd.to_datetime(df['date'])",
        "df['date'].apply(lambda x: date(x))",
        "df['date'].astype(float)"
      ],
      correctIndex: 1,
      explanation: "pd.to_datetime() is the optimized, highly resilient Pandas function for parsing and converting strings/numbers into proper datetime types."
    }
  },
  {
    id: 11,
    title: "11. GroupBy",
    desc: "A cornerstone of Data Engineering. `.groupby()` partitions datasets and applies aggregations (sum, mean, count) over defined dimensions.",
    code: `df = pd.DataFrame({
    "department": ["IT", "HR", "IT", "HR", "Sales"],
    "salary": [80000, 60000, 95000, 65000, 75000]
})

# Calculate multiple statistics per department
dept_summary = df.groupby("department").agg({
    "salary": ["sum", "mean", "count"]
})
print(dept_summary)`,
    quiz: {
      question: "How do you calculate both the total sum and the average (mean) salary per department in a single GroupBy command?",
      options: [
        "df.groupby('department')['salary'].sum().mean()",
        "df.groupby('department').agg({'salary': ['sum', 'mean']})",
        "df.groupby('department')['salary'].apply(sum, mean)",
        "df.groupby('department').sum() + df.groupby('department').mean()"
      ],
      correctIndex: 1,
      explanation: "Using `.agg()` combined with a dictionary is the cleanest, most performant way to request multiple aggregations per column."
    }
  },
  {
    id: 12,
    title: "12. Map & Apply",
    desc: "Perform custom element-wise transformations. Use `.map()` for dictionary replacements, and `.apply()` for mapping custom Python functions or lambda functions.",
    code: `df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie"],
    "salary": [50000, 70000, 95000]
})

# Custom lambda calculation with apply
df["bonus"] = df["salary"].apply(lambda s: s * 0.15 if s > 60000 else s * 0.05)
print(df)`,
    quiz: {
      question: "Which method is best suited for translating a column of category codes (e.g. 1, 2) into text descriptions (e.g. 'Active', 'Inactive') using a static dictionary?",
      options: [
        ".apply()",
        ".map()",
        ".groupby()",
        ".astype()"
      ],
      correctIndex: 1,
      explanation: "`.map()` takes a Python dictionary and maps each key (original column values) to its respective value, making it fast and elegant for category substitutions."
    }
  },
  {
    id: 13,
    title: "13. Concatenate",
    desc: "Merge datasets structurally. Vertical concatenation (`axis=0`) appends row databases together, while horizontal (`axis=1`) stitches columns together.",
    code: `df1 = pd.DataFrame({"name": ["Alice", "Bob"], "salary": [50000, 60000]})
df2 = pd.DataFrame({"name": ["Charlie", "David"], "salary": [70000, 80000]})

# Concatenate vertically & reset indexes
combined = pd.concat([df1, df2], ignore_index=True)
print(combined)`,
    quiz: {
      question: "By default, what is the axis setting when calling pd.concat([df1, df2]), and does it merge rows or columns?",
      options: [
        "axis=1, merging columns horizontally.",
        "axis=0, appending rows vertically.",
        "axis='rows', merging columns vertically.",
        "axis='columns', merging rows horizontally."
      ],
      correctIndex: 1,
      explanation: "By default, `pd.concat` uses `axis=0` which appends datasets vertically (row-wise)."
    }
  },
  {
    id: 14,
    title: "14. Merge & Join",
    desc: "Stitch tables together based on relational keys. This is identical to SQL joins (INNER, LEFT, RIGHT, FULL OUTER joins).",
    code: `employees = pd.DataFrame({
    "emp_id": [1, 2, 3],
    "name": ["Alice", "Bob", "Charlie"]
})
departments = pd.DataFrame({
    "emp_id": [1, 2, 4],
    "dept": ["IT", "HR", "Sales"]
})

# Perform Left Join (keep all employees)
merged = pd.merge(employees, departments, on="emp_id", how="left")
print(merged)`,
    quiz: {
      question: "Which join type ('how' parameter) in pd.merge() ensures that ALL rows from the left DataFrame are kept, even if there is no matching key in the right DataFrame?",
      options: [
        "how='inner'",
        "how='outer'",
        "how='left'",
        "how='right'"
      ],
      correctIndex: 2,
      explanation: "how='left' retains all records from the left table, inserting NaN values for any missing columns from the right table."
    }
  },
  {
    id: 15,
    title: "15. Time Series",
    desc: "Data pipelines ingest timestamp-based event records. Pandas specializes in date indexes, rolling calculations, and sampling.",
    code: `dates = pd.date_range("2026-05-01", periods=5, freq="D")
df = pd.DataFrame({
    "date": dates,
    "revenue": [1000, 1500, 1200, 1800, 2000]
}).set_index("date")

# Shift rows to compute daily delta
df["prev_revenue"] = df["revenue"].shift(1)

# 3-day rolling average revenue
df["rolling_3d_avg"] = df["revenue"].rolling(window=3).mean()
print(df)`,
    quiz: {
      question: "To calculate a moving average of the last 7 days of active sales data in a timeseries DataFrame, which construct should you use?",
      options: [
        "df['sales'].shift(7)",
        "df['sales'].rolling(window=7).mean()",
        "df['sales'].resample('7D').sum()",
        "df['sales'].groupby('sales').mean()"
      ],
      correctIndex: 1,
      explanation: "`.rolling(window=7).mean()` calculates a moving/rolling window of 7 elements, then computes the mean average for each sliding interval."
    }
  },
  {
    id: 16,
    title: "16. NumPy for Data Engineers",
    desc: "NumPy powers highly optimized, multi-dimensional array operations. It is the mathematical engine running under Pandas' hood.",
    code: `# Create a 1D array
arr = np.array([1, 2, 3, 4, 5, 6])

# Reshape into a 2x3 matrix
matrix = arr.reshape(2, 3)
print("Reshaped Matrix:\\n", matrix)

# Vectorized operation
multiplied = arr * 10
print("Multiplied:", multiplied)

# Masked array filtering
print("Items > 3:", arr[arr > 3])`,
    quiz: {
      question: "What is the primary architectural reason Data Engineers use NumPy arrays over standard Python lists for massive mathematical operations?",
      options: [
        "NumPy arrays support mixed strings and numerical data types.",
        "NumPy arrays store data in contiguous memory blocks and execute operations using compiled C-level vectorization.",
        "NumPy arrays automatically connect to cloud databases.",
        "NumPy arrays are native to the standard Python library."
      ],
      correctIndex: 1,
      explanation: "NumPy arrays are stored in contiguous memory and perform vectorized math via compiled C code, making them orders of magnitude faster and memory efficient compared to nested Python loops."
    }
  },
  {
    id: 17,
    title: "17. End-to-End Pipeline",
    desc: "Put it all together. A classic ETL script extracts dirty CSV data, applies cleanses/conversions, aggregates KPIs, and saves the target output.",
    code: `import pandas as pd
import numpy as np

# 1. EXTRACT raw mock records
raw_data = pd.DataFrame({
    "date": ["2026-05-01", "2026-05-02", "2026-05-01", "2026-05-02", np.nan],
    "region": ["East", "West", "East", "West", "East"],
    "amount": [250.00, np.nan, 150.00, 300.00, 100.00],
    "transactions": [5, 10, 3, 12, np.nan]
})

# 2. TRANSFORM (Clean nulls, convert types, feature engineer)
raw_data.dropna(subset=["date", "amount"], inplace=True)
raw_data["date"] = pd.to_datetime(raw_data["date"])
raw_data["tax"] = raw_data["amount"] * 0.18

# 3. AGGREGATE
summary = raw_data.groupby("region").agg({
    "amount": "sum",
    "tax": "sum"
})

# 4. LOAD
print("ETL complete. Aggregated Summary Target:\\n", summary)`,
    quiz: {
      question: "In the end-to-end data pipeline example, what does the command raw_data.dropna(subset=['date', 'amount']) do?",
      options: [
        "Deletes the 'date' and 'amount' columns entirely from the DataFrame.",
        "Fills missing cells in 'date' and 'amount' with column averages.",
        "Removes only the rows where BOTH the 'date' and 'amount' values are missing.",
        "Removes rows if EITHER their 'date' OR 'amount' value is null."
      ],
      correctIndex: 3,
      explanation: "Passing column names to the `subset` parameter of `dropna` instructs Pandas to delete rows where any value in those specific columns is null (NaN)."
    }
  }
];

const interviewScenarios = [
  {
    id: 1,
    category: "Architecture",
    title: "Explain your end-to-end data pipeline in detail.",
    answer: `### 🌟 Production End-to-End ELT Pipeline Architecture
1. **Ingestion (CDC & Streaming)**: Captures transactional updates from MySQL databases using Debezium CDC and streams them into Apache Kafka topics.
2. **Lakehouse Storage**: Apache Spark (running on AWS EMR) reads Kafka streams, validates schemas, and writes data to AWS S3 in Delta Lake format (insulating us with transactional ACID safety).
3. **Analytical Loading**: Snowflake loads the Delta Lake increments dynamically using parallel COPY INTO commands from secure storage stages, compiling clean analytical tables for Looker BI reports.`
  },
  {
    id: 2,
    category: "Debugging",
    title: "Scenario: Business says pipeline is slow. How do you debug?",
    answer: `### 🛠️ Diagnostic Runbook for Slow Pipelines
1. **Orchestrator Check**: Analyze Airflow DAG run charts to identify the exact task node causing the delay.
2. **Spark UI Diagnostics**: Inspect Spark Web UI. Check for high Spill (Disk/Memory) indicating under-partitioned data, or high Garbage Collection (GC) overhead.
3. **Warehouse Profiling**: Check Snowflake Query Profile. Ensure partitioning/clustering keys are pruning queries instead of running expensive full table scans. Scale up warehouses horizontally if concurrent sessions peak.`
  },
  {
    id: 3,
    category: "Architecture",
    title: "Scenario: How do you handle incremental loads in real projects?",
    answer: `### 🔄 Enterprise Incremental Loading Strategies
1. **CDC Ingestion**: Use Debezium to stream insert/update/delete events directly from DB binlogs, avoiding heavy database scans.
2. **Timestamp Watermarking**: Execute query filters like \`WHERE updated_at > last_processed_timestamp\` on source platforms.
3. **Merge Operations**: Load staging layers into the Lakehouse and execute ACID \`MERGE INTO\` statements matching primary keys to upsert modified records and append new ones.`
  },
  {
    id: 4,
    category: "Architecture",
    title: "Scenario: What happens if late data arrives after pipeline run?",
    answer: `### 🕒 Late Data Handling Protocols
1. **Streaming Pipelines**: Enforce structured streaming watermark thresholds (e.g. \`withWatermark("timestamp", "2 hours")\`) to allow late-arriving events to merge in-memory.
2. **Batch Pipelines**: Implement partition-overwrite structures. If data for '2026-05-25' arrives late, run a targeted backfill task that replaces that date partition on S3 and refreshes Snowflake metadata.`
  },
  {
    id: 5,
    category: "Debugging",
    title: "Scenario: Spark job failed with OutOfMemory error — what exactly do you do?",
    answer: `### ⚡ Resolving Spark OutOfMemory (OOM) Failures
1. **Identify the OOM Scope**:
   - **Executor OOM**: Caused by heavy joins, data skew, or massive partition sizes. Fix by increasing \`spark.sql.shuffle.partitions\`, reducing executor cores, or using Broadcast Joins.
   - **Driver OOM**: Caused by calling \`.collect()\` on large DataFrames. Fix by removing \`.collect()\`, using \`.take()\` or exporting directly to S3.`
  },
  {
    id: 6,
    category: "Optimization",
    title: "Scenario: Too many small files in Data Lake — why is it a problem?",
    answer: `### 📁 Small File Metadata Overhead Problem
1. **The Issue**: Cloud storage systems (S3/HDFS) execute individual metadata requests (GET/LIST) per file. Millions of KB-sized files trigger massive latency overhead and slow down query plan listings.
2. **The Fix**: Execute scheduled file compaction workloads. In Delta Lake/Databricks, run the \`OPTIMIZE data_table\` query periodically to merge small files into clean 100MB-250MB blocks.`
  },
  {
    id: 7,
    category: "Quality",
    title: "Scenario: Source sends duplicate records. How do you handle?",
    answer: `### 🧬 Duplicates Mitigation Strategy
1. **Ingestion Level**: Configure Kafka record key hash offsets to ensure only unique key-payload values are queued.
2. **Spark Processing**: Apply \`df.dropDuplicates(subset=["transaction_id", "timestamp"])\` on ingestion data frames.
3. **Warehouse Merges**: Execute SQL \`MERGE INTO\` statements in target warehouses to match and update rows instead of stacking duplicates.`
  },
  {
    id: 8,
    category: "Quality",
    title: "Scenario: Schema changed in source and pipeline broke.",
    answer: `### 🛡️ Schema Evolution & Enforcement Architecture
1. **Schema Registry**: Integrate Kafka schemas via Confluent Schema Registry (Avro) to reject incompatible schema payloads at the producer gate.
2. **Schema Enforcement**: Delta Lake automatically blocks queries containing altered schemas to prevent system pollution.
3. **Safe Evolution**: Enable automatic column merging for non-breaking changes using \`df.write.format("delta").option("mergeSchema", "true")\` in Spark.`
  },
  {
    id: 9,
    category: "Debugging",
    title: "Scenario: Report numbers don’t match source. How do you debug?",
    answer: `### 🔍 Auditing Data Discrepancies
1. **Source-to-Target Reconciliation**: Run count/sum checksums on staging and target layers to locate where row counts drifted.
2. **Data Lineage Tracking**: Map column mutations using open-source OpenLineage or DBT DAG lineage models.
3. **Filter Investigations**: Check for timezone conversion offsets, late-arriving updates, or logical hard-deletes in staging transformation scripts.`
  },
  {
    id: 10,
    category: "Debugging",
    title: "Scenario: Job failed in middle of execution. What next?",
    answer: `### 🔄 Failure Recovery & Pipeline Idempotency
1. **Design Idempotency**: Ensure pipelines can be rerun repeatedly without altering targets. Use \`INSERT OVERWRITE\` or SQL \`MERGE\` patterns. Never use append queries without unique key matching.
2. **Atomic States**: Write data to temporary staging directories, only renaming/loading the data block once execution completes.
3. **Orchestrator Retries**: Configure Airflow tasks to auto-retry with exponential backoffs, clearing transient staging files on failure events.`
  },
  {
    id: 11,
    category: "Quality",
    title: "Scenario: How do you ensure data quality?",
    answer: `### 📈 Automated Data Quality Verification
1. **Contract Testing**: Establish data contracts checking column nullness, ranges, and types at the landing zones.
2. **Quality Frameworks**: Implement **Great Expectations** or **Soda** assertions in your CI/CD and Airflow execution flows.
3. **Anomaly Quarantining**: Send failed records to an isolated S3 quarantine bucket and raise urgent PagerDuty/Slack notifications.`
  },
  {
    id: 12,
    category: "Debugging",
    title: "Scenario: How do you monitor pipelines?",
    answer: `### 📊 Enterprise Pipeline Monitoring Stack
1. **Metrics Ingestion**: Emit processing metrics (record throughput, processing rates, OOM spikes) from Spark nodes.
2. **Unified Dashboarding**: Send telemetry directly to **Prometheus & Grafana** or **Datadog** clusters.
3. **Alert Routing**: Configure PagerDuty/Slack integration hooks inside Airflow on-failure callbacks to notify operators immediately.`
  },
  {
    id: 13,
    category: "Architecture",
    title: "Scenario: How do you handle backfill for historical data?",
    answer: `### 📅 Scalable Backfill Operations
1. **Parameterization**: Design processing scripts to receive date parameters dynamically (e.g. \`--start-date\` and \`--end-date\`).
2. **Orchestration Tools**: Leverage Airflow CLI backfill commands: \`airflow dags backfill -s 2025-01-01 -e 2025-12-31 data_pipeline\`.
3. **Compute Scaling**: Spin up ephemeral AWS EMR clusters with high compute capacities to process historical months in parallel.`
  },
  {
    id: 14,
    category: "Optimization",
    title: "Scenario: How do you optimize SQL queries in warehouse?",
    answer: `### ⚡ SQL Performance Tuning Protocols
1. **Clustering & Micro-partitioning**: Apply clustering keys on high-cardinality search filter columns (like \`tenant_id\` or \`date\`).
2. **Prune Columns**: Avoid expensive \`SELECT *\` statements; request only targeted columns.
3. **Avoid Shuffling**: Optimize joins by matching on partitioned indices and utilize Materialized Views to cache heavy summaries.`
  },
  {
    id: 15,
    category: "Optimization",
    title: "Scenario: Data skew in Spark — how do you identify and fix?",
    answer: `### ⚖️ Mitigation of Spark Data Skew
1. **Identification**: Monitor Spark Web UI execution lanes. If one executor runs for 1 hour while 99 others finish in 2 seconds, data is heavily skewed.
2. **Resolution (Salting)**: Add a random numerical prefix (e.g., 0-9) to the skewed key of both tables to split hot partitions.
3. **Rescaling**: Enable Spark **Adaptive Query Execution (AQE)** which automatically splits skewed partitions at runtime.`
  },
  {
    id: 16,
    category: "Security",
    title: "Scenario: How do you handle PII data?",
    answer: `### 🔐 PII Encryption & Isolation Policies
1. **Ingestion Masking**: Mask or hash sensitive records (SSNs, emails, credit cards) during raw stream ingestion.
2. **Column Encryption**: Encrypt fields at-rest using **AWS KMS** customer-managed keys.
3. **Role-Based Access (RBAC)**: Enforce Snowflake Dynamic Data Masking, revealing raw fields only to authorized analytical roles.`
  },
  {
    id: 17,
    category: "Optimization",
    title: "Scenario: Pipeline SLA missed repeatedly.",
    answer: `### ⏱️ Resolving SLA Overruns
1. **Execution Compactions**: Compacting small files reduces file listing and GET request latencies in S3.
2. **Hardware Upgrades**: Scale up compute clusters (EMR nodes) or enable horizontal auto-scaling rules.
3. **DAG Isolation**: Decouple non-critical transformation paths from priority ingestion queues in Airflow.`
  },
  {
    id: 18,
    category: "Security",
    title: "Scenario: How do you deploy changes safely?",
    answer: `### 🚀 Blue-Green Safe Deployment Protocols
1. **Environments Segregation**: Maintain Dev, Staging, and Production layers, keeping S3 buckets strictly separated.
2. **Infrastructure as Code**: Manage cloud configurations using **Terraform** plans.
3. **CI/CD Unit Tests**: Run GitHub Actions checking SQL scripts with SQLFluff and Python components with PyTest before merging.`
  },
  {
    id: 19,
    category: "Career",
    title: "Interviewer asks: What makes you a good Data Engineer?",
    answer: `### 🏆 The Qualities of an Elite Data Engineer
1. **Production-First Mindset**: I focus on security, idempotency, testing, and system-level resiliency, not just writing local scripts.
2. **Cloud Economics Focus**: I design pipelines to scale down during idle times, optimizing partition scans to keep query billing low.
3. **Business Communication**: I bridge communication gaps between Data Science, software development, and executive stakeholders.`
  },
  {
    id: 20,
    category: "Security",
    title: "How to secure pipelines on the cloud?",
    answer: `### 🛡️ End-to-End Cloud Pipeline Hardening
1. **Network Security**: Launch EMR nodes, Databricks clusters, and databases in private VPC subnets. Connect privately to Snowflake via **AWS PrivateLink**.
2. **Data Protection**: Enforce TLS 1.2+ for all data in-transit, and enforce AWS KMS encryption for all S3 and EBS storage volumes.
3. **Least Privilege**: Configure strictly bounded AWS IAM roles for pipeline agents, auditing all accesses using CloudTrail logging.`
  }
];

const databricksChapters = [
  {
    id: 1,
    title: "1. Introduction & Magic Commands",
    desc: "Databricks is a Unified Analytics Platform built on Apache Spark. Runtimes come pre-packaged with PySpark, Delta Lake, and Photon vectorization. In notebooks, Magic Commands allow running multi-lingual code and executing file utilities.",
    code: `%python
# Use %python to declare PySpark blocks
print("Hello from Databricks runtime!")

# %sql - run raw SQL statements
# %scala - run high performance Scala
# %sh - run local unix/bash scripts
# %fs - run native DBFS file listings (dbutils.fs)
# %run - call and inherit variables from sibling notebooks`,
    quiz: {
      question: "How do you call another notebook (e.g. 'utils_notebook') from your active notebook and inherit all its variables and functions?",
      options: [
        "%call utils_notebook",
        "%run ./utils_notebook",
        "import utils_notebook",
        "dbutils.notebook.run('./utils_notebook')"
      ],
      correctIndex: 1,
      explanation: "Using `%run ./notebook_name` executes the targeted notebook inline, allowing the active notebook to fully inherit its declared variables, imports, and functions. In contrast, `dbutils.notebook.run()` runs it as an isolated job, returning only a single exit string."
    }
  },
  {
    id: 2,
    title: "2. Compute & Cluster Architecture",
    desc: "Databricks splits nodes into Driver (orchestrator, runs SparkSession and Driver JVM) and Workers (execute JVM tasks). It supports All-Purpose Clusters (interactive workspaces), Job Clusters (ephemeral task runs - 30% cheaper), and SQL Warehouses (optimized BI connectors). Virtual pools pre-warm nodes to slash startup latency.",
    code: `# Configure SparkSession inside local JVM context
# spark.conf.set("spark.sql.shuffle.partitions", "200")
print("Driver and Worker coordinates initialized. Pools pre-warmed.")`,
    quiz: {
      question: "Which cluster type is recommended for running scheduled production ETL pipelines to optimize cloud costs?",
      options: [
        "Interactive All-Purpose Clusters",
        "Job Clusters (Ephemeral Tasks Clusters)",
        "Single-Node Serverless SQL Warehouses",
        "High-Concurrency Shared Pools"
      ],
      correctIndex: 1,
      explanation: "Job Clusters are ephemeral nodes created solely for a job run and terminated instantly on completion. They are charged at a much lower rate (saves 30% or more compared to All-Purpose nodes)."
    }
  },
  {
    id: 3,
    title: "3. DBFS & ADLS Cloud Ingest",
    desc: "Databricks File System (DBFS) is an S3/ADLS bucket mount. In enterprise setups, rather than public storage access, you mount ADLS Gen2 or AWS S3 containers securely inside the Data Plane using Service Principals, OAuth 2.0, or Unity Catalog storage credentials.",
    code: `# List files in DBFS root
# dbutils.fs.ls("/mnt/data")

# Mount Azure ADLS Gen2 directory
# dbutils.fs.mount(
#   source = "abfss://container@storage.dfs.core.windows.net/",
#   mount_point = "/mnt/storage",
#   extra_configs = configs
# )
print("Cloud secure S3/ADLS mounts validated.")`,
    quiz: {
      question: "Which Databricks utility module is used to safely manipulate files, directories, and storage mounts in DBFS?",
      options: [
        "os.path",
        "dbutils.fs",
        "spark.read",
        "shutil"
      ],
      correctIndex: 1,
      explanation: "`dbutils.fs` (Databricks Utilities File System) provides native commands (ls, cp, mv, rm, mount) to safely interact with DBFS and external cloud storage buckets."
    }
  },
  {
    id: 4,
    title: "4. SparkSession & Ingest",
    desc: "The SparkSession (spark) is the entry point for Spark SQL and PySpark DataFrames. Ingest raw CSV, JSON, Parquet, or Avro files by enforcing static schemas (StructType) to prevent data corruption during loading.",
    code: `from pyspark.sql.types import StructType, StructField, StringType, IntegerType

# Define strict target schema
schema = StructType([
    StructField("id", IntegerType(), True),
    StructField("name", StringType(), True)
])

# Read CSV with defined schema
# df = spark.read.format("csv").schema(schema).load("/mnt/raw/users.csv")
print("Structured Spark schema compilation validated.")`,
    quiz: {
      question: "Why is it best practice to enforce a strict StructType schema when reading raw CSV/JSON files in PySpark?",
      options: [
        "To speed up execution by bypassing Spark's schema-inference job scan.",
        "To automatically encrypt all incoming string columns.",
        "To bypass network PrivateLink firewalls.",
        "To cast all numerical values into float formats automatically."
      ],
      correctIndex: 0,
      explanation: "Enforcing a strict schema prevents Spark from running a separate, costly job scan across the entire dataset to infer schemas, saving CPU time, and guarantees data contract safety."
    }
  },
  {
    id: 5,
    title: "5. Spark Operations & Joins",
    desc: "Execute core relational tasks. PySpark handles joins (inner, left, right, outer, semi, anti). When joining a massive table with a small dimension table (<100MB), force a Broadcast Join to send the small table to all workers, eliminating expensive network shuffles.",
    code: `from pyspark.sql.functions import broadcast

# Standard Join
# joined_df = large_df.join(small_df, on="user_id", how="inner")

# Optimized Broadcast Join (bypasses shuffles!)
# joined_df = large_df.join(broadcast(small_df), on="user_id", how="inner")
print("Broadcast join routing successfully configured.")`,
    quiz: {
      question: "Which PySpark join type returns only the rows from the left table that have NO matching key in the right table (useful for locating orphaned records)?",
      options: [
        "how='left_semi'",
        "how='left_anti'",
        "how='left_outer'",
        "how='full_outer'"
      ],
      correctIndex: 1,
      explanation: "An anti join returns left-side rows that do not have matching keys in the right table. (In contrast, semi returns left-side rows that do have matching keys, without appending columns)."
    }
  },
  {
    id: 6,
    title: "6. Advanced Functions & Windows",
    desc: "Perform complex operations over dataset groups. Window functions (row_number(), rank(), dense_rank(), running totals) require partitioning and ordering matrices dynamically in memory.",
    code: `from pyspark.sql.window import Window
from pyspark.sql.functions import row_number, sum, col

# Set window boundary: group by department, order by salary
window_spec = Window.partitionBy("department").orderBy(col("salary").desc())

# Assign rank IDs and compute partition running total
# df = df.withColumn("rank_id", row_number().over(window_spec))
# df = df.withColumn("running_total", sum("salary").over(window_spec))
print("Analytical partitions window spec created.")`,
    quiz: {
      question: "Which window function should you use to rank records without leaving gaps in ranking values if duplicates exist?",
      options: [
        "row_number()",
        "rank()",
        "dense_rank()",
        "sum()"
      ],
      correctIndex: 2,
      explanation: "dense_rank() assigns consecutive ranks (e.g. 1, 2, 2, 3), leaving no gaps. In contrast, rank() leaves gaps (e.g. 1, 2, 2, 4), and row_number() always assigns distinct consecutive numbers (1, 2, 3, 4)."
    }
  },
  {
    id: 7,
    title: "7. Delta Lake & ACID Internals",
    desc: "Delta Lake is an open-source storage layer. Under the hood, Delta stores data in Parquet format, accompanied by a transaction log (_delta_log/000...000.json). It records all transactions chronologically, providing full ACID compliance, schema enforcement, and audit logs.",
    code: `# Create Delta table
# df.write.format("delta").mode("overwrite").saveAsTable("sales_delta")

# Managed Table: stores data inside default Unity Catalog database path.
# External Table: points to an external secure S3 bucket mount.
print("ACID transactional Delta logs verified.")`,
    quiz: {
      question: "What is the core structural difference between a Managed Table and an External Table in Unity Catalog?",
      options: [
        "Managed tables store files as JSON; External tables store files as Avro.",
        "Managed tables own the underlying data; dropping a managed table deletes both metadata and actual data files. Dropping an external table deletes metadata only.",
        "External tables do not support Unity Catalog access rules.",
        "Managed tables run exclusively on Python 2."
      ],
      correctIndex: 1,
      explanation: "A Managed table owns its storage. Dropping it deletes both metadata and physical files from cloud storage. An External table references external storage, so dropping it only deletes the metadata, leaving the physical files intact."
    }
  },
  {
    id: 8,
    title: "8. Delta CRUD & MERGE Operations",
    desc: "Data Engineers use Delta Lake's ACID CRUD operations: INSERT, UPDATE, DELETE, and the extremely powerful MERGE INTO statement. MERGE INTO allows executing high-performance Change Data Capture (CDC) upserts (matching keys to update old fields and insert new ones).",
    code: `# PySpark Delta Merge Ingest
# from delta.tables import DeltaTable
# targetTable = DeltaTable.forPath(spark, "/mnt/delta/users")
# targetTable.alias("t").merge(
#     sourceDF.alias("s"), "t.id = s.id"
# ).whenMatchedUpdateAll().whenNotMatchedInsertAll().execute()
print("PySpark Delta CDC MERGE configurations validated.")`,
    quiz: {
      question: "Which Delta Lake SQL/PySpark command is the industry standard to implement a Change Data Capture (CDC) load, updating existing keys and inserting new records in a single transactional step?",
      options: [
        "INSERT INTO ... ON DUPLICATE KEY",
        "MERGE INTO",
        "df.write.mode('overwrite')",
        "UPDATE TABLE"
      ],
      correctIndex: 1,
      explanation: "MERGE INTO is the SQL standard command (natively supported in Delta Lake) to execute upsert operations, matching keys between source and target datasets in a single transaction."
    }
  },
  {
    id: 9,
    title: "9. Delta Optimization & Compactions",
    desc: "Small files severely degrade read performance in data lakes. Delta solves this via OPTIMIZE (file compaction which packs small files into large 1GB blocks) and ZORDER BY (co-locating related data across columns for multi-dimensional search pruning). Use VACUUM to delete unreferenced stale files.",
    code: `-- Optimize table and Z-Order by high priority join keys
-- OPTIMIZE sales_delta ZORDER BY (customer_id, date);

-- Cleanup historical files older than default 7 days retention
-- VACUUM sales_delta;
print("Compaction and sorting plans compiled.")`,
    quiz: {
      question: "Which of the following commands should you run to permanently delete unreferenced physical data files older than the default 7-day retention period in a Delta table?",
      options: [
        "DELETE FROM table",
        "OPTIMIZE table",
        "VACUUM table",
        "DROP TABLE table"
      ],
      correctIndex: 2,
      explanation: "VACUUM deletes all physical parquet files no longer referenced by the transaction log that are older than the retention threshold (default: 7 days / 168 hours)."
    }
  },
  {
    id: 10,
    title: "10. Time Travel & Restore",
    desc: "Because Delta log records every version of a table, you can 'Time Travel' to query historical data as of a specific version or timestamp, and instantly rollback using the RESTORE command.",
    code: `-- Read Delta table as of version 3
-- SELECT * FROM sales_delta VERSION AS OF 3;

-- Restore table back to an older version
-- RESTORE TABLE sales_delta TO VERSION AS OF 2;
print("Delta Time Travel logs active.")`,
    quiz: {
      question: "Which SQL/PySpark command allows you to view the complete history of all operations, versions, and users who modified a Delta table?",
      options: [
        "SELECT * FROM history(table)",
        "DESCRIBE HISTORY table_name",
        "SHOW TRANSACTIONS table_name",
        "GET HISTORICAL LOG table_name"
      ],
      correctIndex: 1,
      explanation: "DESCRIBE HISTORY table_name displays the chronological history of a Delta table, listing every version number, timestamp, operation (e.g. MERGE, OPTIMIZE), and the user ID."
    }
  },
  {
    id: 11,
    title: "11. Unity Catalog & Governance",
    desc: "Unity Catalog is Databricks' centralized data governance layer. It establishes a standard securable hierarchy (Catalog -> Schema -> Table) and enforces granular permissions (GRANT SELECT, row-level filtering policies, and column masking policies).",
    code: `-- Grant access privilege to analyst groups
-- GRANT SELECT, USAGE, READ VOLUME ON SCHEMA sales.gold TO \`analyst_group\`;

-- Create column masking policy
-- CREATE MASKING POLICY email_mask AS (val STRING) ->
--   CASE WHEN is_member('hr_group') THEN val ELSE '###@###.com' END;
print("Unity Catalog governance configurations active.")`,
    quiz: {
      question: "Which SQL command is used in Unity Catalog to grant read-only permissions on a specific schema to a team group named 'de_team'?",
      options: [
        "ALLOW SELECT ON SCHEMA sales TO de_team",
        "GRANT SELECT, USAGE ON SCHEMA sales TO `de_team`",
        "GRANT READ ON SCHEMA sales TO de_team",
        "SET PRIVILEGE SELECT ON SCHEMA sales TO de_team"
      ],
      correctIndex: 1,
      explanation: "Using GRANT SELECT, USAGE ON SCHEMA schema_name TO group_name is the standard ANSI-SQL command to assign read privileges to a group in Unity Catalog."
    }
  },
  {
    id: 12,
    title: "12. Medallion Lake Architecture",
    desc: "A multi-hop layout designed to organize data quality. Bronze layer: Raw ingestion, keeps raw history (append-only). Silver layer: Cleaned, validated, structured, and deduplicated. Gold layer: Aggregated business level tables ready for BI dashboarding.",
    code: `# raw_stream (Bronze) -> cleaned_deduped (Silver) -> business_kpi (Gold)
print("Bronze, Silver, and Gold structures mapped.")`,
    quiz: {
      question: "In which medallion architecture layer should you perform schema casting, null imputation, deduplication, and string cleaning?",
      options: [
        "Bronze Layer",
        "Silver Layer",
        "Gold Layer",
        "Landing Zone"
      ],
      correctIndex: 1,
      explanation: "The Silver layer is designed for data cleansing, validation, structural standardization, type casting, and deduplication, serving as a trusted source for reporting."
    }
  },
  {
    id: 13,
    title: "13. Auto Loader Ingest",
    desc: "Auto Loader (format('cloudFiles')) incrementally and efficiently processes new files as they arrive in cloud storage. It supports schema discovery/evolution and records streaming states inside checkpoint directories to guarantee exactly-once processing.",
    code: `# PySpark Auto Loader Configuration
# df = (spark.readStream
#   .format("cloudFiles")
#   .option("cloudFiles.format", "json")
#   .option("cloudFiles.schemaLocation", "/mnt/schemas/logs")
#   .load("/mnt/raw_data"))
print("Auto Loader incremental telemetry configured.")`,
    quiz: {
      question: "Which parameter must be passed in Spark readStream to invoke Databricks' Auto Loader engine?",
      options: [
        ".format('autoloader')",
        ".format('cloudFiles')",
        ".option('incremental', 'true')",
        ".format('delta')"
      ],
      correctIndex: 1,
      explanation: "Passing .format('cloudFiles') instructs the Spark runtime to boot up the optimized Databricks Auto Loader engine for directory file-discovery streams."
    }
  },
  {
    id: 14,
    title: "14. Structured Streaming & Watermarks",
    desc: "Structured Streaming handles low-latency event processing. Trigger modes (processingTime, once=True, availableNow=True) partition batches. Watermarking (withWatermark()) defines late-arriving event thresholds, cleaning up state stores dynamically.",
    code: `# Spark Structured Streaming with Watermark
# df_stream = (spark.readStream.table("bronze")
#   .withWatermark("timestamp", "2 hours")
#   .groupBy("region", window("timestamp", "1 hour"))
#   .count())
print("Structured Streaming watermark configurations active.")`,
    quiz: {
      question: "Which trigger option in Structured Streaming should you choose to process all currently available records in cloud storage and then instantly shut down the compute cluster to minimize server charges?",
      options: [
        ".trigger(processingTime='10 seconds')",
        ".trigger(once=True) / .trigger(availableNow=True)",
        ".trigger(continuous='1 second')",
        ".trigger(batch=True)"
      ],
      correctIndex: 1,
      explanation: "Both .trigger(once=True) (older Spark versions) and .trigger(availableNow=True) (modern standard) process all outstanding records as a single batch, updating checkpoint states, and terminating the query immediately."
    }
  },
  {
    id: 15,
    title: "15. Workflows & DAG Jobs",
    desc: "Databricks Workflows orchestrates complex DAG tasks. You define tasks (Notebooks, SQL queries, Python scripts), declare upstream dependencies, configure automatic email/Slack alerts, and choose Job Clusters for lower cost execution.",
    code: `# Multi-task DAG pipeline setup
# task_1: Ingestion -> task_2: Spark Cleaning (depends on task_1)
print("Workflows DAG task scheduling active.")`,
    quiz: {
      question: "Why should production workflows always target Ephemeral Job Clusters instead of active All-Purpose interactive clusters?",
      options: [
        "Interactive clusters do not support scheduling.",
        "Ephemeral Job Clusters are up to 30-50% cheaper, terminate automatically on DAG completion, and isolate execution contexts completely.",
        "Job Clusters run Spark much faster than interactive nodes.",
        "To bypass Unity Catalog governance schemas."
      ],
      correctIndex: 1,
      explanation: "Job Clusters are built dynamically for the specific task run and terminated instantly. Databricks bills Job workloads at a significantly lower per-unit rate compared to All-Purpose workspaces."
    }
  },
  {
    id: 16,
    title: "16. Delta Live Tables (DLT)",
    desc: "Delta Live Tables (DLT) is a declarative framework to build reliable, maintainable data pipelines. You write standard SQL/Python, and DLT handles orchestration, dependencies, and enforces data-quality checks using 'Expectations'.",
    code: `# PySpark DLT pipeline with Expectations
# import dlt
# @dlt.table
# @dlt.expect_or_drop("valid_id", "id IS NOT NULL")
# def dlt_silver_table():
#   return dlt.read("dlt_bronze_table")
print("Delta Live Tables validation engine active.")`,
    quiz: {
      question: "In Delta Live Tables (DLT), what happens to a row that fails a constraint defined as @dlt.expect_or_fail()?",
      options: [
        "The row is dropped, and the pipeline continues.",
        "The row is placed in a quarantine table, and an alert is sent.",
        "The transaction is aborted, the task execution immediately fails, and the pipeline stops.",
        "The row is encrypted and loaded."
      ],
      correctIndex: 2,
      explanation: "expect_or_fail is a strict data quality rule. If a record violates this constraint, DLT halts the execution immediately to prevent corrupted data from spilling into downstream gold layers."
    }
  },
  {
    id: 17,
    title: "17. Databricks SQL & BI Warehouses",
    desc: "Databricks SQL enables running standard ANSI SQL queries at warehouse speeds. Serverless SQL Warehouses scale up instantly to handle peak analyst concurrency, communicating natively with BI tools like PowerBI and Tableau.",
    code: `-- SQL query executed against Serverless Warehouse
-- SELECT region, SUM(amount) FROM finance_catalog.gold.sales_kpis
-- GROUP BY region ORDER BY 2 DESC;
print("SQL Warehouses endpoint active.")`,
    quiz: {
      question: "Which component in Databricks SQL is optimized specifically to run reporting BI dashboard queries at scale, supporting auto-suspend and serverless concurrency scaling?",
      options: [
        "Job Clusters",
        "Serverless SQL Warehouses",
        "All-Purpose Workspace Nodes",
        "Single-Node Driver VMs"
      ],
      correctIndex: 1,
      explanation: "SQL Warehouses are specialized compute resources tailored for SQL queries, reporting, and BI integrations. Serverless warehouses boot up in under 5 seconds and auto-scale horizontally to support concurrent analysts."
    }
  },
  {
    id: 18,
    title: "18. Spark Performance & Shuffle Tuning",
    desc: "High-performance Spark requires optimizing shuffles. Tweak spark.sql.shuffle.partitions (default 200 is too large for small data and too small for TBs). Solve data skew using 'Salting' (random keys join prefixing) and utilize the Photon engine for optimized hardware-level vectorized query execution.",
    code: `# Optimizing shuffle partitions dynamically
# spark.conf.set("spark.sql.shuffle.partitions", "20")
print("Photon execution engine and shuffle optimizations verified.")`,
    quiz: {
      question: "How do you identify that a PySpark job is suffering from 'Data Skew' during execution, and how do you resolve it?",
      options: [
        "Check the Spark UI: if a single worker task takes 90% of processing time while others finish instantly. Resolve by adding a random salt prefix to partition keys.",
        "The job will crash with a 'Driver Memory Full' warning. Resolve by calling .collect().",
        "The cluster will trigger a VPC PrivateLink gateway timeout.",
        "Upgrade the notebook version to Python 3.12."
      ],
      correctIndex: 0,
      explanation: "Data Skew means one partition holds much more data than others. On Spark UI, you will see highly uneven task run times. Adding a random prefix ('salting') to the join key divides the skewed key across multiple executors, balancing workload partitions."
    }
  }
];

const databricksCheatsheetData = [
  {
    id: "magic",
    title: "1. Magic Notebook Commands",
    desc: "Magic commands allow multi-lingual execution and local file utility queries within the same notebook runtime, streamlining pipelines and cross-team development.",
    commands: [
      { name: "%python", syntax: "%python\n# Write raw PySpark / Python statements\nprint(df.count())", desc: "Sets the active cell language to Python. Runtimes come pre-loaded with Python 3.x and SparkContext." },
      { name: "%sql", syntax: "%sql\nSELECT * FROM finance_catalog.clean.users LIMIT 10", desc: "Runs standard ANSI SQL queries. Automatically accesses metadata registered in Unity Catalog or Hive Metastore." },
      { name: "%scala", syntax: "%scala\nval df = spark.read.table(\"users\")", desc: "Sets active cell to Scala for high-throughput compiled code execution." },
      { name: "%r", syntax: "%r\nlibrary(ggplot2)\nplot(df)", desc: "Sets active cell to R for advanced statistical analysis and ggplot visualization." },
      { name: "%md", syntax: "%md\n# Platform Architecture\n* Use private VPC subnets", desc: "Renders Markdown text cells for pipeline documentation and inline runbooks." },
      { name: "%sh", syntax: "%sh\npip install mlflow\ndf -h", desc: "Spins up a local Unix/Bash terminal shell inside the Driver node's operating system." },
      { name: "%fs", syntax: "%fs\nls /mnt/telemetry/\nmv /dbfs/file1 /dbfs/file2", desc: "Shorthand file system shell utilities to navigate the Databricks File System (DBFS)." },
      { name: "%run", syntax: "%run ./utils_notebook", desc: "Executes a sibling notebook inline, inheriting all its variables, imports, and function definitions." }
    ],
    pysparkCode: `# Magic command simulation via SparkSession
# You can run raw SQL inside a python block using spark.sql()
spark.sql("SELECT current_user(), current_catalog(), current_database()").show()`
  },
  {
    id: "dbfs",
    title: "2. DBFS & Storage Mounting",
    desc: "Databricks File System (DBFS) is a virtual directory mounted over an S3 bucket or ADLS container, allowing secure, local-like file read/write operations.",
    commands: [
      { name: "dbutils.fs.ls", syntax: "dbutils.fs.ls(\"/mnt/telemetry/raw_logs\")", desc: "Returns a list of files, sizes, and path names within the specified directory." },
      { name: "dbutils.fs.cp", syntax: "dbutils.fs.cp(\"source_path\", \"dest_path\", recurse=True)", desc: "Copies files or directories recursively across DBFS directories." },
      { name: "dbutils.fs.mv", syntax: "dbutils.fs.mv(\"source\", \"destination\")", desc: "Moves files or directories recursively. Equivalent to a file rename operation." },
      { name: "dbutils.fs.rm", syntax: "dbutils.fs.rm(\"path\", recurse=True)", desc: "Deletes files or directory trees recursively from storage. (Warning: Permanent)." },
      { name: "dbutils.fs.head", syntax: "dbutils.fs.head(\"path\", maxBytes=1024)", desc: "Displays the first N bytes of a file (excellent for quick CSV/JSON inspections)." },
      { name: "dbutils.fs.mount", syntax: "dbutils.fs.mount(\n  source = \"abfss://container@storage.dfs.core.windows.net/\",\n  mount_point = \"/mnt/azure_storage\",\n  extra_configs = configs\n)", desc: "Mounts an external cloud storage container into DBFS using Service Principal OAuth credentials." }
    ],
    pysparkCode: `# Simulated DBFS mount & directory scan
dbutils = spark.sparkContext._jvm.com.databricks.dbutils.DBUtils
print("DBFS Mounts active: " + str([m.mountPoint for m in dbutils.fs.mounts()]))
print(dbutils.fs.ls("/mnt/telemetry/"))`
  },
  {
    id: "dataframe_io",
    title: "3. DataFrame Reading & Writing",
    desc: "High-performance reading and writing of columnar formats (Parquet, Delta) with schema safeguards and custom file sizing properties.",
    commands: [
      { name: "spark.read.format", syntax: "df = spark.read.format(\"parquet\").load(\"path\")", desc: "Standard entry point to read files. Supported formats: csv, json, parquet, delta, text, orc." },
      { name: "option", syntax: ".option(\"header\", \"true\").option(\"inferSchema\", \"true\")", desc: "Applies custom configurations (e.g. delimiters for CSVs, multi-line parser for JSONs)." },
      { name: "schema", syntax: ".schema(custom_struct_schema)", desc: "Enforces a strict structure mapping (StructType) during file loading, skipping costly auto-inference scans." },
      { name: "df.write.format", syntax: "df.write.format(\"delta\").saveAsTable(\"db.table\")", desc: "Writes DataFrame records to catalogs in specified format." },
      { name: "mode", syntax: ".mode(\"overwrite\")", desc: "Specifies file write behaviors: overwrite (replaces all records), append (inserts increments), ignore, or errorIfExists." },
      { name: "partitionBy", syntax: ".partitionBy(\"year\", \"month\")", desc: "Splits output physical directories by column values, optimizing downstream partition pruning scans." }
    ],
    pysparkCode: `# Standard Spark DataFrame read/write sequence
raw_schema = "id INT, timestamp TIMESTAMP, revenue DOUBLE, department STRING"
df = (spark.read.format("delta")
  .schema(raw_schema)
  .load("/mnt/telemetry/clean_revenues"))

(df.write.format("delta")
  .mode("overwrite")
  .partitionBy("department")
  .saveAsTable("finance_catalog.clean.revenues"))`
  },
  {
    id: "transformations",
    title: "4. DataFrame Transformations",
    desc: "Transformations operate on Spark's lazy evaluation model, building execution DAGs that resolve only when actions (like show, collect, or write) are called.",
    commands: [
      { name: "select", syntax: "df.select(\"id\", col(\"amount\").alias(\"total\"))", desc: "Selects and projects target columns, applying calculations or column renaming inline." },
      { name: "filter / where", syntax: "df.filter((col(\"age\") > 21) & (col(\"country\") == \"US\"))", desc: "Applies boolean filtering constraints to rows. where is a complete alias for filter." },
      { name: "withColumn", syntax: "df.withColumn(\"tax\", col(\"amount\") * 0.18)", desc: "Creates a new column or updates an existing column name with modified data types." },
      { name: "withColumnRenamed", syntax: "df.withColumnRenamed(\"old_name\", \"new_name\")", desc: "Renames an existing column. Avoids the overhead of full table schema modifications." },
      { name: "drop", syntax: "df.drop(\"sensitive_column\")", desc: "Deletes target columns from the DataFrame schema." },
      { name: "dropDuplicates", syntax: "df.dropDuplicates(subset=[\"user_id\", \"date\"])", desc: "Deduplicates records based on a unique composite key index, retaining the first encountered row." },
      { name: "fillna", syntax: "df.fillna(value=0, subset=[\"score\"])", desc: "Replaces null (NaN) cells with default values in specified columns." },
      { name: "dropna", syntax: "df.dropna(how=\"any\", subset=[\"id\"])", desc: "Deletes rows containing null cells in specified column scopes." }
    ],
    pysparkCode: `# PySpark transformation flow
from pyspark.sql.functions import col, current_timestamp
clean_df = (spark.read.table("finance_catalog.raw.ingest_logs")
  .filter(col("amount").isNotNull())
  .dropDuplicates(subset=["id"])
  .withColumn("processed_time", current_timestamp())
  .withColumnRenamed("amount", "revenue"))
clean_df.show(5)`
  },
  {
    id: "aggregations",
    title: "5. Aggregations & Joins",
    desc: "Operations that trigger shuffles (data moving across executors). Optimized using broadcast hints to prevent heavy network overheads on small datasets.",
    commands: [
      { name: "groupBy", syntax: "df.groupBy(\"region\")", desc: "Groups rows based on categorical values, returning a GroupedData object ready for aggregates." },
      { name: "agg", syntax: "df.groupBy().agg(sum(\"revenue\").alias(\"total\"))", desc: "Computes multiple aggregations (sum, count, avg, max, min) on grouped datasets." },
      { name: "join", syntax: "df1.join(df2, df1.id == df2.id, how=\"left\")", desc: "Joins two DataFrames. Types: inner, left, right, full, semi (existential match), anti (exclusion filter)." },
      { name: "broadcast", syntax: "df1.join(broadcast(small_df), \"id\")", desc: "Broadcasts a small table (<10MB default) to all executors, skipping costly cluster shuffling." }
    ],
    pysparkCode: `# High-performance join with broadcast hint
from pyspark.sql.functions import broadcast, col, avg
sales_df = spark.read.table("finance_catalog.clean.sales")
regions_df = spark.read.table("finance_catalog.clean.regions")

joined_df = sales_df.join(broadcast(regions_df), "region_id", "inner")
joined_df.groupBy("region_name").agg(avg(col("amount")).alias("average_sale")).show()`
  },
  {
    id: "window",
    title: "6. Window Partition Functions",
    desc: "Window functions execute calculations across a group of rows (partitions) that are related to the current row, without collapsing them into a single row.",
    commands: [
      { name: "Window.partitionBy", syntax: "Window.partitionBy(\"department\")", desc: "Defines the column values to split the dataset partitions into." },
      { name: "orderBy", syntax: "window_spec.orderBy(col(\"date\").desc())", desc: "Specifies the logical sort ordering of rows inside each partition bucket." },
      { name: "row_number", syntax: "row_number().over(window_spec)", desc: "Assigns a sequential row index (starting at 1) to each row within a partition." },
      { name: "rank", syntax: "rank().over(window_spec)", desc: "Assigns a sorted ranking rank index, leaving gaps if duplicate order values occur." },
      { name: "dense_rank", syntax: "dense_rank().over(window_spec)", desc: "Assigns ranking index without leaving gaps for duplicates." },
      { name: "sum().over()", syntax: "sum(\"amount\").over(window_spec)", desc: "Calculates running totals or cumulative aggregates over ordered partitions." }
    ],
    pysparkCode: `# Advanced Window running total calculation
from pyspark.sql.window import Window
from pyspark.sql.functions import col, sum, row_number

window_spec = Window.partitionBy("department").orderBy("date")
res_df = (spark.read.table("finance_catalog.clean.revenues")
  .withColumn("idx", row_number().over(window_spec))
  .withColumn("running_revenue", sum(col("revenue")).over(window_spec)))
res_df.show()`
  },
  {
    id: "delta_crud",
    title: "7. Delta Lake ACID & CRUD",
    desc: "Delta Lake adds a transactional ACID log to Parquet, providing transaction history, time travel, schema safeguards, and safe MERGE capabilities.",
    commands: [
      { name: "MERGE INTO (Upsert)", syntax: "target.merge(updates, \"t.id = u.id\")\n.whenMatchedUpdate(set={...})\n.whenNotMatchedInsert(values={...})", desc: "Upserts change data capture (CDC) increments in a single transaction, updating existing matches and appending new ones." },
      { name: "DESCRIBE HISTORY", syntax: "DESCRIBE HISTORY delta_db.table_name", desc: "Retrieves complete metadata log versions, listing usernames, operations, timestamps, and commit properties." },
      { name: "RESTORE TABLE", syntax: "RESTORE TABLE delta_db.table TO VERSION AS OF 5", desc: "Rolls back table records completely to a historical commit version or a specific timestamp state." },
      { name: "Time Travel query", syntax: "spark.read.option(\"versionAsOf\", 3).load(path)", desc: "Reads historical table snapshots using commit versions or specific calendar timestamps." }
    ],
    pysparkCode: `# Delta historical query and rollback checks
history_df = spark.sql("DESCRIBE HISTORY finance_catalog.clean.users")
history_df.select("version", "timestamp", "userName", "operation").show(5)

# Example time travel query
# df_v3 = spark.read.option("versionAsOf", 3).table("finance_catalog.clean.users")`
  },
  {
    id: "delta_optimization",
    title: "8. Delta Lake Performance Compactions",
    desc: "Operations that physically compact, layout-sort, and prune datasets to solve the 'Small File Problem' and maintain high read queries efficiency.",
    commands: [
      { name: "OPTIMIZE", syntax: "OPTIMIZE database.table", desc: "Merges fragmented kilobytes-sized files in active directories into optimized 100MB-250MB Parquet segments." },
      { name: "ZORDER BY", syntax: "OPTIMIZE table ZORDER BY (customer_id, date)", desc: "Groups datasets physically into multidimensional sort keys, enabling high query pruning efficiency." },
      { name: "VACUUM", syntax: "VACUUM table RETAIN 168 HOURS", desc: "Permanently deletes unreferenced historical Parquet files that are older than the specified retention threshold (default 7 days)." }
    ],
    pysparkCode: `-- SQL delta compaction block
OPTIMIZE finance_catalog.clean.users
ZORDER BY (customer_id, event_date);

-- Remove old physical files (default 7 days retention bypass requires spark.databricks.delta.vacuum.parallelDelete.enabled = true)
VACUUM finance_catalog.clean.users RETAIN 168 HOURS;`
  },
  {
    id: "unity_catalog",
    title: "9. Unity Catalog & Security Controls",
    desc: "Enforces role-based permissions, column masking, and row filter policies uniformly across multiple workspaces and cloud environments.",
    commands: [
      { name: "GRANT", syntax: "GRANT SELECT, MODIFY ON TABLE catalog.schema.table TO `analyst_group`", desc: "Assigns access privileges to users, groups, or service principals registered in account consoles." },
      { name: "REVOKE", syntax: "REVOKE MODIFY ON SCHEMA catalog.schema FROM `intern_group`", desc: "Withdraws specific access privileges from identities." },
      { name: "CREATE ROW FILTER", syntax: "CREATE ROW FILTER POLICY region_filter USING (region STRING) -> region = 'US'", desc: "Enforces row-level security masking, restricting row visual access based on user attributes." },
      { name: "CREATE MASK", syntax: "CREATE MASK POLICY email_mask USING (val STRING) -> CASE WHEN is_member('HR') THEN val ELSE '***' END", desc: "Implements column-level masking to obscure PII fields (emails, SSNs) for non-authorized roles." }
    ],
    pysparkCode: `-- SQL Access governance checks
SHOW GRANTS ON TABLE finance_catalog.clean.users;

-- Establish a clean privilege grant
GRANT USAGE ON CATALOG finance_catalog TO \`de_operator_group\`;
GRANT SELECT ON SCHEMA finance_catalog.clean TO \`analyst_group\`;`
  },
  {
    id: "autoloader",
    title: "10. Auto Loader Stream Ingestion",
    desc: "Auto Loader efficiently discovers and ingests millions of raw files from S3 or ADLS directories incrementally, without directory list scanning penalties.",
    commands: [
      { name: "cloudFiles format", syntax: ".format(\"cloudFiles\")", desc: "Triggers the optimized Databricks Auto Loader ingestion stream engine." },
      { name: "cloudFiles.format option", syntax: ".option(\"cloudFiles.format\", \"json\")", desc: "Configures the format of source files (json, csv, parquet, text, orc, xml)." },
      { name: "cloudFiles.schemaLocation", syntax: ".option(\"cloudFiles.schemaLocation\", \"/mnt/schemas/\")", desc: "Establishes a schema storage stage. Auto Loader uses this to track data structures and column evolutions." },
      { name: "checkpointLocation", syntax: ".option(\"checkpointLocation\", \"/mnt/checkpoints/\")", desc: "Saves streaming progress offsets, ensuring exactly-once delivery and instant crash recovery." }
    ],
    pysparkCode: `# Auto Loader incremental JSON directory scanner
df = (spark.readStream
  .format("cloudFiles")
  .option("cloudFiles.format", "json")
  .option("cloudFiles.schemaLocation", "/mnt/telemetry/schemas/users")
  .load("/mnt/telemetry/raw_uploads"))

(df.writeStream
  .format("delta")
  .outputMode("append")
  .option("checkpointLocation", "/mnt/telemetry/_checkpoints/users")
  .table("finance_catalog.raw.users_ingest"))`
  },
  {
    id: "streaming",
    title: "11. Structured Streaming Core",
    desc: "Executes continuous or micro-batched data processing, handling late-arriving events cleanly using watermarks and checkpointing directories.",
    commands: [
      { name: "readStream", syntax: "spark.readStream.format(\"delta\").load()", desc: "Initiates a streaming source DataFrame from Delta tables or broker queues." },
      { name: "withWatermark", syntax: "df.withWatermark(\"timestamp\", \"2 hours\")", desc: "Configures stream latency boundaries, allowing Spark to garbage-collect expired state states from RAM." },
      { name: "trigger", syntax: ".trigger(availableNow=True)", desc: "Configures stream processing schedules. availableNow processes all queued items in micro-batches and auto-terminates." },
      { name: "outputMode", syntax: ".outputMode(\"complete\")", desc: "Controls write states: append (new rows only), complete (re-writes entire summaries), or update (updates altered cells)." }
    ],
    pysparkCode: `# Structured Streaming summary rollup with watermarking
from pyspark.sql.functions import col, window, current_timestamp
stream_df = spark.readStream.table("finance_catalog.raw.users_ingest")

summary_df = (stream_df
  .withWatermark("timestamp", "10 minutes")
  .groupBy(window(col("timestamp"), "5 minutes"), col("department"))
  .count())

(summary_df.writeStream
  .format("delta")
  .outputMode("complete")
  .option("checkpointLocation", "/mnt/telemetry/_checkpoints/stream_agg")
  .trigger(processingTime="10 seconds")
  .table("finance_catalog.gold.active_counts"))`
  },
  {
    id: "dlt",
    title: "12. Delta Live Tables (DLT)",
    desc: "Declarative orchestration framework for building reliable, self-healing data pipelines with high quality constraints checking.",
    commands: [
      { name: "@dlt.table", syntax: "@dlt.table(name=\"silver_users\")\ndef clean_users(): ...", desc: "Python decorator declaring a managed live DLT table container." },
      { name: "@dlt.view", syntax: "@dlt.view(name=\"staging_view\")", desc: "Declares a transient DLT view layer. Does not materialize physically, saving storage costs." },
      { name: "@dlt.expect", syntax: "@dlt.expect(\"valid_id\", \"id IS NOT NULL\")", desc: "Data quality assertion. Records metrics if a record violates constraints but allows row ingestion." },
      { name: "@dlt.expect_or_drop", syntax: "@dlt.expect_or_drop(\"valid_amount\", \"amount > 0\")", desc: "Data quality assertion. Instantly drops rows that violate constraints, sending them to lineage metrics." },
      { name: "@dlt.expect_or_fail", syntax: "@dlt.expect_or_fail(\"critical_pk\", \"id > 0\")", desc: "Data quality assertion. Halts pipeline execution immediately to prevent system pollution." },
      { name: "APPLY CHANGES INTO", syntax: "dlt.apply_changes(target=\"table\", source=\"view\", keys=[\"id\"], sequence_by=\"ts\")", desc: "Enforces incremental Change Data Capture (CDC) processing, handling primary keys sorting automatically." }
    ],
    pysparkCode: `# Declaring DLT stream pipeline with expectations
import dlt
from pyspark.sql.functions import col

@dlt.table(comment="Ingest raw stream with Auto Loader")
def bronze_users():
  return (spark.readStream.format("cloudFiles")
    .option("cloudFiles.format", "json")
    .load("/mnt/telemetry/raw_logs"))

@dlt.table(comment="Cleaned Silver table with constraints checks")
@dlt.expect_or_drop("valid_email", "email LIKE '%@%.%'")
@dlt.expect_or_fail("has_id", "id IS NOT NULL")
def silver_users():
  return dlt.read_stream("bronze_users").select("id", "name", "email")`
  }
];

const sqlDatasets = {
  employees: [
    { id: 1, name: 'Alice', department_id: 101, salary: 60000, hire_date: '2020-01-15' },
    { id: 2, name: 'Bob', department_id: 102, salary: 45000, hire_date: '2021-03-20' },
    { id: 3, name: 'Charlie', department_id: 101, salary: 75000, hire_date: '2019-11-05' },
    { id: 4, name: 'David', department_id: 103, salary: 30000, hire_date: '2022-07-10' },
    { id: 5, name: 'Eve', department_id: 102, salary: 50000, hire_date: '2021-09-01' }
  ],
  departments: [
    { department_id: 101, department_name: 'Engineering' },
    { department_id: 102, department_name: 'Sales' },
    { department_id: 103, department_name: 'Support' }
  ],
  projects: [
    { project_id: 1, project_name: 'Project Alpha', department_id: 101, budget: 100000 },
    { project_id: 2, project_name: 'Project Beta', department_id: 102, budget: 50000 }
  ]
};

const sqlChallenges = [
  {
    id: 'sql-basic-1',
    category: 'Basic',
    title: 'High Earners',
    difficulty: 'Easy',
    description: "Write a SQL query to select all columns for employees who have a salary greater than 30000 (30k).",
    starterCode: "SELECT * FROM employees;",
    expectedQuery: "SELECT * FROM employees WHERE salary > 30000"
  },
  {
    id: 'sql-basic-2',
    category: 'Basic',
    title: 'Name Search',
    difficulty: 'Easy',
    description: "Select the `name` and `salary` of employees whose name starts with 'A' (e.g., using LIKE).",
    starterCode: "SELECT name, salary FROM employees;",
    expectedQuery: "SELECT name, salary FROM employees WHERE name LIKE 'A%'"
  },
  {
    id: 'sql-basic-3',
    category: 'Basic',
    title: 'Recent Engineering Hires',
    difficulty: 'Easy',
    description: "Find all columns of employees who work in the Engineering department (ID 101) and were hired on or after '2021-01-01'.",
    starterCode: "SELECT * FROM employees;",
    expectedQuery: "SELECT * FROM employees WHERE department_id = 101 AND hire_date >= '2021-01-01'"
  },
  {
    id: 'sql-join-1',
    category: 'Intermediate',
    title: 'Employee Departments',
    difficulty: 'Medium',
    description: "Join the `employees` and `departments` tables to show each employee's `name` and their `department_name`.",
    starterCode: "SELECT e.name, d.department_name \nFROM employees e;",
    expectedQuery: "SELECT e.name, d.department_name FROM employees e JOIN departments d ON e.department_id = d.department_id"
  },
  {
    id: 'sql-agg-1',
    category: 'Intermediate',
    title: 'Department Salary Totals',
    difficulty: 'Medium',
    description: "Calculate the total salary for each department. Output should have `department_id` and `total_salary`.",
    starterCode: "SELECT department_id \nFROM employees \nGROUP BY department_id;",
    expectedQuery: "SELECT department_id, SUM(salary) AS total_salary FROM employees GROUP BY department_id"
  },
  {
    id: 'sql-agg-2',
    category: 'Intermediate',
    title: 'High Budget Departments',
    difficulty: 'Medium',
    description: "Join the `departments` and `projects` tables to find departments that manage projects with a budget strictly greater than 60,000. Display the department's `department_name` and the project's `budget`.",
    starterCode: "SELECT d.department_name, p.budget \nFROM departments d;",
    expectedQuery: "SELECT d.department_name, p.budget FROM departments d JOIN projects p ON d.department_id = p.department_id WHERE p.budget > 60000"
  },
  {
    id: 'sql-agg-3',
    category: 'Intermediate',
    title: 'Department Employee Counts',
    difficulty: 'Medium',
    description: "Find the number of employees in each department. Output should have the `department_name` and the number of employees aliased as `emp_count`.",
    starterCode: "SELECT d.department_name \nFROM departments d;",
    expectedQuery: "SELECT d.department_name, COUNT(e.id) as emp_count FROM departments d JOIN employees e ON d.department_id = e.department_id GROUP BY d.department_name"
  },
  {
    id: 'sql-sub-1',
    category: 'Intermediate',
    title: 'Above Average Earners',
    difficulty: 'Medium',
    description: "Write a query using a subquery to select the `name` and `salary` of employees who earn strictly more than the average salary of all employees in the company.",
    starterCode: "SELECT name, salary \nFROM employees;",
    expectedQuery: "SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)"
  },
  {
    id: 'sql-window-1',
    category: 'Advanced',
    title: 'Salary Ranking',
    difficulty: 'Hard',
    description: "Use a window function to rank employees by salary (highest to lowest) within their department. Select `name`, `department_id`, `salary`, and `rank`.",
    starterCode: "SELECT name, department_id, salary \nFROM employees;",
    expectedQuery: "SELECT name, department_id, salary, RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) as rank FROM employees"
  },
  {
    id: 'sql-window-2',
    category: 'Advanced',
    title: 'Sequential Row Indexing',
    difficulty: 'Hard',
    description: "Write a query that assigns a sequential integer row number (starting at 1) to all employees ordered by their `hire_date` ascending. Output should contain their `name`, `hire_date`, and the row index alias `row_num`.",
    starterCode: "SELECT name, hire_date \nFROM employees;",
    expectedQuery: "SELECT name, hire_date, ROW_NUMBER() OVER(ORDER BY hire_date ASC) as row_num FROM employees"
  },
  {
    id: 'sql-window-3',
    category: 'Advanced',
    title: 'Salary Running Total',
    difficulty: 'Hard',
    description: "Calculate a running cumulative sum of employee salaries, ordered by `hire_date` ascending. Output should contain `name`, `hire_date`, `salary`, and the cumulative sum aliased as `running_salary_total`.",
    starterCode: "SELECT name, hire_date, salary \nFROM employees;",
    expectedQuery: "SELECT name, hire_date, salary, SUM(salary) OVER(ORDER BY hire_date ASC) as running_salary_total FROM employees"
  }
];

const sqlConcepts = [
  {
    id: 1,
    category: "Basics",
    question: "What is the difference between WHERE and HAVING?",
    answer: "WHERE filters rows before any grouping is done (before GROUP BY). HAVING filters the aggregated results after grouping. You cannot use aggregate functions like SUM() or COUNT() in a WHERE clause."
  },
  {
    id: 2,
    category: "Joins",
    question: "Explain the difference between INNER JOIN and LEFT JOIN.",
    answer: "INNER JOIN returns only rows that have matching values in both tables. LEFT JOIN returns all rows from the left table, and the matched rows from the right table. If there is no match, the result is NULL on the right side."
  },
  {
    id: 3,
    category: "Window Functions",
    question: "What is a Window Function?",
    answer: "A Window Function performs a calculation across a set of table rows that are somehow related to the current row, similar to an aggregate function. However, unlike regular aggregate functions, window functions do not cause rows to become grouped into a single output row — the rows retain their separate identities."
  },
  {
    id: 4,
    category: "Basics",
    question: "What are SQL Subqueries and Common Table Expressions (CTEs)?",
    answer: "A Subquery is an inner query nested inside a larger outer query (e.g. inside a WHERE, FROM, or SELECT clause). A CTE (Common Table Expression) is a temporary named result set defined using the WITH clause. CTEs are generally easier to read, maintain, and can be referenced multiple times within the same query."
  },
  {
    id: 5,
    category: "Basics",
    question: "How do you handle NULL values in SQL using COALESCE?",
    answer: "NULL represents a missing or unknown value. You can use the `COALESCE(val1, val2, ...)` function to return the first non-NULL value in its arguments list. E.g., `COALESCE(bonus, 0)` returns 0 if the bonus value is NULL, making it highly useful for mathematical operations."
  },
  {
    id: 6,
    category: "Joins",
    question: "What is a CROSS JOIN and a FULL OUTER JOIN?",
    answer: "CROSS JOIN returns the Cartesian product of the two tables (every row of the first table paired with every row of the second table). FULL OUTER JOIN returns all rows when there is a match in either left or right table records, filling missing values on either side with NULLs."
  },
  {
    id: 7,
    category: "Window Functions",
    question: "Explain ROW_NUMBER() vs RANK() vs DENSE_RANK()",
    answer: "All three assign sequential integers to ordered rows. ROW_NUMBER() assigns a unique number to each row regardless of duplicates. RANK() assigns the same rank to identical values, but skips subsequent rank numbers (e.g. 1, 2, 2, 4). DENSE_RANK() assigns the same rank to duplicates but keeps ranks sequential without gaps (e.g. 1, 2, 2, 3)."
  },
  {
    id: 8,
    category: "Window Functions",
    question: "What are LEAD() and LAG() functions used for?",
    answer: "They are value window functions used to look at neighboring rows without performing self-joins. LAG() accesses data from a previous row at a specified offset (default is 1). LEAD() accesses data from a subsequent row. Excellent for comparing period-over-period or step-by-step changes."
  }
];

const pythonConcepts = [
  {
    id: 1,
    category: "Basics",
    question: "What is if __name__ == '__main__' in Python?",
    answer: "It checks whether the script is being executed directly by the user or imported as a module by another script. When run directly, `__name__` is set to `'__main__'`, executing the block. When imported, `__name__` is set to the module name, preventing execution of testing/demo code."
  },
  {
    id: 2,
    category: "Imports & cache",
    question: "Difference between import module and from module import function?",
    answer: "`import module` imports the entire module namespace, requiring you to access functions via `module.function()` (safer, prevents naming collisions). `from module import function` binds the function directly into the local namespace, allowing direct call as `function()`, but risks overriding local functions."
  },
  {
    id: 3,
    category: "Imports & cache",
    question: "What is the __pycache__ folder?",
    answer: "It is a directory automatically created by Python to store compiled bytecode (.pyc files) of imported modules. It speeds up subsequent program startup times by skipping translation steps from raw source code."
  },
  {
    id: 4,
    category: "Imports & cache",
    question: "Why does Python create .pyc files?",
    answer: "Python compiles `.py` files into `.pyc` files containing bytecode. This is an intermediate form of representation that executes significantly faster in the Python Virtual Machine (PVM) than parsing raw source code files on every launch."
  },
  {
    id: 5,
    category: "Basics",
    question: "What is the purpose of requirements.txt?",
    answer: "It acts as a package manifest file listing exact external libraries and version locks required by a project. Enables standardized, reproducible environment setups across teams using `pip install -r requirements.txt`."
  },
  {
    id: 6,
    category: "Imports & cache",
    question: "Difference between .py and .pyc files?",
    answer: "`.py` files are human-readable, editable source code files containing raw Python statements. `.pyc` files are compiled, machine-readable binary bytecode generated by the interpreter to optimize load times."
  },
  {
    id: 7,
    category: "Basics",
    question: "What is a Python module?",
    answer: "A single `.py` file containing classes, variables, functions, and runnable statements that can be imported and reused inside other Python scripts."
  },
  {
    id: 8,
    category: "Basics",
    question: "What is a Python package?",
    answer: "A directory containing multiple modules along with a special `__init__.py` file, establishing a hierarchical namespace structure (e.g. `import package.module`)."
  },
  {
    id: 9,
    category: "Imports & cache",
    question: "What is the __init__.py file?",
    answer: "It is a special file placed inside directories to mark them as Python packages. It can be empty, or used to execute package-level initialization codes and define the exposed namespace via the `__all__` list."
  },
  {
    id: 10,
    category: "Scopes",
    question: "Difference between local variable and global variable?",
    answer: "Local variables are declared inside functions, are bounded to that function's stack frame, and disappear when the function exits. Global variables are declared at the top-level of a module, exist for the lifecycle of the script, and are accessible by any function."
  },
  {
    id: 11,
    category: "Scopes",
    question: "What is the use of the global keyword?",
    answer: "It instructs Python that a variable declared inside a function refers to the module-level global scope, allowing you to modify and reassign its value globally instead of creating a local variable duplicate."
  },
  {
    id: 12,
    category: "Scopes",
    question: "What is the use of the nonlocal keyword?",
    answer: "It allows a nested inner function to bind and modify variables declared inside its outer enclosing function (lexical closure scope), rather than creating a duplicate local variable inside the inner scope."
  },
  {
    id: 13,
    category: "Basics",
    question: "Difference between == and is?",
    answer: "`==` is the equality operator, comparing whether the values of two variables are equal (value comparison). `is` is the identity operator, comparing whether two variables point to the exact same object in physical RAM memory (address check: `id(a) == id(b)`)."
  },
  {
    id: 14,
    category: "Containers",
    question: "Difference between append() and extend() on lists?",
    answer: "`append(item)` adds its argument as a single object element to the end of the list (e.g., appending a list adds a nested list). `extend(iterable)` iterates over the argument elements, unwrapping and appending each one individually."
  },
  {
    id: 15,
    category: "Containers",
    question: "Difference between remove(), pop(), and del on lists?",
    answer: "`remove(val)` searches and deletes the first occurrence of a specific value (errors if not found). `pop(idx)` deletes and returns the element at the specified index (default last item). `del list[idx]` is a built-in statement that permanently deletes the reference at that index without returning a value."
  },
  {
    id: 16,
    category: "Containers",
    question: "What is list comprehension?",
    answer: "A compact, expressive, and faster syntax to construct new lists from existing iterables by applying mapping formulas and boolean filter criteria inside square brackets, e.g. `[x*2 for x in items if x > 5]`."
  },
  {
    id: 17,
    category: "Containers",
    question: "Difference between tuple and list?",
    answer: "Lists are mutable (modifiable) dynamic arrays, bounded in square brackets `[]`, slower due to over-allocation overhead. Tuples are immutable (read-only) sequences, bounded in parentheses `()`, faster, and hashable (usable as dictionary keys)."
  },
  {
    id: 18,
    category: "Containers",
    question: "Why are tuples immutable?",
    answer: "Tuples have a fixed layout in memory, which optimizes allocation speeds and protects reference integrity. Because they cannot change values, their hash values remain constant, making them structurally sound to act as dictionary keys."
  },
  {
    id: 19,
    category: "Containers",
    question: "What is unpacking in Python?",
    answer: "Unpacking allows you to assign elements of an iterable (list, tuple, dictionary keys) to multiple variables in a single statement, e.g., `x, y = (10, 20)` or `head, *tail = [1, 2, 3]`."
  },
  {
    id: 20,
    category: "Scopes",
    question: "What is *args and **kwargs?",
    answer: "`*args` captures an arbitrary number of optional positional arguments as a tuple inside a function. `**kwargs` captures arbitrary keyword-bound arguments as a dictionary, providing dynamic function interfaces."
  },
  {
    id: 21,
    category: "Memory",
    question: "Difference between shallow copy and deep copy?",
    answer: "A shallow copy (`copy.copy()`) creates a new container object but populates it with references to the nested items (modifying nested items affects both). A deep copy (`copy.deepcopy()`) recursively duplicates the container and all its nested children, creating a completely independent object structure in RAM."
  },
  {
    id: 22,
    category: "Basics",
    question: "What is a lambda function?",
    answer: "An anonymous, single-expression function defined inline using the `lambda` keyword, useful for short-lived functional helpers, e.g. `lambda x: x ** 2`."
  },
  {
    id: 23,
    category: "Basics",
    question: "What is map(), filter(), and reduce()?",
    answer: "`map(func, iter)` applies a function to all elements in an iterable. `filter(pred, iter)` returns elements where a boolean condition is true. `reduce(func, iter)` (from `functools`) aggregates elements pairwise into a single cumulative output."
  },
  {
    id: 24,
    category: "Basics",
    question: "What is exception handling in Python?",
    answer: "A defensive design pattern using `try` (code to run), `except` (error catch routines), `else` (runs if no exception occurred), and `finally` (always runs, excellent for cleanups like file closures) to handle crashes gracefully."
  },
  {
    id: 25,
    category: "Basics",
    question: "Difference between syntax error, runtime error, and logical error?",
    answer: "Syntax errors occur during code compilation (invalid text rules, unclosed brackets). Runtime errors occur during program execution (divided by zero, file not found). Logical errors occur when the program runs successfully but returns incorrect results due to faulty algorithms."
  },
  {
    id: 26,
    category: "Memory",
    question: "What is a virtual environment (venv) in Python?",
    answer: "An isolated directory structure containing a private Python interpreter and independent libraries folder. Prevents dependency conflicts between different projects on the same machine."
  },
  {
    id: 27,
    category: "Basics",
    question: "Why do we use pip?",
    answer: "It is the standard package manager for Python, used to download, install, update, and manage third-party packages from PyPI (Python Package Index) securely."
  },
  {
    id: 28,
    category: "Files",
    question: "Difference between read(), readline(), and readlines()?",
    answer: "`read()` reads the entire file contents as a single massive string. `readline()` reads a single line, advancing the pointer. `readlines()` reads all lines, compiling them into a clean list of individual strings."
  },
  {
    id: 29,
    category: "Advanced",
    question: "What are decorators in Python?",
    answer: "A design pattern used to modify or enhance the behavior of a function or class dynamically at runtime. It takes a function as an argument, wraps it inside a wrapper, and returns the modified wrapper function."
  },
  {
    id: 30,
    category: "Advanced",
    question: "What are generators and why use yield?",
    answer: "Generators are functions containing `yield` that return iterators lazily. Unlike lists, they do not hold all elements in memory, instead computing each item on-demand inside loops, making them highly RAM-efficient for processing massive datasets."
  },
  {
    id: 31,
    category: "Advanced",
    question: "Difference between iloc and loc in pandas?",
    answer: "`loc` selects rows/columns using label/string names. `iloc` selects rows/columns using strictly integer-based index coordinate numbers (0-indexed)."
  },
  {
    id: 32,
    category: "Memory",
    question: "Difference between mutable and immutable objects?",
    answer: "Mutable objects (lists, dicts, sets) can modify their internal state in-place without changing their memory address. Immutable objects (ints, floats, strings, tuples) cannot be altered; any change creates a brand-new object in memory."
  },
  {
    id: 33,
    category: "Imports & cache",
    question: "What happens internally when Python imports a module?",
    answer: "1. Checks the cache `sys.modules` (skips if already loaded). 2. Searches the directories in `sys.path`. 3. Compiles the `.py` source code to bytecode. 4. Executes the module's code in a isolated namespace context and records it in `sys.modules`."
  },
  {
    id: 34,
    category: "Basics",
    question: "Why is indentation important in Python?",
    answer: "Unlike languages using curly braces `{}`, Python uses white space indentations to logically group statements and establish scope boundaries (for functions, classes, and loops). Indentation is a strict, compiler-enforced syntax rule."
  },
  {
    id: 35,
    category: "Concurrency",
    question: "What is the Python GIL?",
    answer: "The Global Interpreter Lock (GIL) is a mutex lock in the CPython interpreter that ensures only one native thread executes Python bytecode at a time. This prevents race conditions but limits native CPU multithreading scaling on multi-core systems."
  },
  {
    id: 36,
    category: "Concurrency",
    question: "Difference between multithreading and multiprocessing?",
    answer: "Multithreading runs multiple threads inside a single process, sharing the same memory block (highly efficient for IO-bound tasks, blocked by GIL for CPU tasks). Multiprocessing spawns completely separate OS processes, each with its own interpreter and memory, bypassing the GIL to utilize multiple CPU cores."
  },
  {
    id: 37,
    category: "Advanced",
    question: "What is monkey patching?",
    answer: "The practice of dynamically overriding or updating a class, function, or module namespace at runtime without altering the physical source file, widely used in unit-testing mocks."
  },
  {
    id: 38,
    category: "Advanced",
    question: "What is serialization and pickling?",
    answer: "Serialization converts memory objects into a stream of bytes for file storage or network transport. In Python, `pickle` is the native module used to serialize (dump) and deserialize (load) object structures."
  },
  {
    id: 39,
    category: "Files",
    question: "What is a context manager (with open) in Python?",
    answer: "An automated resource management pattern. Bounding files inside `with open(...) as f` ensures the `__exit__` method is triggered, safely closing the file descriptors even if fatal execution crashes occur inside the block."
  },
  {
    id: 40,
    category: "OOP",
    question: "Why do we use self in classes?",
    answer: "`self` refers to the specific instance of the object being created or modified. It allows object methods to bind, store, and access state variables allocated on the heap specifically for that object."
  },
  {
    id: 41,
    category: "OOP",
    question: "Difference between class variable and instance variable?",
    answer: "Class variables are declared inside the class body but outside methods, shared uniformly across all instances. Instance variables are declared inside the `__init__` constructor using `self.variable`, allocating private, isolated values per object instance."
  }
];

const pythonCodingChallenges = [
  {
    id: 1,
    category: "Strings",
    title: "1. Reverse a string using slicing",
    desc: "Python slicing syntax supports a step parameter. Passing a step of -1 reverses string coordinates quickly at compiler speeds.",
    code: `text = "learning"
reversed_text = text[::-1]
print("Reversed:", reversed_text)  # gninrael`,
    quiz: {
      question: "Which of the following slicing formulas correctly reverses a string 's'?",
      options: ["s[::1]", "s[-1:0:1]", "s[::-1]", "s.reverse()"],
      correctIndex: 2,
      explanation: "The syntax s[start:stop:step] with a step of -1 tells Python to step backward through the entire string index."
    }
  },
  {
    id: 2,
    category: "Strings",
    title: "2. Count vowels in a string",
    desc: "Iterate over characters and check memberships inside a targeted vowels collection.",
    code: `text = "python developer"
vowels = "aeiouAEIOU"
count = sum(1 for char in text if char in vowels)
print("Vowels:", count)  # 5`,
    quiz: {
      question: "What is the most pythonic, high-performance way to count vowels in a massive string?",
      options: [
        "A nested for loop with variable increments",
        "sum(1 for char in text if char in 'aeiouAEIOU')",
        "regex count operations on strings",
        "text.find('a', 'e', 'i', 'o', 'u')"
      ],
      correctIndex: 1,
      explanation: "Using sum() over a generator expression is highly optimized, concise, and memory-efficient."
    }
  },
  {
    id: 3,
    category: "Strings",
    title: "3. Count consonants in a string",
    desc: "Consonants are letters that are not vowels. Filter for letters using isalpha() while checking vowel exclusions.",
    code: `text = "python developer"
vowels = "aeiouAEIOU"
consonants = sum(1 for char in text if char.isalpha() and char not in vowels)
print("Consonants:", consonants)  # 10`,
    quiz: {
      question: "Which check ensures that you are only counting alphabetical consonants (excluding symbols and numbers)?",
      options: ["char.isalpha()", "char.isdigit()", "char.isalnum()", "char.islower()"],
      correctIndex: 0,
      explanation: "char.isalpha() filters out spaces, numbers, and symbols, ensuring only letters are checked for vowel exclusion."
    }
  },
  {
    id: 4,
    category: "Strings",
    title: "4. Count occurrence of a character",
    desc: "Use the built-in count() string method or aggregate character iterations dynamically.",
    code: `text = "data engineering"
char_count = text.count('e')
print("Count of 'e':", char_count)  # 2`,
    quiz: {
      question: "Which built-in string method retrieves the count of a substring within a string?",
      options: ["find()", "count()", "index()", "occurrences()"],
      correctIndex: 1,
      explanation: "The count() method returns the number of non-overlapping occurrences of a substring."
    }
  },
  {
    id: 5,
    category: "Math",
    title: "5. Generate Fibonacci series",
    desc: "Generate sequences by updating variables. `a, b = b, a + b` calculates the next Fibonacci terms cleanly in-place.",
    code: `def fibonacci(n):
    series = []
    a, b = 0, 1
    for _ in range(n):
        series.append(a)
        a, b = b, a + b
    return series

print(fibonacci(7))  # [0, 1, 1, 2, 3, 5, 8]`,
    quiz: {
      question: "Which multiple assignment statement successfully calculates the next Fibonacci term?",
      options: ["a = b; b = a + b", "a, b = b, a + b", "a = a + b; b = a", "a += b"],
      correctIndex: 1,
      explanation: "a, b = b, a + b evaluates the right-hand expressions using current values before binding to the left, preventing value overwrites."
    }
  },
  {
    id: 6,
    category: "Lists",
    title: "6. Find maximum number in a list",
    desc: "Retrieve largest item using the built-in max() or execute loops track aggregates.",
    code: `numbers = [44, 12, 89, 7, 56]
maximum = max(numbers)
print("Max:", maximum)  # 89`,
    quiz: {
      question: "Which function should you call to instantly retrieve the maximum value inside a Python list?",
      options: ["max()", "largest()", "top()", "sort_max()"],
      correctIndex: 0,
      explanation: "max() is the built-in function optimized to retrieve largest items."
    }
  },
  {
    id: 7,
    category: "Lists",
    title: "7. Find minimum number in a list",
    desc: "Retrieve smallest items dynamically using the native min() method.",
    code: `numbers = [44, 12, 89, 7, 56]
minimum = min(numbers)
print("Min:", minimum)  # 7`,
    quiz: {
      question: "Which built-in function returns the smallest item in a list?",
      options: ["min()", "smallest()", "bottom()", "first()"],
      correctIndex: 0,
      explanation: "min() parses the iterable, returning the minimum value."
    }
  },
  {
    id: 8,
    category: "Lists",
    title: "8. Find middle element of a list",
    desc: "Calculate middle indexes using double-slash integer division `len(lst) // 2`.",
    code: `lst = [10, 20, 30, 40, 50]
middle_idx = len(lst) // 2
print("Middle item:", lst[middle_idx])  # 30`,
    quiz: {
      question: "Why is double slash (//) preferred over single slash (/) when calculating list indices?",
      options: [
        "// returns floats.",
        "// performs integer floor division, preventing index floating errors.",
        "// processes indices twice as fast.",
        "// accesses items from the end of lists."
      ],
      correctIndex: 1,
      explanation: "List indices must be integers. // performs floor division, truncating decimals to yield valid integers."
    }
  },
  {
    id: 9,
    category: "Lists",
    title: "9. Convert list into string",
    desc: "Unite sequence characters with standard join() string operators.",
    code: `char_list = ['D', 'A', 'T', 'A']
joined_str = "".join(char_list)
print("String:", joined_str)  # DATA`,
    quiz: {
      question: "Which method joins elements of a string list into a single string with a separator?",
      options: ["list.join()", "str.join(list)", "list.to_string()", "list.implode()"],
      correctIndex: 1,
      explanation: "The join() method is called on the separator string, taking the list as an argument (e.g. ','.join(lst))."
    }
  },
  {
    id: 10,
    category: "Lists",
    title: "10. Add two lists element-wise",
    desc: "Unite parallel list items using zip() iteration lists or list comprehensions.",
    code: `list1 = [1, 2, 3]
list2 = [10, 20, 30]
element_wise_sum = [x + y for x, y in zip(list1, list2)]
print("Sum:", element_wise_sum)  # [11, 22, 33]`,
    quiz: {
      question: "What is the purpose of zip() in element-wise list additions?",
      options: [
        "Compresses elements to save storage.",
        "Pairs up parallel index items of multiple lists into tuples.",
        "Permutes all combinations.",
        "Sorts the lists in-place."
      ],
      correctIndex: 1,
      explanation: "zip() yields tuples containing matching-index elements from each passed iterable, enabling parallel indexes additions."
    }
  },
  {
    id: 11,
    category: "Strings",
    title: "11. Check whether two strings are anagrams",
    desc: "Anagrams contain the exact same characters with matching counts. Sort both strings and compare.",
    code: `str1 = "silent"
str2 = "listen"
is_anagram = sorted(str1) == sorted(str2)
print("Anagram?", is_anagram)  # True`,
    quiz: {
      question: "Which logic identifies if two strings are anagrams?",
      options: [
        "sorted(str1) == sorted(str2)",
        "str1 in str2",
        "len(str1) == len(str2)",
        "str1.lower() == str2.lower()"
      ],
      correctIndex: 0,
      explanation: "If two sorted letter arrays match exactly, the original strings share identical character counts."
    }
  },
  {
    id: 12,
    category: "Strings",
    title: "12. Check palindrome string",
    desc: "A palindrome reads identical forwards and backwards. Slices with ::-1 and check equality.",
    code: `word = "radar"
is_palindrome = word == word[::-1]
print("Palindrome?", is_palindrome)  # True`,
    quiz: {
      question: "Which python expression determines if a string is a palindrome?",
      options: ["s.reverse() == s", "s == s[::-1]", "s == s.invert()", "s.split() == s"],
      correctIndex: 1,
      explanation: "s[::-1] reverses s backward. If the original matches the reversed state, it is a palindrome."
    }
  },
  {
    id: 13,
    category: "Strings",
    title: "13. Count white spaces in a string",
    desc: "Call count(' ') or summarize spaces iteratively.",
    code: `text = "cloud computing tools"
space_count = text.count(' ')
print("Spaces:", space_count)  # 2`,
    quiz: {
      question: "Which built-in string count check locates spaces?",
      options: ["text.count(' ')", "text.spaces()", "len(text.split())", "text.find(' ')"],
      correctIndex: 0,
      explanation: "Using count(' ') scans and yields total blank space character frequencies."
    }
  },
  {
    id: 14,
    category: "Strings",
    title: "14. Count digits, letters, and spaces",
    desc: "Use `isdigit()`, `isalpha()`, and `isspace()` checks inside list sum expressions.",
    code: `text = "Spark 3.5 release!"
letters = sum(1 for c in text if c.isalpha())
digits = sum(1 for c in text if c.isdigit())
spaces = sum(1 for c in text if c.isspace())
print(f"Letters: {letters}, Digits: {digits}, Spaces: {spaces}")`,
    quiz: {
      question: "Which method checks if a specific character is a numeric digit?",
      options: ["isnumeric()", "isdigit()", "isinteger()", "isalnum()"],
      correctIndex: 1,
      explanation: "isdigit() returns True if all characters in the string are digits and there is at least one character."
    }
  },
  {
    id: 15,
    category: "Strings",
    title: "15. Count special characters",
    desc: "Filter for characters that are not digits, letters, or spaces.",
    code: `text = "process_id: #999!"
special_count = sum(1 for c in text if not (c.isalnum() or c.isspace()))
print("Special characters:", special_count)  # 3 (:, #, !)`,
    quiz: {
      question: "Which compound check identifies special characters?",
      options: [
        "not (c.isalnum() or c.isspace())",
        "c.isspecial()",
        "c.isalpha() and c.isdigit()",
        "c.startswith('$')"
      ],
      correctIndex: 0,
      explanation: "If a character is neither alphanumeric nor space, it is characterized as a symbol/special character."
    }
  },
  {
    id: 16,
    category: "Strings",
    title: "16. Remove all whitespaces from a string",
    desc: "Use the replace() method to swap spaces with empty strings.",
    code: `text = " d a t a "
clean_text = text.replace(" ", "")
print("Clean:", clean_text)  # data`,
    quiz: {
      question: "Which method removes all intermediate and outer whitespaces from a string?",
      options: ["strip()", "replace(' ', '')", "split()", "trim()"],
      correctIndex: 1,
      explanation: "strip() only removes outer padding. replace(' ', '') replaces every space inside the string."
    }
  },
  {
    id: 17,
    category: "Math",
    title: "17. Build pyramid pattern in Python",
    desc: "Calculate prefix spaces and stars, joining them inside a structured loop.",
    code: `def build_pyramid(rows):
    res = []
    for i in range(rows):
        spaces = " " * (rows - i - 1)
        stars = "*" * (2 * i + 1)
        res.append(spaces + stars)
    return "\\n".join(res)

print(build_pyramid(4))`,
    quiz: {
      question: "What is the formula to calculate star counts for the i-th row (0-indexed) in a centered pyramid?",
      options: ["i + 1", "2 * i + 1", "2 * i", "i ** 2"],
      correctIndex: 1,
      explanation: "To build a symmetric pyramid, the stars increment as odd numbers: 1, 3, 5, 7..., which maps as 2 * i + 1."
    }
  },
  {
    id: 18,
    category: "Lists",
    title: "18. Shuffle/randomize items of a list",
    desc: "Use the random.shuffle() method to reorder lists in-place.",
    code: `import random
lst = [1, 2, 3, 4, 5]
random.shuffle(lst)
print("Shuffled list:", lst)`,
    quiz: {
      question: "Which behavior characterizes random.shuffle()?",
      options: [
        "It returns a new randomized copy of the list.",
        "It modifies the list in-place and returns None.",
        "It only works on numerical items.",
        "It sorts the list descending."
      ],
      correctIndex: 1,
      explanation: "random.shuffle(x) modifies the passed list directly in-place, returning None."
    }
  },
  {
    id: 19,
    category: "Advanced",
    title: "19. Generate prime numbers using generator",
    desc: "Implement a generator function containing `yield` that evaluates numbers on-demand.",
    code: `def prime_generator(limit):
    def is_prime(num):
        if num < 2: return False
        for i in range(2, int(num ** 0.5) + 1):
            if num % i == 0: return False
        return True
    
    num = 2
    count = 0
    while count < limit:
        if is_prime(num):
            yield num
            count += 1
        num += 1

print(list(prime_generator(5)))  # [2, 3, 5, 7, 11]`,
    quiz: {
      question: "What does the 'yield' statement do in the prime generator function?",
      options: [
        "It terminates the function instantly, returning a list.",
        "It pauses the execution, yielding the prime value, and resumes on next() calls.",
        "It allocates memory pools to speed up operations.",
        "It deletes internal variables."
      ],
      correctIndex: 1,
      explanation: "yield pauses the generator's state, yielding a single computed item, and resumes exactly where it left off on subsequent calls."
    }
  },
  {
    id: 20,
    category: "Math",
    title: "20. Check whether a number is prime",
    desc: "Primes are divisible only by 1 and themselves. Check factors up to square root of N.",
    code: `def check_prime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0: return False
    return True

print("Is 17 prime?", check_prime(17))  # True`,
    quiz: {
      question: "Why is checking divisibility up to square root (n**0.5) mathematically sufficient?",
      options: [
        "It processes integers twice as fast.",
        "If N has a factor, one factor must be less than or equal to its square root, reducing runtime.",
        "Python floats are only accurate up to square root limits.",
        "It is required syntax."
      ],
      correctIndex: 1,
      explanation: "Factors occur in pairs. If both factors were larger than the square root, their product would exceed N. Thus, one factor must exist below or at the square root limit."
    }
  },
  {
    id: 21,
    category: "Scopes",
    title: "21. Variable length arguments using *args",
    desc: "Pass dynamic lists of arguments captured inside standard tuples.",
    code: `def add_all(*args):
    return sum(args)

print("Sum of 5 numbers:", add_all(1, 2, 3, 4, 5))  # 15`,
    quiz: {
      question: "What is the data type of 'args' inside a function declared with def f(*args)?",
      options: ["List", "Tuple", "Dictionary", "Set"],
      correctIndex: 1,
      explanation: "The single asterisk * compiles variable positional arguments into a standard, immutable Tuple."
    }
  },
  {
    id: 22,
    category: "Scopes",
    title: "22. Keyword variable length arguments (**kwargs)",
    desc: "Capture variable named parameters into function dictionaries.",
    code: `def print_user_details(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# prints 'name: Bob' and 'role: DE'
print_user_details(name="Bob", role="DE")`,
    quiz: {
      question: "What Python container captures parameters declared using the double asterisk **kwargs?",
      options: ["Tuple", "List", "Dictionary", "Namespace"],
      correctIndex: 2,
      explanation: "The double asterisk ** captures named keyword arguments as a key-value Dictionary."
    }
  },
  {
    id: 23,
    category: "OOP",
    title: "23. Instance member variables in class",
    desc: "Instance variables are declared inside the `__init__` constructor using `self.variable_name`.",
    code: `class Employee:
    def __init__(self, name, salary):
        self.name = name          # Instance variable
        self.salary = salary      # Instance variable

emp = Employee("Alice", 90000)
print(emp.name, emp.salary)`,
    quiz: {
      question: "Where are instance variables defined inside standard classes?",
      options: [
        "In class bodies directly, outside methods.",
        "Inside the __init__ constructor method using the 'self' prefix.",
        "Inside global scopes.",
        "In decorators."
      ],
      correctIndex: 1,
      explanation: "Declaring self.variable inside the __init__ method binds state variables specifically to that object instance."
    }
  },
  {
    id: 24,
    category: "Basics",
    title: "24. Add numbers using lambda function",
    desc: "Anonymous lambdas write clean calculations inline.",
    code: `add = lambda x, y: x + y
print("Sum of 4 and 6:", add(4, 6))  # 10`,
    quiz: {
      question: "What is the correct syntax of a lambda function adding two arguments?",
      options: [
        "lambda x, y: x + y",
        "lambda(x, y) { return x + y; }",
        "def lambda x, y: x + y",
        "lambda x + y"
      ],
      correctIndex: 0,
      explanation: "The lambda syntax is: lambda arg1, arg2: expression (no return statement is required or allowed)."
    }
  },
  {
    id: 25,
    category: "Math",
    title: "25. Find factorial using lambda",
    desc: "Factorial calculations can be mapped inside recursive lambdas.",
    code: `fact = lambda n: 1 if n == 0 else n * fact(n - 1)
print("Factorial of 5:", fact(5))  # 120`,
    quiz: {
      question: "Which logic executes recursion inside an anonymous lambda statement?",
      options: [
        "By calling the lambda name identifier recursively inside the conditional branch.",
        "By utilizing a nested helper method.",
        "Lambdas do not support recursion.",
        "Using loops."
      ],
      correctIndex: 0,
      explanation: "Referencing the variable binding n * fact(n - 1) compiles the recursive calls cleanly, provided a base case is defined."
    }
  },
  {
    id: 26,
    category: "Containers",
    title: "26. Create list using list comprehension",
    desc: "Establish filtered square collections cleanly in-place.",
    code: `squares = [x**2 for x in range(1, 6)]
print("Squares:", squares)  # [1, 4, 9, 16, 25]`,
    quiz: {
      question: "Which comprehension expression creates a list containing only even numbers between 0 and 9?",
      options: [
        "[x for x in range(10) if x % 2 == 0]",
        "[x if x % 2 == 0 for x in range(10)]",
        "{x for x in range(10) if x % 2 == 0}",
        "[x for x in range(10) filter x % 2 == 0]"
      ],
      correctIndex: 0,
      explanation: "The filter condition 'if condition' must be placed at the very end of list comprehensions: [formula for item in iterable if condition]."
    }
  },
  {
    id: 27,
    category: "Strings",
    title: "27. Use split() and join() functions",
    desc: "Deconstruct text strings to array arrays, and merge them back with separators.",
    code: `text = "python,spark,delta"
arr = text.split(",")
print("Array:", arr)  # ['python', 'spark', 'delta']
merged = " | ".join(arr)
print("Merged:", merged)  # python | spark | delta`,
    quiz: {
      question: "What data container is returned when you call 's.split()' on a string?",
      options: ["Tuple", "List of strings", "Dictionary", "Set"],
      correctIndex: 1,
      explanation: "split() processes the source string, segmenting it by separator boundaries, and yields a List of substring elements."
    }
  },
  {
    id: 28,
    category: "Scopes",
    title: "28. Global and local variables",
    desc: "Differentiate variable namespaces across local stack scopes.",
    code: `var = "Global"

def test_scope():
    var = "Local"  # Bounded local variable
    print("Inside function:", var)

test_scope()
print("Outside function:", var)`,
    quiz: {
      question: "If a local variable inside a function shares the name of a global variable, what occurs?",
      options: [
        "Python raises a NameError compile exception.",
        "The local variable shadows the global variable inside the function.",
        "The global variable gets overwritten automatically.",
        "The compiler crashes."
      ],
      correctIndex: 1,
      explanation: "This is called Variable Shadowing. The local assignment blocks access to the global reference inside that function's scope."
    }
  },
  {
    id: 29,
    category: "Scopes",
    title: "29. Use globals() function",
    desc: "globals() returns the active global namespace dictionary of the module.",
    code: `val = 42
def modify_global_direct():
    globals()["val"] = 99  # Direct global lookup modification

modify_global_direct()
print("Modified value:", val)  # 99`,
    quiz: {
      question: "What is returned when you call the built-in globals() function?",
      options: [
        "A list of global variable names.",
        "A dictionary mapping variable names (keys) to their values (values) in the global scope.",
        "A string representation.",
        "A memory address."
      ],
      correctIndex: 1,
      explanation: "globals() returns the actual dictionary of variables allocated inside the module scope, enabling dynamic evaluations."
    }
  },
  {
    id: 30,
    category: "Basics",
    title: "30. Type conversions in Python",
    desc: "Cast variables cleanly using `int()`, `float()`, `str()`, `list()`, `set()`, or `tuple()` constructors.",
    code: `num_str = "100"
converted_int = int(num_str)
converted_float = float(converted_int)
print(converted_int, type(converted_int))
print(converted_float, type(converted_float))`,
    quiz: {
      question: "Which of the following constructor casts throws a ValueError in standard Python?",
      options: ["int('100')", "float('3.14')", "int('3.14')", "str(42)"],
      correctIndex: 2,
      explanation: "int('3.14') attempts to parse a non-integer decimal string directly into an integer, throwing a ValueError. You must first convert to float: int(float('3.14'))."
    }
  },
  {
    id: 31,
    category: "Advanced",
    title: "31. Create and use decorators",
    desc: "A decorator takes a function, wraps its execution, and returns the modified wrapper function.",
    code: `def log_decorator(func):
    def wrapper(*args, **kwargs):
        print("[Logger]: Before function execution")
        res = func(*args, **kwargs)
        print("[Logger]: After execution")
        return res
    return wrapper

@log_decorator
def greet(name):
    print(f"Hello, {name}!")

greet("Alex")`,
    quiz: {
      question: "What is the primary role of the wrapper function (*args, **kwargs) inside decorators?",
      options: [
        "To compile the source code faster.",
        "To capture target function inputs, executing custom actions before and after the original call.",
        "To delete global bindings.",
        "To enforce class structures."
      ],
      correctIndex: 1,
      explanation: "The wrapper acts as the proxy, executing logic around the intercepted target call."
    }
  },
  {
    id: 32,
    category: "Advanced",
    title: "32. Create iterators in Python",
    desc: "Implement `__iter__()` and `__next__()` inside classes to create custom iterators.",
    code: `class Counter:
    def __init__(self, limit):
        self.limit = limit
        self.count = 0
    def __iter__(self):
        return self
    def __next__(self):
        if self.count >= self.limit:
            raise StopIteration
        self.count += 1
        return self.count

print(list(Counter(3)))  # [1, 2, 3]`,
    quiz: {
      question: "Which exception must be raised inside the __next__ method of an iterator to signal loop termination?",
      options: ["SystemExit", "StopIteration", "IndexError", "GeneratorExit"],
      correctIndex: 1,
      explanation: "Raising StopIteration tells standard loops (like for) that the iterator is exhausted."
    }
  },
  {
    id: 33,
    category: "Advanced",
    title: "33. Create generators in Python",
    desc: "Yielding values sequentially inside functions constructs clean iterators.",
    code: `def count_up_to(limit):
    n = 1
    while n <= limit:
        yield n
        n += 1

print(list(count_up_to(3)))  # [1, 2, 3]`,
    quiz: {
      question: "What makes generators memory efficient when processing big data files?",
      options: [
        "They store arrays in contiguous SSD storage.",
        "They yield values lazily one-at-a-time instead of allocating massive arrays in RAM.",
        "They bypass standard compiler cache.",
        "They run inside private VPC nodes."
      ],
      correctIndex: 1,
      explanation: "Generators use lazy evaluation, returning elements dynamically on loop request instead of allocating memory for entire tables."
    }
  },
  {
    id: 34,
    category: "Advanced",
    title: "34. Function overloading techniques",
    desc: "Python does not support traditional Java-like overloading. Implement default options or argument type inspections.",
    code: `def compute_area(shape, dim1, dim2=None):
    if shape == "circle":
        return 3.14 * (dim1 ** 2)
    elif shape == "rectangle":
        return dim1 * dim2
    return 0

print("Circle Area:", compute_area("circle", 5))
print("Rect Area:", compute_area("rectangle", 4, 5))`,
    quiz: {
      question: "What happens if you define two functions with matching names but different arguments inside a Python script?",
      options: [
        "Python raises a syntax error compilation exception.",
        "The second function overrides the first one completely.",
        "Both functions co-exist via native function overloading.",
        "The interpreter crashes on start."
      ],
      correctIndex: 1,
      explanation: "Python is dynamically typed. The last function defined inside a namespace overrides any preceding declarations of matching names."
    }
  },
  {
    id: 35,
    category: "Scopes",
    title: "35. Positional arguments in Python",
    desc: "Arguments mapped sequentially in order of function signature parameters.",
    code: `def format_name(first, last):
    return f"{first} {last}"

# Mapped positionally
print(format_name("John", "Doe"))  # John Doe`,
    quiz: {
      question: "How are positional arguments bound to functions?",
      options: [
        "Bound by their keyword names explicitly.",
        "Bound sequentially based on their order in the function call.",
        "Bound based on alphabetical sorting.",
        "Evaluated recursively."
      ],
      correctIndex: 1,
      explanation: "Positional arguments bind to target parameters based on matching sequence order."
    }
  },
  {
    id: 36,
    category: "Lists",
    title: "36. Difference between sort() and sorted()",
    desc: "`sort()` modifies list references in-place. `sorted()` returns a brand new sorted list.",
    code: `lst = [3, 1, 4]
res_sorted = sorted(lst)  # returns [1, 3, 4], original remains [3, 1, 4]
lst.sort()                # modifies original, returns None
print("lst.sort():", lst)
print("sorted(lst):", res_sorted)`,
    quiz: {
      question: "Which of the following is true regarding 'sort()' and 'sorted()'?",
      options: [
        "sort() returns a new list, while sorted() modifies in-place.",
        "sort() is a list method modifying in-place, while sorted() is a built-in function returning a new sorted copy.",
        "Both return identical sorted copies.",
        "Both modify in-place."
      ],
      correctIndex: 1,
      explanation: "sort() is a method of list objects that mutates in-place (returning None). sorted() is a global built-in that accepts any iterable, returning a clean sorted copy."
    }
  },
  {
    id: 37,
    category: "OOP",
    title: "37. Static member variables in class",
    desc: "Static class variables are declared directly inside classes, outside any instance methods.",
    code: `class CloudConfig:
    provider = "AWS"  # Static Class Variable
    
    def __init__(self, region):
        self.region = region  # Instance Variable

print("Static config:", CloudConfig.provider)  # AWS`,
    quiz: {
      question: "How do you access static class variables outside instance initializations?",
      options: [
        "Using the Class name itself (e.g. Class.variable).",
        "Only by instantiating an object first.",
        "Via globals() dictionary calls.",
        "They are private and inaccessible."
      ],
      correctIndex: 0,
      explanation: "Class variables exist in the Class namespace and can be queried directly using ClassName.variable without instantiating objects."
    }
  },
  {
    id: 38,
    category: "Advanced",
    title: "38. Use else with loops",
    desc: "The `else` block runs only if the loop completes fully without encountering a `break` statement.",
    code: `for x in range(3):
    print("Loop:", x)
else:
    print("Else: Loop completed without break!")`,
    quiz: {
      question: "When does the 'else' block associated with a loop trigger?",
      options: [
        "Immediately if the loop encounters a break statement.",
        "Only when the loop completes all iterations normally without encountering a break.",
        "If the loop throws an exception.",
        "Never, it is a syntax error."
      ],
      correctIndex: 1,
      explanation: "The else block linked to a loop acts as a 'no-break' indicator. If the loop completes successfully, else runs."
    }
  },
  {
    id: 39,
    category: "Files",
    title: "39. Read a text file and count total words",
    desc: "Use context manager to read contents, split by whitespaces, and count.",
    code: `# Writing mock file and reading
with open("workspace_log.txt", "w") as f:
    f.write("cloud platforms telemetry telemetry")

with open("workspace_log.txt", "r") as f:
    words = f.read().split()
    print("Total words:", len(words))  # 4`,
    quiz: {
      question: "Which combination cleanly reads a file and splits it into word elements?",
      options: [
        "f.read().split()",
        "f.readline().words()",
        "f.readlines().split(',')",
        "f.words_count()"
      ],
      correctIndex: 0,
      explanation: "f.read() retrieves the entire contents as a string, and calling .split() on that string divides words by whitespaces."
    }
  },
  {
    id: 40,
    category: "Files",
    title: "40. Read a file line by line",
    desc: "Iterate over the file object directly inside a loop, which evaluates lines lazily to protect memory.",
    code: `with open("workspace_log.txt", "r") as f:
    for line in f:
        print("Line:", line.strip())`,
    quiz: {
      question: "What is the most memory-efficient way to process a multi-gigabyte file line-by-line?",
      options: [
        "Using f.read(), splitting it by newlines.",
        "Using f.readlines() within a standard loop.",
        "Iterating over the file object itself: 'for line in f:'.",
        "Converting the file to a CSV."
      ],
      correctIndex: 2,
      explanation: "Iterating directly over the file object utilizes a lazy buffer under the hood, yielding one line at a time instead of loading the entire file into RAM."
    }
  },
  {
    id: 41,
    category: "Files",
    title: "41. Append new content into a file",
    desc: "Open file using 'a' mode (Append) to write records without wiping existing data.",
    code: `with open("workspace_log.txt", "a") as f:
    f.write("\\nnew appended trace")`,
    quiz: {
      question: "Which file mode parameter should you pass to open() to append content without deleting existing data?",
      options: ["'r'", "'w'", "'a'", "'x'"],
      correctIndex: 2,
      explanation: "'a' (Append) mode preserves original data, appending new writes to the end of the file."
    }
  },
  {
    id: 42,
    category: "Files",
    title: "42. Copy content from one file to another",
    desc: "Read from source file and write to target file in nested context scopes.",
    code: `with open("workspace_log.txt", "r") as src:
    content = src.read()

with open("backup_log.txt", "w") as dst:
    dst.write(content)
print("File copied successfully.")`,
    quiz: {
      question: "Which module provides high-level physical file copy operations natively in Python?",
      options: ["os", "sys", "shutil", "copy"],
      correctIndex: 2,
      explanation: "While nested opens work, python's shutil module provides high-level utilities like shutil.copy(src, dst) for cleaner copying."
    }
  },
  {
    id: 43,
    category: "Data Format",
    title: "43. Read JSON file in Python",
    desc: "Load structured dictionary files cleanly utilizing the json.load() method.",
    code: `import json
# Writing mock JSON
mock_data = {"tenant": "finance", "status": "active"}
with open("config.json", "w") as f:
    json.dump(mock_data, f)

with open("config.json", "r") as f:
    data = json.load(f)
    print("Parsed JSON:", data["tenant"])  # finance`,
    quiz: {
      question: "Which method parses a JSON file directly into a Python dictionary?",
      options: ["json.loads()", "json.load()", "json.read()", "json.parse()"],
      correctIndex: 1,
      explanation: "json.load() takes a file object as an argument, whereas json.loads() takes a raw JSON string as an argument."
    }
  },
  {
    id: 44,
    category: "Data Format",
    title: "44. Update JSON data and save back",
    desc: "Read the file, update the dictionary properties, and rewrite using json.dump().",
    code: `import json
with open("config.json", "r") as f:
    config = json.load(f)

config["status"] = "suspended"  # Update value

with open("config.json", "w") as f:
    json.dump(config, f, indent=4)
print("JSON updated successfully.")`,
    quiz: {
      question: "What parameter in json.dump() formats output JSON file with clean indent spaces?",
      options: ["pretty=True", "indent=4", "format='pretty'", "spacing=4"],
      correctIndex: 1,
      explanation: "Passing indent=4 (or any positive integer) outputs clean multi-line readable JSON formatted with matching indents."
    }
  },
  {
    id: 45,
    category: "Data Format",
    title: "45. Convert dictionary into JSON file",
    desc: "Utilize json.dump() to serialize dictionary containers to file formats.",
    code: `import json
meta = {"project": "telemetry", "version": 2}
with open("meta.json", "w") as f:
    json.dump(meta, f)
print("Dictionary saved as JSON.")`,
    quiz: {
      question: "Which method serializes a Python dictionary to a file?",
      options: ["json.dumps()", "json.dump()", "json.to_file()", "json.write()"],
      correctIndex: 1,
      explanation: "json.dump() serializes python objects to file streams. json.dumps() returns it as a string."
    }
  },
  {
    id: 46,
    category: "Data Format",
    title: "46. Read CSV file using csv module",
    desc: "Import native csv module and iterate over delimited row arrays.",
    code: `import csv
# Mock CSV creation
with open("users.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["id", "name"])
    w.writerow([101, "Alice"])

with open("users.csv", "r") as f:
    reader = csv.reader(f)
    for row in reader:
        print("Row:", row)  # Row: ['id', 'name']`,
    quiz: {
      question: "Which native module parses standard CSV rows in Python?",
      options: ["os", "csv", "openpyxl", "pandas"],
      correctIndex: 1,
      explanation: "The built-in csv module provides csv.reader() and csv.writer() utilities natively."
    }
  },
  {
    id: 47,
    category: "Data Format",
    title: "47. Read CSV file using pandas",
    desc: "Utilize the pd.read_csv() method to load CSV files into DataFrames instantly.",
    code: `import pandas as pd
df = pd.read_csv("users.csv")
print(df.head())`,
    quiz: {
      question: "What is returned when you call pandas.read_csv()?",
      options: ["List of lists", "Dictionary of columns", "DataFrame object", "Tuple of indices"],
      correctIndex: 2,
      explanation: "pd.read_csv() parses structured CSV grids, representing them as dynamic tabular DataFrames."
    }
  },
  {
    id: 48,
    category: "Data Format",
    title: "48. Write data into CSV file",
    desc: "Use csv.writer() to save rows to local directories safely.",
    code: `import csv
records = [["id", "role"], [1, "Admin"], [2, "Operator"]]
with open("roles.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(records)
print("CSV file created successfully.")`,
    quiz: {
      question: "Which parameter inside open() should be passed when writing CSVs to prevent extra blank lines?",
      options: ["newline=''", "encoding='utf-8'", "mode='w'", "flush=True"],
      correctIndex: 0,
      explanation: "Passing newline='' inside open() ensures the native CSV writer handles newline translations uniformly across systems without adding extra blank rows."
    }
  },
  {
    id: 49,
    category: "Files",
    title: "49. Create log file using logging module",
    desc: "Initiate professional application logs using the native logging module.",
    code: `import logging
logging.basicConfig(filename="app_telemetry.log", level=logging.INFO,
                    format="%(asctime)s - %(levelname)s - %(message)s")
logging.info("Platform initialized.")
logging.warning("Resource limits at 85%")`,
    quiz: {
      question: "Which logging level is higher in priority: INFO or WARNING?",
      options: ["INFO", "WARNING", "Both share identical priority", "DEBUG is higher"],
      correctIndex: 1,
      explanation: "The default logging levels are: DEBUG < INFO < WARNING < ERROR < CRITICAL. Thus, WARNING is higher priority."
    }
  },
  {
    id: 50,
    category: "Files",
    title: "50. Find largest file inside a folder",
    desc: "Iterate over directory files, comparing os.path.getsize() metadata properties.",
    code: `import os
def get_largest_file(folder):
    largest_file = None
    max_size = 0
    if not os.path.exists(folder): return None
    for file in os.listdir(folder):
        path = os.path.join(folder, file)
        if os.path.isfile(path):
            size = os.path.getsize(path)
            if size > max_size:
                max_size = size
                largest_file = file
    return largest_file

# Checks current working folder
print("Largest file in root:", get_largest_file("."))`,
    quiz: {
      question: "Which method in the os.path module retrieves the size of a file in bytes?",
      options: ["os.path.size()", "os.path.getsize()", "os.path.bytes()", "os.path.info()"],
      correctIndex: 1,
      explanation: "os.path.getsize(path) queries the OS file system metadata, returning file sizes in bytes."
    }
  },
  {
    id: 51,
    category: "Files",
    title: "51. Read all files using os module",
    desc: "List files inside directories using the os.listdir() utility.",
    code: `import os
for file in os.listdir("."):
    if os.path.isfile(file):
        print("Found file:", file)`,
    quiz: {
      question: "What is returned when you invoke os.listdir('.')?",
      options: [
        "A list of absolute file path strings.",
        "A list of directory item names (files and folders) within the path.",
        "A generator yielding file buffers.",
        "A dictionary."
      ],
      correctIndex: 1,
      explanation: "os.listdir(path) returns a list of the names of the entries in the directory given by the path."
    }
  },
  {
    id: 52,
    category: "Files",
    title: "52. Rename files in a folder",
    desc: "Use the os.rename() system wrapper to modify file names.",
    code: `import os
# Writing temp and renaming
with open("temp.txt", "w") as f:
    f.write("temp data")

if os.path.exists("temp.txt"):
    os.rename("temp.txt", "renamed_temp.txt")
    print("File renamed successfully.")`,
    quiz: {
      question: "Which method in the os module renames a file from old_name to new_name?",
      options: ["os.mv()", "os.rename()", "os.move()", "os.change_name()"],
      correctIndex: 1,
      explanation: "os.rename(src, dst) executes an atomic file rename operation in the operating system."
    }
  },
  {
    id: 53,
    category: "Files",
    title: "53. Delete files using Python",
    desc: "Remove files safely from the filesystem using os.remove() or os.unlink().",
    code: `import os
if os.path.exists("renamed_temp.txt"):
    os.remove("renamed_temp.txt")
    print("File cleaned up.")`,
    quiz: {
      question: "Which function from the os module deletes/removes a physical file?",
      options: ["os.delete()", "os.remove()", "os.rmdir()", "os.clean()"],
      correctIndex: 1,
      explanation: "os.remove(path) deletes the specified file. os.rmdir(path) is only for deleting empty folders."
    }
  },
  {
    id: 54,
    category: "Data Format",
    title: "54. Read Excel file using pandas",
    desc: "Load sheets dynamically using pandas pd.read_excel() interface.",
    code: `import pandas as pd
# df = pd.read_excel("data_sheet.xlsx", sheet_name="Sheet1")
print("Pandas read_excel API imported successfully.")`,
    quiz: {
      question: "Which parameter allows you to specify a specific tab sheet to load inside pandas.read_excel()?",
      options: ["tab_name", "sheet_name", "index", "column"],
      correctIndex: 1,
      explanation: "Passing sheet_name='SheetName' (or an integer index) loads that specific worksheet."
    }
  },
  {
    id: 55,
    category: "Data Format",
    title: "55. Write Excel file using pandas",
    desc: "Convert DataFrames to physical Excel files via df.to_excel() API.",
    code: `import pandas as pd
# df = pd.DataFrame({"id": [1, 2], "val": ["A", "B"]})
# df.to_excel("output.xlsx", index=False)
print("Pandas to_excel engine verified.")`,
    quiz: {
      question: "Which of the following packages acts as the engine to write Excel files (.xlsx) inside Pandas?",
      options: ["excelwrite", "openpyxl", "xlrd", "csv"],
      correctIndex: 1,
      explanation: "openpyxl is the industry standard Python library used under the hood by pandas to create and write Excel files."
    }
  },
  {
    id: 56,
    category: "Files",
    title: "56. Merge multiple text files",
    desc: "Iterate over list paths, reading and appending contents to a single output stream.",
    code: `files_to_merge = ["workspace_log.txt", "backup_log.txt"]
with open("combined_output.txt", "w") as outfile:
    for filename in files_to_merge:
        try:
            with open(filename, "r") as infile:
                outfile.write(infile.read() + "\\n")
        except FileNotFoundError:
            pass
print("Files merged successfully.")`,
    quiz: {
      question: "Which statement ensures that errors are bypassed if one of the source files in a merge list is missing?",
      options: ["if file.exists()", "try/except FileNotFoundError block", "outfile.force()", "os.bypass()"],
      correctIndex: 1,
      explanation: "Enclosing file opens inside a try/except FileNotFoundError block guarantees the script continues compiling even if individual files are missing."
    }
  },
  {
    id: 57,
    category: "Files",
    title: "57. Search a word inside a file",
    desc: "Read lines sequentially, checking character memberships dynamically.",
    code: `def search_word_in_file(filepath, word):
    found_lines = []
    try:
        with open(filepath, "r") as f:
            for line_no, line in enumerate(f, 1):
                if word in line:
                    found_lines.append((line_no, line.strip()))
    except FileNotFoundError:
        pass
    return found_lines

print("Search results for 'telemetry':", search_word_in_file("workspace_log.txt", "telemetry"))`,
    quiz: {
      question: "Which function allows tracking line numbers (1-indexed) while iterating through file lines?",
      options: ["range()", "enumerate(f, 1)", "line_count()", "os.track()"],
      correctIndex: 1,
      explanation: "enumerate(iterable, start) yields index-value tuples, starting at the specified integer limit."
    }
  },
  {
    id: 58,
    category: "Files",
    title: "58. Replace text inside a file",
    desc: "Read entire file string, apply replace(), and overwrite the original file.",
    code: `with open("workspace_log.txt", "r") as f:
    text = f.read()

updated_text = text.replace("telemetry", "telemetry_metrics")

with open("workspace_log.txt", "w") as f:
    f.write(updated_text)
print("Text replaced successfully.")`,
    quiz: {
      question: "What is the typical sequence to safely replace text inside a file?",
      options: [
        "Write to file first, then read in-place.",
        "Read file into string variable, apply .replace(), and write updated string back in 'w' mode.",
        "Use append mode 'a' directly.",
        "Delete the file and start over."
      ],
      correctIndex: 1,
      explanation: "You must read the file into memory first, replace text, and then write in 'w' (write) mode to overwrite the original contents."
    }
  },
  {
    id: 59,
    category: "Data Format",
    title: "59. Parse nested JSON data",
    desc: "Access nested values cleanly by chaining dictionary key index references.",
    code: `import json
nested_str = '{"user": {"id": 1, "profile": {"email": "user@comp.com"}}}'
payload = json.loads(nested_str)
email = payload["user"]["profile"]["email"]
print("Nested email:", email)  # user@comp.com`,
    quiz: {
      question: "How do you retrieve nested properties from a parsed JSON dictionary?",
      options: [
        "Chaining bracket lookup keys (e.g. data['parent']['child']).",
        "Using dot notation (data.parent.child).",
        "Calling nested_find() methods.",
        "Converting to a flat list."
      ],
      correctIndex: 0,
      explanation: "Parsed JSON forms a standard Python dictionary. Chaining bracket keys (dict[key1][key2]) digs into nested values."
    }
  },
  {
    id: 60,
    category: "Data Format",
    title: "60. Create API response parser",
    desc: "Parse API JSON responses, extract target arrays, and aggregate metrics dynamically.",
    code: `import json
api_response = '{"status": 200, "results": [{"val": 100}, {"val": 200}, {"val": 150}]}'
data = json.loads(api_response)

if data["status"] == 200:
    total_val = sum(item["val"] for item in data["results"])
    print("Sum of API results:", total_val)  # 450`,
    quiz: {
      question: "Which module is imported to parse API JSON response strings into active dictionaries?",
      options: ["sys", "os", "json", "requests"],
      correctIndex: 2,
      explanation: "The native json module is imported to translate and deserialize standard JSON formatted string payloads."
    }
  }
];

const pythonCompilerProblems = {
  "Reverse a string using slicing": {
    title: "Reverse String using Slicing",
    difficulty: "Easy",
    statement: "Write a function `reverse_string(s: str) -> str` that takes a string `s` and returns it reversed. To optimize performance, utilize Python's native slicing syntax.",
    constraints: [
      "Input string `s` contains only ASCII alphabetical characters.",
      "Constraints: Must run in O(N) time complexity.",
      "Memory: O(1) auxiliary space (modify or slice in-place)."
    ],
    examples: [
      {
        input: 's = "learning"',
        output: '"gninrael"',
        explanation: "Reversing the characters index-by-index yields 'gninrael'."
      },
      {
        input: 's = "antigravity"',
        output: '"ytivargitna"',
        explanation: "Reversing 'antigravity' yields 'ytivargitna'."
      }
    ],
    starterCode: `def reverse_string(s: str) -> str:
    # Write your slicing logic here
    pass`,
    solution: `def reverse_string(s: str) -> str:
    return s[::-1]`,
    testCases: [
      { input: "learning", expected: "gninrael" },
      { input: "hello", expected: "olleh" },
      { input: "datastructure", expected: "erutcurtsatad" }
    ],
    verify: (code) => {
      const sanitized = code.replace(/\s+/g, '');
      return sanitized.includes('[::-1]') || sanitized.includes('slice');
    }
  },
  "Count vowels in a string": {
    title: "Count Vowels in String",
    difficulty: "Easy",
    statement: "Write a function `count_vowels(s: str) -> int` that takes a string `s` and returns the total number of vowels ('a', 'e', 'i', 'o', 'u', case-insensitive) present in the string. Try utilizing a high-performance, single-line generator expression.",
    constraints: [
      "Input string contains printable ASCII letters, spaces, and symbols.",
      "Constraints: Time complexity O(N), Space complexity O(1)."
    ],
    examples: [
      {
        input: 's = "python developer"',
        output: "5",
        explanation: "The vowels are 'o', 'e', 'e', 'o', 'e', totaling 5."
      }
    ],
    starterCode: `def count_vowels(s: str) -> int:
    # Write your generator logic here
    pass`,
    solution: `def count_vowels(s: str) -> int:
    vowels = "aeiouAEIOU"
    return sum(1 for char in s if char in vowels)`,
    testCases: [
      { input: "python developer", expected: 5 },
      { input: "data engineer", expected: 5 },
      { input: "sky", expected: 0 }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('sum(') && (clean.includes('in') || clean.includes('vowels'));
    }
  },
  "Generate Fibonacci series": {
    title: "Fibonacci Sequence Generator",
    difficulty: "Medium",
    statement: "Write a function `fibonacci(n: int) -> list` that generates and returns the first `n` terms of the Fibonacci sequence, starting with 0 and 1. Implement this iteratively without recursion to avoid stack overflow.",
    constraints: [
      "1 <= n <= 30",
      "Time complexity O(N), space complexity O(N) to store the result list."
    ],
    examples: [
      {
        input: "n = 7",
        output: "[0, 1, 1, 2, 3, 5, 8]",
        explanation: "The first 7 Fibonacci numbers are 0, 1, 1, 2, 3, 5, and 8."
      }
    ],
    starterCode: `def fibonacci(n: int) -> list:
    # Write iterative Fibonacci logic here
    pass`,
    solution: `def fibonacci(n: int) -> list:
    series = []
    a, b = 0, 1
    for _ in range(n):
        series.append(a)
        a, b = b, a + b
    return series`,
    testCases: [
      { input: 7, expected: [0, 1, 1, 2, 3, 5, 8] },
      { input: 3, expected: [0, 1, 1] },
      { input: 1, expected: [0] }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('range(') && (clean.includes('a,b=b,a+b') || clean.includes('a, b = b, a + b') || clean.includes('append'));
    }
  },
  "Create and use decorators": {
    title: "Logger Function Decorators",
    difficulty: "Medium",
    statement: "Create a Python decorator `log_execution(func)` that wraps any standard target function. The decorator must print exactly `[Logger]: Before execution` prior to executing the function, execute the function, and then print `[Logger]: After execution` immediately after.",
    constraints: [
      "Must correctly support functions with variable arbitrary positional and keyword arguments (*args, **kwargs).",
      "Must return the wrapped output value correctly."
    ],
    examples: [
      {
        input: '@log_execution\ndef greet(name):\n    print(f"Hello, {name}!")',
        output: "[Logger]: Before execution\nHello, Alex!\n[Logger]: After execution",
        explanation: "Calling greet('Alex') prints wrapper entries before and after the hello output."
      }
    ],
    starterCode: `def log_execution(func):
    def wrapper(*args, **kwargs):
        # Write wrapper logic here
        pass
    return wrapper`,
    solution: `def log_execution(func):
    def wrapper(*args, **kwargs):
        print("[Logger]: Before execution")
        result = func(*args, **kwargs)
        print("[Logger]: After execution")
        return result
    return wrapper`,
    testCases: [
      { input: "greet('Alex')", expected: "success" }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('wrapper') && clean.includes('func(') && clean.includes('before') && clean.includes('after');
    }
  },
  "Read a text file and count total words": {
    title: "Text File Word Count Pipeline",
    difficulty: "Medium",
    statement: "Write a function `count_words(file_path: str) -> int` that opens a text file safely inside a `with open(...)` block, reads its content, splits it by whitespace, and returns the total number of words. Standardize file closures.",
    constraints: [
      "File I/O must use context managers (`with`) to prevent connection leaks.",
      "Time complexity O(L) where L is total lines count."
    ],
    examples: [
      {
        input: 'file_path = "employees.txt" (containing "Data Engineering Learning")',
        output: "3",
        explanation: "Splitting the text by whitespace yields three words: ['Data', 'Engineering', 'Learning']."
      }
    ],
    starterCode: `def count_words(file_path: str) -> int:
    # Write safe file word count logic here
    pass`,
    solution: `def count_words(file_path: str) -> int:
    with open(file_path, 'r') as f:
        content = f.read()
        words = content.split()
        return len(words)`,
    testCases: [
      { input: "employees.txt", expected: 3 }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('with') && clean.includes('open(') && (clean.includes('split(') || clean.includes('split()')) && clean.includes('len(');
    }
  }
};

const pysparkCompilerProblems = {
  "1. Read CSV file into DataFrame": {
    title: "CSV DataFrame Reader",
    difficulty: "Easy",
    statement: "Write a function `read_csv(spark, path: str)` that utilizes the `SparkSession` `spark` to ingest a CSV file into a PySpark DataFrame with high-performance schema inference and headers enabled.",
    constraints: [
      "Format must be specified as 'csv'.",
      "Options must specify 'header' as 'true' and 'inferSchema' as 'true'."
    ],
    examples: [
      {
        input: 'path = "employees.csv"',
        output: "DataFrame[id: int, name: string, salary: double]",
        explanation: "PySpark ingests the file, parses column headers, and assigns appropriate data types automatically."
      }
    ],
    starterCode: `def read_csv(spark, path: str):
    # Write your spark reader logic here
    pass`,
    solution: `def read_csv(spark, path: str):
    return spark.read.format("csv") \\
        .option("header", "true") \\
        .option("inferSchema", "true") \\
        .load(path)`,
    testCases: [
      { input: "employees.csv", expected: "StructType" }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('spark.read') && clean.includes('csv') && clean.includes('header') && clean.includes('inferschema');
    }
  },
  "12. Group by and aggregate salary": {
    title: "GroupBy Aggregates",
    difficulty: "Easy",
    statement: "Write a function `get_city_stats(df)` that aggregates a PySpark DataFrame `df`. Group the data by `city`, calculate the average `salary` as `avg_salary`, and retrieve the maximum `age` as `max_age`.",
    constraints: [
      "Must import Spark SQL functions `avg` and `max` for column calculations."
    ],
    examples: [
      {
        input: 'df (columns: id, name, city, salary, age)',
        output: "DataFrame[city: string, avg_salary: double, max_age: int]",
        explanation: "DataFrame is grouped by city with aggregate columns calculated correctly."
      }
    ],
    starterCode: `from pyspark.sql import functions as F

def get_city_stats(df):
    # Write your groupBy aggregation logic here
    pass`,
    solution: `from pyspark.sql import functions as F

def get_city_stats(df):
    return df.groupBy("city").agg(
        F.avg("salary").alias("avg_salary"),
        F.max("age").alias("max_age")
    )`,
    testCases: [
      { input: "df", expected: "AggregatedDataFrame" }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('groupby(') && clean.includes('agg(') && (clean.includes('avg(') || clean.includes('mean(')) && clean.includes('max(');
    }
  },
  "22. Remove duplicates using Window functions": {
    title: "Window Deduplication",
    difficulty: "Medium",
    statement: "Given a DataFrame `df`, remove duplicate rows for each user by partitioning on `user_id`, ordering by `timestamp` descending, and keeping only the latest entry per user using a Window function and `row_number()`.",
    constraints: [
      "Must use PySpark Window functions.",
      "Filter out rows where row number is greater than 1."
    ],
    examples: [
      {
        input: 'df (columns: user_id, timestamp, action)',
        output: "DataFrame[user_id: int, timestamp: timestamp, action: string]",
        explanation: "Assigns ranks to each user's actions based on time, pruning duplicates."
      }
    ],
    starterCode: `from pyspark.sql.window import Window
from pyspark.sql.functions import row_number, desc

def deduplicate_users(df):
    # Define Window and filter row_number here
    pass`,
    solution: `from pyspark.sql.window import Window
from pyspark.sql.functions import row_number, desc

def deduplicate_users(df):
    windowSpec = Window.partitionBy("user_id").orderBy(desc("timestamp"))
    return df.withColumn("rn", row_number().over(windowSpec)) \\
             .filter("rn == 1") \\
             .drop("rn")`,
    testCases: [
      { input: "df", expected: "DeduplicatedDataFrame" }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('partitionby(') && clean.includes('orderby(') && clean.includes('row_number(') && (clean.includes('filter(') || clean.includes('where('));
    }
  },
  "27. Use broadcast join optimization": {
    title: "Broadcast Join Hint",
    difficulty: "Medium",
    statement: "Optimize standard shuffle joins by broadcasting a tiny DataFrame `df_small` to all executors, avoiding expensive shuffle steps for large tables `df_large`.",
    constraints: [
      "Must use `broadcast()` column wrapper function."
    ],
    examples: [
      {
        input: "df_large (100M rows), df_small (50 rows)",
        output: "Map-side Broadcast Join executed.",
        explanation: "Bypasses worker network shuffles, accelerating query execution times."
      }
    ],
    starterCode: `from pyspark.sql.functions import broadcast

def optimize_join(df_large, df_small):
    # Perform map-side join here
    pass`,
    solution: `from pyspark.sql.functions import broadcast

def optimize_join(df_large, df_small):
    return df_large.join(broadcast(df_small), "user_id", "inner")`,
    testCases: [
      { input: "df_large, df_small", expected: "BroadcastJoin" }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('broadcast(') && clean.includes('.join(');
    }
  },
  "29. Handle skewed data using salting": {
    title: "Skew Key Salting",
    difficulty: "Hard",
    statement: "Dreaded data skew causes slow executors when joining high-cardinality keys. Write salting logic to append a random salt value (0-3) to the join key, distributing skew records evenly across executors.",
    constraints: [
      "Add a calculated random integer column `salt`.",
      "Concat join key with `salt` to create new balanced partitions."
    ],
    examples: [
      {
        input: "df (highly skewed key 'Null' or 'Company_A')",
        output: "Equally distributed executor loads.",
        explanation: "Splits hot keys into balanced sub-keys, preventing slow worker bottlenecks."
      }
    ],
    starterCode: `import pyspark.sql.functions as F

def salt_join_keys(df):
    # Write key salting column here
    pass`,
    solution: `import pyspark.sql.functions as F

def salt_join_keys(df):
    return df.withColumn("salt", F.concat(F.col("key"), F.lit("_"), F.rand(42).multiply(4).cast("int")))`,
    testCases: [
      { input: "df", expected: "SaltedDataFrame" }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('withcolumn(') && (clean.includes('rand') || clean.includes('salt'));
    }
  },
  "30. Optimize small file problem using OPTIMIZE + ZORDER": {
    title: "Delta Compaction & Z-Order",
    difficulty: "Hard",
    statement: "Consolidate thousands of small parquet files inside a Delta table to optimize read speeds. Execute SQL statements that compact and cluster partitions using OPTIMIZE and cluster keys.",
    constraints: [
      "Must run Delta compaction queries using spark.sql().",
      "Table index must be Z-Ordered by `customer_id`."
    ],
    examples: [
      {
        input: 'table_name = "sales_delta"',
        output: "Consolidated parquet shards, ZORDER on customer_id.",
        explanation: "Decreases files counts, improving file skipped scans by 90%."
      }
    ],
    starterCode: `def compact_delta_table(spark, table_name: str):
    # Write spark.sql optimized queries here
    pass`,
    solution: `def compact_delta_table(spark, table_name: str):
    spark.sql(f"OPTIMIZE {table_name} ZORDER BY (customer_id)")`,
    testCases: [
      { input: "sales_delta", expected: "DeltaCompacted" }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('spark.sql(') && clean.includes('optimize') && clean.includes('zorder');
    }
  }
};

const databricksCompilerProblems = {
  "Ingestion Auto Loader": {
    title: "Incremental Auto Loader Stream",
    difficulty: "Medium",
    statement: "Ingest files incrementally from cloud storage safely using Databricks Auto Loader (`cloudFiles`). Setup check pointing to recover from stream failures.",
    constraints: [
      "Read format must be 'cloudFiles'.",
      "Option 'cloudFiles.format' must specify 'json' or 'csv'."
    ],
    examples: [
      {
        input: 'path = "/mnt/telemetry/raw"',
        output: "Active Spark Streaming Query",
        explanation: "Databricks Auto Loader registers directory file detections and streams new files dynamically."
      }
    ],
    starterCode: `# Write Incremental Auto Loader stream here
df_stream = (spark.readStream
    .format("cloudFiles")
    # Add cloudFiles format & loading options here
)`,
    solution: `df_stream = (spark.readStream
    .format("cloudFiles")
    .option("cloudFiles.format", "json")
    .load("/mnt/telemetry/raw")
)`,
    testCases: [
      { input: "/mnt/telemetry/raw", expected: "StreamingQuery" }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('readstream') && clean.includes('cloudfiles') && clean.includes('format') && clean.includes('load(');
    }
  },
  "Medallion Silver Cleaning": {
    title: "PySpark User Logs Deduplication",
    difficulty: "Easy",
    statement: "Prune duplicate action entries from the user activity log DataFrame keeping only unique rows based on active columns.",
    constraints: [
      "Must utilize df.dropDuplicates() or df.distinct() for optimal operations."
    ],
    examples: [
      {
        input: 'df_users (50,000 logs)',
        output: 'Deduplicated logs (48,150 rows)',
        explanation: "Prunes out double click events or duplicate actions securely."
      }
    ],
    starterCode: `# Complete duplicate pruning
def deduplicate_logs(df):
    # Write drop duplicates code here
    pass`,
    solution: `def deduplicate_logs(df):
    return df.dropDuplicates(["id", "timestamp"])`,
    testCases: [
      { input: "df_users", expected: "UniqueDataFrame" }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('dropduplicates') || clean.includes('distinct');
    }
  },
  "Window running totals": {
    title: "Revenue Partition Running Totals",
    difficulty: "Medium",
    statement: "Write a window function partition query that computes running revenue totals grouped by `department` ordered by `date`.",
    constraints: [
      "Use PySpark Window partitionBy and orderBy.",
      "Calculate F.sum('revenue') over Window specifications."
    ],
    examples: [
      {
        input: "IT department logs",
        output: "Running revenue totals calculated correctly over time.",
        explanation: "Tracks dynamic department ledger aggregates sequentially."
      }
    ],
    starterCode: `from pyspark.sql import functions as F
from pyspark.sql.window import Window

def calculate_running_total(df):
    # Define window specs and sum columns here
    pass`,
    solution: `from pyspark.sql import functions as F
from pyspark.sql.window import Window

def calculate_running_total(df):
    windowSpec = Window.partitionBy("department").orderBy("date")
    return df.withColumn("running_total", F.sum("revenue").over(windowSpec))`,
    testCases: [
      { input: "df", expected: "RunningTotalDataFrame" }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('partitionby') && clean.includes('orderby') && clean.includes('sum(') && clean.includes('over(');
    }
  },
  "Delta compactions (Z-Order)": {
    title: "Delta Table Compaction Optimization",
    difficulty: "Hard",
    statement: "Perform Delta compaction optimization queries on Databricks tables by packing tiny files together and clustering customer partitions to minimize query latency.",
    constraints: [
      "Must execute OPTIMIZE and ZORDER BY customer_id."
    ],
    examples: [
      {
        input: 'sales table compaction',
        output: "Delta Compacted table",
        explanation: "Consolidates tiny parquet fragments into uniform larger database blocks."
      }
    ],
    starterCode: `# compact delta tables using SQL queries
spark.sql("OPTIMIZE ...")`,
    solution: `spark.sql("OPTIMIZE sales_table ZORDER BY (customer_id)")`,
    testCases: [
      { input: "sales_table", expected: "CompactedDeltaTable" }
    ],
    verify: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('optimize') && clean.includes('zorder');
    }
  }
};

export default function Home() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOffline, setIsOffline] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // Gamification Stats State
  const [stats, setStats] = useState({
    level: 1,
    xp: 120,
    activeTime: 45,
    streak: 3,
    completedChallenges: []
  });

  // DB Sync Status
  const [syncing, setSyncing] = useState(false);

  // Error Logger State
  const [errorLogs, setErrorLogs] = useState([]);
  const [newError, setNewError] = useState({
    title: '',
    logContent: '',
    solution: '',
    tag: 'Docker',
    status: 'Pending'
  });
  const [errorSearch, setErrorSearch] = useState('');

  // Revisions (My Notes) State
  const [revisions, setRevisions] = useState([]);
  const [newCustomNote, setNewCustomNote] = useState({
    title: '',
    category: 'General',
    answer: ''
  });
  const [noteSearch, setNoteSearch] = useState('');
  const [noteFilter, setNoteFilter] = useState('All');

  // AI Coach State — Groq AI API
  const [googleStudioApiKey, setGoogleStudioApiKey] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `👋 **Welcome to your Big Data & ETL AI Coach!**\n\nI can help you build optimized PySpark DAGs, resolve Docker networking conflicts, explain Unity Catalog governance, write advanced SQL, or explain distributed partition salting.\n\nAsk me anything to get a structured revision summary!`
    }
  ]);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // --- PLAYGROUND STATES ---

  // 1. Data Analysis (NumPy/Pandas)
  const [dfChallengeStep, setDfChallengeStep] = useState(1);
  const [pandasCode, setPandasCode] = useState('');
  const [pandasOutput, setPandasOutput] = useState('');
  const [pandasStatus, setPandasStatus] = useState('idle'); // idle, success, error
  const [pandasData, setPandasData] = useState([
    { id: 1, name: 'Alice', age: 25, city: 'New York', salary: 70000 },
    { id: 2, name: 'Bob', age: null, city: 'Chicago', salary: 80000 },
    { id: 3, name: 'Charlie', age: 35, city: 'New York', salary: null },
    { id: 4, name: 'David', age: 40, city: null, salary: 95000 },
    { id: 5, name: 'Alice', age: 25, city: 'New York', salary: 70000 }
  ]);

  // Pandas Roadmap States
  const [pandasSubTab, setPandasSubTab] = useState('roadmap'); // 'roadmap' or 'challenges'
  const [pandasRightTab, setPandasRightTab] = useState('guidelines'); // 'guidelines' or 'notes'
  const [selectedRoadmapChapter, setSelectedRoadmapChapter] = useState(1);
  const [quizState, setQuizState] = useState({}); // { [chapterId]: { selected: null, checked: false, isCorrect: null } }

  // Interview Scenarios States
  const [scenarioSearch, setScenarioSearch] = useState('');
  const [scenarioFilter, setScenarioFilter] = useState('All');
  const [expandedScenario, setExpandedScenario] = useState(null);

  const handleSaveScenarioToNotes = async (title, answer) => {
    await handleSaveRevision(
      `Scenario: ${title.replace("Scenario: ", "")}`,
      "Interview Scenario Prep",
      answer,
      "Cloud Security"
    );
  };

  const parseInlineMarkdown = (line) => {
    if (!line) return '';
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} style={{ color: 'hsl(var(--secondary))', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} style={{ background: 'hsla(var(--primary), 0.15)', color: 'hsl(var(--primary))', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const lang = match ? match[1] : '';
        const code = match ? match[2] : part.slice(3, -3);
        return (
          <div key={index} className="terminal-window" style={{ margin: '12px 0', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', borderRadius: '8px', overflow: 'hidden' }}>
            <div className="terminal-header d-flex justify-content-between align-items-center" style={{ padding: '6px 12px', background: 'hsla(var(--card), 0.5)', fontSize: '11px', color: 'hsl(var(--text-muted))' }}>
              <span>{lang ? lang.toUpperCase() : 'CODE'}</span>
              <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(code)} style={{ padding: '2px 8px', fontSize: '10px', borderRadius: '4px', background: 'transparent', borderColor: 'transparent' }}>
                Copy
              </button>
            </div>
            <pre style={{ margin: 0, padding: '12px', overflowX: 'auto', fontSize: '11.5px', fontFamily: 'monospace', color: 'hsl(var(--primary))', background: '#090d16' }}>
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      const lines = part.split('\n');
      return (
        <div key={index}>
          {lines.map((line, lIdx) => {
            if (line.startsWith('### ')) {
              return <h3 key={lIdx} style={{ color: 'hsl(var(--primary))', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid hsla(var(--border), 0.3)', paddingBottom: '4px', fontSize: '14px', fontWeight: '700' }}>{line.slice(4)}</h3>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={lIdx} style={{ color: 'hsl(var(--secondary))', marginTop: '18px', marginBottom: '10px', fontSize: '16px', fontWeight: '700' }}>{line.slice(3)}</h2>;
            }
            if (line.startsWith('# ')) {
              return <h1 key={lIdx} style={{ color: 'hsl(var(--text))', marginTop: '20px', marginBottom: '12px', fontSize: '18px', fontWeight: '800' }}>{line.slice(2)}</h1>;
            }
            const listMatch = line.match(/^(\d+)\.\s(.*)/);
            if (listMatch) {
              const num = listMatch[1];
              const content = listMatch[2];
              return (
                <div key={lIdx} style={{ display: 'flex', gap: '8px', marginLeft: '12px', margin: '4px 0', fontSize: '12.5px' }}>
                  <span style={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}>{num}.</span>
                  <span>{parseInlineMarkdown(content)}</span>
                </div>
              );
            }
            if (line.startsWith('- ') || line.startsWith('* ')) {
              return (
                <div key={lIdx} style={{ display: 'flex', gap: '8px', marginLeft: '12px', margin: '4px 0', fontSize: '12.5px' }}>
                  <span style={{ color: 'hsl(var(--secondary))' }}>•</span>
                  <span>{parseInlineMarkdown(line.slice(2))}</span>
                </div>
              );
            }
            if (!line.trim()) {
              return <div key={lIdx} style={{ height: '8px' }} />;
            }
            return (
              <p key={lIdx} style={{ margin: '4px 0', fontSize: '12.5px', lineHeight: '1.5', color: 'hsl(var(--text))' }}>
                {parseInlineMarkdown(line)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  // Databricks Academy States
  const [databricksSubTab, setDatabricksSubTab] = useState('roadmap'); // 'roadmap' or 'playground'
  const [databricksRightTab, setDatabricksRightTab] = useState('guidelines'); // 'guidelines' or 'notes'
  const [selectedDatabricksChapter, setSelectedDatabricksChapter] = useState(1);
  const [databricksQuizState, setDatabricksQuizState] = useState({}); // { [chapterId]: { selected: null, checked: false, isCorrect: null } }
  const [databricksCode, setDatabricksCode] = useState('');
  const [databricksActiveTemplate, setDatabricksActiveTemplate] = useState('Ingestion Auto Loader');
  const [databricksTerminalOutput, setDatabricksTerminalOutput] = useState('');
  const [databricksTerminalStatus, setDatabricksTerminalStatus] = useState('idle'); // idle, running, success, error
  const [showDatabricksSolution, setShowDatabricksSolution] = useState(false);
  const [activeCheatsheetCat, setActiveCheatsheetCat] = useState('magic');

  // Python Core Academy States
  const [pythonSubTab, setPythonSubTab] = useState('coding'); // 'fundamentals', 'coding', or 'compiler'
  const [selectedPythonQuestion, setSelectedPythonQuestion] = useState(1);
  const [pythonQuizState, setPythonQuizState] = useState({});
  const [pythonCode, setPythonCode] = useState(`text = "learning"
reversed_text = text[::-1]
print("Reversed:", reversed_text)`);
  const [pythonActiveTemplate, setPythonActiveTemplate] = useState('Reverse a string using slicing');
  const [pythonTerminalOutput, setPythonTerminalOutput] = useState('');
  const [pythonTerminalStatus, setPythonTerminalStatus] = useState('idle');
  const [showPythonSolution, setShowPythonSolution] = useState(false);
  const [pythonSearchQuery, setPythonSearchQuery] = useState('');
  const [pythonCategoryFilter, setPythonCategoryFilter] = useState('All');
  const [expandedPythonConcept, setExpandedPythonConcept] = useState(null);

  // SQL Academy States
  const [sqlSubTab, setSqlSubTab] = useState('coding'); // 'fundamentals', 'coding', 'compiler', 'notes'
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM employees;');
  const [sqlResult, setSqlResult] = useState([]);
  const [sqlError, setSqlError] = useState('');
  const [sqlSelectedChallenge, setSqlSelectedChallenge] = useState('sql-basic-1');
  const [showSqlSolution, setShowSqlSolution] = useState(false);
  const [sqlSearchQuery, setSqlSearchQuery] = useState('');
  const [sqlCategoryFilter, setSqlCategoryFilter] = useState('All');
  const [sqlExerciseCode, setSqlExerciseCode] = useState('SELECT * FROM employees;');
  const [sqlExerciseResult, setSqlExerciseResult] = useState(null);
  const [sqlExerciseError, setSqlExerciseError] = useState('');
  const [sqlExerciseStatus, setSqlExerciseStatus] = useState('idle');

  // Live SQL data viewer states and functions
  const [sqlLiveTables, setSqlLiveTables] = useState({
    employees: [],
    departments: [],
    projects: []
  });
  const [sqlExpandedTables, setSqlExpandedTables] = useState({
    employees: false,
    departments: false,
    projects: false
  });

  const updateSqlLiveTables = () => {
    try {
      const employees = alasql('SELECT * FROM employees');
      const departments = alasql('SELECT * FROM departments');
      const projects = alasql('SELECT * FROM projects');
      setSqlLiveTables({
        employees: Array.isArray(employees) ? employees : [],
        departments: Array.isArray(departments) ? departments : [],
        projects: Array.isArray(projects) ? projects : []
      });
    } catch (err) {
      console.error('Error fetching live tables:', err);
    }
  };

  const resetSqlDatabase = () => {
    try {
      alasql('DELETE FROM employees');
      alasql('DELETE FROM departments');
      alasql('DELETE FROM projects');
      
      alasql.tables.employees.data = JSON.parse(JSON.stringify(sqlDatasets.employees));
      alasql.tables.departments.data = JSON.parse(JSON.stringify(sqlDatasets.departments));
      alasql.tables.projects.data = JSON.parse(JSON.stringify(sqlDatasets.projects));
      
      updateSqlLiveTables();
      setSqlError('');
      setSqlResult([]);
    } catch (err) {
      console.error('Reset database error:', err);
    }
  };
  // --- PYTHON EXERCISE & MULTI-PAGE NOTES STATES ---
  const [selectedExerciseItem, setSelectedExerciseItem] = useState(null);
  const [exerciseCode, setExerciseCode] = useState('');
  const [exerciseTerminalOutput, setExerciseTerminalOutput] = useState('');
  const [exerciseTerminalStatus, setExerciseTerminalStatus] = useState('idle');
  const [showExerciseSolution, setShowExerciseSolution] = useState(false);

  const [globalNotebook, setGlobalNotebook] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('global_notebook_notes');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [notebookActivePagesIndexes, setNotebookActivePagesIndexes] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('global_notebook_notes', JSON.stringify(globalNotebook));
    }
  }, [globalNotebook]);

  // --- REUSABLE STUDY NOTEBOOK COMPONENT ---
  const renderStudyNotebook = (noteKey, defaultHeading) => {
    // Block-based page structure: each page has an ordered array of blocks
    // Block types: { type: 'heading', content: '' } | { type: 'paragraph', content: '' } | { type: 'image', src: null }
    const makeDefaultPage = (heading) => ({
      blocks: [
        { type: 'heading',   content: heading || 'Study Notes' },
        { type: 'paragraph', content: '' }
      ]
    });

    const rawPages = globalNotebook[noteKey];
    // Migrate old format (array of {heading, paragraph, image}) to new block format
    let pages;
    if (!rawPages) {
      pages = [makeDefaultPage(defaultHeading)];
    } else if (Array.isArray(rawPages) && rawPages.length > 0 && !rawPages[0].blocks) {
      // Old format migration
      pages = rawPages.map(p => {
        const blocks = [];
        blocks.push({ type: 'heading', content: p.heading || defaultHeading || 'Study Notes' });
        if (p.image) blocks.push({ type: 'image', src: p.image });
        blocks.push({ type: 'paragraph', content: p.paragraph || '' });
        return { blocks };
      });
    } else {
      pages = rawPages;
    }

    const pageIndex = notebookActivePagesIndexes[noteKey] || 0;
    const currentPageIndex = pageIndex >= pages.length ? 0 : pageIndex;
    const currentPage = pages[currentPageIndex] || makeDefaultPage(defaultHeading);
    const blocks = currentPage.blocks || [];

    const updatePages = (newPages) =>
      setGlobalNotebook(prev => ({ ...prev, [noteKey]: newPages }));

    const updateBlocks = (newBlocks) => {
      const updated = [...pages];
      updated[currentPageIndex] = { ...updated[currentPageIndex], blocks: newBlocks };
      updatePages(updated);
    };

    // ---- Block operations ----
    const addBlock = (type) => {
      const newBlock =
        type === 'heading'   ? { type: 'heading',   content: 'New Heading' } :
        type === 'paragraph' ? { type: 'paragraph', content: '' } :
                               { type: 'image',     src: null };
      updateBlocks([...blocks, newBlock]);
    };

    const removeBlock = (idx) => {
      if (blocks.length <= 1) return; // keep at least one
      const updated = blocks.filter((_, i) => i !== idx);
      updateBlocks(updated);
    };

    const moveBlock = (idx, dir) => {
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= blocks.length) return;
      const updated = [...blocks];
      [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
      updateBlocks(updated);
    };

    const updateBlockContent = (idx, content) => {
      const updated = blocks.map((b, i) => i === idx ? { ...b, content } : b);
      updateBlocks(updated);
    };

    const handleImageUpload = (idx, e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = blocks.map((b, i) => i === idx ? { ...b, src: reader.result } : b);
        updateBlocks(updated);
      };
      reader.readAsDataURL(file);
    };

    // Rich-text helpers (execCommand on contentEditable)
    const applyFormat = (cmd) => document.execCommand(cmd, false, null);

    // ---- Page operations ----
    const handleAddPage = () => {
      const updated = [...pages, makeDefaultPage(`Notes Page ${pages.length + 1}`)];
      updatePages(updated);
      setNotebookActivePagesIndexes(prev => ({ ...prev, [noteKey]: updated.length - 1 }));
    };
    const handleDeletePage = () => {
      if (pages.length <= 1) {
        updatePages([makeDefaultPage(defaultHeading)]);
        setNotebookActivePagesIndexes(prev => ({ ...prev, [noteKey]: 0 }));
      } else {
        const updated = pages.filter((_, i) => i !== currentPageIndex);
        updatePages(updated);
        setNotebookActivePagesIndexes(prev => ({ ...prev, [noteKey]: Math.max(0, currentPageIndex - 1) }));
      }
    };

    const controlBtn = (onClick, title, children, danger = false) => (
      <button
        onClick={onClick}
        title={title}
        style={{
          border: `1px solid ${danger ? 'hsl(var(--danger))' : 'hsl(var(--border))'}`,
          background: danger ? 'hsla(var(--danger),0.06)' : '#ffffff',
          color: danger ? 'hsl(var(--danger))' : 'hsl(var(--text-muted))',
          borderRadius: '6px',
          width: '26px', height: '26px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '13px', flexShrink: 0
        }}
      >{children}</button>
    );

    return (
      <div
        className="card"
        style={{
          border: '1px solid hsl(var(--border))',
          borderRadius: '16px',
          background: '#ffffff',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          minHeight: '480px'
        }}
      >
        {/* ── Header: Page nav + page controls ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'hsl(var(--text))' }}>📝 Notebook</span>
            <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', fontWeight: '600', background: 'hsla(var(--secondary),0.1)', padding: '2px 8px', borderRadius: '10px' }}>
              Page {currentPageIndex + 1} of {pages.length}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {controlBtn(
              () => setNotebookActivePagesIndexes(prev => ({ ...prev, [noteKey]: Math.max(0, currentPageIndex - 1) })),
              'Previous page', <ChevronLeft style={{ width: '14px', height: '14px' }} />
            )}
            {controlBtn(
              () => setNotebookActivePagesIndexes(prev => ({ ...prev, [noteKey]: Math.min(pages.length - 1, currentPageIndex + 1) })),
              'Next page', <ChevronRight style={{ width: '14px', height: '14px' }} />
            )}
            <button
              onClick={handleAddPage}
              style={{ border: '1px solid hsl(var(--border))', background: 'hsla(var(--primary),0.07)', color: 'hsl(var(--primary))', borderRadius: '6px', padding: '0 10px', height: '26px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
            >+ Page</button>
            {controlBtn(handleDeletePage, 'Delete this page', <Trash2 style={{ width: '13px', height: '13px' }} />, true)}
          </div>
        </div>

        {/* ── Add-block toolbar ── */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'hsl(var(--text-muted))', alignSelf: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>+ Add:</span>
          {[
            { label: '🔤 Heading',   type: 'heading'   },
            { label: '📄 Paragraph', type: 'paragraph' },
            { label: '🖼 Image',     type: 'image'     },
          ].map(({ label, type }) => (
            <button
              key={type}
              onClick={() => addBlock(type)}
              style={{
                border: '1px solid hsl(var(--border))',
                background: 'hsla(var(--primary),0.05)',
                color: 'hsl(var(--primary))',
                borderRadius: '8px',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >{label}</button>
          ))}
        </div>

        {/* ── Blocks ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {blocks.map((block, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid hsl(var(--border))',
                borderRadius: '10px',
                padding: '12px',
                background: 'hsla(var(--secondary),0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative'
              }}
            >
              {/* Block controls: move up / move down / delete */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {block.type === 'heading' ? '🔤 Heading' : block.type === 'paragraph' ? '📄 Paragraph' : '🖼 Image'}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {controlBtn(() => moveBlock(idx, -1), 'Move up',   '↑')}
                  {controlBtn(() => moveBlock(idx,  1), 'Move down', '↓')}
                  {controlBtn(() => removeBlock(idx), 'Remove block', <Trash2 style={{ width: '11px', height: '11px' }} />, true)}
                </div>
              </div>

              {/* ── HEADING block ── */}
              {block.type === 'heading' && (
                <input
                  type="text"
                  value={block.content}
                  onChange={e => updateBlockContent(idx, e.target.value)}
                  placeholder="Heading text..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: 'hsl(var(--text))',
                    outline: 'none',
                    background: 'transparent'
                  }}
                />
              )}

              {/* ── PARAGRAPH block ── */}
              {block.type === 'paragraph' && (
                <>
                  {/* Mini rich-text toolbar */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onMouseDown={e => { e.preventDefault(); applyFormat('bold'); }}
                      style={{ border: '1px solid hsl(var(--border))', background: '#fff', borderRadius: '5px', padding: '2px 10px', fontSize: '12px', fontWeight: 900, cursor: 'pointer', color: 'hsl(var(--text))' }}
                      title="Bold (Ctrl+B)"
                    ><b>B</b></button>
                    <button
                      onMouseDown={e => { e.preventDefault(); applyFormat('hiliteColor'); document.execCommand('hiliteColor', false, '#fef08a'); }}
                      style={{ border: '1px solid hsl(var(--border))', background: '#fef08a', borderRadius: '5px', padding: '2px 10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#78350f' }}
                      title="Highlight"
                    >H</button>
                    <button
                      onMouseDown={e => { e.preventDefault(); applyFormat('italic'); }}
                      style={{ border: '1px solid hsl(var(--border))', background: '#fff', borderRadius: '5px', padding: '2px 10px', fontSize: '12px', fontStyle: 'italic', fontWeight: 600, cursor: 'pointer', color: 'hsl(var(--text))' }}
                      title="Italic"
                    ><i>I</i></button>
                    <button
                      onMouseDown={e => { e.preventDefault(); applyFormat('removeFormat'); }}
                      style={{ border: '1px solid hsl(var(--border))', background: '#fff', borderRadius: '5px', padding: '2px 10px', fontSize: '11px', cursor: 'pointer', color: 'hsl(var(--text-muted))' }}
                      title="Clear formatting"
                    >✕</button>
                  </div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onInput={e => updateBlockContent(idx, e.currentTarget.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: block.content }}
                    data-placeholder="Write your notes here..."
                    style={{
                      minHeight: '120px',
                      padding: '10px 12px',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      color: 'hsl(var(--text))',
                      outline: 'none',
                      background: '#ffffff',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowY: 'auto'
                    }}
                  />
                </>
              )}

              {/* ── IMAGE block ── */}
              {block.type === 'image' && (
                block.src ? (
                  <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                    <img
                      src={block.src}
                      alt="Note reference"
                      style={{
                        display: 'block',
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <button
                      onClick={() => { const updated = blocks.map((b, i) => i === idx ? { ...b, src: null } : b); updateBlocks(updated); }}
                      style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Remove image"
                    >✕</button>
                  </div>
                ) : (
                  <label
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', border: '2px dashed hsl(var(--border))', borderRadius: '10px', padding: '24px', cursor: 'pointer', background: 'hsla(var(--secondary),0.02)', transition: 'background 0.2s' }}
                  >
                    <ImageIcon style={{ width: '28px', height: '28px', color: 'hsl(var(--text-muted))' }} />
                    <span style={{ fontSize: '12px', color: 'hsl(var(--text-muted))' }}>Click to upload image</span>
                    <span style={{ fontSize: '11px', color: 'hsl(var(--text-dark))' }}>PNG, JPG, GIF, SVG — shown at natural size</span>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(idx, e)} />
                  </label>
                )
              )}
            </div>
          ))}

          {blocks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'hsl(var(--text-muted))', fontSize: '13px' }}>
              Use the <strong>+ Add</strong> buttons above to start building your notes.
            </div>
          )}
        </div>
      </div>
    );
  };
  const runExerciseCode = () => {
    if (!selectedExerciseItem) return;
    setExerciseTerminalStatus('running');
    setExerciseTerminalOutput('Initializing python sandbox runtime...\nCompiling code...\nRunning test verification suite...\n\n');

    setTimeout(() => {
      const activeProb = selectedExerciseItem;
      const userCode = exerciseCode;
      
      let allPassed = true;
      let testOutput = `🚀 PYTEST EXECUTION SUITE ACTIVE...\n`;
      testOutput += `Problem: ${activeProb.title} (${activeProb.difficulty})\n`;
      testOutput += `--------------------------------------------------\n`;

      const parenthesesCount = (userCode.match(/\(/g) || []).length === (userCode.match(/\)/g) || []).length;
      const bracketCount = (userCode.match(/\[/g) || []).length === (userCode.match(/\]/g) || []).length;
      const braceCount = (userCode.match(/\{/g) || []).length === (userCode.match(/\}/g) || []).length;
      const quotesCountDouble = (userCode.match(/"/g) || []).length % 2 === 0;
      const quotesCountSingle = (userCode.match(/'/g) || []).length % 2 === 0;

      if (!parenthesesCount || !bracketCount || !braceCount || !quotesCountDouble || !quotesCountSingle) {
        allPassed = false;
        testOutput += `🚨 SYNTAX ERROR DETECTED DURING PARSING\n`;
        if (!parenthesesCount) testOutput += `  - Mismatched parenthesis: '('\n`;
        if (!bracketCount) testOutput += `  - Mismatched brackets: '['\n`;
        if (!braceCount) testOutput += `  - Mismatched braces: '{'\n`;
        if (!quotesCountDouble || !quotesCountSingle) testOutput += `  - Unterminated string literal detected.\n`;
        testOutput += `--------------------------------------------------\n`;
        testOutput += `❌ Status: COMPILER ERROR\n`;
        testOutput += `Please check your code for open syntax constructs and try again.`;
        setExerciseTerminalStatus('error');
        setExerciseTerminalOutput(testOutput);
        return;
      }

      if (activeProb.testCases && activeProb.testCases.length > 0) {
        activeProb.testCases.forEach((tc, idx) => {
          testOutput += `Test Case ${idx + 1}/${activeProb.testCases.length}:\n`;
          let tcPassed = true;
          
          if (activeProb.id === 'printing' && !userCode.includes('print')) tcPassed = false;
          if (activeProb.id === 'multi-printing' && (!userCode.includes('*') && !userCode.includes('print'))) tcPassed = false;
          if (activeProb.id === 'while-loop' && !userCode.includes('while')) tcPassed = false;
          if (activeProb.id === 'jumping-through-while' && !userCode.includes('continue')) tcPassed = false;
          if (activeProb.id === 'encapsulation' && !userCode.includes('__balance')) tcPassed = false;
          if (activeProb.id === 'abstraction' && !userCode.includes('speak')) tcPassed = false;
          if (activeProb.id === 'static-method' && !userCode.includes('@staticmethod')) tcPassed = false;
          
          if (tcPassed) {
            testOutput += `  - Input: "${tc.input || 'None'}"\n`;
            testOutput += `  - Expected Output: "${tc.expected.trim()}"\n`;
            testOutput += `  - Console Stdout: "${tc.expected.trim()}"\n`;
            testOutput += `  - Status: ✅ Passed!\n\n`;
          } else {
            allPassed = false;
            testOutput += `  - Input: "${tc.input || 'None'}"\n`;
            testOutput += `  - Expected Output: "${tc.expected.trim()}"\n`;
            testOutput += `  - Console Stdout: "None / Execution error"\n`;
            testOutput += `  - Status: ❌ Failed (Assertion failed, missing required keywords/functions)!\n\n`;
          }
        });
      } else {
        if (userCode.trim().length < 10) {
          allPassed = false;
          testOutput += `❌ Verification failed. Code template remains unchanged or is too short.\n`;
        } else {
          testOutput += `  - Execution: Compiled successfully.\n`;
          testOutput += `  - Status: ✅ Passed!\n`;
        }
      }

      testOutput += `--------------------------------------------------\n`;
      if (allPassed) {
        testOutput += `🎉 Status: ACCEPTED\n`;
        testOutput += `All tests passed beats 99.1% of virtual submissions.\n`;
        testOutput += `XP Reward: +100 XP added to your achievements!`;
        addXP(100);
        setExerciseTerminalStatus('success');
      } else {
        testOutput += `❌ Status: WRONG ANSWER\n`;
        testOutput += `Some assertions failed. Verify your logic or review the Optimal Solution if stuck!`;
        setExerciseTerminalStatus('error');
      }
      setExerciseTerminalOutput(testOutput);
    }, 1500);
  };

  // PySpark Core Academy States

  const [pysparkSubTab, setPysparkSubTab] = useState('fundamentals');
  const [selectedPysparkQuestion, setSelectedPysparkQuestion] = useState(1);
  const [pysparkQuizState, setPysparkQuizState] = useState({});
  const [pysparkCode, setPysparkCode] = useState(`df = spark.read.format("csv") \\
  .option("header", "true") \\
  .option("inferSchema", "true") \\
  .load("employees.csv")
df.show(5)`);
  const [pysparkActiveTemplate, setPysparkActiveTemplate] = useState('1. Read CSV file into DataFrame');
  const [pysparkTerminalOutput, setPysparkTerminalOutput] = useState('');
  const [pysparkTerminalStatus, setPysparkTerminalStatus] = useState('idle');
  const [showPysparkSolution, setShowPysparkSolution] = useState(false);
  const [pysparkSearchQuery, setPysparkSearchQuery] = useState('');
  const [pysparkCategoryFilter, setPysparkCategoryFilter] = useState('All');
  const [expandedPysparkConcept, setExpandedPysparkConcept] = useState(null);

  const handleSelectPythonQuizOption = (questionId, optionIndex) => {
    if (pythonQuizState[questionId]?.checked) return;
    const challenge = pythonCodingChallenges.find(c => c.id === questionId);
    if (!challenge) return;
    const isCorrect = optionIndex === challenge.quiz.correctIndex;
    setPythonQuizState(prev => ({
      ...prev,
      [questionId]: {
        selected: optionIndex,
        checked: true,
        isCorrect
      }
    }));
    if (isCorrect) {
      addXP(20);
    }
  };

  const loadPythonExample = (code, title) => {
    setPythonCode(code);
    setPythonActiveTemplate(title);
    setPythonSubTab('compiler');
    setPythonTerminalStatus('success');
    setPythonTerminalOutput(`⚡ Script loaded successfully: ${title}!\nEdit and click "Run Script" to compile inside the simulated Python runtime environment.`);
  };

  const loadPythonPresetTemplate = (name) => {
    setPythonActiveTemplate(name);
    setShowPythonSolution(false);
    const prob = pythonCompilerProblems[name];
    if (prob) {
      setPythonCode(prob.starterCode);
      setPythonTerminalStatus('idle');
      setPythonTerminalOutput('Ready. Write your solution function and click "Run Code" to test it.');
    }
  };

  const runPythonPlayground = () => {
    setPythonTerminalStatus('running');
    setPythonTerminalOutput('Initializing python virtual environment (venv)...\nRunning syntax checks on script.py...\nExecuting test suite...\n\n');
    
    setTimeout(() => {
      const activeProb = pythonCompilerProblems[pythonActiveTemplate];
      if (!activeProb) {
        setPythonTerminalStatus('success');
        setPythonTerminalOutput('Success: script compiled, but no LeetCode test suite registered for this preset.');
        return;
      }
      
      const userCode = pythonCode;
      const isCorrect = activeProb.verify(userCode);
      
      let testOutput = `🚀 LEETCODE VERIFICATION SUITE RUNNING...\n`;
      testOutput += `Problem: ${activeProb.title} (${activeProb.difficulty})\n`;
      testOutput += `--------------------------------------------------\n`;
      
      let allPassed = true;
      activeProb.testCases.forEach((tc, idx) => {
        testOutput += `Test Case ${idx + 1}/${activeProb.testCases.length}: Input: ${JSON.stringify(tc.input)}\n`;
        if (isCorrect) {
          testOutput += `Expected: ${JSON.stringify(tc.expected)}\n`;
          testOutput += `Actual: ${JSON.stringify(tc.expected)}\n`;
          testOutput += `✅ Test Case Passed!\n\n`;
        } else {
          allPassed = false;
          testOutput += `Expected: ${JSON.stringify(tc.expected)}\n`;
          if (!userCode.includes('def ')) {
            testOutput += `Actual: None (Syntax Error: No function defined)\n`;
          } else {
            testOutput += `Actual: Unchanged / Incorrect Value\n`;
          }
          testOutput += `❌ Test Case Failed!\n\n`;
        }
      });
      
      testOutput += `--------------------------------------------------\n`;
      if (allPassed) {
        testOutput += `🎉 Status: ACCEPTED\n`;
        testOutput += `All ${activeProb.testCases.length}/${activeProb.testCases.length} test cases passed.\n`;
        testOutput += `Runtime: 8ms (beats 98.4% of Python submissions)\n`;
        testOutput += `Memory: 14.1 MB (beats 92.1% of submissions)\n`;
        testOutput += `Reward: +100 XP added!`;
        addXP(100);
        setPythonTerminalStatus('success');
      } else {
        testOutput += `❌ Status: WRONG ANSWER\n`;
        testOutput += `Passed: 0/${activeProb.testCases.length} test cases.\n`;
        testOutput += `Error: Please check your logic and template function signature. Click "Show Solution" if you are stuck!`;
        setPythonTerminalStatus('error');
      }
      
      setPythonTerminalOutput(testOutput);
    }, 1500);
  };

  // PySpark Core Academy Event Handlers
  const handleSelectPysparkQuizOption = (questionId, optionIndex) => {
    if (pysparkQuizState[questionId]?.checked) return;
    const challenge = pysparkChallenges.find(c => c.id === questionId);
    if (!challenge) return;
    const isCorrect = optionIndex === challenge.quiz.correctIndex;
    setPysparkQuizState(prev => ({
      ...prev,
      [questionId]: {
        selected: optionIndex,
        checked: true,
        isCorrect
      }
    }));
    if (isCorrect) {
      addXP(20);
    }
  };

  const loadPysparkExample = (code, title) => {
    setPysparkCode(code);
    setPysparkActiveTemplate(title);
    setPysparkSubTab('compiler');
    setPysparkTerminalStatus('success');
    setPysparkTerminalOutput(`⚡ Script loaded successfully: ${title}!\nEdit and click "Run Script" to compile inside the simulated PySpark cluster.`);
  };

  const loadPysparkPresetTemplate = (name) => {
    setPysparkActiveTemplate(name);
    setShowPysparkSolution(false);
    const prob = pysparkCompilerProblems[name];
    if (prob) {
      setPysparkCode(prob.starterCode);
      setPysparkTerminalStatus('idle');
      setPysparkTerminalOutput('Ready. Write your solution function and click "Run Code" to test it.');
    }
  };

  const runPysparkPlayground = () => {
    setPysparkTerminalStatus('running');
    setPysparkTerminalOutput('Spinning up PySpark JVM cluster environment...\nInitializing SparkSession...\nExecuting Spark SQL execution graph...\n\n');
    
    setTimeout(() => {
      const activeProb = pysparkCompilerProblems[pysparkActiveTemplate];
      if (!activeProb) {
        setPysparkTerminalStatus('success');
        setPysparkTerminalOutput('Success: Spark Job completed successfully!');
        return;
      }
      
      const userCode = pysparkCode;
      const isCorrect = activeProb.verify(userCode);
      
      let testOutput = `⚡ PYSPARK CLUSTER TEST SUITE RUNNING...\n`;
      testOutput += `Problem: ${activeProb.title} (${activeProb.difficulty})\n`;
      testOutput += `--------------------------------------------------\n`;
      
      let allPassed = true;
      activeProb.testCases.forEach((tc, idx) => {
        testOutput += `Test Input Partition: ${JSON.stringify(tc.input)}\n`;
        if (isCorrect) {
          testOutput += `Expected DAG Plan: ${JSON.stringify(tc.expected)}\n`;
          testOutput += `Actual DAG Plan: ${JSON.stringify(tc.expected)}\n`;
          testOutput += `✅ Spark Plan Optimization Passed!\n\n`;
        } else {
          allPassed = false;
          testOutput += `Expected DAG Plan: ${JSON.stringify(tc.expected)}\n`;
          testOutput += `Actual DAG Plan: Unoptimized Standard Join Plan (Full Shuffle Shuffle)\n`;
          testOutput += `❌ Test Case Failed! Incorrect SQL query aggregates or missing hints.\n\n`;
        }
      });
      
      testOutput += `--------------------------------------------------\n`;
      if (allPassed) {
        testOutput += `🎉 Status: ACCEPTED (Spark Catalyst Optimized)\n`;
        testOutput += `Shuffle size: 0 bytes (Map-side join executed)\n`;
        testOutput += `Execution partitions: 1 (perfect data load balance)\n`;
        testOutput += `Reward: +100 XP added!`;
        addXP(100);
        setPysparkTerminalStatus('success');
      } else {
        testOutput += `❌ Status: WRONG ANSWER (Unoptimized Job)\n`;
        testOutput += `Shuffle partitions skewed. Missing salting, ZORDER compactions, or broadcast join hints.\n`;
        testOutput += `Need help? Toggle "Show Solution" to learn the advanced Spark SQL pattern!`;
        setPysparkTerminalStatus('error');
      }
      
      setPysparkTerminalOutput(testOutput);
    }, 1500);
  };

  const handleSelectDatabricksQuizOption = (chapterId, optionIndex) => {
    if (databricksQuizState[chapterId]?.checked) return; // Can't change after verification

    const chapter = databricksChapters.find(c => c.id === chapterId);
    if (!chapter) return;

    const isCorrect = optionIndex === chapter.quiz.correctIndex;

    setDatabricksQuizState(prev => ({
      ...prev,
      [chapterId]: {
        selected: optionIndex,
        checked: true,
        isCorrect
      }
    }));

    if (isCorrect) {
      addXP(20); // Award 20 XP instantly!
    }
  };

  const loadDatabricksExample = (code, title) => {
    setDatabricksCode(code);
    setDatabricksActiveTemplate(title);
    setDatabricksSubTab('playground');
    setDatabricksTerminalStatus('success');
    setDatabricksTerminalOutput(`⚡ Script loaded successfully: ${title}!\nEdit and click "Run Script" to compile inside the simulated SparkSession environment.`);
  };

  const loadPresetTemplate = (name) => {
    setDatabricksActiveTemplate(name);
    setShowDatabricksSolution(false);
    const prob = databricksCompilerProblems[name];
    if (prob) {
      setDatabricksCode(prob.starterCode);
      setDatabricksTerminalStatus('idle');
      setDatabricksTerminalOutput('Ready. Write your solution function and click "Run Code" to test it.');
    } else {
      setDatabricksCode("# Custom sandbox template. Write your code here.");
      setDatabricksTerminalStatus('idle');
      setDatabricksTerminalOutput('Ready. Write or edit your PySpark/SQL code and click "Run Script".');
    }
  };

  const runDatabricksPlayground = () => {
    setDatabricksTerminalStatus('running');
    setDatabricksTerminalOutput('Initializing SparkSession...\nSetting config: spark.sql.extensions = io.delta.sql.DeltaSparkSessionExtension\nSparkSession initialized (Spark version 3.5.0, Photon execution engine active).\n\n');
    
    setTimeout(() => {
      const activeProb = databricksCompilerProblems[databricksActiveTemplate];
      if (!activeProb) {
        setDatabricksTerminalStatus('success');
        setDatabricksTerminalOutput('Success: Databricks compile succeeded.');
        return;
      }
      
      const userCode = databricksCode;
      const isCorrect = activeProb.verify(userCode);
      
      let testOutput = `☁️ DATABRICKS PHOTON EXECUTOR SUITE RUNNING...\n`;
      testOutput += `Problem: ${activeProb.title} (${activeProb.difficulty})\n`;
      testOutput += `--------------------------------------------------\n`;
      
      let allPassed = true;
      activeProb.testCases.forEach((tc, idx) => {
        testOutput += `Mock Delta Source: ${JSON.stringify(tc.input)}\n`;
        if (isCorrect) {
          testOutput += `Expected Output: ${JSON.stringify(tc.expected)}\n`;
          testOutput += `Actual Output: ${JSON.stringify(tc.expected)}\n`;
          testOutput += `✅ Databricks Test Case Passed!\n\n`;
        } else {
          allPassed = false;
          testOutput += `Expected Output: ${JSON.stringify(tc.expected)}\n`;
          testOutput += `Actual Output: None or Syntax Error\n`;
          testOutput += `❌ Test Case Failed! Incorrect syntax.\n\n`;
        }
      });
      
      testOutput += `--------------------------------------------------\n`;
      if (allPassed) {
        testOutput += `🎉 Status: ACCEPTED (Medallion Asset Verified)\n`;
        testOutput += `Photon engine acceleration: 12x speedup active.\n`;
        testOutput += `Checkpoint logs verified in Delta metadata.\n`;
        testOutput += `Reward: +100 XP added!`;
        addXP(100);
        setDatabricksTerminalStatus('success');
      } else {
        testOutput += `❌ Status: WRONG ANSWER (Execution Halted)\n`;
        testOutput += `Verify Auto Loader patterns, window aggregations, or file compaction structures.\n`;
        testOutput += `Toggle "Show Solution" to reveal the correct Databricks workflow.`;
        setDatabricksTerminalStatus('error');
      }
      
      setDatabricksTerminalOutput(testOutput);
    }, 1500);
  };

  const handleVerifyQuiz = (chapterId) => {
    const activeQuizState = quizState[chapterId];
    if (!activeQuizState || activeQuizState.selected === undefined || activeQuizState.checked) return;

    const chapter = roadmapChapters.find(c => c.id === chapterId);
    if (!chapter) return;

    const isCorrect = activeQuizState.selected === chapter.quiz.correctIndex;
    
    setQuizState(prev => ({
      ...prev,
      [chapterId]: {
        ...prev[chapterId],
        checked: true,
        isCorrect
      }
    }));

    if (isCorrect) {
      addXP(20); // Award 20 XP for correct answer!
    }
  };

  const handleSelectQuizOption = (chapterId, optionIndex) => {
    if (quizState[chapterId]?.checked) return; // Can't change after verification

    const chapter = roadmapChapters.find(c => c.id === chapterId);
    if (!chapter) return;

    const isCorrect = optionIndex === chapter.quiz.correctIndex;

    setQuizState(prev => ({
      ...prev,
      [chapterId]: {
        selected: optionIndex,
        checked: true,
        isCorrect
      }
    }));

    if (isCorrect) {
      addXP(20); // Award 20 XP for correct answer instantly!
    }
  };

  const loadRoadmapExample = (code) => {
    setPandasCode(code);
    setPandasSubTab('challenges');
    setPandasStatus('success');
    setPandasOutput('⚡ Code loaded successfully from Roadmap example! Edit and click "Run Solution" to experiment, or switch back to the roadmap anytime.');
  };

  // 2. Docker Track
  const [dockerStep, setDockerStep] = useState(1);
  const [dockerInput, setDockerInput] = useState('');
  const [dockerOutput, setDockerOutput] = useState('');
  const [dockerStatus, setDockerStatus] = useState('stopped'); // stopped, running, error
  const [dockerLogsActive, setDockerLogsActive] = useState(false);

  // 3. Kafka Track
  const [kafkaStep, setKafkaStep] = useState(1);
  const [kafkaInput, setKafkaInput] = useState('');
  const [kafkaOutput, setKafkaOutput] = useState('');
  const [kafkaActiveNodes, setKafkaActiveNodes] = useState({ producer: false, broker: false, consumer: false });

  // 4. Airflow Track
  const [airflowStep, setAirflowStep] = useState(1);
  const [airflowInput, setAirflowInput] = useState('');
  const [airflowOutput, setAirflowOutput] = useState('');
  const [airflowDagState, setAirflowDagState] = useState({
    extract: 'idle', // idle, running, success, failed
    clean: 'idle',
    load: 'idle'
  });

  // Initialize SQL Datasets in alasql
  useEffect(() => {
    try {
      alasql('CREATE TABLE IF NOT EXISTS employees');
      alasql('CREATE TABLE IF NOT EXISTS departments');
      alasql('CREATE TABLE IF NOT EXISTS projects');
      
      alasql.tables.employees.data = JSON.parse(JSON.stringify(sqlDatasets.employees));
      alasql.tables.departments.data = JSON.parse(JSON.stringify(sqlDatasets.departments));
      alasql.tables.projects.data = JSON.parse(JSON.stringify(sqlDatasets.projects));
      
      updateSqlLiveTables();
    } catch (err) {
      console.error('Alasql init error:', err);
    }
  }, []);

  // Load Initial Data when session status changes
  useEffect(() => {
    fetchProgress();
    fetchErrorLogs();
    fetchRevisions();
  }, [session]);

  // Increment learning time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      incrementStudyTime(1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // API Call: Fetch Progress
  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/progress');
      const json = await res.json();
      if (json.data) {
        setStats(json.data);
        setIsOffline(json.isMock);
      }
    } catch (e) {
      console.warn('API error, using offline stats:', e);
      setIsOffline(true);
    }
  };

  // API Call: Fetch Error Logs
  const fetchErrorLogs = async () => {
    try {
      const res = await fetch('/api/errors');
      const json = await res.json();
      if (json.data) {
        setErrorLogs(json.data);
      }
    } catch (e) {
      console.warn('API error, fetching errors failed:', e);
    }
  };

  // API Call: Fetch Revisions (Notes)
  const fetchRevisions = async () => {
    try {
      const res = await fetch('/api/revisions');
      const json = await res.json();
      if (json.data) {
        setRevisions(json.data);
      }
    } catch (e) {
      console.warn('API error, fetching notes failed:', e);
    }
  };

  // API Call: Increment XP and Level-up handle
  const addXP = async (amount, challengeId = null) => {
    if (challengeId && stats.completedChallenges.includes(challengeId)) {
      // Already completed challenge, don't double award
      return;
    }

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xpToAdd: amount,
          completedChallengeId: challengeId
        })
      });
      const json = await res.json();
      if (json.data) {
        setStats(json.data);
      }
    } catch (e) {
      // Manual offline fallback calculation
      setStats(prev => {
        const nextXp = prev.xp + amount;
        const nextLevel = Math.floor(nextXp / 500) + 1;
        const completed = [...prev.completedChallenges];
        if (challengeId && !completed.includes(challengeId)) {
          completed.push(challengeId);
        }
        return {
          ...prev,
          xp: nextXp,
          level: nextLevel,
          completedChallenges: completed
        };
      });
    }
  };

  // API Call: Increment Study Time
  const incrementStudyTime = async (minutes) => {
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeTimeToAdd: minutes })
      });
      const json = await res.json();
      if (json.data) {
        setStats(json.data);
      }
    } catch (e) {
      setStats(prev => ({ ...prev, activeTime: prev.activeTime + minutes }));
    }
  };

  // API Call: Error Log CRUD
  const handleCreateError = async (e) => {
    e.preventDefault();
    if (!newError.title || !newError.logContent || !newError.solution) return;

    setSyncing(true);
    try {
      const res = await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newError)
      });
      const json = await res.json();
      if (json.data) {
        setErrorLogs(prev => [json.data, ...prev]);
        setNewError({ title: '', logContent: '', solution: '', tag: 'Docker', status: 'Pending' });
        addXP(50); // XP for documenting a bug
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleErrorStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Solved' ? 'Pending' : 'Solved';
    setSyncing(true);
    try {
      const res = await fetch('/api/errors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });
      const json = await res.json();
      if (json.data) {
        setErrorLogs(prev => prev.map(item => item._id === id ? { ...item, status: nextStatus } : item));
        if (nextStatus === 'Solved') addXP(75);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteError = async (id) => {
    setSyncing(true);
    try {
      await fetch(`/api/errors?id=${id}`, { method: 'DELETE' });
      setErrorLogs(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  // API Call: Saved Notes CRUD
  const handleSaveRevision = async (title, question, answer, category) => {
    setSyncing(true);
    try {
      const res = await fetch('/api/revisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, question, answer, category })
      });
      const json = await res.json();
      if (json.data) {
        setRevisions(prev => [json.data, ...prev]);
        addXP(30);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateCustomNote = async (e) => {
    e.preventDefault();
    if (!newCustomNote.title || !newCustomNote.answer) return;

    await handleSaveRevision(
      newCustomNote.title,
      'Custom Note Logged',
      newCustomNote.answer,
      newCustomNote.category
    );
    setNewCustomNote({ title: '', category: 'General', answer: '' });
  };

  const handleDeleteRevision = async (id) => {
    setSyncing(true);
    try {
      await fetch(`/api/revisions?id=${id}`, { method: 'DELETE' });
      setRevisions(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  // --- PLAYGROUND LOGIC VALIDATORS ---

  // 1. Data Analysis (NumPy/Pandas) Playground run
  const runPandasPlayground = () => {
    setPandasStatus('idle');
    const cleanCode = pandasCode.trim().replace(/\s+/g, ' ');

    if (dfChallengeStep === 1) {
      // Target: df.drop_duplicates() or df.drop_duplicates(inplace=True)
      if (cleanCode.includes('drop_duplicates')) {
        setPandasStatus('success');
        setPandasOutput('Success: Duplicate row removed successfully!\nOutput:\n   id     name   age      city   salary\n0   1    Alice  25.0  New York  70000.0\n1   2      Bob   NaN   Chicago  80000.0\n2   3  Charlie  35.0  New York      NaN\n3   4    David  40.0       NaN  95000.0');
        setPandasData([
          { id: 1, name: 'Alice', age: 25, city: 'New York', salary: 70000 },
          { id: 2, name: 'Bob', age: null, city: 'Chicago', salary: 80000 },
          { id: 3, name: 'Charlie', age: 35, city: 'New York', salary: null },
          { id: 4, name: 'David', age: 40, city: null, salary: 95000 }
        ]);
        addXP(150, 'pandas-challenge-1');
      } else {
        setPandasStatus('error');
        setPandasOutput('SyntaxError: Please use the drop_duplicates() method on your DataFrame (df).');
      }
    } else if (dfChallengeStep === 2) {
      // Target: df['Age'].fillna(df['Age'].mean()) or similar
      if (cleanCode.includes('fillna') && (cleanCode.includes('mean') || cleanCode.includes('30') || cleanCode.includes('33'))) {
        setPandasStatus('success');
        setPandasOutput('Success: Missing ages imputed with the average age (33.33)!\nOutput:\n   id     name        age      city   salary\n0   1    Alice  25.000000  New York  70000.0\n1   2      Bob  33.333333   Chicago  80000.0\n2   3  Charlie  35.000000  New York      NaN\n3   4    David  40.000000       NaN  95000.0');
        setPandasData([
          { id: 1, name: 'Alice', age: 25, city: 'New York', salary: 70000 },
          { id: 2, name: 'Bob', age: 33.33, city: 'Chicago', salary: 80000 },
          { id: 3, name: 'Charlie', age: 35, city: 'New York', salary: null },
          { id: 4, name: 'David', age: 40, city: null, salary: 95000 }
        ]);
        addXP(150, 'pandas-challenge-2');
      } else {
        setPandasStatus('error');
        setPandasOutput('SyntaxError: Imputation logic missing. Make sure to use fillna() combined with df["age"].mean() or standard numeric means.');
      }
    } else if (dfChallengeStep === 3) {
      // Target: df[df['salary'] > 75000]
      if (cleanCode.includes('salary') && cleanCode.includes('>') && cleanCode.includes('75000')) {
        setPandasStatus('success');
        setPandasOutput('Success: Salary filter matched! Retrieved high earners.\nOutput:\n   id   name   age     city   salary\n1   2    Bob  33.3  Chicago  80000.0\n3   4  David  40.0      NaN  95000.0');
        setPandasData([
          { id: 2, name: 'Bob', age: 33.33, city: 'Chicago', salary: 80000 },
          { id: 4, name: 'David', age: 40, city: null, salary: 95000 }
        ]);
        addXP(150, 'pandas-challenge-3');
      } else {
        setPandasStatus('error');
        setPandasOutput('SyntaxError: Filter condition incorrect. Implement slicing format: df[df["salary"] > 75000]');
      }
    }
  };

  const resetPandasData = () => {
    setPandasCode('');
    setPandasOutput('');
    setPandasStatus('idle');
    setPandasData([
      { id: 1, name: 'Alice', age: 25, city: 'New York', salary: 70000 },
      { id: 2, name: 'Bob', age: null, city: 'Chicago', salary: 80000 },
      { id: 3, name: 'Charlie', age: 35, city: 'New York', salary: null },
      { id: 4, name: 'David', age: 40, city: null, salary: 95000 },
      { id: 5, name: 'Alice', age: 25, city: 'New York', salary: 70000 }
    ]);
  };

  // 2. Docker Track Playground run
  const runDockerPlayground = () => {
    const cmd = dockerInput.trim();
    if (dockerStep === 1) {
      if (cmd === 'docker-compose up -d') {
        setDockerStatus('running');
        setDockerOutput('Creating network "learn_default" with the default driver\nCreating volume "learn_ollama_data" with default driver\nPulling ollama (ollama/ollama:latest)...\nContainer learning_platform_ollama  Creating\nContainer learning_platform_ollama  Started\nOllama is running on port http://localhost:11434 with CORS origins active!');
        addXP(100, 'docker-challenge-1');
        setDockerStep(2);
        setDockerInput('');
      } else {
        setDockerOutput(`bash: command not found: "${cmd}". Recheck spelling: "docker-compose up -d"`);
      }
    } else if (dockerStep === 2) {
      if (cmd === 'docker logs learning_platform_ollama') {
        setDockerLogsActive(true);
        setDockerOutput('2026-05-26T18:43:01Z [info] Ollama server is running\n2026-05-26T18:43:01Z [info] listening on 0.0.0.0:11434\n2026-05-26T18:43:02Z [info] OLLAMA_ORIGINS=* configured (CORS enabled)\n2026-05-26T18:43:02Z [info] dynamic GPU compilation enabled.');
        addXP(100, 'docker-challenge-2');
        setDockerStep(3);
        setDockerInput('');
      } else {
        setDockerOutput(`bash: command not found: "${cmd}". Standard logging: "docker logs learning_platform_ollama"`);
      }
    }
  };

  // 3. Kafka Track Playground run
  const runKafkaPlayground = () => {
    const cmd = kafkaInput.trim();
    if (kafkaStep === 1) {
      if (cmd.includes('kafka-topics.sh') && cmd.includes('--create') && cmd.includes('interview-prep')) {
        setKafkaActiveNodes(prev => ({ ...prev, broker: true }));
        setKafkaOutput('Created topic interview-prep.\nTopic details:\n  Topic: interview-prep\tPartitionCount: 3\tReplicationFactor: 1\tConfigs: segment.bytes=1073741824');
        addXP(100, 'kafka-challenge-1');
        setKafkaStep(2);
        setKafkaInput('');
      } else {
        setKafkaOutput(`Error: Syntax error or missing mandatory keys in command. Enter:\nkafka-topics.sh --create --topic interview-prep --bootstrap-server localhost:9092`);
      }
    } else if (kafkaStep === 2) {
      if (cmd.includes('kafka-console-producer.sh') && cmd.includes('interview-prep')) {
        setKafkaActiveNodes(prev => ({ ...prev, producer: true }));
        setKafkaOutput('Kafka Producer started successfully. Interactive prompt ready for message stream.\n> Input messages now connected to broker cluster.');
        addXP(100, 'kafka-challenge-2');
        setKafkaStep(3);
        setKafkaInput('');
      } else {
        setKafkaOutput(`Error: Command should invoke producer streaming tool:\nkafka-console-producer.sh --topic interview-prep --bootstrap-server localhost:9092`);
      }
    } else if (kafkaStep === 3) {
      if (cmd.includes('kafka-console-consumer.sh') && cmd.includes('interview-prep') && cmd.includes('--from-beginning')) {
        setKafkaActiveNodes({ producer: true, broker: true, consumer: true });
        setKafkaOutput('Kafka Consumer running and streaming topic messages:\n[Partition 0]: Processing cloud architecture queries\n[Partition 1]: Stream pipeline initialized\nConsumer active. End-to-end Kafka cluster pipeline verified!');
        addXP(150, 'kafka-challenge-3');
        setKafkaInput('');
      } else {
        setKafkaOutput(`Error: Command should invoke consumer streaming tool from start:\nkafka-console-consumer.sh --topic interview-prep --from-beginning --bootstrap-server localhost:9092`);
      }
    }
  };

  // 4. Airflow Track Playground run
  const runAirflowPlayground = () => {
    const cmd = airflowInput.trim();
    if (airflowStep === 1) {
      if (cmd === 'airflow dags list') {
        setAirflowOutput('dag_id                                   | filepath               | owner   | paused\n-----------------------------------------+------------------------+---------+-------\ndata_cleaning_pipeline                   | dags/etl_dag.py        | airflow | True  \ncloud_ingestion_stream                   | dags/stream.py         | airflow | True');
        addXP(100, 'airflow-challenge-1');
        setAirflowStep(2);
        setAirflowInput('');
      } else {
        setAirflowOutput(`bash: command error. Use standard DAG list checker: "airflow dags list"`);
      }
    } else if (airflowStep === 2) {
      if (cmd === 'airflow dags trigger data_cleaning_pipeline') {
        setAirflowOutput('Created <DagRun data_cleaning_pipeline @ 2026-05-26T18:44:00Z: manual__2026-05-26T18:44:00Z, externally triggered: True>');

        // Animate task runs
        setAirflowDagState({ extract: 'running', clean: 'idle', load: 'idle' });
        setTimeout(() => {
          setAirflowDagState({ extract: 'success', clean: 'running', load: 'idle' });
          setTimeout(() => {
            setAirflowDagState({ extract: 'success', clean: 'success', load: 'running' });
            setTimeout(() => {
              setAirflowDagState({ extract: 'success', clean: 'success', load: 'success' });
              addXP(150, 'airflow-challenge-2');
            }, 1000);
          }, 1000);
        }, 1000);

        setAirflowInput('');
      } else {
        setAirflowOutput(`bash: command incorrect. Trigger your cleaning pipeline DAG via:\n"airflow dags trigger data_cleaning_pipeline"`);
      }
    }
  };

  // --- SQL ACADEMY LOGIC ---
  const runSqlSandbox = () => {
    try {
      setSqlError('');
      const res = alasql(sqlQuery);
      setSqlResult(Array.isArray(res) ? res : [res]);
      updateSqlLiveTables();
    } catch (err) {
      setSqlError(err.message);
      setSqlResult([]);
    }
  };

  const runSqlExercise = () => {
    try {
      setSqlExerciseError('');
      setSqlExerciseStatus('running');
      setTimeout(() => {
        try {
          const res = alasql(sqlExerciseCode);
          setSqlExerciseResult(Array.isArray(res) ? res : [res]);
          setSqlExerciseStatus('success');
          updateSqlLiveTables();
          
          // Verify
          const activeChallenge = sqlChallenges.find(c => c.id === sqlSelectedChallenge);
          if (activeChallenge) {
             const expectedRes = alasql(activeChallenge.expectedQuery);
             if (JSON.stringify(res) === JSON.stringify(expectedRes)) {
                addXP(50, `sql-challenge-${activeChallenge.id}`);
             } else {
                setSqlExerciseError('Query ran successfully, but results did not match the expected output.');
                setSqlExerciseStatus('error');
             }
          }
        } catch(innerErr) {
          setSqlExerciseError(innerErr.message);
          setSqlExerciseStatus('error');
        }
      }, 600);
    } catch (err) {
      setSqlExerciseError(err.message);
      setSqlExerciseStatus('error');
    }
  };

  // --- GROK (xAI) AI COACH LOGIC ---

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    setAiLoading(true);

    try {
      // Call Grok (xAI) API — OpenAI-compatible endpoint
      const systemPrompt = `You are a LangChain Sequence Manager Assistant. You must ALWAYS format your responses in strict Markdown using exactly the following five sections:

### 1. Explanation
[Provide a clear, high-level structural explanation of the topic here]

### 2. How It's Working
[Detail the exact step-by-step internal execution or distributed mechanics here]

### 3. Example Code
[Provide a premium, production-ready python/pyspark/sql code block here. If not applicable, write "Not Applicable"]

### 4. Most Related Questions
[List 3 highly relevant interview questions or scenario concepts related to this query]

### 5. Fun Fact
[Add an interesting, non-obvious engineering trivia or historical fact about this technology]

Always output this exact structure. Do not skip any section.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userMessage,
          systemPrompt,
          customApiKey: googleStudioApiKey
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Server error: ' + response.status);
      }

      const data = await response.json();
      const aiText = data.content;
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
      addXP(40);
    } catch (err) {
      console.error('Groq AI API error:', err);

      let errorDetail = err.message || 'Unknown error';
      let fixHint = '';

      if (errorDetail.includes('401') || errorDetail.includes('403')) {
        fixHint = '🔑 **API Key issue** — Go to the **Settings** tab and paste a valid Groq API key or define `llm_api` in your `.env` file. Get one at [console.groq.com](https://console.groq.com).';
      } else if (errorDetail.includes('429')) {
        fixHint = '⏳ **Rate limit reached** — You have hit the Groq quota. Wait a moment or check your Groq limits.';
      } else if (errorDetail.includes('Failed to fetch') || errorDetail.includes('NetworkError')) {
        fixHint = '🌐 **Network error** — Check your internet connection and try again.';
      } else {
        fixHint = '⚙️ Go to the **Settings** tab and verify your **Groq API Key** (`llm_api` in .env) is correct.';
      }

      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: `❌ **Groq AI Error**\n\n\`\`\`\n${errorDetail}\n\`\`\`\n\n${fixHint}\n\nTo get a Groq key:\n1. Visit [console.groq.com](https://console.groq.com)\n2. Create an API key\n3. Paste it in **Settings → Groq API Key** field`
      }]);
      addXP(0);
    } finally {
      setAiLoading(false);
    }
  };

  // Export Notes (Revisions) as Markdown
  const exportNotesToMarkdown = () => {
    let md = `# My Data Engineering & Cloud Interview Prep Notes\n\n`;
    revisions.forEach((rev, idx) => {
      md += `## ${idx + 1}. ${rev.title}\n`;
      md += `* **Category**: ${rev.category}\n`;
      md += `* **Date**: ${new Date(rev.createdAt).toLocaleDateString()}\n\n`;
      if (rev.question && rev.question !== 'Custom Note Logged') {
        md += `### Interview Question/Context:\n> ${rev.question}\n\n`;
      }
      md += `### Explanation / Solution Details:\n${rev.answer}\n\n`;
      md += `--- \n\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([md], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = "data_engineering_notes.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      {mobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="logo-container">
          <div className="logo-icon">DE</div>
          <span className="logo-text">DE learning</span>
        </div>

        {status === 'authenticated' && session?.user ? (
          <div className="user-profile-card" style={{ padding: '16px 20px', borderBottom: '1px solid hsl(var(--border))', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid hsl(var(--primary))' }}
                />
              ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'hsl(var(--primary))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                  {session.user.name ? session.user.name[0].toUpperCase() : 'U'}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'hsl(var(--text))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {session.user.name}
                </span>
                <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {session.user.email}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award className="stat-icon" style={{ width: '13px', height: '13px', color: 'hsl(var(--primary))' }} />
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'hsl(var(--text))' }}>Lv {stats.level}</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-muted))' }}>• {stats.xp} XP</span>
              </div>
              <button
                onClick={() => signOut()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'hsl(var(--secondary))',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="user-profile-card" style={{ padding: '16px 20px', borderBottom: '1px solid hsl(var(--border))', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'hsla(var(--border), 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--text-muted))' }}>
                <Layers style={{ width: '18px', height: '18px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'hsl(var(--text))' }}>Guest Account</span>
                <span style={{ fontSize: '10.5px', color: 'hsl(var(--text-muted))' }}>Progress isn't saved to cloud</span>
              </div>
            </div>
            <button
              onClick={() => signIn('google')}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '8px',
                fontWeight: '600',
                background: 'hsl(var(--primary))',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.386-2.87-6.386-6.39s2.87-6.39 6.386-6.39c1.63 0 3.126.617 4.27 1.73l3.076-3.075C19.347 2.683 15.93 1.5 12.24 1.5c-5.79 0-10.5 4.71-10.5 10.5s4.71 10.5 10.5 10.5c5.789 0 10.428-4.22 10.428-10.5 0-.662-.08-1.294-.228-1.895l-10.2 1.08z" />
              </svg>
              Sign In with Google
            </button>
          </div>
        )}

        <nav className="nav-menu">
          <div className="nav-section-title">Core Overview</div>
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigate('dashboard')}
          >
            <Layers className="nav-item-icon" /> Dashboard
          </button>

          <div className="nav-section-title">Programming Tracks</div>
          <button
            className={`nav-item ${activeTab === 'python' ? 'active' : ''}`}
            onClick={() => handleNavigate('python')}
          >
            <BookOpen className="nav-item-icon" /> Python Core
          </button>
          <button
            className={`nav-item ${activeTab === 'pandas' ? 'active' : ''}`}
            onClick={() => handleNavigate('pandas')}
          >
            <Database className="nav-item-icon" /> Pandas Playground
          </button>
          <button
            className={`nav-item ${activeTab === 'sql' ? 'active' : ''}`}
            onClick={() => handleNavigate('sql')}
          >
            <Database className="nav-item-icon" style={{ color: 'hsl(142 70% 50%)' }} /> SQL Academy
          </button>
          <button
            className={`nav-item ${activeTab === 'pyspark' ? 'active' : ''}`}
            onClick={() => handleNavigate('pyspark')}
          >
            <Sparkles className="nav-item-icon" /> PySpark Core
          </button>

          <div className="nav-section-title">Data Infrastructure</div>
          <button
            className={`nav-item ${activeTab === 'databricks' ? 'active' : ''}`}
            onClick={() => handleNavigate('databricks')}
          >
            <Cpu className="nav-item-icon" /> Databricks Academy
          </button>
          <button
            className={`nav-item ${activeTab === 'docker' ? 'active' : ''}`}
            onClick={() => handleNavigate('docker')}
          >
            <Terminal className="nav-item-icon" /> Docker Track
          </button>
          <button
            className={`nav-item ${activeTab === 'kafka' ? 'active' : ''}`}
            onClick={() => handleNavigate('kafka')}
          >
            <Cpu className="nav-item-icon" /> Kafka Ingestion
          </button>
          <button
            className={`nav-item ${activeTab === 'airflow' ? 'active' : ''}`}
            onClick={() => handleNavigate('airflow')}
          >
            <RefreshCw className="nav-item-icon" /> Airflow Pipelines
          </button>

          <div className="nav-section-title">Developer Workspace</div>
          <button
            className={`nav-item ${activeTab === 'errors' ? 'active' : ''}`}
            onClick={() => handleNavigate('errors')}
          >
            <AlertTriangle className="nav-item-icon" /> Error Logger
          </button>
          <button
            className={`nav-item ${activeTab === 'revisions' ? 'active' : ''}`}
            onClick={() => handleNavigate('revisions')}
          >
            <FileText className="nav-item-icon" /> My Notes
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavigate('settings')}
          >
            <SettingsIcon className="nav-item-icon" /> Configurations
          </button>
        </nav>

        <div className="sidebar-footer">
          {isOffline ? (
            <div className="offline-banner">
              <AlertTriangle className="stat-icon" /> Running Offline Mode
            </div>
          ) : (
            <div className="offline-banner" style={{ color: '#10b981', background: '#10b98115', borderColor: '#10b98130' }}>
              <CheckCircle className="stat-icon" /> Cloud Database Connected
            </div>
          )}
          <span style={{ fontSize: '11px', color: 'hsl(var(--text-dark))', paddingLeft: '8px' }}>
            Local Time: 18:45
          </span>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="main-content">
        {/* Header with Stats */}
        <header className="header">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-menu-toggle-btn"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'hsl(var(--text))',
              marginRight: '12px',
              padding: '6px',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Menu style={{ width: '22px', height: '22px' }} />
          </button>

          <div className="page-title-section" style={{ flexGrow: 1 }}>
            <h1>
              {activeTab === 'dashboard' && 'Developer & Cloud Architecture Hub'}
              {activeTab === 'python' && 'Python Core & File Systems Academy'}
              {activeTab === 'pandas' && 'Interactive Data Wrangling Engine'}
              {activeTab === 'databricks' && 'Databricks Cloud & PySpark Academy'}
              {activeTab === 'pyspark' && 'PySpark Core & Distributed Systems Academy'}
              {activeTab === 'docker' && 'Docker Container Orchestrator'}
              {activeTab === 'kafka' && 'High-Throughput Kafka Streamer'}
              {activeTab === 'airflow' && 'Directed Acyclic Graph Orchestration'}
              {activeTab === 'errors' && 'Atlas Error Logger & Debugger'}
              {activeTab === 'revisions' && 'My Notes & Saved AI Revisions'}
              {activeTab === 'settings' && 'Platform Settings'}
            </h1>
            <p>
              {activeTab === 'dashboard' && 'Gamified curriculum to master big data, ETL engines, and cloud setups.'}
              {activeTab === 'python' && 'Master core python algorithms, object variables, and high-value filesystem pipelines.'}
              {activeTab === 'pandas' && 'Write pandas logic to clean, merge, and transform raw dirty data.'}
              {activeTab === 'databricks' && 'Master PySpark pipelines, Medallion lakes, and Unity Catalog governance.'}
              {activeTab === 'pyspark' && 'Master distributed computing datasets, salting joins, watermarks, and high-performance Catalyst plans.'}
              {activeTab === 'docker' && 'Master docker configurations, network bridges, and volumes.'}
              {activeTab === 'kafka' && 'Create partitioned topic queues and verify end-to-end processing.'}
              {activeTab === 'airflow' && 'Orchestrate tasks pipelines, monitor DAG runs, and load S3 targets.'}
              {activeTab === 'errors' && 'Document production bugs with cloud architectures solutions.'}
              {activeTab === 'revisions' && 'Browse, edit, search, and export your interview preparation files.'}
              {activeTab === 'settings' && 'Configure custom Ollama ports, model names, and connection strings.'}
            </p>
          </div>

          <div className="gamification-stats">
            <div className="stat-pill level-pill">
              <Award className="stat-icon" />
              <span>Level {stats.level}</span>
            </div>

            <div className="stat-pill xp-pill" title="500 XP to Level Up!">
              <Sparkles className="stat-icon" />
              <div className="flex-column d-flex">
                <span>{stats.xp} XP</span>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${(stats.xp % 500) / 5}%` }}></div>
                </div>
              </div>
            </div>

            <div className="stat-pill streak-pill">
              <Flame className="stat-icon" />
              <span>{stats.streak} Day Streak</span>
            </div>

            <div className="stat-pill" style={{ borderColor: 'hsl(var(--border))' }}>
              <Clock className="stat-icon" style={{ color: 'hsl(var(--secondary))' }} />
              <span>{stats.activeTime} Mins</span>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="content-grid">
          {/* TAB 1: DASHBOARD LANDING */}
          {activeTab === 'dashboard' && (
            <>
              <div className="card dashboard-hero">
                <div>
                  <h2>Master Data Engineering & Secure Pipelines</h2>
                  <p style={{ marginTop: '8px' }}>
                    Welcome back! You are preparing to run enterprise data architectures. Your AI Coach is now powered by <strong>Grok (xAI)</strong> — study advanced topics like AWS EMR, Snowflake scaling, and Databricks clusters. Complete challenges below to raise your levels!
                  </p>
                  {/* ✅ CHANGE VERIFICATION BANNER */}
                  <div style={{
                    marginTop: '14px',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    background: 'linear-gradient(90deg, hsl(142 70% 18%), hsl(210 80% 20%))',
                    border: '1px solid hsl(142 60% 35%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    color: 'hsl(142 80% 75%)'
                  }}>
                    <span style={{ fontSize: '18px' }}>✅</span>
                    <div>
                      <strong style={{ color: 'hsl(142 80% 85%)' }}>LLM Updated — Grok AI (xAI) Active</strong>
                      <div style={{ fontSize: '11.5px', color: 'hsl(142 60% 65%)', marginTop: '2px' }}>
                        Model: <code style={{ background: 'hsl(142 40% 12%)', padding: '1px 6px', borderRadius: '4px' }}>grok-3-mini</code>
                        &nbsp;·&nbsp; Using <code style={{ background: 'hsl(210 40% 12%)', padding: '1px 6px', borderRadius: '4px' }}>llm_api</code> key
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hero-stats-row">
                  <div className="hero-stat-card accent-purple">
                    <span className="hero-stat-label">Total Challenges Done</span>
                    <span className="hero-stat-value">{stats.completedChallenges.length} / 10</span>
                  </div>
                  <div className="hero-stat-card accent-cyan">
                    <span className="hero-stat-label">Saved Revision Sheets</span>
                    <span className="hero-stat-value">{revisions.length} Notes</span>
                  </div>
                  <div className="hero-stat-card accent-gold">
                    <span className="hero-stat-label">Logged System Bugs</span>
                    <span className="hero-stat-value">{errorLogs.length} Bugs</span>
                  </div>
                </div>
              </div>

              {/* Ollama Chat & Glossary split */}
              <div className="card" style={{ gridColumn: 'span 12' }}>
                <div className="ai-coach-grid">
                  <div className="flex-column d-flex gap-12">
                    <div className="card-title-container" style={{ marginBottom: '12px' }}>
                      <div className="card-header-with-icon">
                        <Sparkles className="card-header-icon" style={{ color: 'hsl(var(--primary))' }} />
                        <div>
                          <h2>⚡ Grok-3-mini AI Coach</h2>
                          <p className="card-subtitle">Powered by xAI API</p>
                        </div>
                      </div>
                      <span className="badge-outline" style={{ color: 'hsl(142 70% 60%)', borderColor: 'hsl(142 50% 40%)' }}>xAI API Active</span>
                    </div>

                    <div className="chat-box">
                      <div className="chat-header">
                        <div className="d-flex align-items-center gap-8">
                          <div className="editor-dot" style={{ background: '#27c93f', width: '8px', height: '8px' }}></div>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: 'hsl(var(--text))' }}>
                            Grok-3-mini
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'hsl(var(--text-dark))' }}>api.x.ai/v1/chat/completions</span>
                      </div>

                      <div className="chat-history">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className={`chat-message ${msg.sender}`}>
                            <div className="markdown-body" style={{ fontSize: '12.5px', lineHeight: '1.4' }}>
                              {renderMarkdown(msg.text)}
                            </div>
                            {msg.sender === 'ai' && i > 0 && (
                              <button
                                className="btn btn-secondary"
                                style={{ marginTop: '12px', padding: '4px 10px', fontSize: '11px' }}
                                onClick={() => handleSaveRevision(
                                  `AI Coach: ${chatMessages[i - 1].text.substring(0, 30)}...`,
                                  chatMessages[i - 1].text,
                                  msg.text,
                                  'AI Revision'
                                )}
                              >
                                <Plus className="stat-icon" /> Save to My Notes
                              </button>
                            )}
                          </div>
                        ))}
                        {aiLoading && (
                          <div className="chat-message ai d-flex gap-8 align-items-center">
                            <RefreshCw className="stat-icon spin" style={{ animation: 'spin 1.5s linear infinite' }} />
                            <span>Thinking, querying Groq AI (LLaMA) API...</span>
                          </div>
                        )}
                      </div>

                      <form onSubmit={handleSendChatMessage} className="chat-input-row">
                        <input
                          type="text"
                          className="chat-input"
                          placeholder="Ask about Snowflake COPY INTO, EMR Security configurations, or Spark partitions..."
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '10px 14px' }}>
                          <Send className="stat-icon" />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* High Value Structured Definitions & Interview Prep Scenarios */}
                  <div className="flex-column d-flex gap-12" style={{ maxHeight: '560px' }}>
                    <div className="card-title-container" style={{ marginBottom: '12px' }}>
                      <div className="card-header-with-icon">
                        <BookOpen className="card-header-icon" style={{ color: 'hsl(var(--secondary))' }} />
                        <div>
                          <h2>Fundamentals & Cloud Scenarios</h2>
                          <p className="card-subtitle">Real-world interview scenario-based preps</p>
                        </div>
                      </div>
                    </div>

                    {/* Search & Category filter */}
                    <div className="d-flex gap-8 align-items-center" style={{ marginBottom: '8px' }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Search style={{ position: 'absolute', left: '10px', width: '14px', height: '14px', color: 'hsl(var(--text-dark))' }} />
                        <input
                          type="text"
                          className="form-input w-full"
                          style={{ paddingLeft: '32px', paddingTop: '6px', paddingBottom: '6px', borderRadius: '6px', fontSize: '12px', background: '#050508' }}
                          placeholder="Search scenarios (e.g. OOM, PII, slow...)"
                          value={scenarioSearch}
                          onChange={e => setScenarioSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="d-flex gap-4 flex-wrap" style={{ gap: '4px', marginBottom: '8px' }}>
                      {['All', 'Architecture', 'Debugging', 'Optimization', 'Security', 'Quality', 'Career'].map(cat => (
                        <button
                          key={cat}
                          className={`btn ${scenarioFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '2px 8px', fontSize: '11px', borderRadius: '4px' }}
                          onClick={() => setScenarioFilter(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Expandable Scenario list */}
                    <div className="flex-column d-flex gap-8" style={{ overflowY: 'auto', paddingRight: '4px', flexGrow: 1 }}>
                      {interviewScenarios
                        .filter(item => scenarioFilter === 'All' || item.category === scenarioFilter)
                        .filter(item =>
                          item.title.toLowerCase().includes(scenarioSearch.toLowerCase()) ||
                          item.answer.toLowerCase().includes(scenarioSearch.toLowerCase())
                        )
                        .map((scen) => {
                          const isExpanded = expandedScenario === scen.id;
                          return (
                            <div
                              key={scen.id}
                              className="instruction-step"
                              style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                borderColor: isExpanded ? 'hsl(var(--secondary) / 0.4)' : 'hsl(var(--border))',
                                background: isExpanded ? 'hsla(var(--card), 0.4)' : 'hsla(var(--background), 0.4)'
                              }}
                              onClick={() => setExpandedScenario(isExpanded ? null : scen.id)}
                            >
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-8">
                                  <span className="tag-pill" style={{ fontSize: '11px', padding: '2px 8px' }}>{scen.category}</span>
                                  <h3 style={{ color: 'hsl(var(--text))', fontSize: '15px', fontWeight: '600', margin: 0 }}>{scen.title}</h3>
                                </div>
                                <span style={{ fontSize: '14px', color: 'hsl(var(--text-dark))' }}>{isExpanded ? '▼' : '▶'}</span>
                              </div>

                              {isExpanded && (
                                <div style={{ marginTop: '12px', borderTop: '1px solid hsl(var(--border))', paddingTop: '10px' }} onClick={e => e.stopPropagation()}>
                                  <div className="markdown-body" style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', lineHeight: '1.5' }}>
                                    {renderMarkdown(scen.answer)}
                                  </div>
                                  <button
                                    className="btn btn-secondary"
                                    style={{ marginTop: '12px', padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    onClick={() => handleSaveScenarioToNotes(scen.title, scen.answer)}
                                  >
                                    <Plus className="stat-icon" style={{ width: '13px', height: '13px' }} /> Save Scenario to Notes
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: PYTHON CORE ACADEMY */}
          {activeTab === 'python' && (
            <div className="card" style={{ gridColumn: 'span 12' }}>
              {/* Sub Navigation Tabs */}
              <div className="d-flex gap-12" style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                  className={`btn ${pythonSubTab === 'fundamentals' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => {
                    setPythonSubTab('fundamentals');
                    setPythonSearchQuery('');
                  }}
                >
                  <HelpCircle className="stat-icon" /> Fundamentals Concept Explorer
                </button>
                <button
                  className={`btn ${pythonSubTab === 'coding' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => {
                    setPythonSubTab('coding');
                    setPythonSearchQuery('');
                  }}
                >
                  <Award className="stat-icon" /> Python Exercises & Solutions
                </button>
                <button
                  className={`btn ${pythonSubTab === 'compiler' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => {
                    setPythonSubTab('compiler');
                    setPythonSearchQuery('');
                  }}
                >
                  <Terminal className="stat-icon" /> Python Runtime Compiler Simulator
                </button>
                <button
                  className={`btn ${pythonSubTab === 'notes' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => {
                    setPythonSubTab('notes');
                    setPythonSearchQuery('');
                  }}
                >
                  📝 My Notes
                </button>
              </div>

              {/* SUBTAB 1: FUNDAMENTALS */}
              {pythonSubTab === 'fundamentals' && (
                <div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                      <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))', width: '16px', height: '16px' }} />
                      <input
                        type="text"
                        placeholder="Search 41 interview questions..."
                        value={pythonSearchQuery}
                        onChange={e => setPythonSearchQuery(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '38px', width: '100%', background: '#ffffff', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '10px 10px 10px 38px', color: 'hsl(var(--text))', fontSize: '13px' }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['All', 'Basics', 'Imports & cache', 'Scoping & Variables', 'Operations & Data Types', 'Decorators & Generators', 'Advanced & Engine'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setPythonCategoryFilter(cat)}
                          className={`btn ${pythonCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '20px' }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pythonConcepts
                      .filter(concept => {
                        const matchesCategory = pythonCategoryFilter === 'All' || concept.category === pythonCategoryFilter;
                        const matchesSearch = concept.question.toLowerCase().includes(pythonSearchQuery.toLowerCase()) || 
                                              concept.answer.toLowerCase().includes(pythonSearchQuery.toLowerCase());
                        return matchesCategory && matchesSearch;
                      })
                      .map(concept => {
                        const isExpanded = expandedPythonConcept === concept.id;
                        return (
                          <div
                            key={concept.id}
                            style={{
                              border: isExpanded ? '1px solid hsl(var(--primary) / 0.4)' : '1px solid hsl(var(--border))',
                              background: isExpanded ? 'hsla(var(--card), 0.5)' : 'hsla(var(--card), 0.2)',
                              borderRadius: '12px',
                              padding: '16px',
                              cursor: 'pointer',
                              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: isExpanded ? '0 0 15px hsla(var(--primary), 0.05)' : 'none'
                            }}
                            onClick={() => setExpandedPythonConcept(isExpanded ? null : concept.id)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  padding: '4px 10px',
                                  borderRadius: '10px',
                                  background: 'hsla(var(--secondary), 0.1)',
                                  color: 'hsl(var(--secondary))',
                                  border: '1px solid hsla(var(--secondary), 0.2)'
                                }}>
                                  {concept.category}
                                </span>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', color: isExpanded ? 'hsl(var(--primary))' : 'hsl(var(--text))', transition: 'color 0.2s' }}>
                                  {concept.question}
                                </h3>
                              </div>
                              <span style={{ fontSize: '14px', color: isExpanded ? 'hsl(var(--primary))' : 'hsl(var(--text-dark))', transition: 'color 0.2s' }}>
                                {isExpanded ? '▼' : '▶'}
                              </span>
                            </div>

                            {isExpanded && (
                              <div
                                style={{ marginTop: '12px', borderTop: '1px solid hsl(var(--border))', paddingTop: '12px' }}
                                onClick={e => e.stopPropagation()}
                              >
                                <p style={{ fontSize: '15px', color: 'hsl(var(--text-muted))', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                  {concept.answer}
                                </p>
                                <button
                                  className="btn btn-secondary"
                                  style={{ marginTop: '14px', padding: '8px 16px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px' }}
                                  onClick={() => handleSaveRevision(concept.question, concept.question, concept.answer, "Python Fundamentals")}
                                >
                                  <Plus className="stat-icon" style={{ width: '13px', height: '13px' }} /> Save to My Notes (+30 XP)
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* SUBTAB 2: CODING & PRACTICE WORKSPACE */}
              {pythonSubTab === 'coding' && (
                <div>
                  {selectedExerciseItem === null ? (
                    /* INDEX VIEW: TOPIC PRACTICE DIRECTORY */
                    <div>
                      {/* Premium Header */}
                      <div className="card-title-container" style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid hsl(var(--border))' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                          <div>
                            <h1 style={{ fontSize: '26px', fontWeight: '800', background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                              Python Exercise with Practice Questions and Solutions
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '13px', color: 'hsl(var(--text-muted))' }}>
                              <span style={{ fontWeight: '600', color: 'hsl(var(--warning))' }}>● Last Updated : 16 May, 2026</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Header Description notice */}
                      <div className="card" style={{ background: 'hsla(var(--primary), 0.03)', border: '1px solid hsl(var(--primary) / 0.15)', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
                        <p style={{ fontSize: '14.5px', fontWeight: '500', color: 'hsl(var(--text))', lineHeight: '1.6', marginBottom: '12px' }}>
                          Practice problems help improve programming and problem-solving skills through topic-wise coding questions and quizzes.
                        </p>
                        <p style={{ fontSize: '13.5px', color: 'hsl(var(--text-muted))', lineHeight: '1.6', margin: 0 }}>
                          Links below cover different topic pages containing coding problems and quizzes. Users need to log in first to start solving problems. The submitted code is tested against the expected output and points are awarded for successful submissions.
                          <br />
                          If a submission contains an error, a clear message is displayed indicating the type of error, such as a compiler error or output mismatch.
                          <br />
                          To learn by solved examples, refer to <span onClick={() => setPythonSubTab('fundamentals')} style={{ color: 'hsl(var(--primary))', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>Python Programs page</span>.
                        </p>
                      </div>

                      {/* Categories Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                        {[
                          { name: "Basic Problems", link: "Fundamentals Coding Problem" },
                          { name: "Conditional Statement and Loops Problems", link: "Conditional Statement and Loops Coding Problem" },
                          { name: "Functions Problems", link: "Functions Coding Problems" },
                          { name: "List Problems", link: "List Exercise" },
                          { name: "String Problems", link: "String Exercise" },
                          { name: "Dictionary Problems", link: "Dictionary Exercise" },
                          { name: "Set Problems", link: "Set Exercise" },
                          { name: "OOP Problems", link: "OOP Coding Problems" },
                          { name: "Heap Problems", link: "Heap Coding Problems" },
                          { name: "Deque Problems", link: "Deque Coding Problems" },
                          { name: "Python Quizzes", link: "Quiz Playground" }
                        ].map((cat, catIdx) => {
                          const items = pythonExercises.filter(ex => ex.category === cat.name);
                          return (
                            <div
                              key={catIdx}
                              className="card hover-card"
                              style={{
                                background: '#ffffff',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '16px',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                <div style={{ width: '8px', height: '16px', background: 'linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--secondary)))', borderRadius: '4px' }}></div>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'hsl(var(--text))', margin: 0 }}>
                                  {cat.name}
                                </h3>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minHeight: '120px' }}>
                                {items.map((item) => {
                                  const key = item.id;
                                  const savedNotes = globalNotebook["python_" + key];
                                  const hasNotes = Array.isArray(savedNotes) && savedNotes.some(p => p && ((p.paragraph && p.paragraph.trim() !== '') || p.image));
                                  
                                  return (
                                    <button
                                      key={item.id}
                                      onClick={() => {
                                        setSelectedExerciseItem(item);
                                        setExerciseCode(item.starterCode);
                                        setExerciseTerminalStatus('idle');
                                        setExerciseTerminalOutput('Sandbox initialized. Click "Run Code" to verify your program.');
                                        setShowExerciseSolution(false);
                                      }}
                                      style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '10px 14px',
                                        borderRadius: '8px',
                                        background: 'hsla(var(--secondary), 0.04)',
                                        border: '1px solid hsl(var(--border))',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                      }}
                                      className="exercise-item-btn"
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '13.5px', fontWeight: '550', color: 'hsl(var(--text))' }}>
                                          {item.title}
                                        </span>
                                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', background: item.difficulty === 'Easy' ? 'hsla(var(--success), 0.1)' : item.difficulty === 'Medium' ? 'hsla(var(--warning), 0.1)' : 'hsla(var(--danger), 0.1)', color: item.difficulty === 'Easy' ? 'hsl(var(--success))' : item.difficulty === 'Medium' ? 'hsl(var(--warning))' : 'hsl(var(--danger))', fontWeight: 'bold' }}>
                                          {item.difficulty}
                                        </span>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {hasNotes && (
                                          <FileText style={{ width: '13px', height: '13px', color: 'hsl(var(--primary))' }} title="Has notes logged" />
                                        )}
                                        <span style={{ fontSize: '12px', color: 'hsl(var(--primary))', fontWeight: '500' }}>
                                          Solve →
                                        </span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>

                              <div
                                onClick={() => setPythonSubTab('compiler')}
                                style={{
                                  borderTop: '1px solid hsl(var(--border))',
                                  paddingTop: '12px',
                                  marginTop: '16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  color: 'hsl(var(--primary))',
                                  fontSize: '12.5px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'color 0.2s'
                                }}
                                className="category-footer-link"
                              >
                                <span>For more problems and coding practices visit {cat.link}</span>
                                <ExternalLink style={{ width: '13px', height: '13px' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* WORKSPACE VIEW: THREE-PANEL CODE COMPILER AND STUDY NOTEBOOK */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Workspace Header Panel */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid hsl(var(--border))', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button
                            onClick={() => setSelectedExerciseItem(null)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 14px',
                              background: '#ffffff',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '13px',
                              color: 'hsl(var(--text-muted))',
                              transition: 'all 0.2s'
                            }}
                          >
                            <ArrowLeft style={{ width: '14px', height: '14px' }} /> Back to Exercise List
                          </button>
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Python Academy / {selectedExerciseItem.category}
                            </span>
                            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'hsl(var(--text))', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {selectedExerciseItem.title}
                              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '8px', background: selectedExerciseItem.difficulty === 'Easy' ? 'hsla(var(--success), 0.1)' : selectedExerciseItem.difficulty === 'Medium' ? 'hsla(var(--warning), 0.1)' : 'hsla(var(--danger), 0.1)', color: selectedExerciseItem.difficulty === 'Easy' ? 'hsl(var(--success))' : selectedExerciseItem.difficulty === 'Medium' ? 'hsl(var(--warning))' : 'hsl(var(--danger))', fontWeight: 'bold' }}>
                                {selectedExerciseItem.difficulty}
                              </span>
                            </h2>
                          </div>
                        </div>
                      </div>

                      {/* Three-Panel Split Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr 380px', gap: '20px', alignItems: 'stretch' }}>
                        
                        {/* LEFT PANEL: PROBLEM STATEMENT & CONSOLE */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {/* Instructions Card */}
                          <div className="card" style={{ padding: '20px', borderRadius: '12px', background: '#ffffff', border: '1px solid hsl(var(--border))', flex: 1 }}>
                            <span style={{ fontSize: '11px', color: 'hsl(var(--primary))', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                              📋 Challenge Description
                            </span>
                            <p style={{ fontSize: '14px', color: 'hsl(var(--text-muted))', lineHeight: '1.6', margin: 0 }}>
                              {selectedExerciseItem.description}
                            </p>

                            <div style={{ marginTop: '20px', borderTop: '1px solid hsl(var(--border))', paddingTop: '16px' }}>
                              <button
                                className="btn btn-secondary"
                                style={{ width: '100%', padding: '8px 12px', fontSize: '12.5px', justifyContent: 'center' }}
                                onClick={() => setShowExerciseSolution(!showExerciseSolution)}
                              >
                                {showExerciseSolution ? '💡 Hide Solution Guide' : '💡 Show Solution Guide'}
                              </button>
                            </div>

                            {showExerciseSolution && (
                              <div style={{ marginTop: '16px', background: 'hsl(240 25% 2%)', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontFamily: 'monospace' }}>
                                  optimal_solution.py
                                </span>
                                <pre style={{ margin: 0, fontFamily: 'var(--font-mono, monospace)', fontSize: '12.5px', overflowX: 'auto', color: '#38bdf8', lineHeight: '1.4' }}>
                                  <code>{selectedExerciseItem.solutionCode}</code>
                                </pre>
                              </div>
                            )}
                          </div>

                          {/* Stdout Console */}
                          <div className="card" style={{ padding: '16px', borderRadius: '12px', background: '#090d16', border: '1px solid #1e293b' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Console Output (Stdout)
                              </span>
                              <span className={`leetcode-status-tag ${exerciseTerminalStatus === 'success' ? 'accepted' : exerciseTerminalStatus === 'error' ? 'wrong-answer' : 'running'}`}>
                                {exerciseTerminalStatus === 'success' ? 'Accepted' : exerciseTerminalStatus === 'error' ? 'Wrong Answer' : exerciseTerminalStatus === 'running' ? 'Running' : 'Ready'}
                              </span>
                            </div>
                            <div style={{
                              minHeight: '140px',
                              maxHeight: '200px',
                              overflowY: 'auto',
                              fontFamily: 'var(--font-mono, monospace)',
                              fontSize: '12px',
                              whiteSpace: 'pre-wrap',
                              color: exerciseTerminalStatus === 'error' ? '#ef4444' : exerciseTerminalStatus === 'success' ? '#22c55e' : '#38bdf8',
                              lineHeight: '1.5'
                            }}>
                              {exerciseTerminalOutput}
                            </div>
                          </div>
                        </div>

                        {/* CENTER PANEL: CODE EDITOR */}
                        <div className="editor-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '520px' }}>
                          <div className="editor-header">
                            <div className="editor-dots">
                              <div className="editor-dot"></div>
                              <div className="editor-dot"></div>
                              <div className="editor-dot"></div>
                            </div>
                            <span className="editor-title">{selectedExerciseItem.id}.py</span>
                          </div>

                          <div className="editor-body" style={{ flex: 1, display: 'flex', background: '#05070f', position: 'relative' }}>
                            {/* Line Numbers gutter */}
                            <div style={{
                              padding: '12px 10px',
                              textAlign: 'right',
                              color: '#475569',
                              fontFamily: 'var(--font-mono, monospace)',
                              fontSize: '13px',
                              lineHeight: '1.5',
                              userSelect: 'none',
                              borderRight: '1px solid #1e293b',
                              background: '#03050a'
                            }}>
                              {Array.from({ length: Math.max(12, exerciseCode.split('\n').length) }, (_, i) => (
                                <div key={i}>{i + 1}</div>
                              ))}
                            </div>

                            {/* Main TextArea */}
                            <textarea
                              className="code-textarea"
                              placeholder="Write your Python program here..."
                              value={exerciseCode}
                              onChange={e => setExerciseCode(e.target.value)}
                              style={{
                                fontFamily: 'var(--font-mono, monospace)',
                                fontSize: '13px',
                                width: '100%',
                                flex: 1,
                                border: 'none',
                                background: 'transparent',
                                color: '#f8fafc',
                                padding: '12px',
                                resize: 'none',
                                outline: 'none',
                                lineHeight: '1.5'
                              }}
                            />
                          </div>

                          <div className="editor-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderTop: '1px solid hsl(var(--border))' }}>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => {
                                setExerciseCode(selectedExerciseItem.starterCode);
                                setExerciseTerminalStatus('idle');
                                setExerciseTerminalOutput('Sandbox initialized. Code reset to starter template.');
                              }}
                            >
                              Reset Code
                            </button>
                            <button
                              className="btn btn-primary"
                              style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
                              onClick={runExerciseCode}
                            >
                              <Play className="stat-icon" style={{ width: '14px', height: '14px' }} /> Run Code
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 3: COMPILER SIMULATOR */}
              {pythonSubTab === 'compiler' && (
                <div className="leetcode-split">
                  {/* Left Problem Statement Panel */}
                  <div className="leetcode-problem-panel">
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Select Python Core Problem:
                      </label>
                      <select
                        className="form-select"
                        style={{
                          width: '100%',
                          background: '#ffffff',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          padding: '10px',
                          color: 'hsl(var(--text))',
                          outline: 'none',
                          cursor: 'pointer',
                          fontSize: '13.5px',
                          fontWeight: '500'
                        }}
                        value={pythonActiveTemplate}
                        onChange={(e) => loadPythonPresetTemplate(e.target.value)}
                      >
                        <option value="Reverse a string using slicing">String Slicing: Reverse String</option>
                        <option value="Count vowels in a string">Vowels Count Filter</option>
                        <option value="Generate Fibonacci series">Fibonacci Sequence Generator</option>
                        <option value="Create and use decorators">Logger Function Decorators</option>
                        <option value="Read a text file and count total words">Text File Word Count Pipeline</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'hsl(var(--text))' }}>
                        {pythonCompilerProblems[pythonActiveTemplate]?.title}
                      </h2>
                      <span className={`leetcode-badge ${pythonCompilerProblems[pythonActiveTemplate]?.difficulty.toLowerCase()}`}>
                        {pythonCompilerProblems[pythonActiveTemplate]?.difficulty}
                      </span>
                    </div>

                    <p style={{ fontSize: '14px', color: 'hsl(var(--text))', lineHeight: '1.6', marginTop: '8px' }}>
                      {pythonCompilerProblems[pythonActiveTemplate]?.statement}
                    </p>

                    <h3 className="leetcode-section-title">Examples</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {pythonCompilerProblems[pythonActiveTemplate]?.examples.map((ex, idx) => (
                        <div key={idx} className="leetcode-example-block">
                          <strong>Example {idx + 1}:</strong><br />
                          <strong>Input:</strong> {ex.input}<br />
                          <strong>Output:</strong> {ex.output}<br />
                          {ex.explanation && (
                            <>
                              <strong>Explanation:</strong> {ex.explanation}
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    <h3 className="leetcode-section-title">Constraints</h3>
                    <ul style={{ paddingLeft: '20px', margin: '4px 0 0 0', fontSize: '13px', color: 'hsl(var(--text-muted))', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {pythonCompilerProblems[pythonActiveTemplate]?.constraints.map((c, idx) => (
                        <li key={idx} style={{ listStyleType: 'disc' }}>{c}</li>
                      ))}
                    </ul>

                    {showPythonSolution && (
                      <div style={{ marginTop: '20px', border: '1px solid hsl(var(--primary))', borderRadius: '12px', background: 'hsla(var(--primary), 0.05)', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'hsl(var(--primary))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            💡 Optimal Python Solution
                          </span>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '2px 8px', fontSize: '11px', height: 'auto' }}
                            onClick={() => setShowPythonSolution(false)}
                          >
                            Hide Solution
                          </button>
                        </div>
                        <pre style={{
                          background: '#090d16',
                          color: '#f8fafc',
                          padding: '12px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontFamily: 'var(--font-mono, monospace)',
                          overflowX: 'auto',
                          border: '1px solid #1e293b',
                          margin: 0
                        }}>
                          <code>{pythonCompilerProblems[pythonActiveTemplate]?.solution}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Right Editor & Console Panel */}
                  <div className="flex-column d-flex gap-16">
                    <div className="editor-container" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
                      <div className="editor-header">
                        <div className="editor-dots">
                          <div className="editor-dot"></div>
                          <div className="editor-dot"></div>
                          <div className="editor-dot"></div>
                        </div>
                        <span className="editor-title">{pythonActiveTemplate.toLowerCase().replace(/\s+/g, '_').substring(0, 20)}.py</span>
                      </div>

                      <div className="editor-body" style={{ flex: 1, display: 'flex' }}>
                        <textarea
                          className="code-textarea"
                          placeholder="Write your Python script here..."
                          value={pythonCode}
                          onChange={e => setPythonCode(e.target.value)}
                          style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', width: '100%', flex: 1, minHeight: '260px' }}
                        />
                      </div>

                      <div className="editor-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#f8fafc', borderTop: '1px solid hsl(var(--border))' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => loadPythonPresetTemplate(pythonActiveTemplate)}>
                            Reset Code
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px', background: showPythonSolution ? 'hsla(var(--primary), 0.1)' : 'transparent', borderColor: showPythonSolution ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
                            onClick={() => setShowPythonSolution(!showPythonSolution)}
                          >
                            {showPythonSolution ? 'Hide Solution' : 'Show Solution'}
                          </button>
                        </div>
                        <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={runPythonPlayground}>
                          <Play className="stat-icon" style={{ width: '14px', height: '14px' }} /> Run Code
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="leetcode-console-header">
                        <label style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', fontWeight: '600', display: 'block', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Simulated Local Console Stdout:
                        </label>
                        <div className="leetcode-console-status">
                          {pythonTerminalStatus === 'running' && (
                            <span className="leetcode-status-tag running">Evaluating</span>
                          )}
                          {pythonTerminalStatus === 'success' && (
                            <span className="leetcode-status-tag accepted">Accepted</span>
                          )}
                          {pythonTerminalStatus === 'error' && (
                            <span className="leetcode-status-tag wrong-answer">Wrong Answer</span>
                          )}
                        </div>
                      </div>
                      <div className={`terminal-output ${pythonTerminalStatus}`} style={{ minHeight: '160px', maxHeight: '240px', overflowY: 'auto', fontFamily: 'var(--font-mono, monospace)', fontSize: '12.5px', whiteSpace: 'pre-wrap', background: '#090d16', color: '#38bdf8', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                        {pythonTerminalOutput || 'Console is clean. Click "Run Code" to trigger execution.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: MY NOTES */}
              {pythonSubTab === 'notes' && (
                <div className="d-flex flex-column gap-12" style={{ padding: '8px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '22px' }}>📝</span>
                    <div>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'hsl(var(--text))' }}>My Python Notes</h2>
                      <p style={{ fontSize: '12.5px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>Your personal study notes for Python — bold, highlight, headings all supported. Auto-saved to browser.</p>
                    </div>
                  </div>
                  {renderStudyNotebook('python_notes_main', 'Python Core — My Notes')}
                </div>
              )}
            </div>
          )}

          {/* TAB: PYSPARK CORE ACADEMY */}
          {activeTab === 'pyspark' && (
            <div className="card" style={{ gridColumn: 'span 12' }}>
              {/* Sub Navigation Tabs */}
              <div className="d-flex gap-12" style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                  className={`btn ${pysparkSubTab === 'fundamentals' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => {
                    setPysparkSubTab('fundamentals');
                    setPysparkSearchQuery('');
                  }}
                >
                  <HelpCircle className="stat-icon" /> Fundamentals Concept Explorer
                </button>
                <button
                  className={`btn ${pysparkSubTab === 'coding' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => {
                    setPysparkSubTab('coding');
                    setPysparkSearchQuery('');
                  }}
                >
                  <Award className="stat-icon" /> 50 Coding & Production Challenges
                </button>
                <button
                  className={`btn ${pysparkSubTab === 'compiler' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => {
                    setPysparkSubTab('compiler');
                    setPysparkSearchQuery('');
                  }}
                >
                  <Terminal className="stat-icon" /> PySpark Runtime Compiler Simulator
                </button>
              </div>

              {/* SUBTAB 1: FUNDAMENTALS */}
              {pysparkSubTab === 'fundamentals' && (
                <div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                      <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))', width: '16px', height: '16px' }} />
                      <input
                        type="text"
                        placeholder="Search 40 interview questions..."
                        value={pysparkSearchQuery}
                        onChange={e => setPysparkSearchQuery(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '38px', width: '100%', background: '#ffffff', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '10px 10px 10px 38px', color: 'hsl(var(--text))', fontSize: '13px' }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['All', 'Architecture', 'Partitioning', 'Optimization', 'Streaming & Delta', 'General'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setPysparkCategoryFilter(cat)}
                          className={`btn ${pysparkCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '20px' }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pysparkConcepts
                      .filter(concept => {
                        const matchesCategory = pysparkCategoryFilter === 'All' || concept.category === pysparkCategoryFilter;
                        const matchesSearch = concept.question.toLowerCase().includes(pysparkSearchQuery.toLowerCase()) || 
                                              concept.answer.toLowerCase().includes(pysparkSearchQuery.toLowerCase());
                        return matchesCategory && matchesSearch;
                      })
                      .map(concept => {
                        const isExpanded = expandedPysparkConcept === concept.id;
                        return (
                          <div
                            key={concept.id}
                            style={{
                              border: isExpanded ? '1px solid hsl(var(--primary) / 0.4)' : '1px solid hsl(var(--border))',
                              background: isExpanded ? 'hsla(var(--card), 0.5)' : 'hsla(var(--card), 0.2)',
                              borderRadius: '12px',
                              padding: '16px',
                              cursor: 'pointer',
                              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: isExpanded ? '0 0 15px hsla(var(--primary), 0.05)' : 'none'
                            }}
                            onClick={() => setExpandedPysparkConcept(isExpanded ? null : concept.id)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  padding: '4px 10px',
                                  borderRadius: '10px',
                                  background: 'hsla(var(--secondary), 0.1)',
                                  color: 'hsl(var(--secondary))',
                                  border: '1px solid hsla(var(--secondary), 0.2)'
                                }}>
                                  {concept.category}
                                </span>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', color: isExpanded ? 'hsl(var(--primary))' : 'hsl(var(--text))', transition: 'color 0.2s' }}>
                                  {concept.question}
                                </h3>
                              </div>
                              <span style={{ fontSize: '14px', color: isExpanded ? 'hsl(var(--primary))' : 'hsl(var(--text-dark))', transition: 'color 0.2s' }}>
                                {isExpanded ? '▼' : '▶'}
                              </span>
                            </div>

                            {isExpanded && (
                              <div
                                style={{ marginTop: '12px', borderTop: '1px solid hsl(var(--border))', paddingTop: '12px' }}
                                onClick={e => e.stopPropagation()}
                              >
                                <p style={{ fontSize: '15px', color: 'hsl(var(--text-muted))', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                  {concept.answer}
                                </p>
                                <button
                                  className="btn btn-secondary"
                                  style={{ marginTop: '14px', padding: '8px 16px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px' }}
                                  onClick={() => handleSaveRevision(concept.question, concept.question, concept.answer, "PySpark Fundamentals")}
                                >
                                  <Plus className="stat-icon" style={{ width: '13px', height: '13px' }} /> Save to My Notes (+30 XP)
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* SUBTAB 2: CODING & PRODUCTION CHALLENGES */}
              {pysparkSubTab === 'coding' && (
                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 380px', gap: '20px' }}>
                  {/* Left Column: Challenges List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '680px', overflowY: 'auto', paddingRight: '8px' }}>
                    <div style={{ position: 'relative', marginBottom: '8px' }}>
                      <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))', width: '14px', height: '14px' }} />
                      <input
                        type="text"
                        placeholder="Search 50 challenges..."
                        value={pysparkSearchQuery}
                        onChange={e => setPysparkSearchQuery(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '32px', width: '100%', background: '#ffffff', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '8px 8px 8px 32px', color: 'hsl(var(--text))', fontSize: '12px' }}
                      />
                    </div>

                    <div style={{ padding: '0 4px', fontSize: '11px', fontWeight: 'bold', color: 'hsl(var(--text-muted))', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      PySpark Challenges
                    </div>

                    {pysparkChallenges
                      .filter(ch => {
                        return ch.title.toLowerCase().includes(pysparkSearchQuery.toLowerCase()) || 
                               ch.category.toLowerCase().includes(pysparkSearchQuery.toLowerCase());
                      })
                      .map(ch => {
                        const quizStatus = pysparkQuizState[ch.id];
                        const isSelected = selectedPysparkQuestion === ch.id;
                        return (
                          <button
                            key={ch.id}
                            onClick={() => setSelectedPysparkQuestion(ch.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 16px',
                              borderRadius: '12px',
                              background: isSelected ? 'hsl(var(--primary) / 0.08)' : '#ffffff',
                              border: isSelected ? '1px solid hsl(var(--primary) / 0.25)' : '1px solid hsl(var(--border))',
                              color: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              gap: '12px'
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden', flex: 1 }}>
                              <span style={{ fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {ch.title}
                              </span>
                              <span style={{ fontSize: '10px', color: 'hsl(var(--text-dark))', textTransform: 'uppercase' }}>
                                {ch.category}
                              </span>
                            </div>
                            
                            {quizStatus?.checked ? (
                              quizStatus.isCorrect ? (
                                <CheckCircle className="stat-icon" style={{ color: 'hsl(var(--success))', width: '14px', height: '14px', flexShrink: 0 }} />
                              ) : (
                                <AlertTriangle className="stat-icon" style={{ color: 'hsl(var(--danger))', width: '14px', height: '14px', flexShrink: 0 }} />
                              )
                            ) : (
                              <HelpCircle className="stat-icon" style={{ color: 'hsl(var(--text-dark))', width: '14px', height: '14px', flexShrink: 0 }} />
                            )}
                          </button>
                        );
                      })}
                  </div>

                  {/* Right Column: Challenge Panel */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {(() => {
                      const activeCh = pysparkChallenges.find(c => c.id === selectedPysparkQuestion) || pysparkChallenges[0];
                      const activeQuiz = pysparkQuizState[activeCh.id] || { checked: false, selected: null };
                      return (
                        <>
                          <div className="card-title-container">
                            <div className="card-header-with-icon">
                              <Award className="card-header-icon" style={{ color: 'hsl(var(--secondary))' }} />
                              <div>
                                <span style={{ fontSize: '11px', color: 'hsl(var(--secondary))', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                                  Category: {activeCh.category}
                                </span>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'hsl(var(--text))', marginTop: '4px' }}>{activeCh.title}</h2>
                              </div>
                            </div>
                          </div>

                          <div style={{ background: 'hsla(var(--card), 0.15)', border: '1px solid hsl(var(--border))', borderRadius: '12px', padding: '16px' }}>
                            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'hsl(var(--text))', marginBottom: '8px' }}>Challenge Goal / Context</h3>
                            <p style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', lineHeight: '1.5' }}>{activeCh.desc}</p>
                          </div>

                          {/* Code Solution Display */}
                          <div style={{ position: 'relative', background: 'hsl(240 25% 2%)', border: '1px solid hsl(var(--border))', borderRadius: '12px', padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                              <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', fontFamily: 'monospace' }}>pyspark_solution.py</span>
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px' }}
                                onClick={() => loadPysparkExample(activeCh.code, activeCh.title)}
                              >
                                <Terminal style={{ width: '12px', height: '12px' }} /> Load into Compiler
                              </button>
                            </div>
                            <pre style={{ margin: 0, fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', overflowX: 'auto', color: 'hsl(var(--secondary))', lineHeight: '1.5' }}>
                              <code>{activeCh.code}</code>
                            </pre>
                          </div>

                          {/* MCQ Quiz Box */}
                          <div className="card" style={{ background: 'hsla(var(--card), 0.25)', border: '1px solid hsl(var(--border))', padding: '20px' }}>
                            <span style={{ fontSize: '11px', color: 'hsl(var(--primary))', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                              🧠 Verify Understanding (+20 XP)
                            </span>
                            <h3 style={{ fontSize: '14px', color: 'hsl(var(--text))', fontWeight: '600', marginBottom: '16px', lineHeight: '1.4' }}>
                              {activeCh.quiz.question}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {activeCh.quiz.options.map((opt, optIdx) => {
                                const isSelected = activeQuiz.selected === optIdx;
                                let borderCol = 'hsl(var(--border))';
                                let bgCol = 'transparent';
                                if (isSelected) {
                                  borderCol = 'hsl(var(--primary))';
                                  bgCol = 'hsl(var(--primary) / 0.05)';
                                }
                                if (activeQuiz.checked) {
                                  if (optIdx === activeCh.quiz.correctIndex) {
                                    borderCol = 'hsl(var(--success))';
                                    bgCol = 'hsl(var(--success) / 0.08)';
                                  } else if (isSelected) {
                                    borderCol = 'hsl(var(--danger))';
                                    bgCol = 'hsl(var(--danger) / 0.08)';
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    disabled={activeQuiz.checked}
                                    onClick={() => handleSelectPysparkQuizOption(activeCh.id, optIdx)}
                                    style={{
                                      width: '100%',
                                      padding: '12px 14px',
                                      borderRadius: '8px',
                                      border: `1px solid ${borderCol}`,
                                      background: bgCol,
                                      color: activeQuiz.checked && optIdx === activeCh.quiz.correctIndex ? 'hsl(var(--success))' : isSelected ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
                                      fontSize: '13px',
                                      textAlign: 'left',
                                      cursor: activeQuiz.checked ? 'default' : 'pointer',
                                      transition: 'all 0.15s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between'
                                    }}
                                  >
                                    <span>{opt}</span>
                                    {activeQuiz.checked && optIdx === activeCh.quiz.correctIndex && <CheckCircle style={{ width: '16px', height: '16px', color: 'hsl(var(--success))', flexShrink: 0 }} />}
                                    {activeQuiz.checked && isSelected && optIdx !== activeCh.quiz.correctIndex && <AlertTriangle style={{ width: '16px', height: '16px', color: 'hsl(var(--danger))', flexShrink: 0 }} />}
                                  </button>
                                );
                              })}
                            </div>

                            {activeQuiz.checked && (
                              <div style={{ marginTop: '16px', padding: '16px', borderRadius: '10px', background: 'hsla(var(--card), 0.5)', borderLeft: `4px solid ${activeQuiz.isCorrect ? 'hsl(var(--success))' : 'hsl(var(--danger))'}` }}>
                                <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'hsl(var(--text))', marginBottom: '6px' }}>
                                  {activeQuiz.isCorrect ? '🎉 Correct Answer! (+20 XP)' : '❌ Incorrect Answer'}
                                </h4>
                                <p style={{ fontSize: '12.5px', color: 'hsl(var(--text-muted))', lineHeight: '1.4' }}>
                                  {activeCh.quiz.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <div className="d-flex flex-column gap-12">
                    <h2 className="my-notes-heading">My Notes</h2>
                    {renderStudyNotebook("pyspark_challenge_" + (pysparkChallenges.find(c => c.id === selectedPysparkQuestion) || pysparkChallenges[0]).id, "Notes: " + (pysparkChallenges.find(c => c.id === selectedPysparkQuestion) || pysparkChallenges[0]).title)}
                  </div>
                </div>
              )}

              {/* SUBTAB 3: COMPILER SIMULATOR */}
              {pysparkSubTab === 'compiler' && (
                <div className="leetcode-split" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 380px', gap: '20px', alignItems: 'stretch' }}>
                  {/* Left Problem Statement Panel */}
                  <div className="leetcode-problem-panel">
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Select PySpark Core Problem:
                      </label>
                      <select
                        className="form-select"
                        style={{
                          width: '100%',
                          background: '#ffffff',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          padding: '10px',
                          color: 'hsl(var(--text))',
                          outline: 'none',
                          cursor: 'pointer',
                          fontSize: '13.5px',
                          fontWeight: '500'
                        }}
                        value={pysparkActiveTemplate}
                        onChange={(e) => loadPysparkPresetTemplate(e.target.value)}
                      >
                        <option value="1. Read CSV file into DataFrame">CSV DataFrame Reader</option>
                        <option value="12. Group by and aggregate salary">GroupBy Salary Aggregates</option>
                        <option value="22. Remove duplicates using Window functions">Window Deduplication</option>
                        <option value="27. Use broadcast join optimization">Broadcast Join Hint</option>
                        <option value="29. Handle skewed data using salting">Skew Key Salting</option>
                        <option value="30. Optimize small file problem using OPTIMIZE + ZORDER">Delta Table Z-Order Compaction</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'hsl(var(--text))' }}>
                        {pysparkCompilerProblems[pysparkActiveTemplate]?.title}
                      </h2>
                      <span className={`leetcode-badge ${pysparkCompilerProblems[pysparkActiveTemplate]?.difficulty.toLowerCase()}`}>
                        {pysparkCompilerProblems[pysparkActiveTemplate]?.difficulty}
                      </span>
                    </div>

                    <p style={{ fontSize: '14px', color: 'hsl(var(--text))', lineHeight: '1.6', marginTop: '8px' }}>
                      {pysparkCompilerProblems[pysparkActiveTemplate]?.statement}
                    </p>

                    <h3 className="leetcode-section-title">Examples</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {pysparkCompilerProblems[pysparkActiveTemplate]?.examples.map((ex, idx) => (
                        <div key={idx} className="leetcode-example-block">
                          <strong>Example {idx + 1}:</strong><br />
                          <strong>Input:</strong> {ex.input}<br />
                          <strong>Output:</strong> {ex.output}<br />
                          {ex.explanation && (
                            <>
                              <strong>Explanation:</strong> {ex.explanation}
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    <h3 className="leetcode-section-title">Constraints</h3>
                    <ul style={{ paddingLeft: '20px', margin: '4px 0 0 0', fontSize: '13px', color: 'hsl(var(--text-muted))', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {pysparkCompilerProblems[pysparkActiveTemplate]?.constraints.map((c, idx) => (
                        <li key={idx} style={{ listStyleType: 'disc' }}>{c}</li>
                      ))}
                    </ul>

                    {showPysparkSolution && (
                      <div style={{ marginTop: '20px', border: '1px solid hsl(var(--primary))', borderRadius: '12px', background: 'hsla(var(--primary), 0.05)', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'hsl(var(--primary))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            💡 Optimal Spark Plan Solution
                          </span>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '2px 8px', fontSize: '11px', height: 'auto' }}
                            onClick={() => setShowPysparkSolution(false)}
                          >
                            Hide Solution
                          </button>
                        </div>
                        <pre style={{
                          background: '#090d16',
                          color: '#f8fafc',
                          padding: '12px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontFamily: 'var(--font-mono, monospace)',
                          overflowX: 'auto',
                          border: '1px solid #1e293b',
                          margin: 0
                        }}>
                          <code>{pysparkCompilerProblems[pysparkActiveTemplate]?.solution}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Right Editor & Console Panel */}
                  <div className="flex-column d-flex gap-16">
                    <div className="editor-container" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
                      <div className="editor-header">
                        <div className="editor-dots">
                          <div className="editor-dot"></div>
                          <div className="editor-dot"></div>
                          <div className="editor-dot"></div>
                        </div>
                        <span className="editor-title">{pysparkActiveTemplate.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 20)}.py</span>
                      </div>

                      <div className="editor-body" style={{ flex: 1, display: 'flex' }}>
                        <textarea
                          className="code-textarea"
                          placeholder="Write your PySpark script here..."
                          value={pysparkCode}
                          onChange={e => setPysparkCode(e.target.value)}
                          style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', width: '100%', flex: 1, minHeight: '260px' }}
                        />
                      </div>

                      <div className="editor-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#f8fafc', borderTop: '1px solid hsl(var(--border))' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => loadPysparkPresetTemplate(pysparkActiveTemplate)}>
                            Reset Code
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px', background: showPysparkSolution ? 'hsla(var(--primary), 0.1)' : 'transparent', borderColor: showPysparkSolution ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
                            onClick={() => setShowPysparkSolution(!showPysparkSolution)}
                          >
                            {showPysparkSolution ? 'Hide Solution' : 'Show Solution'}
                          </button>
                        </div>
                        <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={runPysparkPlayground}>
                          <Play className="stat-icon" style={{ width: '14px', height: '14px' }} /> Run Code
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="leetcode-console-header">
                        <label style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', fontWeight: '600', display: 'block', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Simulated Cluster Console Stdout:
                        </label>
                        <div className="leetcode-console-status">
                          {pysparkTerminalStatus === 'running' && (
                            <span className="leetcode-status-tag running">Shuffling</span>
                          )}
                          {pysparkTerminalStatus === 'success' && (
                            <span className="leetcode-status-tag accepted">Optimized</span>
                          )}
                          {pysparkTerminalStatus === 'error' && (
                            <span className="leetcode-status-tag wrong-answer">Skew Skew</span>
                          )}
                        </div>
                      </div>
                      <div className={`terminal-output ${pysparkTerminalStatus}`} style={{ minHeight: '160px', maxHeight: '240px', overflowY: 'auto', fontFamily: 'var(--font-mono, monospace)', fontSize: '12.5px', whiteSpace: 'pre-wrap', background: '#090d16', color: '#10b981', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                        {pysparkTerminalOutput || 'Cluster console is clean. Click "Run Code" to initialize execution.'}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-12">
                    <h2 className="my-notes-heading">My Notes</h2>
                    {renderStudyNotebook("pyspark_compiler_" + pysparkActiveTemplate.toLowerCase().replace(/[^a-z0-9]+/g, '_'), "Notes: " + pysparkCompilerProblems[pysparkActiveTemplate]?.title)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PANDAS DATA CLEANING */}
          {activeTab === 'pandas' && (
            <div className="card" style={{ gridColumn: 'span 12' }}>
              {/* Sub Navigation Tabs */}
              <div className="d-flex gap-12" style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '16px', marginBottom: '20px' }}>
                <button
                  className={`btn ${pandasSubTab === 'roadmap' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => setPandasSubTab('roadmap')}
                >
                  <BookOpen className="stat-icon" /> Data Engineering Roadmap (17 Steps)
                </button>
                <button
                  className={`btn ${pandasSubTab === 'challenges' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => setPandasSubTab('challenges')}
                >
                  <Database className="stat-icon" /> Challenges & Playgrounds
                </button>
              </div>

              {pandasSubTab === 'roadmap' ? (
                /* ROADMAP VIEW */
                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
                  {/* Left Column: Chapters Navigator */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '680px', overflowY: 'auto', paddingRight: '8px' }}>
                    <div style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', color: 'hsl(var(--text-muted))', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Roadmap Syllabus
                    </div>
                    {roadmapChapters.map((ch) => {
                      const quizDone = quizState[ch.id]?.checked;
                      const quizCorrect = quizState[ch.id]?.isCorrect;
                      return (
                        <button
                          key={ch.id}
                          onClick={() => setSelectedRoadmapChapter(ch.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: selectedRoadmapChapter === ch.id ? 'hsl(var(--primary) / 0.08)' : '#ffffff',
                            border: selectedRoadmapChapter === ch.id ? '1px solid hsl(var(--primary) / 0.25)' : '1px solid hsl(var(--border))',
                            color: selectedRoadmapChapter === ch.id ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>{ch.title}</span>
                          {quizDone && (
                            quizCorrect ? (
                              <CheckCircle className="stat-icon" style={{ color: 'hsl(var(--success))', width: '14px', height: '14px' }} />
                            ) : (
                              <AlertTriangle className="stat-icon" style={{ color: 'hsl(var(--danger))', width: '14px', height: '14px' }} />
                            )
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: Detailed Chapter View */}
                  {(() => {
                    const ch = roadmapChapters.find(c => c.id === selectedRoadmapChapter) || roadmapChapters[0];
                    const activeQuiz = quizState[ch.id] || { selected: null, checked: false, isCorrect: null };
                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                        {/* Chapter Detail Pane */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div className="instruction-step active" style={{ margin: 0, padding: '24px' }}>
                            <span className="step-badge">Module {ch.id} / 17</span>
                            <h2 style={{ color: 'hsl(var(--text))', fontSize: '20px', marginTop: '6px' }}>{ch.title}</h2>
                            <p style={{ marginTop: '8px', fontSize: '14px', lineHeight: '1.5', color: 'hsl(var(--text-muted))' }}>
                              {ch.desc}
                            </p>

                            {/* Practical Code block */}
                            <div style={{ marginTop: '16px' }}>
                              <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'hsl(var(--text-dark))', display: 'block', marginBottom: '6px' }}>
                                Interactive Example Code Snippet
                              </label>
                              <pre style={{
                                background: '#050508',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '10px',
                                padding: '16px',
                                fontSize: '12.5px',
                                fontFamily: 'JetBrains Mono',
                                color: '#a78bfa',
                                overflowX: 'auto',
                                whiteSpace: 'pre',
                              }}>
                                <code>{ch.code}</code>
                              </pre>
                            </div>

                            <button
                              className="btn btn-primary"
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', marginTop: '16px', padding: '8px 16px' }}
                              onClick={() => loadRoadmapExample(ch.code)}
                            >
                              <Play className="stat-icon" /> ⚡ Load Example into Editor & Practice
                            </button>
                          </div>

                          {/* Interactive Exam Prep Quiz Box */}
                          <div className="instruction-step" style={{ margin: 0, padding: '20px', border: '1px solid hsl(var(--border))', background: 'hsla(var(--card), 0.2)' }}>
                            <span className="step-badge purple">📝 Exam Practice Question</span>
                            <p style={{ marginTop: '8px', fontSize: '14px', fontWeight: '600', color: 'hsl(var(--text))', lineHeight: '1.4' }}>
                              {ch.quiz.question}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                              {ch.quiz.options.map((opt, optIdx) => {
                                const isSelected = activeQuiz.selected === optIdx;
                                let borderCol = 'hsl(var(--border))';
                                let bgCol = 'transparent';
                                if (isSelected) {
                                  borderCol = 'hsl(var(--primary))';
                                  bgCol = 'hsl(var(--primary) / 0.05)';
                                }
                                if (activeQuiz.checked) {
                                  if (optIdx === ch.quiz.correctIndex) {
                                    borderCol = 'hsl(var(--success))';
                                    bgCol = 'hsl(var(--success) / 0.08)';
                                  } else if (isSelected) {
                                    borderCol = 'hsl(var(--danger))';
                                    bgCol = 'hsl(var(--danger) / 0.08)';
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    disabled={activeQuiz.checked}
                                    onClick={() => handleSelectQuizOption(ch.id, optIdx)}
                                    style={{
                                      width: '100%',
                                      padding: '10px 14px',
                                      borderRadius: '8px',
                                      border: `1px solid ${borderCol}`,
                                      background: bgCol,
                                      color: activeQuiz.checked && optIdx === ch.quiz.correctIndex ? 'hsl(var(--success))' : isSelected ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
                                      fontSize: '13px',
                                      textAlign: 'left',
                                      cursor: activeQuiz.checked ? 'default' : 'pointer',
                                      transition: 'all 0.15s ease',
                                    }}
                                  >
                                    {String.fromCharCode(65 + optIdx)}. {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {activeQuiz.checked && (
                              <div style={{ marginTop: '14px', borderTop: '1px solid hsl(var(--border))', paddingTop: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 'bold', color: activeQuiz.isCorrect ? 'hsl(var(--success))' : 'hsl(var(--danger))' }}>
                                  {activeQuiz.isCorrect ? (
                                    <>
                                      <CheckCircle className="stat-icon" style={{ color: 'hsl(var(--success))' }} />
                                      Correct! (+20 XP Awarded)
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle className="stat-icon" style={{ color: 'hsl(var(--danger))' }} />
                                      Incorrect
                                    </>
                                  )}
                                </div>
                                <p style={{ fontSize: '12.5px', marginTop: '6px', color: 'hsl(var(--text-muted))', lineHeight: '1.4' }}>
                                  <strong>Explanation:</strong> {ch.quiz.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Learning Path Guidelines & Order reference */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {/* Sidebar Tabs */}
                          <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '8px' }}>
                            <button
                              onClick={() => setPandasRightTab('guidelines')}
                              style={{
                                flex: 1,
                                padding: '6px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: pandasRightTab === 'guidelines' ? 'hsla(var(--primary), 0.1)' : 'transparent',
                                border: '1px solid ' + (pandasRightTab === 'guidelines' ? 'hsl(var(--primary))' : 'transparent'),
                                color: pandasRightTab === 'guidelines' ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))'
                              }}
                            >
                              Guidelines
                            </button>
                            <button
                              onClick={() => setPandasRightTab('notes')}
                              style={{
                                flex: 1,
                                padding: '6px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: pandasRightTab === 'notes' ? 'hsla(var(--primary), 0.1)' : 'transparent',
                                border: '1px solid ' + (pandasRightTab === 'notes' ? 'hsl(var(--primary))' : 'transparent'),
                                color: pandasRightTab === 'notes' ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))'
                              }}
                            >
                              📝 Notebook
                            </button>
                          </div>

                          {pandasRightTab === 'notes' ? (
                            renderStudyNotebook("pandas_roadmap_" + ch.id, "Notes: " + ch.title)
                          ) : (
                            <>
                              <div className="visualizer-card" style={{ padding: '16px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'hsl(var(--secondary))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  🎓 Data Engineer Study Order
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', fontSize: '12.5px' }}>
                                  <div style={{ borderLeft: '2px solid hsl(var(--secondary))', paddingLeft: '8px' }}>
                                    <strong style={{ color: 'hsl(var(--text))' }}>Phase 1: Foundations</strong>
                                    <p style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>NumPy/Pandas foundations.</p>
                                  </div>
                                  <div style={{ borderLeft: '2px solid hsl(var(--primary))', paddingLeft: '8px' }}>
                                    <strong style={{ color: 'hsl(var(--text))' }}>Phase 2: Cleaning Core</strong>
                                    <p style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>NaNs, duplicates, data types, query filters.</p>
                                  </div>
                                  <div style={{ borderLeft: '2px solid hsl(var(--warning))', paddingLeft: '8px' }}>
                                    <strong style={{ color: 'hsl(var(--text))' }}>Phase 3: Relational Wrangling</strong>
                                    <p style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>GroupBy aggregate joins and maps.</p>
                                  </div>
                                  <div style={{ borderLeft: '2px solid hsl(var(--danger))', paddingLeft: '8px' }}>
                                    <strong style={{ color: 'hsl(var(--text))' }}>Phase 4: Datetime & Scalability</strong>
                                    <p style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>Timeseries shift, rolling window, SQL wrappers.</p>
                                  </div>
                                  <div style={{ borderLeft: '2px solid hsl(var(--success))', paddingLeft: '8px' }}>
                                    <strong style={{ color: 'hsl(var(--text))' }}>Phase 5: Cloud Architecture</strong>
                                    <p style={{ fontSize: '11px', color: 'hsl(var(--text-dark))', marginTop: '2px' }}>Spark, Airflow DAG pipelines, S3 targets.</p>
                                  </div>
                                </div>
                              </div>

                              <div className="visualizer-card" style={{ padding: '16px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'hsl(var(--primary))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  💡 Must-Master Methods
                                </span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                                  {["read_csv()", "head()", "info()", "loc[]", "iloc[]", "groupby()", "merge()", "concat()", "fillna()", "dropna()", "astype()", "apply()", "to_csv()"].map((m) => (
                                    <code
                                      key={m}
                                      style={{
                                        fontSize: '11.5px',
                                        fontFamily: 'JetBrains Mono',
                                        color: '#fff',
                                        background: '#050508',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        border: '1px solid hsl(var(--border))',
                                      }}
                                    >
                                      {m}
                                    </code>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* INTERACTIVE CHALLENGES VIEW */
                <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr 380px', gap: '20px', alignItems: 'stretch' }}>
                  <div className="playground-instructions" style={{ margin: 0, padding: 0 }}>
                    <div className="card-title-container">
                      <div className="card-header-with-icon">
                        <Database className="card-header-icon" />
                        <div>
                          <h2>Challenges & Playground Compiler</h2>
                          <p className="card-subtitle">Solve problems and verify execution in real-time</p>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-8" style={{ marginBottom: '12px' }}>
                      <button
                        className={`btn ${dfChallengeStep === 1 ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => { setDfChallengeStep(1); resetPandasData(); }}
                      >
                        Step 1: Deduplication
                      </button>
                      <button
                        className={`btn ${dfChallengeStep === 2 ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => { setDfChallengeStep(2); resetPandasData(); }}
                      >
                        Step 2: Fill NaNs
                      </button>
                      <button
                        className={`btn ${dfChallengeStep === 3 ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => { setDfChallengeStep(3); resetPandasData(); }}
                      >
                        Step 3: Query Filter
                      </button>
                    </div>

                    {dfChallengeStep === 1 && (
                      <div className="instruction-step active">
                        <span className="step-badge">Challenge 1</span>
                        <h3>Remove Duplicate Records</h3>
                        <p>
                          Your raw DataFrame contains duplicate user rows (e.g., Alice has been logged twice). Write the Python code to drop duplicates in-place or assign the clean DataFrame back to the variable <code>df</code>.
                        </p>
                        <p style={{ marginTop: '12px', fontWeight: 'bold' }}>
                          Hint: Use <code>df.drop_duplicates(inplace=True)</code> or <code>df = df.drop_duplicates()</code>
                        </p>
                      </div>
                    )}

                    {dfChallengeStep === 2 && (
                      <div className="instruction-step active">
                        <span className="step-badge purple">Challenge 2</span>
                        <h3>Impute Missing Values (NaN)</h3>
                        <p>
                          Your dataset contains an empty cell in the <code>age</code> column for Bob. Write the code to fill the empty values with the column average.
                        </p>
                        <p style={{ marginTop: '12px', fontWeight: 'bold' }}>
                          Hint: Use <code>df['age'].fillna(df['age'].mean(), inplace=True)</code> or <code>df = df.fillna(33.3)</code>
                        </p>
                      </div>
                    )}

                    {dfChallengeStep === 3 && (
                      <div className="instruction-step active">
                        <span className="step-badge">Challenge 3</span>
                        <h3>Query High Earners</h3>
                        <p>
                          Filter your dataset to only show developers making a salary greater than 75,000.
                        </p>
                        <p style={{ marginTop: '12px', fontWeight: 'bold' }}>
                          Hint: Use DataFrame slicing: <code>df[df['salary'] &gt; 75000]</code>
                        </p>
                      </div>
                    )}

                    {/* Active dataset view */}
                    <div className="form-group" style={{ marginTop: '12px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '600', color: 'hsl(var(--text-muted))' }}>Interactive Raw/Processed Dataset State:</label>
                      <div style={{ overflowX: 'auto', border: '1px solid hsl(var(--border))', borderRadius: '12px', background: '#050508' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ background: '#11111b', borderBottom: '1px solid hsl(var(--border))' }}>
                              <th style={{ padding: '10px 16px' }}>ID</th>
                              <th style={{ padding: '10px 16px' }}>Name</th>
                              <th style={{ padding: '10px 16px' }}>Age</th>
                              <th style={{ padding: '10px 16px' }}>City</th>
                              <th style={{ padding: '10px 16px' }}>Salary</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pandasData.map((row, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                                <td style={{ padding: '8px 16px', fontFamily: 'JetBrains Mono' }}>{row.id}</td>
                                <td style={{ padding: '8px 16px' }}>{row.name}</td>
                                <td style={{ padding: '8px 16px', color: row.age === null ? 'hsl(var(--warning))' : 'inherit' }}>
                                  {row.age === null ? 'NaN' : row.age}
                                </td>
                                <td style={{ padding: '8px 16px', color: row.city === null ? 'hsl(var(--warning))' : 'inherit' }}>
                                  {row.city === null ? 'NaN' : row.city}
                                </td>
                                <td style={{ padding: '8px 16px', color: row.salary === null ? 'hsl(var(--warning))' : 'inherit' }}>
                                  {row.salary === null ? 'NaN' : row.salary}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Editor Side */}
                  <div className="flex-column d-flex gap-16" style={{ margin: 0, padding: 0 }}>
                    <div className="editor-container" style={{ minHeight: '320px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div className="editor-header">
                        <div className="editor-dots">
                          <div className="editor-dot"></div>
                          <div className="editor-dot"></div>
                          <div className="editor-dot"></div>
                        </div>
                        <span className="editor-title">pandas_cleaning.py</span>
                      </div>

                      <div className="editor-body" style={{ flex: 1, display: 'flex', position: 'relative', background: '#05070f' }}>
                        <textarea
                          className="code-textarea"
                          placeholder="Write your Pandas cleaning solution here..."
                          value={pandasCode}
                          onChange={e => setPandasCode(e.target.value)}
                          style={{
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '13px',
                            width: '100%',
                            flex: 1,
                            border: 'none',
                            background: 'transparent',
                            color: '#f8fafc',
                            padding: '12px',
                            resize: 'none',
                            outline: 'none',
                            lineHeight: '1.5',
                            minHeight: '220px'
                          }}
                        />
                      </div>

                      <div className="editor-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#f8fafc', borderTop: '1px solid hsl(var(--border))' }}>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={resetPandasData}>
                          Reset Code
                        </button>
                        <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={runPandasPlayground}>
                          <Play className="stat-icon" /> Run Solution
                        </button>
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '12px', fontWeight: '600', color: 'hsl(var(--text-muted))' }}>Terminal Execution Log:</label>
                      <div className={`terminal-output ${pandasStatus}`} style={{ minHeight: '100px', maxHeight: '160px', overflowY: 'auto' }}>
                        {pandasOutput || 'Ready. Write your code and press "Run Solution".'}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT PANEL: DYNAMIC NOTES STUDY NOTEBOOK */}
                  <div className="d-flex flex-column gap-12">
                              <h2 className="my-notes-heading">My Notes</h2>
                              {renderStudyNotebook("pandas_challenge_" + dfChallengeStep, "Notes: Pandas Challenge " + dfChallengeStep)}
                            </div>
                </div>
              )}
            </div>
          )}
          {/* TAB: SQL ACADEMY */}
          {activeTab === 'sql' && (
            <div className="card" style={{ gridColumn: 'span 12' }}>
              <div className="card-title-container">
                <div className="card-header-with-icon">
                  <Database className="card-header-icon" />
                  <div>
                    <h2>SQL Academy</h2>
                    <p className="card-subtitle">Master Relational Databases, JOINs, Aggregations, and Window Functions</p>
                  </div>
                </div>
              </div>

              {/* SQL Nav */}
              <div className="d-flex gap-12" style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                  className={`btn ${sqlSubTab === 'fundamentals' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                  onClick={() => setSqlSubTab('fundamentals')}
                >
                  <BookOpen className="stat-icon" /> Fundamentals & Concepts
                </button>
                <button
                  className={`btn ${sqlSubTab === 'coding' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                  onClick={() => setSqlSubTab('coding')}
                >
                  <Terminal className="stat-icon" /> Exercises & Solutions
                </button>
                <button
                  className={`btn ${sqlSubTab === 'compiler' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                  onClick={() => setSqlSubTab('compiler')}
                >
                  <Database className="stat-icon" /> Dynamic SQL Engine
                </button>
                <button
                  className={`btn ${sqlSubTab === 'notes' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                  onClick={() => setSqlSubTab('notes')}
                >
                  <FileText className="stat-icon" /> 📝 My Notes
                </button>
              </div>

              {sqlSubTab === 'fundamentals' && (
                <div className="grid-2-cols">
                  {/* CHEAT SHEET SIDE */}
                  <div>
                    <h3 style={{ marginBottom: '16px' }}>Fundamentals Concept Explorer</h3>
                    <div className="d-flex gap-8" style={{ marginBottom: '16px' }}>
                      {['All', 'Basics', 'Joins', 'Window Functions'].map(cat => (
                        <button
                          key={cat}
                          className={`btn ${sqlCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '4px 12px', fontSize: '11px', borderRadius: '20px' }}
                          onClick={() => setSqlCategoryFilter(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {sqlConcepts.filter(c => sqlCategoryFilter === 'All' || c.category === sqlCategoryFilter).map(concept => (
                        <div key={concept.id} className="concept-card">
                          <h4 style={{ color: 'hsl(var(--primary))', marginBottom: '8px' }}>{concept.question}</h4>
                          <p style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', lineHeight: '1.5' }}>
                            {concept.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {sqlSubTab === 'coding' && (
                <div className="grid-2-cols">
                  {/* LEFT: CHALLENGE LIST */}
                  <div>
                     <h3 style={{ marginBottom: '16px' }}>SQL Challenges</h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {sqlChallenges.map(challenge => (
                          <div 
                            key={challenge.id} 
                            className={`concept-card ${sqlSelectedChallenge === challenge.id ? 'active-challenge' : ''}`}
                            style={{ 
                              cursor: 'pointer', 
                              border: sqlSelectedChallenge === challenge.id ? '1px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                              background: sqlSelectedChallenge === challenge.id ? 'hsla(var(--primary), 0.05)' : 'hsl(var(--card))'
                            }}
                            onClick={() => {
                              setSqlSelectedChallenge(challenge.id);
                              setSqlExerciseCode(challenge.starterCode);
                              setSqlExerciseResult(null);
                              setSqlExerciseError('');
                              setSqlExerciseStatus('idle');
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-8">
                               <h4 style={{ margin: 0 }}>{challenge.title}</h4>
                               <span className="step-badge" style={{ margin: 0 }}>{challenge.difficulty}</span>
                            </div>
                            <p style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', margin: 0 }}>{challenge.category}</p>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* RIGHT: RUNNER */}
                  {(() => {
                    const activeChallenge = sqlChallenges.find(c => c.id === sqlSelectedChallenge);
                    return activeChallenge && (
                      <div className="code-editor-wrapper">
                        <div className="editor-header d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-8">
                             <Database className="stat-icon" style={{ width: '14px', height: '14px' }} />
                             <span>Challenge: {activeChallenge.title}</span>
                          </div>
                          <span className="step-badge">{activeChallenge.difficulty}</span>
                        </div>
                        <div style={{ padding: '16px', borderBottom: '1px solid #333' }}>
                           <p style={{ fontSize: '13px', lineHeight: '1.5', margin: 0, color: 'hsl(var(--text))' }}>{activeChallenge.description}</p>
                        </div>
                        <textarea
                          className="code-textarea"
                          style={{ minHeight: '150px' }}
                          value={sqlExerciseCode}
                          onChange={(e) => setSqlExerciseCode(e.target.value)}
                          placeholder="Write your SQL here..."
                          spellCheck={false}
                        />
                        <div className="editor-footer d-flex justify-content-between">
                          <button className="btn btn-secondary" onClick={() => setSqlExerciseCode(activeChallenge.starterCode)}>
                            <RefreshCw style={{ width: '14px', height: '14px', marginRight: '6px' }} /> Reset Code
                          </button>
                          <button className="btn btn-primary" onClick={runSqlExercise} disabled={sqlExerciseStatus === 'running'}>
                            {sqlExerciseStatus === 'running' ? <RefreshCw className="stat-icon spin" /> : <Play className="stat-icon" />} Run Query
                          </button>
                        </div>
                        <div className="terminal-window">
                          <div className="terminal-header">
                             <span>Query Results</span>
                          </div>
                          <div className="terminal-content">
                            {sqlExerciseStatus === 'running' && <span style={{ color: 'hsl(var(--warning))' }}>Executing query on client-side engine...</span>}
                            {sqlExerciseError && <span style={{ color: 'hsl(var(--danger))' }}>{sqlExerciseError}</span>}
                            {sqlExerciseResult && sqlExerciseResult.length === 0 && <span style={{ color: 'hsl(var(--text-muted))' }}>0 rows returned.</span>}
                            {sqlExerciseResult && sqlExerciseResult.length > 0 && (
                               <div style={{ overflowX: 'auto' }}>
                                 <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                   <thead>
                                     <tr>
                                       {Object.keys(sqlExerciseResult[0]).map(key => (
                                          <th key={key} style={{ padding: '6px', borderBottom: '1px solid #444', textAlign: 'left', color: 'hsl(var(--primary))' }}>{key}</th>
                                       ))}
                                     </tr>
                                   </thead>
                                   <tbody>
                                     {sqlExerciseResult.map((row, i) => (
                                       <tr key={i}>
                                         {Object.values(row).map((val, j) => (
                                            <td key={j} style={{ padding: '6px', borderBottom: '1px solid #333' }}>{val !== null ? val.toString() : 'NULL'}</td>
                                         ))}
                                       </tr>
                                     ))}
                                   </tbody>
                                 </table>
                               </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}

              {sqlSubTab === 'compiler' && (
                <div className="grid-2-cols">
                  {/* LEFT: SCHEMA & LIVE DATA VIEWER */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h3 style={{ margin: 0 }}>Database Schema</h3>
                      <button 
                        className="btn btn-secondary" 
                        onClick={resetSqlDatabase} 
                        style={{ padding: '4px 12px', fontSize: '11px', borderRadius: '4px' }}
                        title="Revert all tables to their initial state"
                      >
                        <RefreshCw style={{ width: '12px', height: '12px', marginRight: '6px', display: 'inline' }} /> Reset DB
                      </button>
                    </div>

                    {Object.entries(sqlLiveTables).map(([tableName, data]) => {
                      const columns = sqlDatasets[tableName] && sqlDatasets[tableName][0] 
                        ? Object.keys(sqlDatasets[tableName][0]) 
                        : (data[0] ? Object.keys(data[0]) : []);
                      const isExpanded = sqlExpandedTables[tableName];

                      return (
                        <div key={tableName} className="concept-card" style={{ marginBottom: '12px', padding: '16px' }}>
                          <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '8px' }}>
                            <h4 style={{ color: 'hsl(var(--secondary))', margin: 0, display: 'flex', alignItems: 'center' }}>
                              <Database style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                              {tableName}
                              <span className="step-badge" style={{ marginLeft: '8px', fontSize: '10px', padding: '1px 6px' }}>
                                {data.length} row{data.length !== 1 ? 's' : ''}
                              </span>
                            </h4>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '2px 8px', fontSize: '10px', borderRadius: '4px' }}
                              onClick={() => setSqlExpandedTables(prev => ({ ...prev, [tableName]: !prev[tableName] }))}
                            >
                              {isExpanded ? 'Hide Data' : 'View Data'}
                            </button>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: isExpanded ? '12px' : '0px' }}>
                             {columns.map(col => (
                                <span key={col} style={{ background: 'hsla(var(--secondary), 0.15)', color: 'hsl(var(--text))', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>
                                  {col}
                                </span>
                             ))}
                          </div>

                          {isExpanded && (
                            <div className="terminal-window" style={{ marginTop: '10px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', borderRadius: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                              {data.length === 0 ? (
                                <div style={{ padding: '8px', color: 'hsl(var(--text-muted))', fontSize: '11px', textAlign: 'center' }}>Table is empty.</div>
                              ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                                  <thead>
                                    <tr style={{ background: 'hsla(var(--secondary), 0.1)', borderBottom: '1px solid hsl(var(--border))' }}>
                                      {columns.map(col => (
                                        <th key={col} style={{ padding: '6px 8px', fontWeight: '600', color: 'hsl(var(--secondary))' }}>{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {data.map((row, i) => (
                                      <tr key={i} style={{ borderBottom: '1px solid hsla(var(--border), 0.5)' }}>
                                        {columns.map(col => (
                                          <td key={col} style={{ padding: '6px 8px', color: 'hsl(var(--text))' }}>
                                            {row[col] !== undefined && row[col] !== null ? row[col].toString() : 'NULL'}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* RIGHT: DYNAMIC ENGINE */}
                  <div className="code-editor-wrapper">
                    <div className="editor-header">
                       <Database className="stat-icon" /> <span>Dynamic SQL Compiler</span>
                    </div>
                    <textarea
                      className="code-textarea"
                      style={{ minHeight: '120px' }}
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      placeholder="SELECT * FROM employees;"
                      spellCheck={false}
                    />
                    <div className="editor-footer d-flex justify-content-end">
                       <button className="btn btn-primary" onClick={runSqlSandbox}>
                         <Play className="stat-icon" /> Execute Query
                       </button>
                    </div>
                    <div className="terminal-window">
                       <div className="terminal-header">Results</div>
                       <div className="terminal-content">
                         {sqlError && <span style={{ color: 'hsl(var(--danger))' }}>{sqlError}</span>}
                         {sqlResult && sqlResult.length === 0 && !sqlError && <span style={{ color: 'hsl(var(--text-muted))' }}>0 rows returned.</span>}
                         {sqlResult && sqlResult.length > 0 && (
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                <thead>
                                  <tr>
                                    {Object.keys(sqlResult[0]).map(key => (
                                       <th key={key} style={{ padding: '6px', borderBottom: '1px solid #444', textAlign: 'left', color: 'hsl(var(--primary))' }}>{key}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {sqlResult.map((row, i) => (
                                    <tr key={i}>
                                      {Object.values(row).map((val, j) => (
                                         <td key={j} style={{ padding: '6px', borderBottom: '1px solid #333' }}>{val !== null ? val.toString() : 'NULL'}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                         )}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {sqlSubTab === 'notes' && (
                <div style={{ padding: '20px', background: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}>
                  {renderStudyNotebook("sql_academy_global", "SQL Academy Global Notes")}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DATABRICKS CLOUD ACADEMY */}
          {activeTab === 'databricks' && (
            <div className="card" style={{ gridColumn: 'span 12' }}>
              {/* Sub Navigation Tabs */}
              <div className="d-flex gap-12" style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '16px', marginBottom: '20px' }}>
                <button
                  className={`btn ${databricksSubTab === 'roadmap' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => setDatabricksSubTab('roadmap')}
                >
                  <BookOpen className="stat-icon" /> Databricks Cloud Roadmap (18 Steps)
                </button>
                <button
                  className={`btn ${databricksSubTab === 'playground' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => setDatabricksSubTab('playground')}
                >
                  <Database className="stat-icon" /> PySpark Compiler Simulator
                </button>
                <button
                  className={`btn ${databricksSubTab === 'cheatsheet' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => setDatabricksSubTab('cheatsheet')}
                >
                  <FileText className="stat-icon" /> Command Cheat Sheet & Notes
                </button>
              </div>

              {databricksSubTab === 'roadmap' && (
                /* ROADMAP VIEW */
                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
                  {/* Left Column: Chapters Navigator */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '680px', overflowY: 'auto', paddingRight: '8px' }}>
                    <div style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', color: 'hsl(var(--text-muted))', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Academy Modules
                    </div>
                    {databricksChapters.map((ch) => {
                      const quizDone = databricksQuizState[ch.id]?.checked;
                      const quizCorrect = databricksQuizState[ch.id]?.isCorrect;
                      return (
                        <button
                          key={ch.id}
                          onClick={() => setSelectedDatabricksChapter(ch.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: selectedDatabricksChapter === ch.id ? 'hsl(var(--primary) / 0.08)' : '#ffffff',
                            border: selectedDatabricksChapter === ch.id ? '1px solid hsl(var(--primary) / 0.25)' : '1px solid hsl(var(--border))',
                            color: selectedDatabricksChapter === ch.id ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.title}</span>
                          {quizDone && (
                            quizCorrect ? (
                              <CheckCircle className="stat-icon" style={{ color: 'hsl(var(--success))', width: '14px', height: '14px', flexShrink: 0 }} />
                            ) : (
                              <AlertTriangle className="stat-icon" style={{ color: 'hsl(var(--danger))', width: '14px', height: '14px', flexShrink: 0 }} />
                            )
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: Detailed Chapter View */}
                  {(() => {
                    const ch = databricksChapters.find(c => c.id === selectedDatabricksChapter) || databricksChapters[0];
                    const activeQuiz = databricksQuizState[ch.id] || { selected: null, checked: false, isCorrect: null };
                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                        {/* Chapter Detail Pane */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div className="instruction-step active" style={{ margin: 0, padding: '24px' }}>
                            <span className="step-badge">Module {ch.id} / 18</span>
                            <h2 style={{ color: 'hsl(var(--text))', fontSize: '20px', marginTop: '6px' }}>{ch.title}</h2>
                            <p style={{ marginTop: '8px', fontSize: '14px', lineHeight: '1.5', color: 'hsl(var(--text-muted))' }}>
                              {ch.desc}
                            </p>

                            {/* Practical Code block */}
                            <div style={{ marginTop: '16px' }}>
                              <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'hsl(var(--text-dark))', display: 'block', marginBottom: '6px' }}>
                                Reference Code & SQL Snippet
                              </label>
                              <pre style={{
                                background: '#050508',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '10px',
                                padding: '16px',
                                fontSize: '12.5px',
                                fontFamily: 'JetBrains Mono',
                                color: '#a78bfa',
                                overflowX: 'auto',
                                whiteSpace: 'pre',
                              }}>
                                <code>{ch.code}</code>
                              </pre>
                            </div>

                            <button
                              className="btn btn-primary"
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', marginTop: '16px', padding: '8px 16px' }}
                              onClick={() => loadDatabricksExample(ch.code, ch.title)}
                            >
                              <Play className="stat-icon" /> ⚡ Load Script to Compiler & Run
                            </button>
                          </div>

                          {/* Interactive Exam Prep Quiz Box */}
                          <div className="instruction-step" style={{ margin: 0, padding: '20px', border: '1px solid hsl(var(--border))', background: 'hsla(var(--card), 0.2)' }}>
                            <span className="step-badge purple">📝 Click-to-Verify MCQ</span>
                            <p style={{ marginTop: '8px', fontSize: '14px', fontWeight: '600', color: 'hsl(var(--text))', lineHeight: '1.4' }}>
                              {ch.quiz.question}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                              {ch.quiz.options.map((opt, optIdx) => {
                                const isSelected = activeQuiz.selected === optIdx;
                                let borderCol = 'hsl(var(--border))';
                                let bgCol = 'transparent';
                                if (isSelected) {
                                  borderCol = 'hsl(var(--primary))';
                                  bgCol = 'hsl(var(--primary) / 0.05)';
                                }
                                if (activeQuiz.checked) {
                                  if (optIdx === ch.quiz.correctIndex) {
                                    borderCol = 'hsl(var(--success))';
                                    bgCol = 'hsl(var(--success) / 0.08)';
                                  } else if (isSelected) {
                                    borderCol = 'hsl(var(--danger))';
                                    bgCol = 'hsl(var(--danger) / 0.08)';
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    disabled={activeQuiz.checked}
                                    onClick={() => handleSelectDatabricksQuizOption(ch.id, optIdx)}
                                    style={{
                                      width: '100%',
                                      padding: '10px 14px',
                                      borderRadius: '8px',
                                      border: `1px solid ${borderCol}`,
                                      background: bgCol,
                                      color: activeQuiz.checked && optIdx === ch.quiz.correctIndex ? 'hsl(var(--success))' : isSelected ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
                                      fontSize: '13px',
                                      textAlign: 'left',
                                      cursor: activeQuiz.checked ? 'default' : 'pointer',
                                      transition: 'all 0.15s ease',
                                    }}
                                  >
                                    {String.fromCharCode(65 + optIdx)}. {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {activeQuiz.checked && (
                              <div style={{ marginTop: '14px', borderTop: '1px solid hsl(var(--border))', paddingTop: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 'bold', color: activeQuiz.isCorrect ? 'hsl(var(--success))' : 'hsl(var(--danger))' }}>
                                  {activeQuiz.isCorrect ? (
                                    <>
                                      <CheckCircle className="stat-icon" style={{ color: 'hsl(var(--success))' }} />
                                      Correct! (+20 XP Awarded)
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle className="stat-icon" style={{ color: 'hsl(var(--danger))' }} />
                                      Incorrect
                                    </>
                                  )}
                                </div>
                                <p style={{ fontSize: '12.5px', marginTop: '6px', color: 'hsl(var(--text-muted))', lineHeight: '1.4' }}>
                                  <strong>Explanation:</strong> {ch.quiz.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Sidebar: Quick Reference info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {/* Sidebar Tabs */}
                          <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '8px' }}>
                            <button
                              onClick={() => setDatabricksRightTab('guidelines')}
                              style={{
                                flex: 1,
                                padding: '6px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: databricksRightTab === 'guidelines' ? 'hsla(var(--primary), 0.1)' : 'transparent',
                                border: '1px solid ' + (databricksRightTab === 'guidelines' ? 'hsl(var(--primary))' : 'transparent'),
                                color: databricksRightTab === 'guidelines' ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))'
                              }}
                            >
                              Guidelines
                            </button>
                            <button
                              onClick={() => setDatabricksRightTab('notes')}
                              style={{
                                flex: 1,
                                padding: '6px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: databricksRightTab === 'notes' ? 'hsla(var(--primary), 0.1)' : 'transparent',
                                border: '1px solid ' + (databricksRightTab === 'notes' ? 'hsl(var(--primary))' : 'transparent'),
                                color: databricksRightTab === 'notes' ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))'
                              }}
                            >
                              📝 Notebook
                            </button>
                          </div>

                          {databricksRightTab === 'notes' ? (
                            renderStudyNotebook("databricks_roadmap_" + ch.id, "Notes: " + ch.title)
                          ) : (
                            <>
                              <div className="visualizer-card" style={{ padding: '16px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'hsl(var(--warning))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  💡 Cloud Economics Advice
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px', fontSize: '12.5px', lineHeight: '1.4' }}>
                                  <div style={{ borderLeft: '2px solid hsl(var(--secondary))', paddingLeft: '8px' }}>
                                    <strong style={{ color: 'hsl(var(--text))' }}>Use Ephemeral Job Clusters</strong>
                                    <p style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>Spin up clusters dedicated to a single task run. Job DBUs are 30% cheaper than all-purpose workspace VMs.</p>
                                  </div>
                                  <div style={{ borderLeft: '2px solid hsl(var(--primary))', paddingLeft: '8px' }}>
                                    <strong style={{ color: 'hsl(var(--text))' }}>Enable Auto-Termination</strong>
                                    <p style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>Configure all-purpose workspaces to auto-shutdown after 15-20 minutes of inactivity to prevent runaway cloud bills.</p>
                                  </div>
                                  <div style={{ borderLeft: '2px solid hsl(var(--warning))', paddingLeft: '8px' }}>
                                    <strong style={{ color: 'hsl(var(--text))' }}>Leverage Instance Pools</strong>
                                    <p style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>Keep pre-warmed virtual machine instances idle to slash cluster boot times from 7 minutes to under 40 seconds.</p>
                                  </div>
                                  <div style={{ borderLeft: '2px solid hsl(var(--success))', paddingLeft: '8px' }}>
                                    <strong style={{ color: 'hsl(var(--text))' }}>Spot Instances for Workers</strong>
                                    <p style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>Configure worker nodes to use spot instances (up to 90% discount). Always keep the Driver node as On-Demand.</p>
                                  </div>
                                </div>
                              </div>

                              <div className="visualizer-card" style={{ padding: '16px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'hsl(var(--primary))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  📋 Must-Know Spark SQL APIs
                                </span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                                  {["readStream", "writeStream", "cloudFiles", "dropDuplicates()", "withColumn()", "row_number()", "Window.partitionBy", "OPTIMIZE", "ZORDER BY", "VACUUM", "DeltaTable.forName()", "APPLY CHANGES INTO"].map((m) => (
                                    <code
                                      key={m}
                                      style={{
                                        fontSize: '11px',
                                        fontFamily: 'JetBrains Mono',
                                        color: '#fff',
                                        background: '#050508',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        border: '1px solid hsl(var(--border))',
                                      }}
                                    >
                                      {m}
                                    </code>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {databricksSubTab === 'playground' && (
                /* PLAYGROUND COMPILER VIEW */
                <div className="leetcode-split" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 380px', gap: '20px', alignItems: 'stretch' }}>
                  {/* Left Problem Statement Panel */}
                  <div className="leetcode-problem-panel">
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Select Databricks Problem:
                      </label>
                      <select
                        className="form-select"
                        style={{
                          width: '100%',
                          background: '#ffffff',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          padding: '10px',
                          color: 'hsl(var(--text))',
                          outline: 'none',
                          cursor: 'pointer',
                          fontSize: '13.5px',
                          fontWeight: '500'
                        }}
                        value={databricksActiveTemplate}
                        onChange={(e) => loadPresetTemplate(e.target.value)}
                      >
                        <option value="Ingestion Auto Loader">Auto Loader Stream Ingestion</option>
                        <option value="Medallion Silver Cleaning">Silver Deduplication & Casts</option>
                        <option value="Window running totals">Window Partition Aggregates</option>
                        <option value="Delta Merge CDC">Delta Lake CDC MERGE (Upsert)</option>
                        <option value="Delta compactions (Z-Order)">Delta Lake OPTIMIZE & VACUUM</option>
                        <option value="Unity Catalog governance">Unity Catalog Securables & Grants</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'hsl(var(--text))' }}>
                        {databricksCompilerProblems[databricksActiveTemplate]?.title}
                      </h2>
                      <span className={`leetcode-badge ${databricksCompilerProblems[databricksActiveTemplate]?.difficulty.toLowerCase()}`}>
                        {databricksCompilerProblems[databricksActiveTemplate]?.difficulty}
                      </span>
                    </div>

                    <p style={{ fontSize: '14px', color: 'hsl(var(--text))', lineHeight: '1.6', marginTop: '8px' }}>
                      {databricksCompilerProblems[databricksActiveTemplate]?.statement}
                    </p>

                    <h3 className="leetcode-section-title">Examples</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {databricksCompilerProblems[databricksActiveTemplate]?.examples.map((ex, idx) => (
                        <div key={idx} className="leetcode-example-block">
                          <strong>Example {idx + 1}:</strong><br />
                          <strong>Input:</strong> {ex.input}<br />
                          <strong>Output:</strong> {ex.output}<br />
                          {ex.explanation && (
                            <>
                              <strong>Explanation:</strong> {ex.explanation}
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    <h3 className="leetcode-section-title">Constraints</h3>
                    <ul style={{ paddingLeft: '20px', margin: '4px 0 0 0', fontSize: '13px', color: 'hsl(var(--text-muted))', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {databricksCompilerProblems[databricksActiveTemplate]?.constraints.map((c, idx) => (
                        <li key={idx} style={{ listStyleType: 'disc' }}>{c}</li>
                      ))}
                    </ul>

                    {showDatabricksSolution && (
                      <div style={{ marginTop: '20px', border: '1px solid hsl(var(--primary))', borderRadius: '12px', background: 'hsla(var(--primary), 0.05)', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'hsl(var(--primary))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            💡 Optimal Delta Plan Solution
                          </span>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '2px 8px', fontSize: '11px', height: 'auto' }}
                            onClick={() => setShowDatabricksSolution(false)}
                          >
                            Hide Solution
                          </button>
                        </div>
                        <pre style={{
                          background: '#090d16',
                          color: '#f8fafc',
                          padding: '12px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontFamily: 'var(--font-mono, monospace)',
                          overflowX: 'auto',
                          border: '1px solid #1e293b',
                          margin: 0
                        }}>
                          <code>{databricksCompilerProblems[databricksActiveTemplate]?.solution}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Right Editor & Console Panel */}
                  <div className="flex-column d-flex gap-16">
                    <div className="editor-container" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
                      <div className="editor-header">
                        <div className="editor-dots">
                          <div className="editor-dot"></div>
                          <div className="editor-dot"></div>
                          <div className="editor-dot"></div>
                        </div>
                        <span className="editor-title">{databricksActiveTemplate.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 20)}.py</span>
                      </div>

                      <div className="editor-body" style={{ flex: 1, display: 'flex' }}>
                        <textarea
                          className="code-textarea"
                          placeholder="Write your Databricks script here..."
                          value={databricksCode}
                          onChange={e => setDatabricksCode(e.target.value)}
                          style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', width: '100%', flex: 1, minHeight: '260px' }}
                        />
                      </div>

                      <div className="editor-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#f8fafc', borderTop: '1px solid hsl(var(--border))' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => loadPresetTemplate(databricksActiveTemplate)}>
                            Reset Code
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px', background: showDatabricksSolution ? 'hsla(var(--primary), 0.1)' : 'transparent', borderColor: showDatabricksSolution ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
                            onClick={() => setShowDatabricksSolution(!showDatabricksSolution)}
                          >
                            {showDatabricksSolution ? 'Hide Solution' : 'Show Solution'}
                          </button>
                        </div>
                        <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={runDatabricksPlayground}>
                          <Play className="stat-icon" style={{ width: '14px', height: '14px' }} /> Run Code
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="leetcode-console-header">
                        <label style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', fontWeight: '600', display: 'block', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Simulated Databricks Output Console:
                        </label>
                        <div className="leetcode-console-status">
                          {databricksTerminalStatus === 'running' && (
                            <span className="leetcode-status-tag running">Photon Active</span>
                          )}
                          {databricksTerminalStatus === 'success' && (
                            <span className="leetcode-status-tag accepted">Photon Success</span>
                          )}
                          {databricksTerminalStatus === 'error' && (
                            <span className="leetcode-status-tag wrong-answer">Compile Halted</span>
                          )}
                        </div>
                      </div>
                      <div className={`terminal-output ${databricksTerminalStatus}`} style={{ minHeight: '160px', maxHeight: '240px', overflowY: 'auto', fontFamily: 'var(--font-mono, monospace)', fontSize: '12.5px', whiteSpace: 'pre-wrap', background: '#090d16', color: '#38bdf8', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                        {databricksTerminalOutput || 'Databricks execution console is clean. Click "Run Code" to trigger execution.'}
                      </div>
                    </div>
                  </div>
                  {renderStudyNotebook("databricks_playground_" + databricksActiveTemplate.toLowerCase().replace(/[^a-z0-9]+/g, '_'), "Notes: " + databricksActiveTemplate)}
                </div>
              )}

              {databricksSubTab === 'cheatsheet' && (
                /* CHEATSHEET & NOTES VIEW */
                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 380px', gap: '20px' }}>
                  {/* Left Column: Category selector list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '680px', overflowY: 'auto', paddingRight: '8px' }}>
                    <div style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', color: 'hsl(var(--text-muted))', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Command Categories
                    </div>
                    {databricksCheatsheetData.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCheatsheetCat(cat.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: activeCheatsheetCat === cat.id ? 'hsl(var(--primary) / 0.08)' : '#ffffff',
                          border: activeCheatsheetCat === cat.id ? '1px solid hsl(var(--primary) / 0.25)' : '1px solid hsl(var(--border))',
                          color: activeCheatsheetCat === cat.id ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>

                  {/* Right Column: Detailed notes pane */}
                  {(() => {
                    const activeCat = databricksCheatsheetData.find(c => c.id === activeCheatsheetCat) || databricksCheatsheetData[0];
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Summary Block */}
                        <div className="instruction-step active" style={{ margin: 0, padding: '24px' }}>
                          <span className="step-badge">Category: {activeCat.title.split('. ')[1]}</span>
                          <h2 style={{ color: 'hsl(var(--text))', fontSize: '20px', marginTop: '6px' }}>{activeCat.title}</h2>
                          <p style={{ marginTop: '8px', fontSize: '14.5px', lineHeight: '1.5', color: 'hsl(var(--text-muted))' }}>
                            {activeCat.desc}
                          </p>
                        </div>

                        {/* Commands Details Grid */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <h3 style={{ color: 'hsl(var(--text))', fontSize: '15px', fontWeight: 'bold' }}>📋 Commands & Syntax Runbook</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {activeCat.commands.map((cmd, idx) => (
                              <div
                                key={idx}
                                style={{
                                  background: 'hsla(var(--card), 0.2)',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '8px'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'hsl(var(--primary))', fontFamily: 'JetBrains Mono' }}>
                                    {cmd.name}
                                  </span>
                                  <span className="badge-outline" style={{ fontSize: '10px' }}>Core API</span>
                                </div>
                                <p style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', lineHeight: '1.4' }}>
                                  {cmd.desc}
                                </p>
                                <pre style={{
                                  background: '#050508',
                                  border: '1px solid hsl(var(--border) / 0.5)',
                                  borderRadius: '6px',
                                  padding: '10px 14px',
                                  fontSize: '12px',
                                  fontFamily: 'JetBrains Mono',
                                  color: '#38bdf8',
                                  overflowX: 'auto',
                                  margin: 0,
                                  whiteSpace: 'pre'
                                }}>
                                  <code>{cmd.syntax}</code>
                                </pre>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Compiler loader block */}
                        <div className="visualizer-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'hsl(var(--warning))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            ⚡ Playground Compiler Integration
                          </span>
                          <p style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', lineHeight: '1.4' }}>
                            Load the PySpark/SQL reference block for <strong>{activeCat.title.split('. ')[1]}</strong> directly into the Compiler Simulator to run tests and monitor execution output logs instantly.
                          </p>
                          <pre style={{
                            background: '#050508',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            padding: '12px',
                            fontSize: '11.5px',
                            fontFamily: 'JetBrains Mono',
                            color: '#e9d5ff',
                            overflowX: 'auto',
                            whiteSpace: 'pre'
                          }}>
                            <code>{activeCat.pysparkCode}</code>
                          </pre>
                          <button
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', padding: '8px 16px', fontSize: '13px' }}
                            onClick={() => loadDatabricksExample(activeCat.pysparkCode, activeCat.title.split('. ')[1])}
                          >
                            <Play className="stat-icon" /> ⚡ Load Reference into Simulator Compiler
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                  {renderStudyNotebook("databricks_cheatsheet_" + activeCat.id, "Notes: " + activeCat.title)}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DOCKER ORCHESTRATION */}
          {activeTab === 'docker' && (
            <div className="card" style={{ gridColumn: 'span 12' }}>
              <div className="playground-split" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 380px', gap: '20px', alignItems: 'stretch' }}>
                <div className="playground-instructions">
                  <div className="card-title-container">
                    <div className="card-header-with-icon">
                      <Terminal className="card-header-icon" />
                      <div>
                        <h2>Docker Track: Local Ollama Orchestration</h2>
                        <p className="card-subtitle">Spin up local AI CORS models using Docker Compose</p>
                      </div>
                    </div>
                  </div>

                  {dockerStep === 1 && (
                    <div className="instruction-step active">
                      <span className="step-badge">Task 1</span>
                      <h3>Launch the Docker Compose Service</h3>
                      <p>
                        To run Ollama with cross-origin access enabled (which allows our web portal to connect directly), you must deploy the compose file. Type the command to spin up services in detached/background mode.
                      </p>
                      <p style={{ marginTop: '12px' }}>
                        Expected Command: <code>docker-compose up -d</code>
                      </p>
                    </div>
                  )}

                  {dockerStep === 2 && (
                    <div className="instruction-step active">
                      <span className="step-badge">Task 2</span>
                      <h3>Check Active Container Logs</h3>
                      <p>
                        Great! Now, verify that the server is listening correctly and CORS header values are loaded (<code>OLLAMA_ORIGINS=*</code>). Type the command to view logs of your container.
                      </p>
                      <p style={{ marginTop: '12px' }}>
                        Expected Command: <code>docker logs learning_platform_ollama</code>
                      </p>
                    </div>
                  )}

                  {dockerStep === 3 && (
                    <div className="instruction-step active" style={{ borderColor: 'hsl(var(--success) / 0.5)' }}>
                      <span className="step-badge" style={{ background: 'hsl(var(--success) / 0.1)', color: 'hsl(var(--success))' }}>Complete</span>
                      <h3>Docker Pipeline Fully Verified!</h3>
                      <p>
                        Excellent job. Your Ollama Docker container is configured to receive direct browser connections on port <code>11434</code>. You are ready to chat with private, locally compiled LLMs.
                      </p>
                      <button
                        className="btn btn-secondary"
                        style={{ marginTop: '12px' }}
                        onClick={() => { setDockerStep(1); setDockerStatus('stopped'); setDockerLogsActive(false); setDockerOutput(''); }}
                      >
                        Reset Track
                      </button>
                    </div>
                  )}
                </div>

                {/* Docker Terminal Side */}
                <div className="flex-column d-flex gap-16">
                  {/* Container State Visualizer */}
                  <div className="visualizer-card">
                    <span style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', fontWeight: 'bold' }}>
                      Cluster Orchestration Graph
                    </span>
                    <div className="state-diagram" style={{ marginTop: '12px' }}>
                      <div className={`diagram-node ${dockerStatus === 'running' ? 'success' : ''}`}>
                        <Cpu className="node-icon" /> Host Engine
                      </div>
                      <div className={`diagram-arrow ${dockerStatus === 'running' ? 'active' : ''}`}></div>
                      <div className={`diagram-node ${dockerStatus === 'running' ? 'success' : ''}`}>
                        <Layers className="node-icon" /> Docker Daemon
                      </div>
                      <div className={`diagram-arrow ${dockerLogsActive ? 'active' : ''}`}></div>
                      <div className={`diagram-node ${dockerLogsActive ? 'success' : ''}`}>
                        <Terminal className="node-icon" /> Ollama Container
                      </div>
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '12px' }}>
                      Active Status: {dockerStatus === 'running' ? (
                        <span style={{ color: 'hsl(var(--success))', fontWeight: '700' }}>[Container Active - port 11434]</span>
                      ) : (
                        <span style={{ color: 'hsl(var(--danger))' }}>[Offline / Deployed Standby]</span>
                      )}
                    </div>
                  </div>

                  <div className="editor-container">
                    <div className="editor-header">
                      <div className="editor-dots">
                        <div className="editor-dot"></div>
                        <div className="editor-dot"></div>
                        <div className="editor-dot"></div>
                      </div>
                      <span className="editor-title">bash_terminal</span>
                    </div>

                    <div className="editor-body" style={{ minHeight: '120px' }}>
                      <div className="command-input-row">
                        <span className="terminal-prompt">ACER@DESKTOP-LEARN MINGW64 ~/LEARN</span>
                      </div>
                      <div className="command-input-row">
                        <span className="terminal-prompt">$</span>
                        <input
                          type="text"
                          className="terminal-text-input"
                          placeholder="Type command here..."
                          value={dockerInput}
                          onChange={e => setDockerInput(e.target.value)}
                          disabled={dockerStep > 2}
                          onKeyDown={e => e.key === 'Enter' && runDockerPlayground()}
                        />
                      </div>
                    </div>

                    <div className="editor-footer">
                      <span style={{ fontSize: '11px', color: 'hsl(var(--text-dark))' }}>Press Enter to Execute</span>
                      <button className="btn btn-primary" onClick={runDockerPlayground} disabled={dockerStep > 2}>
                        Run Command
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className={`terminal-output ${dockerStatus === 'running' ? 'success' : ''}`}>
                      {dockerOutput || 'Terminal output logs will stream here...'}
                    </div>
                  </div>
                  {renderStudyNotebook("docker_playground", "Notes: Docker Containers")}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KAFKA INGESTION */}
          {activeTab === 'kafka' && (
            <div className="card" style={{ gridColumn: 'span 12' }}>
              <div className="playground-split" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 380px', gap: '20px', alignItems: 'stretch' }}>
                <div className="playground-instructions">
                  <div className="card-title-container">
                    <div className="card-header-with-icon">
                      <Cpu className="card-header-icon" />
                      <div>
                        <h2>Kafka Ingestion: High-Volume Ingestions</h2>
                        <p className="card-subtitle">Master brokers, partitions, and consumers</p>
                      </div>
                    </div>
                  </div>

                  {kafkaStep === 1 && (
                    <div className="instruction-step active">
                      <span className="step-badge">Challenge 1</span>
                      <h3>Create a Partitioned Ingestion Topic</h3>
                      <p>
                        Initialize a Kafka topic named <code>interview-prep</code> to receive streaming datasets. Set up standard connection coordinates pointing to the local broker port <code>9092</code>.
                      </p>
                      <p style={{ marginTop: '12px' }}>
                        Expected Command:<br />
                        <code>kafka-topics.sh --create --topic interview-prep --bootstrap-server localhost:9092</code>
                      </p>
                    </div>
                  )}

                  {kafkaStep === 2 && (
                    <div className="instruction-step active">
                      <span className="step-badge purple">Challenge 2</span>
                      <h3>Start Streaming Ingestion Messages</h3>
                      <p>
                        Excellent, the topic queue is live. Next, spin up the console producer utility to stream raw cloud logs directly into the partitions.
                      </p>
                      <p style={{ marginTop: '12px' }}>
                        Expected Command:<br />
                        <code>kafka-console-producer.sh --topic interview-prep --bootstrap-server localhost:9092</code>
                      </p>
                    </div>
                  )}

                  {kafkaStep === 3 && (
                    <div className="instruction-step active">
                      <span className="step-badge">Challenge 3</span>
                      <h3>Subscribe and Consume Message Stream</h3>
                      <p>
                        Perfect. Complete the pipeline loop. Spin up the console consumer utility to read all streamed queue logs from the absolute beginning.
                      </p>
                      <p style={{ marginTop: '12px' }}>
                        Expected Command:<br />
                        <code>kafka-console-consumer.sh --topic interview-prep --from-beginning --bootstrap-server localhost:9092</code>
                      </p>
                    </div>
                  )}

                  {kafkaStep > 3 && (
                    <div className="instruction-step active" style={{ borderColor: 'hsl(var(--success) / 0.5)' }}>
                      <span className="step-badge" style={{ background: 'hsl(var(--success) / 0.1)', color: 'hsl(var(--success))' }}>Active</span>
                      <h3>Kafka Streaming Verified!</h3>
                      <p>
                        Congratulations! You have modeled high-throughput, partitioned stream ingestion. This is how platforms like Netflix ingest millions of real-time server records into analytical platforms.
                      </p>
                      <button
                        className="btn btn-secondary"
                        style={{ marginTop: '12px' }}
                        onClick={() => { setKafkaStep(1); setKafkaActiveNodes({ producer: false, broker: false, consumer: false }); setKafkaOutput(''); }}
                      >
                        Reset Track
                      </button>
                    </div>
                  )}
                </div>

                {/* Kafka visual and console side */}
                <div className="flex-column d-flex gap-16">
                  {/* Kafka Stream Graph */}
                  <div className="visualizer-card">
                    <span style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', fontWeight: 'bold' }}>
                      Streaming Infrastructure Topology
                    </span>
                    <div className="state-diagram" style={{ marginTop: '12px' }}>
                      <div className={`diagram-node ${kafkaActiveNodes.producer ? 'success' : ''}`}>
                        <Cpu className="node-icon" /> Producer
                      </div>
                      <div className={`diagram-arrow ${kafkaActiveNodes.producer ? 'active' : ''}`}></div>
                      <div className={`diagram-node ${kafkaActiveNodes.broker ? 'success' : ''}`}>
                        <Database className="node-icon" /> Broker Cluster
                      </div>
                      <div className={`diagram-arrow ${kafkaActiveNodes.consumer ? 'active' : ''}`}></div>
                      <div className={`diagram-node ${kafkaActiveNodes.consumer ? 'success' : ''}`}>
                        <Layers className="node-icon" /> Consumer Group
                      </div>
                    </div>
                  </div>

                  <div className="editor-container">
                    <div className="editor-header">
                      <div className="editor-dots">
                        <div className="editor-dot"></div>
                        <div className="editor-dot"></div>
                        <div className="editor-dot"></div>
                      </div>
                      <span className="editor-title">kafka_console_bash</span>
                    </div>

                    <div className="editor-body" style={{ minHeight: '120px' }}>
                      <div className="command-input-row">
                        <span className="terminal-prompt">root@kafka-broker:/usr/bin#</span>
                      </div>
                      <div className="command-input-row">
                        <span className="terminal-prompt">#</span>
                        <input
                          type="text"
                          className="terminal-text-input"
                          placeholder="Write Kafka cluster instructions..."
                          value={kafkaInput}
                          onChange={e => setKafkaInput(e.target.value)}
                          disabled={kafkaStep > 3}
                          onKeyDown={e => e.key === 'Enter' && runKafkaPlayground()}
                        />
                      </div>
                    </div>

                    <div className="editor-footer">
                      <span style={{ fontSize: '11px', color: 'hsl(var(--text-dark))' }}>Check expected instructions</span>
                      <button className="btn btn-primary" onClick={runKafkaPlayground} disabled={kafkaStep > 3}>
                        Execute Ingestion
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="terminal-output" style={{ background: '#050508' }}>
                      {kafkaOutput || 'Stream output messages queue empty...'}
                    </div>
                  </div>
                </div>
                {renderStudyNotebook("kafka_playground", "Notes: Kafka Streams")}
              </div>
            </div>
          )}

          {/* TAB 5: AIRFLOW WORKFLOWS */}
          {activeTab === 'airflow' && (
            <div className="card" style={{ gridColumn: 'span 12' }}>
              <div className="playground-split" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 380px', gap: '20px', alignItems: 'stretch' }}>
                <div className="playground-instructions">
                  <div className="card-title-container">
                    <div className="card-header-with-icon">
                      <RefreshCw className="card-header-icon" />
                      <div>
                        <h2>Airflow: DAG Pipeline Orchestrations</h2>
                        <p className="card-subtitle">Define workflows, dependencies, and verify tasks</p>
                      </div>
                    </div>
                  </div>

                  {airflowStep === 1 && (
                    <div className="instruction-step active">
                      <span className="step-badge">Goal 1</span>
                      <h3>Query Pipeline Manifests</h3>
                      <p>
                        To verify if your pipelines are active on the Airflow scheduler, list all available DAG files compiled under the DAG folder.
                      </p>
                      <p style={{ marginTop: '12px' }}>
                        Expected Command: <code>airflow dags list</code>
                      </p>
                    </div>
                  )}

                  {airflowStep === 2 && (
                    <div className="instruction-step active">
                      <span className="step-badge purple">Goal 2</span>
                      <h3>Trigger Ingestion DAG</h3>
                      <p>
                        Great, <code>data_cleaning_pipeline</code> is compiled. Now, trigger the DAG manually to orchestrate the ETL stages: Extract raw dirty data, Clean/Transform using Spark, and Load to target Snowflake cloud tables.
                      </p>
                      <p style={{ marginTop: '12px' }}>
                        Expected Command: <code>airflow dags trigger data_cleaning_pipeline</code>
                      </p>
                    </div>
                  )}

                  {airflowStep > 2 && (
                    <div className="instruction-step active" style={{ borderColor: 'hsl(var(--success) / 0.5)' }}>
                      <span className="step-badge" style={{ background: 'hsl(var(--success) / 0.1)', color: 'hsl(var(--success))' }}>Success</span>
                      <h3>ETL Orchestration Successful!</h3>
                      <p>
                        Perfect! The scheduler has successfully triggered the tasks. Watch the visual node graphs to check processing and staging flow.
                      </p>
                      <button
                        className="btn btn-secondary"
                        style={{ marginTop: '12px' }}
                        onClick={() => { setAirflowStep(1); setAirflowDagState({ extract: 'idle', clean: 'idle', load: 'idle' }); setAirflowOutput(''); }}
                      >
                        Reset Track
                      </button>
                    </div>
                  )}
                </div>

                {/* Airflow Visual task graph and Console */}
                <div className="flex-column d-flex gap-16">
                  {/* Task Graph Nodes */}
                  <div className="visualizer-card">
                    <span style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', fontWeight: 'bold' }}>
                      DAG Topology View: data_cleaning_pipeline
                    </span>
                    <div className="state-diagram" style={{ marginTop: '12px' }}>
                      <div className={`diagram-node ${
                        airflowDagState.extract === 'running' ? 'active' : ''
                      } ${airflowDagState.extract === 'success' ? 'success' : ''}`}>
                        <Download className="node-icon" /> extract_data
                      </div>
                      <div className={`diagram-arrow ${airflowDagState.clean === 'running' || airflowDagState.clean === 'success' ? 'active' : ''}`}></div>
                      <div className={`diagram-node ${
                        airflowDagState.clean === 'running' ? 'active' : ''
                      } ${airflowDagState.clean === 'success' ? 'success' : ''}`}>
                        <Database className="node-icon" /> clean_data
                      </div>
                      <div className={`diagram-arrow ${airflowDagState.load === 'running' || airflowDagState.load === 'success' ? 'active' : ''}`}></div>
                      <div className={`diagram-node ${
                        airflowDagState.load === 'running' ? 'active' : ''
                      } ${airflowDagState.load === 'success' ? 'success' : ''}`}>
                        <Layers className="node-icon" /> load_snowflake
                      </div>
                    </div>
                  </div>

                  <div className="editor-container">
                    <div className="editor-header">
                      <div className="editor-dots">
                        <div className="editor-dot"></div>
                        <div className="editor-dot"></div>
                        <div className="editor-dot"></div>
                      </div>
                      <span className="editor-title">airflow_worker_terminal</span>
                    </div>

                    <div className="editor-body" style={{ minHeight: '120px' }}>
                      <div className="command-input-row">
                        <span className="terminal-prompt">airflow@airflow-scheduler:~$</span>
                      </div>
                      <div className="command-input-row">
                        <span className="terminal-prompt">$</span>
                        <input
                          type="text"
                          className="terminal-text-input"
                          placeholder="Type Airflow orchestration CLI commands..."
                          value={airflowInput}
                          onChange={e => setAirflowInput(e.target.value)}
                          disabled={airflowStep > 2}
                          onKeyDown={e => e.key === 'Enter' && runAirflowPlayground()}
                        />
                      </div>
                    </div>

                    <div className="editor-footer">
                      <span style={{ fontSize: '11px', color: 'hsl(var(--text-dark))' }}>Press Enter to deploy tasks</span>
                      <button className="btn btn-primary" onClick={runAirflowPlayground} disabled={airflowStep > 2}>
                        Trigger DAG
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="terminal-output" style={{ background: '#050508' }}>
                      {airflowOutput || 'No DAG task runs triggered yet.'}
                    </div>
                  </div>
                  {renderStudyNotebook("airflow_playground", "Notes: Airflow Pipelines")}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ERROR LOGGER */}
          {activeTab === 'errors' && (
            <div className="card" style={{ gridColumn: 'span 12' }}>
              <div className="error-logger-container">
                {/* Form to log error */}
                <div className="flex-column d-flex">
                  <div className="card-title-container">
                    <div className="card-header-with-icon">
                      <AlertTriangle className="card-header-icon" style={{ color: 'hsl(var(--warning))' }} />
                      <div>
                        <h2>Log System & Pipeline Bug</h2>
                        <p className="card-subtitle">Connects to MongoDB Atlas for persistence</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleCreateError}>
                    <div className="form-group">
                      <label>Bug Title / Component Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. PySpark JVM OutOfMemoryError"
                        value={newError.title}
                        onChange={e => setNewError({ ...newError, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Failed Terminal Log / Error Message</label>
                      <textarea
                        className="form-textarea"
                        style={{ fontFamily: 'JetBrains Mono', fontSize: '13px' }}
                        placeholder="Paste terminal log stacktrace..."
                        value={newError.logContent}
                        onChange={e => setNewError({ ...newError, logContent: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Cloud Security / Engineering Solution</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Explain resolution architectural steps..."
                        value={newError.solution}
                        onChange={e => setNewError({ ...newError, solution: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label>Category Tag</label>
                        <select
                          className="form-select w-full"
                          value={newError.tag}
                          onChange={e => setNewError({ ...newError, tag: e.target.value })}
                        >
                          <option value="Docker">Docker</option>
                          <option value="Kafka">Kafka</option>
                          <option value="Airflow">Airflow</option>
                          <option value="PySpark">PySpark</option>
                          <option value="Snowflake">Snowflake</option>
                          <option value="Cloud Security">Cloud Security</option>
                          <option value="SQL">SQL</option>
                        </select>
                      </div>
                      <div>
                        <label>Status</label>
                        <select
                          className="form-select w-full"
                          value={newError.status}
                          onChange={e => setNewError({ ...newError, status: e.target.value })}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Solved">Solved</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '12px' }} disabled={syncing}>
                      {syncing ? 'Syncing with MongoDB...' : 'Log Bug to MongoDB Atlas'}
                    </button>
                  </form>
                </div>

                {/* Rendered Errors list */}
                <div className="flex-column d-flex gap-16">
                  <div className="card-title-container">
                    <div className="d-flex align-items-center gap-12 w-full">
                      <div className="form-group w-full" style={{ margin: 0 }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <Search style={{ position: 'absolute', left: '12px', width: '16px', height: '16px', color: 'hsl(var(--text-dark))' }} />
                          <input
                            type="text"
                            className="form-input w-full"
                            style={{ paddingLeft: '38px', borderRadius: '8px', fontSize: '13px' }}
                            placeholder="Filter bugs by title, topic tag..."
                            value={errorSearch}
                            onChange={e => setErrorSearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="logs-list" style={{ maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
                    {errorLogs
                      .filter(item =>
                        item.title.toLowerCase().includes(errorSearch.toLowerCase()) ||
                        item.tag.toLowerCase().includes(errorSearch.toLowerCase())
                      )
                      .map((log, index) => (
                        <div key={log._id || index} className="log-item">
                          <div className="log-item-header">
                            <div>
                              <span className="tag-pill" style={{ marginRight: '8px' }}>{log.tag}</span>
                              <span className={`status-pill ${log.status.toLowerCase()}`}>{log.status}</span>
                              <h3 className="log-item-title" style={{ marginTop: '8px' }}>{log.title}</h3>
                            </div>
                            <div className="d-flex gap-8">
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '6px' }}
                                title="Toggle Status"
                                onClick={() => handleToggleErrorStatus(log._id, log.status)}
                              >
                                <Check className="stat-icon" />
                              </button>
                              <button
                                className="btn btn-danger"
                                style={{ padding: '6px' }}
                                title="Delete Bug"
                                onClick={() => handleDeleteError(log._id)}
                              >
                                <Trash2 className="stat-icon" />
                              </button>
                            </div>
                          </div>
                          <div className="log-item-code">{log.logContent}</div>
                          <div className="log-item-solution">
                            <strong>Cloud Architect Solution:</strong> {log.solution}
                          </div>
                        </div>
                      ))}
                    {errorLogs.length === 0 && (
                      <div className="instruction-step" style={{ textAlign: 'center', padding: '40px' }}>
                        <AlertTriangle className="stat-icon" style={{ width: '32px', height: '32px', margin: '0 auto 12px auto', color: 'hsl(var(--text-dark))' }} />
                        <p>No error logs documented yet. Log a bug to secure your XP gains!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MY NOTES */}
          {activeTab === 'revisions' && (
            <div className="card" style={{ gridColumn: 'span 12' }}>
              <div className="error-logger-container">
                {/* Custom Note Adder */}
                <div className="flex-column d-flex">
                  <div className="card-title-container">
                    <div className="card-header-with-icon">
                      <FileText className="card-header-icon" />
                      <div>
                        <h2>Create Custom Revision Note</h2>
                        <p className="card-subtitle">Perfect for interview scenario-based preps</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleCreateCustomNote}>
                    <div className="form-group">
                      <label>Note Title / Topic</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. AWS VPC Private Link to Snowflake"
                        value={newCustomNote.title}
                        onChange={e => setNewCustomNote({ ...newCustomNote, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Note Category Tag</label>
                      <select
                        className="form-select w-full"
                        value={newCustomNote.category}
                        onChange={e => setNewCustomNote({ ...newCustomNote, category: e.target.value })}
                      >
                        <option value="General">General</option>
                        <option value="Snowflake">Snowflake</option>
                        <option value="Spark">Spark</option>
                        <option value="Cloud Security">Cloud Security</option>
                        <option value="SQL scenarios">SQL scenarios</option>
                        <option value="AI Revision">AI Revision</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Content / Architectural Details</label>
                      <textarea
                        className="form-textarea"
                        style={{ minHeight: '220px' }}
                        placeholder="Write structural definitions, tips, and secure architecture configurations here..."
                        value={newCustomNote.answer}
                        onChange={e => setNewCustomNote({ ...newCustomNote, answer: e.target.value })}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={syncing}>
                      {syncing ? 'Saving Note to Atlas...' : 'Save Note to MongoDB Atlas'}
                    </button>
                  </form>
                </div>

                {/* Notes list and filters */}
                <div className="flex-column d-flex gap-16">
                  <div className="card-title-container">
                    <div className="d-flex align-items-center justify-content-between w-full gap-12">
                      <div className="form-group" style={{ margin: 0, flexGrow: 1 }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <Search style={{ position: 'absolute', left: '12px', width: '16px', height: '16px', color: 'hsl(var(--text-dark))' }} />
                          <input
                            type="text"
                            className="form-input w-full"
                            style={{ paddingLeft: '38px', borderRadius: '8px', fontSize: '13px' }}
                            placeholder="Search revision notes..."
                            value={noteSearch}
                            onChange={e => setNoteSearch(e.target.value)}
                          />
                        </div>
                      </div>
                      <button className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }} onClick={exportNotesToMarkdown}>
                        <Download className="stat-icon" /> Export as Markdown
                      </button>
                    </div>
                  </div>

                  <div className="d-flex gap-8 flex-wrap" style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '12px' }}>
                    {['All', 'General', 'Snowflake', 'Spark', 'Cloud Security', 'SQL scenarios', 'AI Revision'].map(cat => (
                      <button
                        key={cat}
                        className={`btn ${noteFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '6px' }}
                        onClick={() => setNoteFilter(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="notes-grid" style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                    {revisions
                      .filter(item => noteFilter === 'All' || item.category === noteFilter)
                      .filter(item =>
                        item.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
                        item.answer.toLowerCase().includes(noteSearch.toLowerCase())
                      )
                      .map((note, index) => (
                        <div key={note._id || index} className="note-card">
                          <div className="note-title-row">
                            <span className="tag-pill">{note.category}</span>
                            <button
                              className="btn btn-danger"
                              style={{ padding: '4px', background: 'transparent', borderColor: 'transparent' }}
                              onClick={() => handleDeleteRevision(note._id)}
                            >
                              <Trash2 className="stat-icon" style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                          <h3 className="note-question">{note.title}</h3>
                          {note.question && note.question !== 'Custom Note Logged' && (
                            <div style={{ fontSize: '11px', color: 'hsl(var(--primary))', fontStyle: 'italic' }}>
                              Prompt: "{parseInlineMarkdown(note.question)}"
                            </div>
                          )}
                          <div className="note-answer markdown-body">{renderMarkdown(note.answer)}</div>
                          <div className="note-footer">
                            <span>Saved to Atlas</span>
                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    {revisions.length === 0 && (
                      <div className="instruction-step" style={{ textAlign: 'center', padding: '40px', gridColumn: 'span 2' }}>
                        <FileText className="stat-icon" style={{ width: '32px', height: '32px', margin: '0 auto 12px auto', color: 'hsl(var(--text-dark))' }} />
                        <p>No notes logged yet. Capture coach answers or write custom definitions!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="card" style={{ gridColumn: 'span 12' }}>
              <div className="card-title-container">
                <div className="card-header-with-icon">
                  <SettingsIcon className="card-header-icon" />
                  <div>
                    <h2>Platform Settings & Integrations</h2>
                    <p className="card-subtitle">Manage connection credentials and AI endpoints</p>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>1. Grok (xAI) API — AI Coach</h3>
                <div style={{
                  padding: '10px 14px',
                  background: 'linear-gradient(90deg, hsl(142 70% 10%), hsl(210 70% 12%))',
                  border: '1px solid hsl(142 50% 30%)',
                  borderRadius: '8px',
                  marginBottom: '14px',
                  fontSize: '12.5px',
                  color: 'hsl(142 70% 70%)'
                }}>
                  ✅ <strong>Ollama removed.</strong> The AI Coach now uses <strong>Groq AI (LLaMA)</strong> securely via server-side environment variables.
                </div>
                <div className="form-group">
                  <label>Groq API Key (<code>llm_api</code> in .env)</label>
                  <input
                    type="password"
                    className="form-input"
                    value={googleStudioApiKey}
                    onChange={e => setGoogleStudioApiKey(e.target.value)}
                    placeholder="Enter your custom Groq API key (gsk_...) or leave blank to use .env..."
                  />
                  <p style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', marginTop: '6px' }}>
                    Leave blank to use the <code>llm_api</code> key defined in your <code>.env</code> file. Get your key at{' '}
                    <a href="https://console.groq.com" target="_blank" rel="noreferrer" style={{ color: 'hsl(var(--primary))' }}>console.groq.com</a>.
                    &nbsp;Model in use: <code>llama-3.3-70b-versatile</code>.
                  </p>
                </div>
              </div>

              <div className="settings-section">
                <h3>2. MongoDB Atlas Environment Configurations</h3>
                <div className="instruction-step">
                  <span className="step-badge">Cloud Storage</span>
                  <h3>Vercel & Atlas Secure Storage Protocol</h3>
                  <p style={{ fontSize: '13.5px', marginTop: '6px' }}>
                    This application is fully production-ready. When deploying to **Vercel**, simply define your <code>MONGODB_URI</code> inside Vercel's Environment Variables panel. Mongoose connection pooling is pre-implemented to handle Vercel's serverless connection scaling.
                  </p>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                    <span className="badge-outline">Pooled Connections</span>
                    <span className="badge-outline">Auto-Failover</span>
                    <span className="badge-outline">Encryption Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}
      {/* FLOATING AI COACH WIDGET */}
      <div style={{ position: 'relative', zIndex: 9999 }}>
        {/* Floating Button */}
        <button
          onClick={() => setShowFloatingChat(!showFloatingChat)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
            color: '#fff',
            border: 'none',
            boxShadow: btnHovered ? '0 12px 40px rgba(0, 0, 0, 0.6)' : '0 8px 32px rgba(0, 0, 0, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: btnHovered ? 'scale(1.08) rotate(15deg)' : 'scale(1)',
            zIndex: 9999
          }}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          title="Open AI Coach"
        >
          {showFloatingChat ? (
            <X style={{ width: '22px', height: '22px' }} />
          ) : (
            <MessageSquare style={{ width: '22px', height: '22px' }} />
          )}
        </button>

        {/* Floating Chat Box */}
        {showFloatingChat && (
          <div
            style={{
              position: 'fixed',
              bottom: '92px',
              right: '24px',
              width: '385px',
              height: '530px',
              borderRadius: '16px',
              background: 'hsla(224, 25%, 12%, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid hsla(var(--border), 0.7)',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 9999,
              animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="chat-box" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="chat-header" style={{ padding: '12px 16px', borderBottom: '1px solid hsla(var(--border), 0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'hsla(var(--card), 0.5)' }}>
                <div className="d-flex align-items-center gap-8">
                  <div className="editor-dot" style={{ background: '#27c93f', width: '8px', height: '8px' }}></div>
                  <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'hsl(var(--text))' }}>
                    Groq LLaMA AI Coach
                  </span>
                </div>
                <button
                  onClick={() => setShowFloatingChat(false)}
                  style={{ background: 'none', border: 'none', color: 'hsl(var(--text-muted))', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

              {/* Chat messages stream */}
              <div className="chat-history" style={{ flexGrow: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '390px' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`chat-message ${msg.sender}`} style={{ margin: 0 }}>
                    <div className="markdown-body" style={{ fontSize: '12.5px', lineHeight: '1.4' }}>
                      {renderMarkdown(msg.text)}
                    </div>
                    {msg.sender === 'ai' && i > 0 && (
                      <button
                        className="btn btn-secondary"
                        style={{ marginTop: '8px', padding: '3px 8px', fontSize: '10px' }}
                        onClick={() => handleSaveRevision(
                          `AI Coach: ${chatMessages[i - 1].text.substring(0, 30)}...`,
                          chatMessages[i - 1].text,
                          msg.text,
                          'AI Revision'
                        )}
                      >
                        <Plus className="stat-icon" style={{ width: '10px', height: '10px' }} /> Save to Notes
                      </button>
                    )}
                  </div>
                ))}
                {aiLoading && (
                  <div className="chat-message ai d-flex gap-8 align-items-center" style={{ margin: 0 }}>
                    <RefreshCw className="stat-icon spin" style={{ width: '12px', height: '12px' }} />
                    <span style={{ fontSize: '12px' }}>Thinking, querying Groq AI...</span>
                  </div>
                )}
              </div>

              {/* Input row */}
              <form onSubmit={handleSendChatMessage} className="chat-input-row" style={{ padding: '12px', borderTop: '1px solid hsla(var(--border), 0.5)', background: 'hsla(var(--card), 0.3)', margin: 0 }}>
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask LLaMA about Spark, SQL, Airflow..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  style={{ fontSize: '12px', padding: '8px 12px' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px' }}>
                  <Send className="stat-icon" style={{ width: '12px', height: '12px' }} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
        </div>
      </main>
    </div>
  );
}
