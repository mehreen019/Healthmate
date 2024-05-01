import nltk
nltk.download('wordnet')

from nltk.corpus import wordnet
import spacy

nlp = spacy.load("en_core_web_sm")
w1 = nlp("knee pain")[0]
w2 = nlp("joint pain")[0]

x = w1.similarity(w2)
print(x)

synonyms = wordnet.synsets('dizzy')
print(synonyms)