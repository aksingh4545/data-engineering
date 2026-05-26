"""
02_pyspark_processing.py

High-Volume Industrial PySpark processing script.
Demonstrates:
1. Dynamic schema enforcement
2. Window partition-based deduplication (advanced interview scenario)
3. Broadcast Join optimization
4. High-performance file writing (partitioning)
"""

try:
    from pyspark.sql import SparkSession
    from pyspark.sql.types import StructType, StructField, IntegerType, StringType, DoubleType
    from pyspark.sql.functions import col, row_number, broadcast, avg
    from pyspark.sql.window import Window
except ImportError:
    print("Warning: PySpark is not installed in your local python virtual environment.")
    print("Please run: pip install pyspark")
    import sys
    sys.exit(0)

def main():
    print("Initializing high-volume local Spark Session...")
    spark = SparkSession.builder \
        .appName("CloudDataPipelineScaleOut") \
        .master("local[*]") \
        .config("spark.sql.shuffle.partitions", "4") \
        .getOrCreate()

    # 1. Define explicit schemas (Critical for production pipelines to prevent drift/failures)
    user_schema = StructType([
        StructField("user_id", IntegerType(), False),
        StructField("username", StringType(), True),
        StructField("department_id", IntegerType(), True),
        StructField("salary", DoubleType(), True),
        StructField("timestamp", StringType(), True)
    ])

    # 2. Mock high volume streaming rows (e.g. ingested from Kafka)
    raw_data = [
        (1, "alice", 10, 75000.0, "2026-05-26 12:00:00"),
        (2, "bob", 20, 85000.0, "2026-05-26 12:05:00"),
        (1, "alice", 10, 75000.0, "2026-05-26 12:10:00"), # Duplicate of Alice with later timestamp
        (3, "charlie", 10, 95000.0, "2026-05-26 12:00:00"),
        (4, "david", 30, 60000.0, "2026-05-26 12:00:00")
    ]

    print("\nLoading dataset into Spark Distributed DataFrame...")
    df = spark.createDataFrame(raw_data, schema=user_schema)
    df.show()

    # 3. Window Partition Deduplication Pattern (Highly asked in EMR/Databricks interviews!)
    # Goal: Deduplicate by user_id keeping the latest record based on timestamp.
    print("Deduplicating stream records using Spark Window & row_number()...")
    windowSpec = Window.partitionBy("user_id").orderBy(col("timestamp").desc())
    deduped_df = df.withColumn("row_num", row_number().over(windowSpec)) \
                   .filter(col("row_num") == 1) \
                   .drop("row_num")

    print("Deduplicated DataFrame (keeping latest timestamp records):")
    deduped_df.show()

    # 4. Broadcast Join optimization (Essential for processing millions of rows!)
    # Joining a massive table (users) with a small static mapping table (departments)
    print("Simulating Broadcast Join optimization...")
    dept_data = [
        (10, "Data Analytics"),
        (20, "Cloud Engineering"),
        (30, "Security & Audit")
    ]
    dept_schema = ["dept_id", "department_name"]
    dept_df = spark.createDataFrame(dept_data, schema=dept_schema)

    # We broadcast the small department dataframe to all worker executors
    # This prevents the massive user dataframe from shuffling across network nodes
    optimized_join_df = deduped_df.join(
        broadcast(dept_df),
        deduped_df.department_id == dept_df.dept_id,
        "inner"
    ).drop("dept_id")

    print("Joined and Optimized Dataset (Broadcasting departments):")
    optimized_join_df.show()

    # 5. Distributed File Writes (Partitioned Parquet)
    # Partitioning organizes directories on S3/HDFS, speeding up filtering queries
    print("Writing processed partitions locally as parquet format...")
    # Using local folder relative path inside workspace
    try:
        optimized_join_df.write \
            .mode("overwrite") \
            .partitionBy("department_name") \
            .parquet("scratch/processed_users.parquet")
        print("Success! Parquet files written to scratch/processed_users.parquet/")
    except Exception as e:
        print(f"File writing bypassed (local directory permissions or lock): {e}")

    spark.stop()
    print("\n--- Spark Pipeline Successfully Executed ---")

if __name__ == '__main__':
    main()
