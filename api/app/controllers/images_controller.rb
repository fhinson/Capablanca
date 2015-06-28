require 'opencv'
include OpenCV
require 'tesseract'
require 'ots'

class ImagesController < ApplicationController
  # POST analyze
  # parameters:
  #  image: base64 string
  #  image_file: string (needed if no image supplied)
  # response:
  #  text: string
  #  summary: array of strings
  #  confidence: float (0 - 100)
  #  topics: array of strings
  #  keywords: array of strings
  #  sentiment: string (positive > .25, negative < -.25, neutral in between)
  #  sentiment_score: float ( ^^ )
  def analyze
    # check that image parameter present
    if !params[:image] && !params[:image_file]
      render json: "Image Required", status: 404
      return
    end
    language = params[:language] || 'english'
    fast = params[:fast] == 'true'

    # grab image from base64 or local filename
    img = get_image(params, fast)

    # do opencv pre-processing
    opencv_crop(img) if !fast

    # set variables used in tesseract processing
    text = ''
    confidence = 0
    counter = 0

    # initialize tesseract engine
    tesseract_engine = Tesseract::Engine.new {|e|
      e.language  = abbrev(language, 3).to_sym
      e.whitelist = [*'a'..'z', *'A'..'Z', *0..9, '.', '?', '!', '-',
        ',', "'"].join
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

    if english?(language)
      # initialize gingerice engine
      gingerice_engine = Gingerice::Parser.new

      # correct spelling/grammar with gingerice and custom spell_check
      text = (' ' + text + ' ').gsub(/ [^iIaA.!?,'-] /, ' ')
      text = gingerice_engine.parse(text)['result']
      if !fast
        words = text.split(' ')
        words.each_with_index do |word, i|
          next if word =~ /['-]/
          w = word.gsub(/[0-9.!?,'-]/, '')
          c = correct(word)
          words[i] = c if w.downcase != c
          words[i] = '' if w == ''
        end
        text = words.join(' ').gsub(/ +/, ' ')
      end
    end

    # create a summary with OTS
    summarizer = OTS.parse(text, language: abbrev(language, 2))
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

  def get_image(params, fast)
    filename = nil
    if params[:image]
      data = params[:image].strip
      if data.include?('data:image')
        data = data[data.index(',') + 1 .. -1]
      end
      png = Base64.decode64(data)
      return png if fast
      filename = 'app/assets/images/image.png'
      File.open(filename, 'wb') do |f|
        f.write(png)
      end
    else
      filename = "app/assets/images/#{params[:image_file]}"
    end
    return filename
  end

  def english?(l)
    return l == 'english' || l == 'eng' || l == 'en'
  end

  def abbrev(l, n)
    case l
    when 'english'
      return 'eng' if n == 3
      return 'en' if n == 2
    when 'french'
      return 'fra' if n == 3
      return 'fr' if n == 2
    when 'spanish'
      return 'spa' if n == 3
      return 'es' if n == 2
    end
  end

  def edits1(word)
    n = word.length
    deletion = (0...n).collect {|i| word[0...i]+word[i+1..-1] }
    transposition = (0...n-1).collect {|i| word[0...i]+word[i+1,1]+word[i,1]+word[i+2..-1] }
    alteration = []
    n.times {|i| LETTERS.each_byte {|l| alteration << word[0...i]+l.chr+word[i+1..-1] } }
    insertion = []
    (n+1).times {|i| LETTERS.each_byte {|l| insertion << word[0...i]+l.chr+word[i..-1] } }
    result = deletion + transposition + alteration + insertion
    result.empty? ? nil : result
  end

  def known_edits2(word)
    result = []
    edits1(word).each {|e1| edits1(e1).each {|e2| result << e2 if NWORDS.has_key?(e2) }}
    result.empty? ? nil : result
  end

  def known(words)
    result = words.find_all {|w| NWORDS.has_key?(w) }
    result.empty? ? nil : result
  end

  def correct(word)
    (known([word]) or known(edits1(word)) or known_edits2(word) or
      [word]).max {|a,b| NWORDS[a] <=> NWORDS[b] }
  end

  def opencv_crop(img)
    cvmat = OpenCV::CvMat.load(img)
    cvmat = cvmat.BGR2GRAY
    canny = cvmat.canny(100,200)
    contour = canny.find_contours(:mode => OpenCV::CV_RETR_LIST, :method => OpenCV::CV_CHAIN_APPROX_SIMPLE)

    while contour
      # No "holes" please (aka. internal contours)
      unless contour.hole?

        puts '-' * 80
        puts "BOUNDING RECT FOUND"
        puts '-' * 80

        # You can detect the "bounding rectangle" which is always oriented horizontally and vertically
        box = contour.bounding_rect
        puts "found external contour with bounding rectangle from #{box.top_left.x},#{box.top_left.y} to #{box.bottom_right.x},#{box.bottom_right.y}"

        # The contour area can be computed:
        puts "that contour encloses an area of #{contour.contour_area} square pixels"

        # .. as can be the length of the contour
        puts "that contour is #{contour.arc_length} pixels long "

        # Draw that bounding rectangle
        cvmat.rectangle! box.top_left, box.bottom_right, :color => OpenCV::CvColor::Black

        # You can also detect the "minimal rectangle" which has an angle, width, height and center coordinates
        # and is not neccessarily horizonally or vertically aligned.
        # The corner of the rectangle with the lowest y and x position is the anchor (see image here: http://bit.ly/lT1XvB)
        # The zero angle position is always straight up.
        # Positive angle values are clockwise and negative values counter clockwise (so -60 means 60 degree counter clockwise)
        box = contour.min_area_rect2
        puts "found minimal rectangle with its center at (#{box.center.x.round},#{box.center.y.round}), width of #{box.size.width.round}px, height of #{box.size.height.round} and an angle of #{box.angle.round} degree"
      end
      contour = contour.h_next
    end

    # And save the image
    puts "\nSaving image with bounding rectangles"
    cvmat.save_image("app/assets/images/rect_image.png")
  end
end
