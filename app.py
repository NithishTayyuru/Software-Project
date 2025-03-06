from flask import Flask, request, jsonify

app = Flask(__name__)

# Dummy event data
events = [
    {"id": 1, "title": "Music Concert", "description": "Live concert with top artists!", "category": "Music", "date": "2025-04-15", "location": "New York", "image": "music.jpg"},
    {"id": 2, "title": "Tech Conference", "description": "AI & Cloud trends", "category": "Technology", "date": "2025-05-10", "location": "San Francisco", "image": "tech.jpg"},
    {"id": 3, "title": "Food Festival", "description": "Delicious cuisines", "category": "Food & Drink", "date": "2025-06-20", "location": "Los Angeles", "image": "food.jpg"}
]

cart = []
users = {"test@example.com": "password123"}

# Fetch all events
@app.route("/api/events", methods=["GET"])
def get_events():
    return jsonify(events)

# Search events
@app.route("/api/search", methods=["GET"])
def search_events():
    query = request.args.get("query", "").lower()
    filtered_events = [event for event in events if query in event["title"].lower()]
    return jsonify(filtered_events)

# Filter events
@app.route("/api/filter", methods=["GET"])
def filter_events():
    category = request.args.get("category", "all")
    location = request.args.get("location", "all")
    date = request.args.get("date", "")

    filtered = [event for event in events if 
                (category == "all" or event["category"] == category) and
                (location == "all" or event["location"] == location) and
                (date == "" or event["date"] == date)]
    return jsonify(filtered)

# Add to cart
@app.route("/api/cart/add", methods=["POST"])
def add_to_cart():
    event_id = request.json.get("event_id")
    cart.append(event_id)
    return jsonify({"cart_count": len(cart)})

# Checkout
@app.route("/api/cart/checkout", methods=["POST"])
def checkout():
    cart.clear()
    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(debug=True)
