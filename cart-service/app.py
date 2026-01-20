from flask import Flask, jsonify, request

app = Flask(__name__)

# Mock In-memory Storage
carts = {}

@app.route('/cart/<user_id>', methods=['GET'])
def get_cart(user_id):
    cart = carts.get(user_id, [])
    return jsonify({"userId": user_id, "items": cart})

@app.route('/cart/<user_id>', methods=['POST'])
def add_to_cart(user_id):
    item = request.json
    if not item:
        return jsonify({"error": "No item provided"}), 400
    
    if user_id not in carts:
        carts[user_id] = []
    
    carts[user_id].append(item)
    return jsonify({"status": "added", "cart": carts[user_id]})

@app.route('/cart/<user_id>', methods=['DELETE'])
def clear_cart(user_id):
    if user_id in carts:
        del carts[user_id]
    return jsonify({"status": "cleared"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8082)
