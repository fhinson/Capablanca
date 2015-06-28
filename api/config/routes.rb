Rails.application.routes.draw do
  root to: 'application#home'

  post '/analyze', to: 'images#analyze'
end
