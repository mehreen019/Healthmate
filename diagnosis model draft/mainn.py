import pandas as pd
import numpy as np
import nltk
nltk.download('wordnet')

from nltk.corpus import wordnet
import csv
import json
import itertools
from spacy.lang.en.stop_words import STOP_WORDS
import spacy
import joblib
from flask import Flask, render_template, request, session

app = Flask(__name__)

nlp = spacy.load('en_core_web_sm')

# save data
data = {"users": []}
with open('DATA.json', 'w') as outfile:
    json.dump(data, outfile)


def write_json(new_data, filename='DATA.json'):
    with open(filename, 'r+') as file:
        # First we load existing data into a dict.
        file_data = json.load(file)
        # Join new_data with file_data inside emp_details
        file_data["users"].append(new_data)
        # Sets file's current position at offset.
        file.seek(0)
        # convert back to json.
        json.dump(file_data, file, indent=4)


df_tr = pd.read_csv('Medical_dataset/Training.csv')
df_tt = pd.read_csv('Medical_dataset/Testing.csv')

symp = []
disease = []
for i in range(len(df_tr)):
    symp.append(df_tr.columns[df_tr.iloc[i] == 1].to_list())
    disease.append(df_tr.iloc[i, -1])

# # I- GET ALL SYMPTOMS

all_symp_col = list(df_tr.columns[:-1])


def clean_symp(sym):
    return sym.replace('_', ' ').replace('.1', '').replace('(typhos)', '').replace('yellowish', 'yellow').replace(
        'yellowing', 'yellow')


all_symp = [clean_symp(sym) for sym in (all_symp_col)]


def preprocess(doc):
    nlp_doc = nlp(doc)
    d = []
    for token in nlp_doc:
        if (not token.text.lower() in STOP_WORDS and token.text.isalpha()):
            d.append(token.lemma_.lower())
    return ' '.join(d)


all_symp_pr = [preprocess(sym) for sym in all_symp]

# associate each processed symp with column name
col_dict = dict(zip(all_symp_pr, all_symp_col))


# II- Syntactic Similarity

# Returns all the subsets of a set. This is a generator.
# {1,2,3}->[{},{1},{2},{3},{1,3},{1,2},..]
def powerset(seq):
    if len(seq) <= 1:
        yield seq
        yield []
    else:
        for item in powerset(seq[1:]):
            yield [seq[0]] + item
            yield item


# Sort list based on length
def sort(a):
    for i in range(len(a)):
        for j in range(i + 1, len(a)):
            if len(a[j]) > len(a[i]):
                a[i], a[j] = a[j], a[i]
    a.pop()
    return a


# find all permutations of a list
def permutations(s):
    permutations = list(itertools.permutations(s))
    return ([' '.join(permutation) for permutation in permutations])


# check if a txt and all diferrent combination if it exists in processed symp list
def DoesExist(txt):
    txt = txt.split(' ')
    combinations = [x for x in powerset(txt)]
    sort(combinations)
    for comb in combinations:
        # print(permutations(comb))
        for sym in permutations(comb):
            if sym in all_symp_pr:
                # print(sym)
                return sym
    return False


# Jaccard similarity 2docs
def jaccard_set(str1, str2):
    list1 = str1.split(' ')
    list2 = str2.split(' ')
    intersection = len(list(set(list1).intersection(list2)))
    union = (len(list1) + len(list2)) - intersection
    return float(intersection) / union


# apply vanilla jaccard to symp with all corpus
def syntactic_similarity(symp_t, corpus):
    most_sim = []
    poss_sym = []
    for symp in corpus:
        d = jaccard_set(symp_t, symp)
        most_sim.append(d)
    order = np.argsort(most_sim)[::-1].tolist()
    for i in order:
        #print(corpus[i])
        if DoesExist(symp_t):
            return 1, [corpus[i]]
        if corpus[i] not in poss_sym and most_sim[i] != 0:
            poss_sym.append(corpus[i])
    if len(poss_sym):
        return 1, poss_sym
    else:
        return 0, None


# check a pattern if it exists in processed symp list
def check_pattern(inp, dis_list):
    import re
    pred_list = []
    ptr = 0
    patt = "^" + inp + "$"
    regexp = re.compile(inp)
    for item in dis_list:
        if regexp.search(item):
            pred_list.append(item)
    if (len(pred_list) > 0):
        return 1, pred_list
    else:
        return ptr, None


# III- Semantic Similarity


from nltk.wsd import lesk
from nltk.tokenize import word_tokenize


def WSD(word, context):
    sens = lesk(context, word)
    return sens


# semantic similarity 2docs
def semanticD(doc1, doc2):
    doc1_p = preprocess(doc1).split(' ')
    doc2_p = preprocess(doc2).split(' ')
    score = 0
    for tock1 in doc1_p:
        for tock2 in doc2_p:
            syn1 = WSD(tock1, doc1)
            syn2 = WSD(tock2, doc2)
            if syn1 is not None and syn2 is not None:
                x = syn1.wup_similarity(syn2)
                # x=syn1.path_similarity((syn2))
                if x is not None and x > 0.25:
                    score += x
    return score / (len(doc1_p) * len(doc2_p))


# apply semantic simarity to symp with all corpus
def semantic_similarity(symp_t, corpus):
    
    max_sim = 0
    most_sim = None
    for symp in corpus:
        print(symp_t + " " + symp)
        d = semanticD(symp_t, symp)
        if d > max_sim:
            most_sim = symp
            max_sim = d
    return max_sim, most_sim


# given a symp suggest possible synonyms
def suggest_syn(sym):
    symp = []
    #sym= nlp(sym)
    synonyms = wordnet.synsets(sym)
    print(synonyms)
    print("these are the synonyms")
    lemmas = [word.lemma_names() for word in synonyms]
    lemmas = list(set(itertools.chain(*lemmas)))
    for e in lemmas:
        res, sym1 = semantic_similarity(e, all_symp_pr)
        print(sym1)
        if res != 0:
            symp.append(sym1)
    return list(set(symp))


# One-Hot-Vector dataframe
def OHV(cl_sym, all_sym):
    #print(cl_sym)
    #print(all_sym)
    
    l = np.zeros([1, len(all_sym)])
    for sym in cl_sym:
        l[0, all_sym.index(sym)] = 1
    return pd.DataFrame(l, columns=all_sym)


def contains(small, big):
    a = True
    for i in small:
        if i not in big:
            a = False
    return a


# list of symptoms --> possible diseases
def possible_diseases(l):
    poss_dis = []
    for dis in set(disease):
        
        if contains(l, symVONdisease(df_tr, dis)):
            poss_dis.append(dis)
    return poss_dis


# disease --> all symptoms
def symVONdisease(df, disease):
    ddf = df[df.prognosis == disease]
    m2 = (ddf == 1).any()
    primarySymptoms = m2.index[m2].tolist()
    cleanedSymptoms = [clean_symp(sym) for sym in (primarySymptoms)]
    return cleanedSymptoms
    


# IV- Prediction Model (KNN)
# load model
knn_clf = joblib.load('model/knn.pkl')

# ##  VI- SEVERITY / DESCRIPTION / PRECAUTION
# get dictionaries for severity-description-precaution for all diseases

severityDictionary = dict()
description_list = dict()
precautionDictionary = dict()


def getDescription():
    global description_list
    with open('Medical_dataset/symptom_Description.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            _description = {row[0]: row[1]}
            description_list.update(_description)


def getSeverityDict():
    global severityDictionary
    with open('Medical_dataset/symptom_severity.csv') as csv_file:

        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        try:
            for row in csv_reader:
                _diction = {row[0]: int(row[1])}
                severityDictionary.update(_diction)
        except:
            pass


def getprecautionDict():
    global precautionDictionary
    with open('Medical_dataset/symptom_precaution.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            _prec = {row[0]: [row[1], row[2], row[3], row[4]]}
            precautionDictionary.update(_prec)


# load dictionaries
getSeverityDict()
getprecautionDict()
getDescription()


# calcul patient condition
def calc_condition(exp, days):
    sum = 0
    for item in exp:
        if item in severityDictionary.keys():
            sum = sum + severityDictionary[item]
    if ((sum * days) / (len(exp)) > 13):
        return 1
        print("You should take the consultation from doctor. ")
    else:
        return 0
        print("It might not be that bad but you should take precautions.")


# print possible symptoms
def related_sym(psym1):
    s = "Could you be more specific? \n"
    i = len(s)
    for num, it in enumerate(psym1):
        s += str(num) + ") " + clean_symp(it) + "\n"

    if num != 0:
        s += "Select the one you meant."
        return s
    else:
        return 0
    
    
current_state = "fs"
temp1=[]
temp2=[]
suggestions=[]
result=[]
userAllSymp=[]
userExtraSymp= None
userDisease=[]
askedUser=[]
maindis=""
result=[]
testprediction=[]

#start
print("Hello! what symptomps are you facing?")
while True:
    
        
    if current_state=="fs":
        symptom1= input('You: ')
        if symptom1 == 'quit':
            break
        #else:
         #   current_state = "fs"
    
        sym1 = preprocess(symptom1)
        sim1, mainsym1 = syntactic_similarity(sym1, all_symp_pr) #similarity, main symptom 1
        temp1 = [sym1, sim1, mainsym1]
        current_state="ss"
        #print(temp1)
        if sim1 == 1:
            s=related_sym(mainsym1)
            if s!=0:
                current_state="rs1"
                print(s)
            else:
                temp1[2]=mainsym1[0]
                print("You are probably facing another symptom, if so, can you specify it?")
        else:
            print("You are probably facing another symptom, if so, can you specify it?")
    
    if(current_state=="rs1"):
        idx = input('You: ')
        
        mainsym1 = clean_symp(mainsym1[int(idx)])
        temp1[2]=mainsym1
        current_state="ss"
        print("You are probably facing another symptom, if so, can you specify it?")
    
    if(current_state=="ss"):
        symptom2= input('You: ')
        if symptom2 == 'quit':
            break
        sym2 = preprocess(symptom2)
        sim2, mainsym2 = syntactic_similarity(sym2, all_symp_pr) #similarity, main symptom 2
        temp2 = [sym2, sim2, mainsym2]
        current_state="semantic"
        if sim2 == 1:
            #print(mainsym2)
            s = related_sym(mainsym2)
            if s!= 0:
                current_state = "rs2"  # related sym2
                print(s)
            else:
                temp2[2]=mainsym2[0]
                
                
    if(current_state=="rs2"):
        idx = input('You: ')
        mainsym2 = clean_symp(mainsym2[int(idx)])
        
        temp2[2]=mainsym2
        print(temp2[2])
        current_state="semantic"
    
    if current_state=="semantic":
        if sim1==0 or sim2==0:   #if any word similarities are 0
            current_state="sim1=0prep"
        else:
            current_state="possible_disease"
    
    
    if current_state=="sim1=0prep":
        if sim1<0 or len(sym1)!=0:
            print("sim1=0prep reached")
            sim1, mainsym1 = semantic_similarity(sym1, all_symp_pr)
            temp1[1]=sim1
            temp1[2]=mainsym1
            print(sim1)
            print(mainsym1)
            print("leaving sim1=0prep")
            current_state="sim1=0"
        else:
            current_state="sim2=0prep"
            
    if current_state=="sim1=0":    #if still no similarity, then suggestions 
        sim1=temp1[1]
        sym1=temp1[0]
        mainsym1=temp1[2]
        
        if sim1<1:
            print(sim1)
            if suggestions==[]:
                suggestions = suggest_syn(sym1)
                print(suggestions)
            if(len(suggestions)>0):
                mainsym1=[]
                while i in range(len(suggestions)):
                    
                    ans=""
                    msg = "are you experiencing any " + suggestions[i] + "?"
                    ans = input(msg)
                    if(ans.lower() == "yes"):  #similarity 1 cause this is what they're experiencing
                        mainsym1.append(suggestions[i])
                        sim1=1
                         
                temp1[1]=sim1         
                temp1[2]=mainsym1
        
        print(mainsym1)
        current_state="sim2=0prep"
        suggestions=[]
    
    if current_state=="sim2=0prep":
        
        if sim2<1 or len(sym2)!=0:
            print("sim2=0 reached")
            sim2, mainsym2 = semantic_similarity(sym2, all_symp_pr)
            temp2[1]=sim2
            temp2[2]=mainsym2
            print(sim2)
            print(mainsym2)
            print("leaving sim2=0prep")
            current_state="sim2=0"
        else:
            current_state="TEST"
        
    if current_state=="sim2=0":
        sim2=temp2[1]
        sym2=temp2[0]
        mainsym2=temp2[2]
        if sim2<0:
            if suggestions==[]:
                suggestions = suggest_syn(sym2)
            if(len(suggestions)>0):
                mainsym2=[]
                while i in range(len(suggestions)):
                    
                    ans=""
                    msg = "are you experiencing any " + suggestions[i] + "?"
                    ans = input(msg)
                    if(ans.lower() == "yes"):  #similarity 1 cause this is what they're experiencing
                        mainsym2.append(suggestions[i])
                        sim2=1
                         
                temp2[1]=sim2         
                temp2[2]=mainsym2
        
        print(mainsym2)
        current_state="TEST"
        
    if current_state=="TEST":
        if temp1[1]==0 or temp2[1]==0:        #if similarity is still 0
            result = None
            current_state="END"
        else:
            if temp1[1]==0:
                temp1[2]=temp2[1]
            if temp2[1]==0:
                temp2[2]=temp1[2]
            current_state="possible_disease"
               
    if current_state=="possible_disease":
        
        print(userAllSymp)
        
        if userAllSymp==[]:
            userAllSymp.append(temp1[2].all())
            userAllSymp.append(temp2[2].all())
            
        print(userAllSymp)
        print("all user symptoms")
        
        userDisease = possible_diseases(userAllSymp)
        print(userDisease)
        print("this is the possible disease part")
        maindis= userDisease[0]
        current_state="for_maindis"
            
        
        print("possible diseases reached") 
        
    if current_state=="DISEASE":
        if userExtraSymp is None:
            userExtraSymp= symVONdisease(df_tr, maindis)
            
        tempExtra = userExtraSymp
        #print(userExtraSymp)
        #print("extra symptom")
            
        if len(userExtraSymp)>0:
            if(tempExtra[0] not in userAllSymp and tempExtra[0] not in askedUser):
                askedUser.append(tempExtra[0])
                msg = "Are you experiencing any "+ clean_symp(tempExtra[0]) + "?\nYou:"
                s=input(msg)
                
                if s.lower() == "yes":
                    userAllSymp.append(tempExtra[0])
                    print("ok")
            
                #del tempExtra[0]
            userExtraSymp.remove(tempExtra[0])
                
        else:
            
            PD= possible_diseases(userAllSymp)
            
            for i in range(len(userDisease)):
                if(userDisease[i] in PD):
                    testprediction.append(userDisease[i])
             
            #if userDisease[0] in PD:
            #    testprediction= userDisease[0]
               
            print(PD)
            print("these are the PD")
            PD.remove(userDisease[0])
            current_state= "for_maindis"    
            #userDisease= PD
            userDisease= []
            #print(len(userDisease))
            #print("user disease length")     
        
    if current_state=="for_maindis":
        if(len(userDisease)<=0):
            current_state="predict"
        else:
            current_state = "DISEASE"
            maindis = userDisease[0]
            userExtraSymp= symVONdisease(df_tr, maindis)
            
    if current_state=="predict":
        result = knn_clf.predict(OHV(userAllSymp, all_symp))
        current_state = "END"
        
    if current_state=="END":
        
        if result is not None:
            print(result[0])
            print("this is the result")
            print(testprediction)
            print("this is the test prediction")
        #if testprediction is not None:
            if result[0] not in testprediction:
                current_state = "fs"
                print("as you provide me with few symptoms, I am sorry to announce that I cannot predict your " \
                       "disease for the moment!!!\n Can you specify more about what you are feeling or Type 'quit' to " \
                       "stop the conversation ")
            else:
                current_state = "Description"
                maindis = result[0]
                print("you may have " + maindis + ". Tap D to get a description of the disease .")
        else:
            current_state = "fs"  # test if user want to continue the conversation or not
            print("can you specify more what you feel or Type quit to stop the conversation")
            
    if current_state == "Description":
        s=input()
        """
        y = {"Name": session["name"], "Age": session["age"], "Gender": session["gender"], "Disease": session["disease"],
             "Sympts": session["all"]}
        write_json(y)
        """
        if s=="D":  
            current_state = "Severity"
            if maindis in description_list.keys():
                print(description_list[maindis] + " \n  How many days have you had symptoms?")
            else:
                if " " in maindis:
                    maindis = maindis.replace(" ", "_")
                print("please visit <a href='" + "https://en.wikipedia.org/wiki/" + maindis + "'>  here  </a>")
        else:
            print("Thank you for using our program!")
            break
            
    if current_state == "Severity":
        s=input()
        if calc_condition(userAllSymp, int(s)) == 1:
            print("you should take the consultation from doctor \n type 'quit' to exit")
        else:
            msg = 'Nothing to worry about, but you should take the following precautions :\n '
            i = 1
            for e in precautionDictionary[maindis]:
                msg += '\n ' + str(i) + ' - ' + e + '<br>'
                i += 1
            #msg += ' Type quit to end'
            print(msg)
        
        break
         
          
          
                
            
                
        
        
    
    