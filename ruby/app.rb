require 'base64'
require 'json'
require 'openssl'
require 'securerandom'
require 'sinatra'
require 'sinatra/cross_origin'

require 'net/http'
require 'uri'


enable :cross_origin
set :port, 1337

PRODUCTION = 'https://partner.opened.com'
MOCK_SERVER = 'https://private-anon-f19fb4f34-opened.apiary-mock.com'

def http_get(url,params=nil)
  return Net::HTTP.get('private-anon-f19fb4f34-opened.apiary-mock.com', "#{url}?".concat(params.collect { |k,v| "#{k}=#{URI.escape(v.to_s)}" }.join('&'))) unless params.nil?
  return Net::HTTP.get(URI.parse(url))
end

def get_allowed_params(params, permitted_params)
  @params.select {|param,v| permitted_params.include? param}
end

options '*' do
  response.headers['Allow'] = 'HEAD,GET,PUT,POST,DELETE,OPTIONS'
  response.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept'
  200
end

get '/' do
  send_file File.join('public/index.html')
end

get '/opened-api.js' do
  send_file File.join('../../opened-api.js')
end

get '/standard_groups' do
  http_get("#{MOCK_SERVER}/1/standard_groups.json")
end

get '/grade_groups' do
  permitted_params = ['standard_group']
  allowed_params = get_allowed_params(@params, permitted_params)
  http_get("/1/grade_groups.json",allowed_params)
end

get '/categories' do
  permitted_params = ['standard_group', 'grade_group']
  allowed_params = get_allowed_params(@params, permitted_params)
  http_get("#{MOCK_SERVER}/1/categories.json",@params)
end

get '/standards' do
  permitted_params = ['standard_group', 'grade_group', 'category']
  allowed_params = get_allowed_params(@params, permitted_params)
  http_get("#{MOCK_SERVER}/1/standards.json",@params)
end

get '/areas' do
  http_get("#{MOCK_SERVER}/areas.json")
end

get '/subjects' do
  permitted_params = ['area']
  allowed_params = get_allowed_params(@params, permitted_params)
  http_get("/1/subjects.json",allowed_params)
end
