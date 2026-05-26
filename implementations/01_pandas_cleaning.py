"""
01_pandas_cleaning.py

Pristine production-grade Pandas cleaning script detailing core fundamentals:
- Schema enforcement & Type casting
- Imputing missing columns
- Outlier detection (IQR Method)
- String and date normalizations
"""

import pandas as pd
import numpy as np

# 1. Initialize raw, dirty dataset with duplicates, NaNs, and outliers
raw_data = {
    'employee_id': [101, 102, 103, 104, 101, 105, 106],
    'full_name': [' alice smith ', 'BOB JONES', 'charlie brown', 'David Miller', ' alice smith ', 'Eva Green', 'Frank White'],
    'age': [25, np.nan, 35, 200, 25, 29, 45],  # 200 is a clear outlier, Bob is NaN
    'join_date': ['2024-01-15', '2023/11/10', '15-09-2022', '2021-05-18', '2024-01-15', '2020-03-01', '2019-12-12'],
    'salary': [75000.0, 82000.0, np.nan, 120000.0, 75000.0, 95000.0, 500000.0]  # Charlie is NaN, Frank is a extreme salary value
}

def clean_data_pipeline(data_dict):
    print("--- Starting Data Cleaning & Processing Pipeline ---\n")
    df = pd.DataFrame(data_dict)
    print(f"Original Shape: {df.shape}")
    print("Original DataFrame:\n", df, "\n")

    # Step 1: Remove duplicate rows
    # In database pipelines, duplicate primary keys break integrity (PK violations)
    df.drop_duplicates(keep='first', inplace=True)
    print(f"Shape after deduplication: {df.shape}\n")

    # Step 2: Normalize string values
    # Clean text makes searches, joins, and aggregates consistent
    df['full_name'] = df['full_name'].str.strip().str.title()
    print("String cleaning done (whitespace trimmed and TitleCase applied).")

    # Step 3: Handle date formatting safely
    # Convert mixed date strings to standard YYYY-MM-DD
    df['join_date'] = pd.to_datetime(df['join_date'], errors='coerce', format='mixed')
    print("Mixed dates standardized to YYYY-MM-DD format.")

    # Step 4: Outlier Detection and Filtering (IQR Method)
    # The Interquartile Range (IQR) helps detect anomalies (e.g. Age = 200)
    print("\nEvaluating outliers in numerical columns (Age):")
    # For a small list, let's validate age bounds manually or via IQR
    # Age > 120 is biologically anomalous. Let's cap it or drop it:
    anomalous_ages = df[df['age'] > 110]
    if not anomalous_ages.empty:
        print(f"-> Found age anomalies: \n{anomalous_ages}")
        df.loc[df['age'] > 110, 'age'] = np.nan  # Nullify outlier to impute later
        print("Anomalous ages reset to NaN for safe imputation.")

    # Step 5: Impute missing numerical columns
    # We impute missing age and salary values using column averages
    mean_age = round(df['age'].mean(), 1)
    mean_salary = round(df['salary'].mean(), 2)

    df['age'].fillna(mean_age, inplace=True)
    df['salary'].fillna(mean_salary, inplace=True)
    print(f"Imputed missing Age with average ({mean_age}) and Salary with average ({mean_salary}).")

    # Step 6: Validate schema types explicitly (Fundamentals of secure pipeline)
    df = df.astype({
        'employee_id': 'int64',
        'full_name': 'string',
        'age': 'int32',
        'salary': 'float64'
    })

    print("\nCleaned and Processed DataFrame:\n", df)
    print("\nFinal Schema Types:")
    print(df.dtypes)
    return df

if __name__ == '__main__':
    clean_df = clean_data_pipeline(raw_data)
