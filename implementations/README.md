# Hands-On Local Implementations

This directory contains standalone, highly commented, production-grade templates for local study and execution. They cover critical data engineering fundamentals:

1. **Pandas & NumPy Cleaning Pipeline (`01_pandas_cleaning.py`)**:
   - Outlier detection (IQR method).
   - Date parsing, string standardization.
   - Pydantic-style manual validation.
   - Missing data handling.

2. **Apache PySpark Scale-Out Patterns (`02_pyspark_processing.py`)**:
   - Partitioning and bucketing.
   - Broadcast joins (optimization).
   - Deduplication with Window partitioners.
   - Schema enforcement.

3. **Snowflake & SQL Scenario Queries (`03_snowflake_sql.sql`)**:
   - Slowly Changing Dimensions (SCD Type 2) Merge SQL.
   - Ingesting and flattening nested JSON variants.
   - Continuous ingestion using Streams and Tasks.

---

## Setting Up Your Python Environment

Since you have an `env/` virtual environment folder in your workspace, follow these commands to run your scripts locally:

### 1. Activate the environment
```bash
# In Windows Powershell:
.\env\Scripts\Activate.ps1

# In Command Prompt (cmd):
.\env\Scripts\activate.bat
```

### 2. Install required libraries
```bash
pip install pandas numpy pyspark
```

### 3. Run the scripts
```bash
python 01_pandas_cleaning.py
python 02_pyspark_processing.py
```
