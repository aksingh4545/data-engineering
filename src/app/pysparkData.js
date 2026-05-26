export const pysparkConcepts = [
  {
    id: 1,
    category: "Architecture",
    question: "What is PySpark?",
    answer: "PySpark is the Python API for Apache Spark, an open-source, distributed general-purpose cluster-computing framework. It allows you to write Spark applications using Python, which under the hood translates commands to JVM bytecodes using the Py4J library, enabling parallel processing of petabyte-scale data."
  },
  {
    id: 2,
    category: "Architecture",
    question: "Difference between Spark and PySpark?",
    answer: "Apache Spark is written in Scala and runs on the Java Virtual Machine (JVM). PySpark is a Python library that wraps Spark's core Scala API. PySpark uses Py4J to communicate between Python processes and JVMs, allowing Python developers to harness Spark's distributed memory compute architecture."
  },
  {
    id: 3,
    category: "Architecture",
    question: "What is SparkSession?",
    answer: "Introduced in Spark 2.0, SparkSession is the unified entry point for programming Spark. It replaces older entry points like SparkContext, SQLContext, and HiveContext. It manages Spark applications, configures runtime options, and is used to create DataFrames, datasets, and execute SQL statements."
  },
  {
    id: 4,
    category: "Architecture",
    question: "What is a Spark Cluster?",
    answer: "A Spark Cluster is a collection of nodes configured to run Spark. It consists of a Driver Node (which compiles code and orchestrates tasks) and Worker Nodes (which house Executors to execute computation tasks). Cluster Managers like YARN, Kubernetes, or Spark Standalone manage physical nodes and allocate CPU/Memory."
  },
  {
    id: 5,
    category: "Architecture",
    question: "Difference between Driver and Executor?",
    answer: "The Driver is the master process that runs your main() function, creates the SparkSession, constructs the logical/physical query plans, and divides work into tasks. Executors run on Worker Nodes, receive tasks from the Driver, execute them in parallel, store partitions in memory, and report status/results back to the Driver."
  },
  {
    id: 6,
    category: "Architecture",
    question: "What are transformations and actions?",
    answer: "Transformations are operations on a DataFrame that return a new DataFrame (e.g. select, filter, groupBy). They are lazy, meaning they are recorded in a lineage graph but not executed immediately. Actions are operations that trigger evaluation and return actual values to the Driver (e.g. count, show, collect, write)."
  },
  {
    id: 7,
    category: "Architecture",
    question: "Difference between narrow and wide transformations?",
    answer: "Narrow transformations (e.g., select, filter) do not require data shuffling across workers; each partition can be processed independently on its worker node. Wide transformations (e.g., groupBy, join, repartition) require data shuffling across workers, redistributing records across the network to group keys together, which is slow."
  },
  {
    id: 8,
    category: "Architecture",
    question: "What causes shuffle in Spark?",
    answer: "Shuffles are triggered by wide transformations that require data to be grouped or rearranged based on key values. Operations like groupBy(), join(), repartition(), distinct(), and reduceByKey() cause Spark to write intermediate files to disk on worker nodes and transfer them over the network to other worker nodes."
  },
  {
    id: 9,
    category: "Architecture",
    question: "Why are shuffles expensive?",
    answer: "Shuffling involves massive disk I/O (writing intermediate map data to local disk), network transfer I/O (moving partitions between worker nodes), and JVM serialization/deserialization CPU costs. Reducing shuffle size is the primary way to optimize distributed Spark jobs."
  },
  {
    id: 10,
    category: "Architecture",
    question: "What is Catalyst Optimizer?",
    answer: "The Catalyst Optimizer is Spark SQL's query optimizer written in Scala. It translates your DataFrame operations or SQL queries into optimized physical execution plans. It executes stages: analysis (catalog lookups), logical plan optimization (pushing down filters, constant folding), physical planning, and dynamic code generation."
  },
  // Partitioning
  {
    id: 11,
    category: "Partitioning",
    question: "What is partitioning?",
    answer: "Partitioning is the logical division of a massive dataset into smaller, manageable chunks distributed across cluster nodes. In Spark, partitions are the basic units of parallelism. Having too few partitions underutilizes cores, while too many causes high task scheduler overhead and the small file problem."
  },
  {
    id: 12,
    category: "Partitioning",
    question: "Difference between repartition() and coalesce()?",
    answer: "`repartition()` reshuffles data across the network to decrease or increase partition counts, creating uniform partition sizes (slow). `coalesce()` decreases the partition count without full shuffles by merging adjacent partitions (much faster), though it can lead to skewed, uneven partition sizes."
  },
  {
    id: 13,
    category: "Partitioning",
    question: "What is data skew?",
    answer: "Data skew occurs when data partition sizes are highly uneven, causing some worker nodes to process massive partitions while others sit idle. This manifests as a Spark job hanging at 99% execution, waiting for a single executor to finish. It is solved by salting or broadcast joins."
  },
  {
    id: 14,
    category: "Partitioning",
    question: "How do you solve skewed joins?",
    answer: "Solve skewed joins by: 1) Broadcast join (if one table is small, removing shuffles); 2) Salting (appending a random integer to keys in the skewed table, and duplicating keys in the small table to spread matching records across executors); 3) Enabling AQE Skew Join Optimization in Spark 3.x."
  },
  {
    id: 15,
    category: "Partitioning",
    question: "What is the small file problem?",
    answer: "The small file problem occurs when a Spark job writes thousands of tiny files (often KB size) to HDFS/S3/ADLS. NameNodes get overloaded with metadata, and subsequent read jobs suffer high latency opening/closing file streams. It is resolved by coalescing before writes or running Delta OPTIMIZE."
  },
  {
    id: 16,
    category: "Partitioning",
    question: "What is ZORDER?",
    answer: "ZORDER is a Delta Lake clustering technique that organizes multi-dimensional data along a Z-order space-filling curve. It clusters related information within the same physical files, significantly improving query file skipping and performance when filtering on multiple high-cardinality fields."
  },
  {
    id: 17,
    category: "Partitioning",
    question: "What causes too many partitions, and how is it a problem?",
    answer: "Setting spark.sql.shuffle.partitions too high (e.g. 2000 for a 10MB join) or calling repartition() with excessive counts causes over-partitioning. This floods the Task Scheduler with tasks that finish in milliseconds, creating extreme scheduling overhead, network congestion, and small file writes."
  },
  {
    id: 18,
    category: "Partitioning",
    question: "How do you decide the Delta table partitioning strategy?",
    answer: "Partition Delta tables ONLY on columns with cardinality between 10 and 1,000 that are frequently used as query filters (e.g., date, country). Never partition on high-cardinality fields (like timestamp, id) which leads to over-partitioning, and keep tables under 1TB unpartitioned."
  },
  {
    id: 19,
    category: "Partitioning",
    question: "What is AQE (Adaptive Query Execution)?",
    answer: "AQE is an optimization framework in Spark 3.x that dynamically adjusts physical execution plans at runtime based on real-time statistics collected during stage runs. It performs three key optimizations: dynamically coalescing shuffle partitions, dynamically optimizing join strategies (e.g., sort-merge to broadcast), and resolving skewed joins."
  },
  {
    id: 20,
    category: "Partitioning",
    question: "What is repartitioning by join key, and when is it useful?",
    answer: "If you have multiple wide transformations or joins occurring consecutively on the same keys, calling `df.repartition('key')` at the start forces data to be distributed across workers once. Subsequent joins or aggregations on that same key will run without network shuffles, boosting speed."
  },
  // Optimization
  {
    id: 21,
    category: "Optimization",
    question: "What is a broadcast join?",
    answer: "A broadcast join (or map-side join) sends a copy of the smaller table to all worker nodes in the cluster. Because every worker has the complete look-up table in memory locally, Spark can join partitions on the fly without performing expensive network shuffles."
  },
  {
    id: 22,
    category: "Optimization",
    question: "When should broadcast joins be used?",
    answer: "Use broadcast joins when joining a massive table with a small table (default threshold is <10MB, configured via `spark.sql.autoBroadcastJoinThreshold`). You can force it in PySpark using `broadcast(small_df)` up to around 100MB, above which executors will crash with OOM errors."
  },
  {
    id: 23,
    category: "Optimization",
    question: "Difference between cache() and persist()?",
    answer: "`cache()` is a shorthand that stores DataFrames in memory only with the default storage level `MEMORY_AND_DISK`. `persist()` is more flexible, allowing you to pass specific `StorageLevel` parameters to store data in memory, disk, serialized form, or replicated on multiple nodes (e.g., `DISK_ONLY`)."
  },
  {
    id: 24,
    category: "Optimization",
    question: "What is checkpointing?",
    answer: "Checkpointing writes a DataFrame's data directly to a reliable external storage system like S3/ADLS and completely cuts/breaks the Spark lineage graph. This is highly useful in recursive algorithms, long DAG pipelines, or streaming to prevent stack overflows and ensure fault-tolerant state recovery."
  },
  {
    id: 25,
    category: "Optimization",
    question: "What is predicate pushdown?",
    answer: "Predicate pushdown is an optimization where filter conditions (`WHERE` clauses) are pushed directly down to the storage layer (e.g., reading Parquet metadata) before reading records. This avoids loading unnecessary columns/rows into Spark memory, reducing disk and network usage."
  },
  {
    id: 26,
    category: "Optimization",
    question: "What happens internally when you call sort() vs orderBy()?",
    answer: "Internally, `sort()` and `orderBy()` are completely identical aliases. They both trigger a wide transformation that performs a range-based shuffle of the data across worker nodes to globally sort the rows, which can be optimized in Delta Lake using ZORDER index structures."
  },
  {
    id: 27,
    category: "Optimization",
    question: "Difference between select() and withColumn()?",
    answer: "`select()` is designed for selecting and transforming columns in bulk, which runs fast. Calling consecutive `withColumn()` statements in a loop forces Spark to construct deep, nested logical trees, resulting in poor compiler optimizer speeds and potential StackOverflowErrors."
  },
  {
    id: 28,
    category: "Optimization",
    question: "How does Spark handle fault tolerance?",
    answer: "Spark achieves fault tolerance through the Lineage Graph (DAG) recorded for all lazy transformations. If an executor crashes and a partition is lost, Spark recreates the lost data partition by re-running the exact sequence of transformations on the source data on a new worker node."
  },
  {
    id: 29,
    category: "Optimization",
    question: "What is lazy evaluation in Spark?",
    answer: "Lazy evaluation means Spark records transformations in a logical plan (DAG) but does not execute them until an Action (like show, collect, write) is called. This allows the Catalyst Optimizer to analyze the entire plan, combine filters, push down predicates, and optimize operations in bulk before runtime."
  },
  {
    id: 30,
    category: "Optimization",
    question: "What is lineage in Spark?",
    answer: "Lineage (or RDD DAG) is a logical execution trail showing how a DataFrame is constructed from raw input files through successive transformations. Spark keeps this graph in memory, serving as a blueprint to recompute partitions if executors crash, ensuring zero data loss."
  },
  // Streaming & Delta
  {
    id: 31,
    category: "Streaming & Delta",
    question: "What is Delta Lake?",
    answer: "Delta Lake is an open-source storage layer that brings ACID transactions and relational governance to S3/ADLS/GCS data lakes. It records operations in a transaction log (`_delta_log`), supports schema enforcement/evolution, enables time travel, and supports high-speed MERGE queries."
  },
  {
    id: 32,
    category: "Streaming & Delta",
    question: "What is Time Travel in Delta?",
    answer: "Because Delta Lake never overwrites raw files immediately (instead creating new parquet files and updating the `_delta_log` transaction ledger), you can query older versions of tables by specifying version numbers or timestamps: `spark.read.option('versionAsOf', 3).load('/path')`."
  },
  {
    id: 33,
    category: "Streaming & Delta",
    question: "What is MERGE in Delta Lake?",
    answer: "MERGE is a Delta transactional operation that performs upserts (updating existing matching keys and inserting new records in a single step). It is highly optimized compared to full table overwrites and is the industry standard for executing Change Data Capture (CDC) pipelines."
  },
  {
    id: 34,
    category: "Streaming & Delta",
    question: "What is SCD Type-2?",
    answer: "Slowly Changing Dimension Type 2 is a data warehouse technique that tracks historical data by creating multiple records for a single key, marked with `active_flag` (True/False) or validity windows (`start_date`, `end_date`). Delta MERGE statements manage this history transactional lifecycle."
  },
  {
    id: 35,
    category: "Streaming & Delta",
    question: "What is watermarking in streaming?",
    answer: "Watermarking is a threshold in Structured Streaming that defines how long the engine should wait for late-arriving data before discarding it. By setting `withWatermark('timestamp', '2 hours')`, Spark keeps states for 2 hours, letting late events arrive, and frees state memory after."
  },
  {
    id: 36,
    category: "Streaming & Delta",
    question: "What is micro-batch processing vs continuous processing?",
    answer: "Micro-batch processing (default) processes data in tiny, successive batches (e.g. every 5 seconds), delivering high throughput with sub-second latency. Continuous processing processes records immediately on arrival, yielding ultra-low sub-millisecond latencies but higher overhead."
  },
  {
    id: 37,
    category: "Streaming & Delta",
    question: "How do you handle late arriving data in streams?",
    answer: "Late data is handled in Structured Streaming by combining event-time processing with a watermark. Spark maintains state in memory, aggregates records against older windows based on active timestamps, and outputs results based on Append, Update, or Complete output modes."
  },
  {
    id: 38,
    category: "Streaming & Delta",
    question: "Difference between PySpark UDF and pandas UDF?",
    answer: "Standard PySpark UDFs serialize records to/from Python and JVM processes row-by-row, creating massive overhead. Pandas UDFs (Vectorized UDFs) leverage Apache Arrow to transfer entire batches of records directly in-memory, processing them as vectorized pandas Series at native CPU speed."
  },
  {
    id: 39,
    category: "Streaming & Delta",
    question: "Why are pandas UDFs faster?",
    answer: "Pandas UDFs use Apache Arrow for zero-copy memory transfers, bypassing row-by-row serialization. They pass chunks of columns directly as NumPy arrays and Pandas Series, allowing Python's vectorized C-libraries to compute formulas at native machine speeds rather than in slow loops."
  },
  {
    id: 40,
    category: "General",
    question: "How do you debug slow Spark jobs or OOM errors?",
    answer: "1) Open Spark UI and trace the Stage DAG to locate bottlenecks; 2) Check for data skew (high max executor runtime vs median); 3) Fix GC pauses or OOMs by increasing executor memory, enabling AQE Skew Join, increasing partitioning, caching reused DataFrames, or switching to broadcast joins."
  }
];

export const pysparkChallenges = [
  {
    id: 1,
    category: "Coding",
    title: "1. Read CSV file into DataFrame",
    desc: "Read a CSV file into a Spark DataFrame using SparkSession, enabling header parsing and dynamic schema inference.",
    code: `df = spark.read.format("csv") \\
  .option("header", "true") \\
  .option("inferSchema", "true") \\
  .load("employees.csv")
df.show(5)`,
    quiz: {
      question: "Which option triggers Spark to read the first row of a CSV as column names?",
      options: ["inferSchema", "header", "delimiter", "csvSchema"],
      correctIndex: 1,
      explanation: "Setting option('header', 'true') instructs the CSV reader to interpret the first record as field headers."
    }
  },
  {
    id: 2,
    category: "Coding",
    title: "2. Read JSON file into DataFrame",
    desc: "Ingest a standard or multi-line JSON file into a distributed DataFrame.",
    code: `df = spark.read.option("multiline", "true") \\
  .json("employees.json")
df.printSchema()`,
    quiz: {
      question: "What option is required if your JSON object spans across multiple physical lines?",
      options: ["multiline", "header", "lineSep", "inferSchema"],
      correctIndex: 0,
      explanation: "The option('multiline', 'true') enables Spark to parse nested JSON records spanning multiple lines."
    }
  },
  {
    id: 3,
    category: "Coding",
    title: "3. Read Parquet file into DataFrame",
    desc: "Read columnar Parquet files into a DataFrame. This format supports optimized storage and predicate pushdown.",
    code: `df = spark.read.parquet("employees.parquet")
df.show(3)`,
    quiz: {
      question: "Why is Parquet highly preferred in Spark architectures over CSV?",
      options: [
        "It is a human-readable text file.",
        "It supports columnar projection and partition skipping metadata.",
        "It is faster to open in basic text editors.",
        "It does not support data compression."
      ],
      correctIndex: 1,
      explanation: "Parquet is a columnar binary file format storing min/max metadata, allowing Spark to skip reading entire chunks and columns."
    }
  },
  {
    id: 4,
    category: "Coding",
    title: "4. Create schema manually using StructType",
    desc: "Enforce a static schema on files using StructType and StructField. This avoids expensive schema inference stages.",
    code: `from pyspark.sql.types import StructType, StructField, StringType, IntegerType, DoubleType
schema = StructType([
  StructField("id", IntegerType(), False),
  StructField("name", StringType(), True),
  StructField("salary", DoubleType(), True)
])
df = spark.read.schema(schema).csv("employees.csv")`,
    quiz: {
      question: "Which StructType parameter represents whether a column can house Null values?",
      options: ["nullable", "inferSchema", "dataType", "isOptional"],
      correctIndex: 0,
      explanation: "The third parameter of StructField is 'nullable' (boolean), which defines if nulls are allowed in that column."
    }
  },
  {
    id: 5,
    category: "Coding",
    title: "5. Filter rows using condition",
    desc: "Filter rows of a DataFrame using logical criteria. You can use filter() or its identical alias where().",
    code: `from pyspark.sql.functions import col
df_filtered = df.filter((col("salary") > 80000) & (col("department") == "IT"))
df_filtered.show()`,
    quiz: {
      question: "Which of the following is the correct logical operator for AND when combining PySpark column expressions?",
      options: ["and", "&&", "&", "AND"],
      correctIndex: 2,
      explanation: "PySpark column expressions require bitwise operators like '&' for AND, '|' for OR, and '~' for NOT."
    }
  },
  {
    id: 6,
    category: "Coding",
    title: "6. Select required columns",
    desc: "Select a subset of columns from a DataFrame, optionally transforming them on the fly.",
    code: `from pyspark.sql.functions import col
df_subset = df.select("id", "name", (col("salary") * 12).alias("annual_salary"))
df_subset.show(5)`,
    quiz: {
      question: "Which select method lets you specify both string column names and advanced functions with alias()?",
      options: ["df.select()", "df.withColumn()", "df.columns()", "df.show()"],
      correctIndex: 0,
      explanation: "df.select() accepts both literal string column names and Spark Column objects constructed via col()."
    }
  },
  {
    id: 7,
    category: "Coding",
    title: "7. Rename columns",
    desc: "Rename an existing column in a DataFrame using withColumnRenamed().",
    code: `df_renamed = df.withColumnRenamed("emp_id", "employee_id")
df_renamed.printSchema()`,
    quiz: {
      question: "Does withColumnRenamed() rename the column in place, or return a new DataFrame?",
      options: [
        "It renames it in place, modifying the active DataFrame.",
        "It returns a new DataFrame with the renamed column (immutable).",
        "It deletes the original column and adds a new one at the end.",
        "It requires calling df.save() to write changes."
      ],
      correctIndex: 1,
      explanation: "Like all PySpark transformations, withColumnRenamed() is immutable and returns a new DataFrame reference."
    }
  },
  {
    id: 8,
    category: "Coding",
    title: "8. Add new column using withColumn()",
    desc: "Generate a new column or replace an existing column using withColumn().",
    code: `from pyspark.sql.functions import col, lit
df_bonus = df.withColumn("bonus", col("salary") * 0.1) \\
  .withColumn("active", lit(True))
df_bonus.show(3)`,
    quiz: {
      question: "Which function must be imported to assign a static literal value to all rows in a new column?",
      options: ["col()", "lit()", "val()", "static()"],
      correctIndex: 1,
      explanation: "The lit() function creates a column containing a static literal value for every row."
    }
  },
  {
    id: 9,
    category: "Coding",
    title: "9. Drop columns from DataFrame",
    desc: "Remove unnecessary columns from a DataFrame to optimize partition sizes and memory usage.",
    code: `df_pruned = df.drop("bonus", "active", "temp_column")
df_pruned.printSchema()`,
    quiz: {
      question: "What is the best-practice rationale for dropping unused columns in Data Engineering pipelines?",
      options: [
        "It is required by the Python interpreter.",
        "It speeds up column projection, reduces intermediate shuffles, and decreases network disk payload size.",
        "It deletes raw files from ADLS storage.",
        "Dropped columns are automatically backed up."
      ],
      correctIndex: 1,
      explanation: "By dropping unused fields early, you optimize execution projections and minimize intermediate serialization shuffle bytes."
    }
  },
  {
    id: 10,
    category: "Coding",
    title: "10. Handle null values using na.fill()",
    desc: "Fill missing null values in columns with standard fallback constants using df.na.fill().",
    code: `df_filled = df.na.fill({
  "salary": 0.0,
  "department": "Unknown",
  "email": "no-reply@company.com"
})
df_filled.show()`,
    quiz: {
      question: "Which parameter signature of na.fill() allows replacing null values selectively using a key-value dictionary?",
      options: [
        "df.na.fill(value, subset)",
        "df.na.fill(dict)",
        "df.na.fill(null_values_list)",
        "df.na.fill(value='Unknown')"
      ],
      correctIndex: 1,
      explanation: "Passing a dictionary maps specific column names (keys) to their corresponding replacement values."
    }
  },
  {
    id: 11,
    category: "Coding",
    title: "11. Remove null values using na.drop()",
    desc: "Discard records containing null values from a DataFrame based on threshold conditions.",
    code: `df_clean = df.na.drop(how="any", subset=["id", "name"])
df_clean.show()`,
    quiz: {
      question: "What does setting how='any' specify inside na.drop()?",
      options: [
        "Drop row if ALL specified columns contain nulls.",
        "Drop row if ANY specified column contains a null.",
        "Drop row only if the first column is null.",
        "Keep rows only if they have no numbers."
      ],
      correctIndex: 1,
      explanation: "how='any' tells Spark to drop the row if any column in the subset list contains a null value. how='all' drops only if all are null."
    }
  },
  {
    id: 12,
    category: "Coding",
    title: "12. Group by and aggregate salary",
    desc: "Perform grouped aggregations on DataFrames, calculating stats like averages, sums, and maximums.",
    code: `from pyspark.sql.functions import avg, sum, max, col
df_grouped = df.groupBy("department") \\
  .agg(
    avg("salary").alias("avg_salary"),
    sum("salary").alias("total_budget"),
    max("salary").alias("highest_salary")
  )
df_grouped.show()`,
    quiz: {
      question: "What wide transformation is triggered under the hood when groupBy() is executed?",
      options: ["Narrow Projection", "Hash Shuffle", "Predicate Pushdown", "Lineage Checkpoint"],
      correctIndex: 1,
      explanation: "groupBy() requires a network Shuffle to redistribute and group rows containing matching keys onto the same executors."
    }
  },
  {
    id: 13,
    category: "Coding",
    title: "13. Sort DataFrame by column",
    desc: "Sort rows globally in ascending or descending order using sort() or orderBy().",
    code: `from pyspark.sql.functions import col
df_sorted = df.orderBy(col("salary").desc(), col("name").asc())
df_sorted.show(5)`,
    quiz: {
      question: "Which function makes a column sort in descending order inside orderBy()?",
      options: ["col('x').desc()", "desc('x')", "col('x').descending()", "Options 1 and 2 are both correct"],
      correctIndex: 3,
      explanation: "Both col('name').desc() and importing desc('name') are valid syntaxes to declare descending order in PySpark."
    }
  },
  {
    id: 14,
    category: "Coding",
    title: "14. Perform inner join between DataFrames",
    desc: "Combine two DataFrames based on a shared key constraint using an inner join.",
    code: `df_joined = df_emp.join(df_dept, df_emp.dept_id == df_dept.id, "inner")
df_joined.show(3)`,
    quiz: {
      question: "What happens if a key exists in one DataFrame but not the other in an 'inner' join?",
      options: [
        "It returns nulls for that record.",
        "It throws a AnalysisException compiler error.",
        "The record is omitted entirely from the resulting DataFrame.",
        "The join reverts to a broadcast cross join."
      ],
      correctIndex: 2,
      explanation: "An inner join returns only rows where there is a matching key in both the left and right datasets; unmatched rows are discarded."
    }
  },
  {
    id: 15,
    category: "Coding",
    title: "15. Perform left join between DataFrames",
    desc: "Execute a left outer join to retain all records from the left DataFrame, matching fields from the right.",
    code: `df_left = df_emp.join(df_dept, "dept_id", "left")
df_left.show(5)`,
    quiz: {
      question: "What values occupy the right-side columns if a left-table key has no match in the right-side table?",
      options: ["0", "Null (None)", "Unknown", "AnalysisException"],
      correctIndex: 1,
      explanation: "Left joins retain all left rows; if no key matches in the right table, columns from the right table are filled with Nulls."
    }
  },
  {
    id: 16,
    category: "Coding",
    title: "16. Union two DataFrames",
    desc: "Merge rows of two DataFrames together, matching them by position or by name schema.",
    code: `df_merged = df1.unionByName(df2, allowMissingColumns=True)
df_merged.show()`,
    quiz: {
      question: "What is the key difference between standard union() and unionByName() in PySpark?",
      options: [
        "union() matches columns by name, while unionByName() matches by schema.",
        "union() matches columns by position index, while unionByName() matches them by exact column names.",
        "unionByName() deletes duplicates automatically.",
        "union() does not trigger a Spark task."
      ],
      correctIndex: 1,
      explanation: "union() merges rows by column index position, which can corrupt data if columns are ordered differently. unionByName() safely resolves columns by name."
    }
  },
  {
    id: 17,
    category: "Coding",
    title: "17. Create array column",
    desc: "Combine multiple primitive columns into a single ArrayType column.",
    code: `from pyspark.sql.functions import array, col
df_skills = df.withColumn("skills_array", array(col("primary_skill"), col("secondary_skill")))
df_skills.printSchema()`,
    quiz: {
      question: "Which imported function is used to create a new ArrayType column from existing columns?",
      options: ["make_list()", "array()", "split()", "struct()"],
      correctIndex: 1,
      explanation: "The array() function accepts a list of columns and combines their row values into a single ArrayType column."
    }
  },
  {
    id: 18,
    category: "Coding",
    title: "18. Create map column",
    desc: "Create a MapType column containing key-value associations.",
    code: `from pyspark.sql.functions import create_map, lit, col
df_map = df.withColumn("metadata", create_map(lit("dept"), col("department"), lit("city"), col("office_city")))
df_map.show(3)`,
    quiz: {
      question: "What argument sequence is required when calling create_map() in PySpark?",
      options: [
        "Alternating key and value column expressions (k1, v1, k2, v2).",
        "A python dictionary argument.",
        "A list of tuples (key, value).",
        "A single string JSON block."
      ],
      correctIndex: 0,
      explanation: "create_map() accepts alternating key and value column expressions: create_map(col_key1, col_val1, col_key2, col_val2)."
    }
  },
  {
    id: 19,
    category: "Coding",
    title: "19. Create struct column",
    desc: "Construct nested struct objects to organize data into logical schemas.",
    code: `from pyspark.sql.functions import struct
df_nested = df.withColumn("contact_info", struct("email", "phone_number", "office_address"))
df_nested.printSchema()`,
    quiz: {
      question: "What complex type is represented by StructType or struct() nesting inside columns?",
      options: ["Array", "Map", "Record/Struct (named fields)", "Binary Blob"],
      correctIndex: 2,
      explanation: "A struct column represents a nested record containing multiple named columns of potentially different datatypes."
    }
  },
  {
    id: 20,
    category: "Coding",
    title: "20. Write UDF to uppercase text",
    desc: "Register a Python User Defined Function (UDF) to process column values row-by-row in Python.",
    code: `from pyspark.sql.functions import udf
from pyspark.sql.types import StringType
upper_udf = udf(lambda s: s.upper() if s else None, StringType())
df_upper = df.withColumn("upper_name", upper_udf("name"))
df_upper.show(3)`,
    quiz: {
      question: "Why should standard PySpark Python UDFs be avoided in production if built-in functions exist?",
      options: [
        "They are not supported in notebooks.",
        "They force Spark to serialize data out of the JVM into a Python subprocess row-by-row, hurting speed.",
        "They can only return integer datatypes.",
        "They automatically delete the source DataFrame."
      ],
      correctIndex: 1,
      explanation: "Standard UDFs break Spark's JVM Catalyst optimizations by serializing columns row-by-row to a Python process, which is very slow."
    }
  },
  {
    id: 21,
    category: "Coding",
    title: "21. Write pandas UDF to square numbers",
    desc: "Leverage vectorized pandas UDFs via Apache Arrow for high-speed batch transfers and computations.",
    code: `from pyspark.sql.functions import pandas_udf
import pandas as pd
@pandas_udf("double")
def square_values(s: pd.Series) -> pd.Series:
    return s * s
df_squared = df.withColumn("squared_val", square_values("val"))
df_squared.show(3)`,
    quiz: {
      question: "Which framework is used behind the scenes to perform zero-copy memory transfers in Vectorized/pandas UDFs?",
      options: ["Hadoop MapReduce", "Apache Arrow", "Kafka Streams", "Delta Log Manager"],
      correctIndex: 1,
      explanation: "Apache Arrow enables zero-copy in-memory column transfers directly between JVM and Python processes."
    }
  },
  {
    id: 22,
    category: "Coding",
    title: "22. Remove duplicates using Window functions",
    desc: "Deduplicate table records selectively keeping the latest row using row_number() partition over Windows.",
    code: `from pyspark.sql.window import Window
from pyspark.sql.functions import row_number, col
w = Window.partitionBy("employee_id").orderBy(col("updated_at").desc())
df_dedup = df.withColumn("rn", row_number().over(w)) \\
  .filter(col("rn") == 1) \\
  .drop("rn")`,
    quiz: {
      question: "Why is partitionBy + row_number() over Windows preferred for deduplication over simple dropDuplicates()?",
      options: [
        "It is always a narrow transformation.",
        "It allows you to specify a sort logic (e.g. keeping the latest record) instead of randomly picking a row.",
        "It automatically caches the output.",
        "It deletes duplicate files on local disk."
      ],
      correctIndex: 1,
      explanation: "dropDuplicates() removes rows randomly. Over Window partition rankings, you can order by a timestamp to guarantee you retain the absolute latest state."
    }
  },
  {
    id: 23,
    category: "Coding",
    title: "23. Find second highest salary using Dense Rank",
    desc: "Apply dense_rank() over Window orders to identify specific rank values across salary distributions.",
    code: `from pyspark.sql.window import Window
from pyspark.sql.functions import dense_rank, col
w = Window.orderBy(col("salary").desc())
df_ranked = df.withColumn("dr", dense_rank().over(w)) \\
  .filter(col("dr") == 2) \\
  .drop("dr")`,
    quiz: {
      question: "What is the difference between rank() and dense_rank() if two rows have matching values?",
      options: [
        "rank() skips ranks (e.g. 1, 2, 2, 4), while dense_rank() does not skip rank gaps (e.g. 1, 2, 2, 3).",
        "dense_rank() is narrow, while rank() is wide.",
        "rank() cannot be used with descending sorts.",
        "There is no difference."
      ],
      correctIndex: 0,
      explanation: "rank() leaves gaps in rank numbering after duplicate ties. dense_rank() keeps rank indexes sequential and continuous."
    }
  },
  {
    id: 24,
    category: "Coding",
    title: "24. Implement MERGE query in Delta Lake",
    desc: "Perform transactional merge upserts (Insert or Update in one atomic operation) against a target Delta table.",
    code: `from delta.tables import DeltaTable
delta_tgt = DeltaTable.forPath(spark, "/delta/employees")
delta_tgt.alias("tgt").merge(
  df_src.alias("src"),
  "tgt.id = src.id"
).whenMatchedUpdateAll() \\
 .whenNotMatchedInsertAll() \\
 .execute()`,
    quiz: {
      question: "Which library must be imported to instantiate DeltaTable targets for merge operations in PySpark?",
      options: ["pyspark.sql.functions", "delta.tables", "pyspark.dbutils", "delta.core"],
      correctIndex: 1,
      explanation: "The delta.tables module provides the DeltaTable class to bind path/name entities for transaction manipulations."
    }
  },
  {
    id: 25,
    category: "Coding",
    title: "25. Implement SCD Type-2 logic",
    desc: "Maintain historical records using Slowly Changing Dimension Type 2 updates.",
    code: `from delta.tables import DeltaTable
# Merges historical updates by adding row flags and start/end dates
print("SCD Type-2 update ledger executed transactionally.")`,
    quiz: {
      question: "What is the primary target objective when implementing slowly changing dimensions (SCD Type-2)?",
      options: [
        "Overwriting old records to save disk space.",
        "Retaining the complete historical record of column value changes over time with validity windows.",
        "Re-indexing files with Z-Order curves.",
        "Converting Parquet metadata to JSON logs."
      ],
      correctIndex: 1,
      explanation: "SCD Type-2 retains historical records by adding validity columns (active_flag, start_date, end_date) instead of overwriting values."
    }
  },
  {
    id: 26,
    category: "Coding",
    title: "26. Repartition DataFrame",
    desc: "Redistribute data across executors to increase parallelism or uniform partition sizes.",
    code: `df_repart = df.repartition(8, "department")
print("New partition count:", df_repart.rdd.getNumPartitions())`,
    quiz: {
      question: "Which of the following is true about calling repartition() in PySpark?",
      options: [
        "It is highly optimized and avoids shuffling.",
        "It forces a full network shuffle to distribute records uniformly.",
        "It can only be used to decrease partition count.",
        "It caches the DataFrame in memory."
      ],
      correctIndex: 1,
      explanation: "repartition() always triggers a wide network shuffle to redistribute records across worker nodes."
    }
  },
  {
    id: 27,
    category: "Coding",
    title: "27. Use broadcast join optimization",
    desc: "Speed up slow joins by broadcasting small look-up tables to executors, bypassing shuffles.",
    code: `from pyspark.sql.functions import broadcast
df_optimized = df_large.join(broadcast(df_small), "dept_id", "inner")
df_optimized.count()`,
    quiz: {
      question: "What is the default autoBroadcastJoinThreshold size limit in Spark?",
      options: ["10 MB", "100 MB", "1 GB", "10 GB"],
      correctIndex: 0,
      explanation: "By default, Spark automatically broadcasts tables smaller than 10MB (spark.sql.autoBroadcastJoinThreshold)."
    }
  },
  {
    id: 28,
    category: "Coding",
    title: "28. Implement watermarking in streaming",
    desc: "Discard streaming states for late-arriving events based on watermarking thresholds.",
    code: `df_stream = spark.readStream.format("parquet").load("/incoming")
df_watermark = df_stream.withWatermark("event_time", "1 hour") \\
  .groupBy("event_time", "device").count()`,
    quiz: {
      question: "What is the function of watermarking in Structured Streaming?",
      options: [
        "Measuring cluster temperature.",
        "Discarding processing states for records arriving later than a declared threshold time boundary.",
        "Enforcing table schemas.",
        "Validating API credentials."
      ],
      correctIndex: 1,
      explanation: "Watermarking tells Spark how long to retain streaming state in memory for late-arriving data; past the threshold, it is discarded."
    }
  },
  {
    id: 29,
    category: "Coding",
    title: "29. Handle skewed data using salting",
    desc: "Alleviate data skew bottlenecking by appending random suffix integer salts to keys.",
    code: `from pyspark.sql.functions import col, concat, rand, lit
# Add random salted suffix 0-3 to skewed join keys
df_salted = df.withColumn("salt_key", concat(col("key"), lit("_"), (rand() * 4).cast("int")))`,
    quiz: {
      question: "Why is 'salting' used in big data architectures?",
      options: [
        "It compresses Parquet file partitions.",
        "It splits highly skewed join keys into sub-keys, distributing records uniformly across executors.",
        "It is a database encryption technique.",
        "It deletes duplicate values."
      ],
      correctIndex: 1,
      explanation: "Salting splits skewed join keys by appending random integers, dispersing the massive duplicate key rows uniformly across different workers."
    }
  },
  {
    id: 30,
    category: "Coding",
    title: "30. Optimize small file problem using OPTIMIZE + ZORDER",
    desc: "Compact thousands of small files into consolidated larger files inside Delta tables.",
    code: `spark.sql("OPTIMIZE delta_employees ZORDER BY (department_id)")`,
    quiz: {
      question: "Which of the following describes the OPTIMIZE command on Delta tables?",
      options: [
        "It drops columns from tables.",
        "It compacts small Parquet files in a directory into larger consolidated files.",
        "It deletes inactive history versions.",
        "It rolls back transaction versions."
      ],
      correctIndex: 1,
      explanation: "Delta's OPTIMIZE command consolidates thousands of tiny files into larger, highly optimized files (approx 1GB)."
    }
  },
  // Scenarios (31 to 40)
  {
    id: 31,
    category: "Scenarios",
    title: "31. Remove duplicates keeping latest record",
    desc: "Real-world Scenario: Source feed sends redundant records with updated values. You must keep the latest row per key.",
    code: `from pyspark.sql.window import Window
from pyspark.sql.functions import row_number, col
w = Window.partitionBy("emp_id").orderBy(col("updated_time").desc())
df_latest = df.withColumn("rn", row_number().over(w)).filter("rn = 1").drop("rn")`,
    quiz: {
      question: "Why not use df.dropDuplicates(['emp_id']) in this scenario?",
      options: [
        "It throws a syntax compilation error.",
        "It removes columns.",
        "It deletes records randomly without guaranteeing that the most recent 'updated_time' record is kept.",
        "It requires a local database connection."
      ],
      correctIndex: 2,
      explanation: "dropDuplicates() removes rows randomly. Using Window row_number() ordered descending by timestamp guarantees the latest record is retained."
    }
  },
  {
    id: 32,
    category: "Scenarios",
    title: "32. Implement SCD Type-2 in Delta Lake",
    desc: "Real-world Scenario: Construct a transaction history ledger that updates existing active rows to inactive and inserts new active records on key changes.",
    code: `from delta.tables import DeltaTable
# Stage new updates, merge existing active keys, deactivate them, and insert new records
print("SCD Type-2 Delta MERGE pipeline completed transactional cycle.")`,
    quiz: {
      question: "What status columns are traditionally managed under an SCD Type-2 design pattern?",
      options: [
        "Only row value IDs.",
        "is_active (True/False) or validity time fields (start_date, end_date).",
        "username and password encryption keys.",
        "filePath and fileSize variables."
      ],
      correctIndex: 1,
      explanation: "SCD Type-2 manages status flags (is_active) or validity limits (start_date/end_date) to trace keys lifecycle history."
    }
  },
  {
    id: 33,
    category: "Scenarios",
    title: "33. Optimize slow joins",
    desc: "Real-world Scenario: An ETL join task is taking hours to run because a massive fact table is being joined with a small dimension table.",
    code: `from pyspark.sql.functions import broadcast
df_fast_join = df_fact.join(broadcast(df_dim), "dim_id")`,
    quiz: {
      question: "How does broadcasting df_dim optimize the join?",
      options: [
        "It compiles the code in Scala.",
        "It sends the small DataFrame copy to all worker executors, completely removing expensive network key shuffling.",
        "It deletes redundant records.",
        "It partitions the fact table."
      ],
      correctIndex: 1,
      explanation: "Broadcasting sends a copy of the small table to every worker, allowing local joins without shuffling data over the network."
    }
  },
  {
    id: 34,
    category: "Scenarios",
    title: "34. Debug failing ADF pipeline",
    desc: "Real-world Scenario: Azure Data Factory / Synapse Spark activity crashes with a Java Heap OutOfMemoryError.",
    code: `# Debugging OOM:
# 1. Enable AQE Skew Join Optimization
# 2. Increase spark.executor.memory allocation
# 3. Avoid row-by-row python UDF structures`,
    quiz: {
      question: "What is a primary cause of Executor JVM OutOfMemoryError in Spark jobs?",
      options: [
        "Data skew, forcing a single executor to load a massive data partition that exceeds its allocated physical JVM heap.",
        "Having too few tasks.",
        "Writing files as Parquet instead of CSV.",
        "Using SparkSession instead of SparkContext."
      ],
      correctIndex: 0,
      explanation: "Uneven data distribution (skew) forces one executor to load a massive partition that overflows its local JVM memory allocations."
    }
  },
  {
    id: 35,
    category: "Scenarios",
    title: "35. Find second highest salary using SQL",
    desc: "Real-world Scenario: Write standard Spark SQL to extract the second highest salary rank inside a department.",
    code: `df.createOrReplaceTempView("employees")
df_second = spark.sql("""
  SELECT name, salary, department FROM (
    SELECT *, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank
    FROM employees
  ) WHERE rank = 2
""")`,
    quiz: {
      question: "What method must be called on a DataFrame to query it directly using spark.sql() commands?",
      options: ["df.show()", "df.createOrReplaceTempView('name')", "df.write()", "df.register()"],
      correctIndex: 1,
      explanation: "Calling df.createOrReplaceTempView() registers the DataFrame as a local SQL temporary view."
    }
  },
  {
    id: 36,
    category: "Scenarios",
    title: "36. Decide Delta table partitioning strategy",
    desc: "Real-world Scenario: You are designing a Delta table structure for a 50GB dataset containing columns like transaction_date, country, and user_id.",
    code: `# Partition on 'transaction_date' or 'country'
# Cardinality is low-to-medium; avoid partitioning on high-cardinality 'user_id'
print("Partitioning plan verified: Partitioned by transaction_date.")`,
    quiz: {
      question: "Why is it a major design mistake to partition a Delta table on a high-cardinality column like user_id?",
      options: [
        "It throws a syntax compile error.",
        "It leads to over-partitioning, writing millions of tiny directories and files, which crushes NameNode metadata and read speeds.",
        "It encrypts the column values.",
        "It forces YARN to use spot instances."
      ],
      correctIndex: 1,
      explanation: "High-cardinality partitions create too many small files, which overwhelms filesystems with metadata and slows down subsequent queries."
    }
  },
  {
    id: 37,
    category: "Scenarios",
    title: "37. Build Data Quality Framework",
    desc: "Real-world Scenario: Ensure ingested data contains zero null IDs and that age values are positive before writing to final targets.",
    code: `df_validated = df.filter(df.id.isNotNull() & (df.age > 0))
# Raise alerts or route failed rows to quarantine folder if count exceeds threshold
print("Validation filters applied.")`,
    quiz: {
      question: "Which Delta Live Tables (DLT) decorator enforces data quality rules dynamically during streaming ingestion?",
      options: ["@expect", "@expect_or_drop", "@expect_or_fail", "All of the above"],
      correctIndex: 3,
      explanation: "DLT expectations (@expect, @expect_or_drop, @expect_or_fail) let you define data quality assertions, logs, and routing paths."
    }
  },
  {
    id: 38,
    category: "Scenarios",
    title: "38. Implement Incremental Copy in ADF",
    desc: "Real-world Scenario: Read only new or modified records from SQL databases using high-watermark timestamp tracking.",
    code: `# ADF incremental copy queries database where last_modified > watermark_timestamp
# Write new records to landing zone, then merge into Delta lake
print("Incremental copy sync completed.")`,
    quiz: {
      question: "Why is incremental loading highly preferred over full load in enterprise Data Engineering?",
      options: [
        "It deletes history files.",
        "It limits data transfers to new/changed rows, reducing network cost, processing time, and pipeline run expenses.",
        "It requires zero database drivers.",
        "It is always a narrow transformation."
      ],
      correctIndex: 1,
      explanation: "Incremental loads process only new/updated data, minimizing network transfer payloads and cluster compute runtimes."
    }
  },
  {
    id: 39,
    category: "Scenarios",
    title: "39. Handle small file problem in ADLS",
    desc: "Real-world Scenario: Thousands of tiny parquet files are written to ADLS by stream processes, slowing down dashboard reports.",
    code: `# Alleviate by:
# 1. Calling coalesce() on write streams
# 2. Running Delta Lake "OPTIMIZE" command on target folders
# 3. Enabling Auto-Compaction on Delta Tables`,
    quiz: {
      question: "Which table property enables automatic background compaction of files upon transaction writes in Delta Lake?",
      options: [
        "delta.autoOptimize.optimizeWrite = true",
        "delta.autoCompaction = true",
        "delta.smallFileFix = true",
        "Options 1 and 2 are both correct"
      ],
      correctIndex: 3,
      explanation: "delta.autoOptimize.optimizeWrite and delta.autoOptimize.autoCompact enable automatic background compaction during table writes."
    }
  },
  {
    id: 40,
    category: "Scenarios",
    title: "40. Join two Delta tables efficiently",
    desc: "Real-world Scenario: You must join a 10TB transaction table with a 5TB user profile table on 'user_id' column.",
    code: `# Step 1: Pre-repartition both tables on 'user_id' join key during ingestion
# Step 2: Ensure Z-Order curves exist on 'user_id' columns
# Step 3: Spark executes a SortMergeJoin with zero runtime shuffles!`,
    quiz: {
      question: "If two massive tables are already physically partitioned or Z-ordered on the exact join key, what slow step is skipped during join execution?",
      options: ["Projection", "Network Shuffling", "Data Type Casting", "Lineage Evaluation"],
      correctIndex: 1,
      explanation: "When tables share partitioning on the join key, Spark reads matching key partitions directly, bypassing expensive network shuffles."
    }
  },
  // Traps (41 to 50)
  {
    id: 41,
    category: "Traps",
    title: "41. Deduplication using groupBy + join instead of Window",
    desc: "Trap: Saying you perform complex row deduplication by grouping keys, calculating max dates, and joining back to the source.",
    code: `# TRAP: df.groupBy("id").agg(max("date")).join(df, ...) [Creates 2 major wide shuffles!]
# OPTIMIZED: row_number() over Windows [Only 1 shuffle stage!]`,
    quiz: {
      question: "Why is using Window row_number() faster than groupBy + join back to source for deduplication?",
      options: [
        "It uses Scala variables.",
        "It requires only a single network shuffle stage instead of two distinct shuffle stages (groupBy and Join shuffles).",
        "It runs locally on the Driver node.",
        "It does not require memory allocations."
      ],
      correctIndex: 1,
      explanation: "groupBy + join requires two network shuffle stages. Window row_number() requires only one, cutting execution time in half."
    }
  },
  {
    id: 42,
    category: "Traps",
    title: "42. Using full load instead of incremental loading",
    desc: "Trap: Implementing full table overwrites in ETL pipelines daily for huge historical tables because writing merge syntax is complex.",
    code: `# TRAP: df.write.mode("overwrite") [Extremely expensive as data scales]
# OPTIMIZED: Delta Lake MERGE [Upserting only the delta changes]`,
    quiz: {
      question: "What risk does daily full overwrites introduce as enterprise dataset sizes grow?",
      options: [
        "Pipeline runtimes scale linearly with table size, eventually exceeding SLAs and inflating cloud warehouse costs.",
        "Data is encrypted.",
        "Spark automatically reverts to local execution.",
        "It throws a class definition error."
      ],
      correctIndex: 0,
      explanation: "Full overwrites scale linearly with dataset sizes, which leads to SLA breaches, high network usage, and inflated cloud compute costs."
    }
  },
  {
    id: 43,
    category: "Traps",
    title: "43. Ignoring partition strategy",
    desc: "Trap: Leaving a 5TB Delta table unpartitioned, or partitioning it on a high-cardinality field like order_id.",
    code: `# TRAP: Partitioning on order_id or leaving massive tables completely unstructured
# OPTIMIZED: Partition on low-cardinality fields like transaction_date`,
    quiz: {
      question: "What performance issue occurs when querying a massive table with zero partition metadata?",
      options: [
        "Queries are rejected by the driver.",
        "Spark is forced to scan every single physical file in the directory (Full Table Scan), killing performance.",
        "It automatically caches the whole dataset.",
        "It switches columns to ArrayTypes."
      ],
      correctIndex: 1,
      explanation: "Without partitions, Spark must read every single physical file in the directory (Full Table Scan), dragging down query speed."
    }
  },
  {
    id: 44,
    category: "Traps",
    title: "44. Not understanding shuffle cost",
    desc: "Trap: Calling wide transformations like groupBy, join, and distinct repeatedly inside loops, ignoring execution plan shuffles.",
    code: `# TRAP: df.groupBy().join().distinct() [Floods network with shuffles]
# OPTIMIZED: Combine filters, broadcast small frames, and repartition once`,
    quiz: {
      question: "What physical resource is the primary bottleneck during a major network shuffle stage?",
      options: ["CPU cache speed", "Network bandwidth and Disk I/O (local shuffle reads/writes)", "Driver memory size", "Python compiler version"],
      correctIndex: 1,
      explanation: "Network shuffles transfer partitions across worker nodes and write intermediate files to local disk, making network bandwidth and disk I/O the primary bottlenecks."
    }
  },
  {
    id: 45,
    category: "Traps",
    title: "45. Using Python UDF everywhere instead of built-in Spark",
    desc: "Trap: Writing python UDF functions for basic string operations or date calculations because they are familiar.",
    code: `# TRAP: udf(lambda s: s.substring(0, 3)) [Slow Python process translation]
# OPTIMIZED: from pyspark.sql.functions import substring [Runs at native JVM C-speed!]`,
    quiz: {
      question: "Why do built-in Spark functions (like substring, date_add) run significantly faster than custom Python UDFs?",
      options: [
        "They are compiled in Python.",
        "They execute directly inside the JVM at optimized binary speeds without data serialization bottlenecks.",
        "They require zero cluster workers.",
        "They automatically partition the tables."
      ],
      correctIndex: 1,
      explanation: "Built-in functions compile directly to optimized JVM bytecode, avoiding row-by-row serialization overhead across processes."
    }
  },
  {
    id: 46,
    category: "Traps",
    title: "46. Not knowing AQE",
    desc: "Trap: Writing complex manual code to handle small partitions, skewed join splits, and partition counts instead of letting Spark handle them.",
    code: `# TRAP: Manually writing custom key salting and partition calculations every run
# OPTIMIZED: spark.conf.set("spark.sql.adaptive.enabled", "true") [Enabled by default in 3.x]`,
    quiz: {
      question: "Which of the following is NOT an optimization executed automatically by Adaptive Query Execution (AQE)?",
      options: [
        "Dynamically coalescing empty/small shuffle partitions.",
        "Dynamically switching SortMerge joins to Broadcast joins.",
        "Dynamically encrypting parquet file data.",
        "Dynamically resolving skewed partitions at runtime."
      ],
      correctIndex: 2,
      explanation: "AQE optimizes shuffles, joins, and data skew at runtime, but does not encrypt parquet files."
    }
  },
  {
    id: 47,
    category: "Traps",
    title: "47. Confusing cache vs persist vs checkpoint",
    desc: "Trap: Saying cache() and checkpoint() are identical, or using cache() on every intermediate DataFrame, which floods memory.",
    code: `# TRAP: Caching every single temporary DataFrame in memory, causing disk eviction
# OPTIMIZED: Cache only DataFrames reused multiple times in the downstream DAG`,
    quiz: {
      question: "Which operation actually breaks the Spark lineage DAG and writes data physically to reliable external storage?",
      options: ["cache()", "persist()", "checkpoint()", "orderBy()"],
      correctIndex: 2,
      explanation: "checkpoint() cuts the lineage graph and writes data directly to external storage like HDFS/S3, whereas cache/persist store it in local memories and maintain lineage."
    }
  },
  {
    id: 48,
    category: "Traps",
    title: "48. Using repartition blindly",
    desc: "Trap: Blindly calling repartition(1) or repartition(200) to adjust file sizes, creating massive, unnecessary shuffles.",
    code: `# TRAP: df.repartition(1).write.parquet() [Forces a complete global shuffle]
# OPTIMIZED: df.coalesce(1).write.parquet() [Saves shuffles when decreasing]`,
    quiz: {
      question: "When should you use coalesce() instead of repartition() to decrease the partition count?",
      options: [
        "When you want to increase the partition count.",
        "When you want to decrease partition counts and avoid expensive network shuffles.",
        "When you want uniform partition sizes.",
        "coalesce() is always slower than repartition()."
      ],
      correctIndex: 1,
      explanation: "coalesce() decreases partition counts by merging adjacent partitions on local executors, completely bypassing network shuffles."
    }
  },
  {
    id: 49,
    category: "Traps",
    title: "49. Creating too many partitions causing small file problem",
    desc: "Trap: Thinking that setting partitions very high (e.g. 5,000) is always best for maximum parallelism, which floods storage with KB-sized files.",
    code: `# TRAP: spark.conf.set("spark.sql.shuffle.partitions", 10000) for a small 50MB join
# OPTIMIZED: Match shuffle partitions to actual dataset scale (1 partition per 100-200MB)`,
    quiz: {
      question: "What is the recommended target partition data size to aim for when configuring Spark partitions?",
      options: ["1 KB - 10 KB", "100 KB - 500 KB", "100 MB - 200 MB", "10 GB - 50 GB"],
      correctIndex: 2,
      explanation: "Spark performs best when partitions range between 100MB and 200MB in size, maximizing parallelism without metadata bloat."
    }
  },
  {
    id: 50,
    category: "Traps",
    title: "50. Not understanding broadcast joins",
    desc: "Trap: Trying to force a broadcast join on a 10GB table, which triggers executor out-of-memory driver crashes.",
    code: `# TRAP: broadcast(df_10gb_table) [Forces driver and workers to crash with OOM]
# OPTIMIZED: Broadcast tables <100MB only; use SortMergeJoins for massive tables`,
    quiz: {
      question: "What happens physically if you attempt to broadcast a massive 15GB DataFrame in YARN clusters?",
      options: [
        "It finishes in milliseconds.",
        "The driver fails to serialize, and workers run out of memory, crashing the Spark application with Java Heap OOM errors.",
        "It splits the files into CSVs.",
        "It automatically caches the table on local worker disks."
      ],
      correctIndex: 1,
      explanation: "Broadcasting a massive table forces Spark to pull the entire dataset to the Driver node and duplicate it to all Workers, instantly crashing JVM heaps."
    }
  }
];
