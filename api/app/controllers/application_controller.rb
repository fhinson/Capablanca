class ApplicationController < ActionController::API
  def home
    render text: 'Welcome to Capablanca!'
  end
end
