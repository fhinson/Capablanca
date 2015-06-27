class ImagesController < ApplicationController
  def analyze
    require 'tesseract'

    engine = Tesseract::Engine.new {|e|
      e.language  = :eng
      e.blacklist = '|'
    }

    render json:  engine.text_for('app/assets/images/sample-1.jpg').strip
  end
end
