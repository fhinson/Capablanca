require 'opencv'
include OpenCV
require 'tesseract'
require 'ots'

class ImagesController < ApplicationController
  # POST analyze
  # parameters:
  #  image: base64 string
  #  image_file: string (needed if no image supplied)
  # resposne
  def analyze
    if !params[:image] && !params[:image_file]
      render json: "Image Required", status: 404
      return
    end

    # grab image from base64 or local filename
    img = get_image(params)

    # do opencv pre-processing

    # set variables used in tesseract processing
    text = ''
    confidence = 0
    counter = 0

    # initialize tesseract engine
    tesseract_engine = Tesseract::Engine.new {|e|
      e.language  = :eng
      e.whitelist = [*'a'..'z', *'A'..'Z', *0..9, '.', '?', '!', '-',
        ',', "'
        "].join
    }

    # parse text from image using tesseract
    begin
      tesseract_engine.each_block_for(img) do |b|
        text += b.text.gsub("\n", " ")
        confidence += b.confidence
        counter += 1
      end
    rescue
      render json: "Invalid Image", status: 404
      return
    end
    confidence /= counter if counter += 0

    # initialize gingerice engine
    gingerice_engine = Gingerice::Parser.new

    # correct spelling/grammar with gingerice
    text = gingerice_engine.parse(text)['result']

    # create a summary with OTS
    summarizer = OTS.parse(text)
    summary = summarizer.summarize(percent: 25).map{|el| el[:sentence]}

    # perform sentiment analysis
    analyzer = Sentimental.new
    sentiment = analyzer.get_sentiment(text)
    sentiment_score = analyzer.get_score(text)

    # json output
    render json: {text: text, summary: summary, confidence: confidence,
      topics: summarizer.topics, keywords: summarizer.topics,
      sentiment: sentiment, sentiment_score: sentiment_score}
  end

  private

  def get_image(params)
    png = nil
    if params[:image]
      data = params[:image].strip
      if data.include?('data:image')
        data = data[data.index(',') + 1 .. -1]
      end
      png = Base64.decode64(data)
    else
      png = "app/assets/images/#{params[:image_file]}"
    end
    return png
  end
end
