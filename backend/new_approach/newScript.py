import pickle
import sys
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, ExtraTreesClassifier
import spacy
from rake_nltk import Rake
import nltk
nltk.download('stopwords')
from spacy.lang.en.stop_words import STOP_WORDS


# Load the model
#model = pickle.load(open('new_approach/ExtraTrees', 'rb'))
model=ExtraTreesClassifier()
with open('new_approach/ExtraTrees_1_000.pkl', 'rb') as f:
    model =  pickle.load(f)
    

desc = pd.read_csv("new_approach/symptom_Description.csv")
prec = pd.read_csv("new_approach/symptom_precaution.csv")

# Define the diseases and symptoms lists
diseases = [ '(vertigo) Paroymsal Positional Vertigo', 'AIDS', 'Acne', 'Alcoholic hepatitis', 'Allergy', 'Arthritis', 'Bronchial Asthma', 'Cervical spondylosis', 'Chicken pox', 'Chronic cholestasis', 'Common Cold', 'Dengue', 'Diabetes', 'Dimorphic hemmorhoids(piles)', 'Drug Reaction', 'Fungal infection', 'GERD', 'Gastroenteritis', 'Heart attack', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Hepatitis E', 'Hypertension', 'Hyperthyroidism', 'Hypoglycemia', 'Hypothyroidism', 'Impetigo', 'Jaundice', 'Malaria', 'Migraine', 'Osteoarthristis', 'Paralysis (brain hemorrhage)', 'Peptic ulcer diseae', 'Pneumonia', 'Psoriasis', 'Tuberculosis', 'Typhoid', 'Urinary tract infection', 'Varicose veins', 'hepatitis A' ]

symptoms =['itching', 'skin_rash', 'nodal_skin_eruptions','continuous_sneezing', 'shivering', 'chills', 'joint_pain','stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting','vomiting', 'burning_micturition', 'fatigue', 'weight_gain','anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss',
       'restlessness', 'lethargy', 'patches_in_throat',
       'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes',
       'breathlessness', 'sweating', 'dehydration', 'indigestion',
       'headache', 'yellowish_skin', 'dark_urine', 'nausea',
       'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain',
       'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever',
       'yellow_urine', 'yellowing_of_eyes', 'acute_liver_failure',
       'fluid_overload', 'swelling_of_stomach', 'swelled_lymph_nodes',
       'malaise', 'blurred_and_distorted_vision', 'phlegm',
       'throat_irritation', 'redness_of_eyes', 'sinus_pressure',
       'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs','fast_heart_rate', 'pain_during_bowel_movements',
       'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus',
       'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity',
       'swollen_legs', 'swollen_blood_vessels', 'puffy_face_and_eyes',
       'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties',
       'excessive_hunger', 'extra_marital_contacts',
       'drying_and_tingling_lips', 'slurred_speech', 'knee_pain',
       'hip_joint_pain', 'muscle_weakness', 'stiff_neck',
       'swelling_joints', 'movement_stiffness', 'spinning_movements',
       'loss_of_balance', 'unsteadiness', 'weakness_of_one_body_side',
       'loss_of_smell', 'bladder_discomfort', 'continuous_feel_of_urine',
       'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)',
       'depression', 'irritability', 'muscle_pain', 'altered_sensorium',
       'red_spots_over_body', 'belly_pain', 'abnormal_menstruation',
       'watering_from_eyes', 'increased_appetite', 'polyuria',
       'family_history', 'mucoid_sputum', 'rusty_sputum',
       'lack_of_concentration', 'visual_disturbances',
       'receiving_blood_transfusion', 'receiving_unsterile_injections',
       'coma', 'stomach_bleeding', 'distention_of_abdomen',
       'history_of_alcohol_consumption', 'blood_in_sputum',
       'prominent_veins_on_calf', 'palpitations', 'painful_walking',
       'pus_filled_pimples', 'blackheads', 'scurring', 'skin_peeling',
       'silver_like_dusting', 'small_dents_in_nails',
       'inflammatory_nails', 'blister', 'red_sore_around_nose',
       'yellow_crust_ooze', 'prognosis', 'skin rash',
       'pus filled pimples', 'mood swings', 'weight loss',
       'fast heart rate', 'excessive hunger', 'muscle weakness',
       'abnormal menstruation', 'muscle wasting', 'patches in throat',
       'high fever', 'extra marital contacts', 'yellowish skin',
       'loss of appetite', 'abdominal pain', 'yellowing of eyes',
       'chest pain', 'loss of balance', 'lack of concentration',
       'blurred and distorted vision', 'drying and tingling lips',
       'slurred speech', 'stiff neck', 'swelling joints',
       'painful walking', 'dark urine', 'yellow urine',
       'receiving blood transfusion', 'receiving unsterile injections',
       'visual disturbances', 'burning micturition', 'bladder discomfort',
       'foul smell of urine', 'continuous feel of urine',
       'irregular sugar level', 'increased appetite', 'joint pain',
       'skin peeling', 'small dents in nails', 'inflammatory nails',
       'swelling of stomach', 'distention of abdomen',
       'history of alcohol consumption', 'fluid overload',
       'pain during bowel movements', 'pain in anal region',
       'bloody stool', 'irritation in anus', 'acute liver failure',
       'stomach bleeding', 'back pain', 'weakness in limbs', 'neck pain',
       'mucoid sputum', 'mild fever', 'muscle pain', 'family history',
       'continuous sneezing', 'watering from eyes', 'rusty sputum',
       'weight gain', 'puffy face and eyes', 'enlarged thyroid',
       'brittle nails', 'swollen extremeties', 'swollen legs',
       'prominent veins on calf', 'stomach pain', 'spinning movements',
       'sunken eyes', 'silver like dusting', 'swelled lymph nodes',
       'blood in sputum', 'swollen blood vessels', 'toxic look (typhos)',
       'belly pain', 'throat irritation', 'redness of eyes',
       'sinus pressure', 'runny nose', 'loss of smell',
       'passage of gases', 'cold hands and feets',
       'weakness of one body side', 'altered sensorium',
       'nodal skin eruptions', 'red sore around nose',
       'yellow crust ooze', 'ulcers on tongue', 'spotting  urination',
       'pain behind the eyes', 'red spots over body', 'internal itching']
       
# Load the description and precautions data
desc = pd.read_csv("new_approach/symptom_Description.csv")
prec = pd.read_csv("new_approach/symptom_precaution.csv")


def predict_disease(passage, symptom_list):
    # Create a list of zeros
    features = [0]*len(symptoms)
    symp_list = []
    resulting=[]
    #symp_list = symptom_list
    count=10
    
    for symptom in symptom_list:
        arr = symptom
        arr = arr.split(" ")
        if(len(arr)==1): symp_list.append(symptom)
        for i in range(len(arr)):
            dem=arr[i]
            dem2=arr[i]
            for j in range(i+1, len(arr)):
                dem+="_"+ arr[j]
                dem2+=" "+arr[j]
                if dem in symptoms:
                    symp_list.append(dem)
                if dem2 in symptoms:
                    symp_list.append(dem2)
                
    
    """
    for olds in symptom_list:
        if olds not in symp_list:
            symp_list.append(olds)
    """
        
    
    for symptom in symp_list:
        if symptom in symptoms:
            index = symptoms.index(symptom)
            resulting.append(symptom)
            features[index] = 1
            
    
    # Make prediction using the model
    proba = model.predict_proba([features])

    # Get the indices and probabilities of the top 5 classes
    top5_idx = np.argsort(proba[0])[-5:][::-1]
    top5_proba = np.sort(proba[0])[-5:][::-1]

    # Get the names of the top 5 diseases
    top5_diseases = [diseases[i] for i in top5_idx]

    # Prepare the response
    response = []
    for i in range(5):
        disease = top5_diseases[i]
        probability = top5_proba[i]
        
        # Get the disease description
        disp = desc[desc['Disease'] == disease].values[0][1] if disease in desc["Disease"].unique() else "No description available"

        # Get the precautions
        precautions = []
        if disease in prec["Disease"].unique():
            c = np.where(prec['Disease'] == disease)[0][0]
            for j in range(1, len(prec.iloc[c])):
                precautions.append(prec.iloc[c, j])
                
        # Add the disease prediction to the response
        response.append({
            'disease': disease,
            'probability': float(probability),
            'description': disp,
            'precautions': precautions
        })
    return response


if __name__ == "__main__":
    for line in sys.stdin:
        data = json.loads(line.strip())
        """
        print({
            'disease': "",
            'probability': 0,
            'description': data,
            'precautions': ""
        })
        result = predict_disease(data[0].split(", "))
        
        #print("response ok, " , data, " was received")
        response = json.dumps(result[0])
        print(response)
        sys.stdout.flush()
        """
        prep_data = data[0].split(" ")
        for word in prep_data:
            word.lower().replace(',', '').replace(' ', '').replace('.','').replace(':','').replace('-','')
        

        newdata=data[0].lower()

        r=Rake()
        r.extract_keywords_from_text(newdata)

        extracted_symptoms=[]

        for rating, keyword in r.get_ranked_phrases_with_scores():
            extracted_symptoms.append(keyword)

        #print(prep_data)   
        result = predict_disease(data[0], extracted_symptoms)
        response = json.dumps(result[0])
        print(response)
        sys.stdout.flush()
