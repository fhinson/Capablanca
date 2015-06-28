LETTERS = ("a".."z").to_a.join
NWORDS = Hash.new(1)
File.read('words.txt').downcase.scan(/[a-z]+/).each do |f|
  NWORDS[f] += 1
end
