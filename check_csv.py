import pandas as pd

# Load movie dataset
movies_df = pd.read_csv("movies_updated.csv")
print("Movies Dataset Columns:", movies_df.columns)

# Load show dataset
shows_df = pd.read_csv("shows_updated.csv")
print("Shows Dataset Columns:", shows_df.columns)