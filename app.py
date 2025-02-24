from flask import Flask, request, jsonify, render_template
import csv

app = Flask(__name__, static_folder="static", template_folder="templates")

def load_data(file_path):
    data = []
    with open(file_path, encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append({
                "title": row["title"],
                "language": row["language"],
                "rating": row["rating"],
                "platform": row["platform"],
                "description": row["description"]
            })
    return data

movies_data = load_data("movies_updated13.csv")
shows_data = load_data("shows_updated.csv")

@app.route("/")
def home():
    return render_template("index.html")  # Load the HTML file properly

@app.route("/movies")
def get_movies():
    language = request.args.get("language")
    filtered_movies = [movie for movie in movies_data if movie["language"].lower() == language.lower()]
    return jsonify(filtered_movies if filtered_movies else {"message": "No movies found for this language."})

@app.route("/shows")
def get_shows():
    language = request.args.get("language")
    filtered_shows = [show for show in shows_data if show["language"].lower() == language.lower()]
    return jsonify(filtered_shows if filtered_shows else {"message": "No shows found for this language."})

if __name__ == "__main__":
    app.run(debug=True)











