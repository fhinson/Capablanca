require 'opencv'
include OpenCV
require 'tesseract'
require 'ots'

class ImagesController < ApplicationController
  def analyze
    png = nil
    if params[:image]
      data = params[:image].strip
      if data.include?('data:image')
        data = data[data.index(',') + 1 .. -1]
      end
      png = Base64.decode64(data)
    else
      png = 'app/assets/images/sample5.png'
    end

    # do opencv pre-processing

    engine = Tesseract::Engine.new {|e|
      e.language  = :eng
      e.blacklist = '|'
    }

    parser = Gingerice::Parser.new
    text = parser.parse(engine.text_for(png).strip.gsub("\n", " "))['result']
    summarizer = OTS.parse(text)

    render json: {text: text, summary: summarizer.summarize(sentences: 1)}
  end
end
