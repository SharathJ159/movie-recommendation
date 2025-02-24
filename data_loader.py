import pandas as pd

# Load datasets
movies_df = pd.read_csv("movies_updated.csv")
shows_df = pd.read_csv("shows_updated.csv")

# Display first 5 rows
print("Movies Dataset:")
print(movies_df.head())

print("\nShows Dataset:")
print(shows_df.head())