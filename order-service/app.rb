require 'sinatra'
require 'json'
require 'net/http'
require 'uri'

set :port, 8084
set :bind, '0.0.0.0'

orders = []

before do
  content_type :json
  response.headers['Access-Control-Allow-Origin'] = '*'
  response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
  response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
end

options '*' do
  200
end

get '/orders' do
  orders.to_json
end

post '/orders' do
  request.body.rewind
  data = JSON.parse(request.body.read)
  
  new_order = {
    id: "ord_#{Time.now.to_i}",
    user_email: data['user_email'], # Expecting email now
    items: data['items'],
    total: data['total'],
    status: 'confirmed',
    timestamp: Time.now.to_s
  }
  
  orders << new_order
  
  # CALL NOTIFICATION SERVICE
  # Fire and forget (in a real app, use a queue)
  Thread.new do
    begin
      uri = URI('http://localhost:8087/notify')
      http = Net::HTTP.new(uri.host, uri.port)
      req = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
      
      message = "<h1>Order Confirmed!</h1><p>Order ID: #{new_order[:id]}</p><p>Total: $#{new_order[:total]}</p><p>Thank you for shopping with PolyShop.</p>"
      
      req.body = {
        to: new_order[:user_email],
        type: 'email',
        message: message
      }.to_json
      
      res = http.request(req)
      puts "Notification sent: #{res.code}"
    rescue => e
      puts "Failed to send notification: #{e.message}"
    end
  end

  status 201
  new_order.to_json
end
