import joblib
import pandas as pd
import pickle
import numpy as np
import sys
import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split


model = pickle.load(open('new_approach/breast.pkl', 'rb'))

def predict(data):
    clump = data['clumpThick']
    preg = data['cellSize']
    glucose = data['cellShape']
    bp = data['marginalAdhesion']
    st = data['epithelial']
    insulin = data['bareNuclei']
    bmi = data['chromatin']
    dpf = data['normalNuclei']
    age = data['mitoses']
    features_value = [np.array([clump, preg, glucose, bp, st, insulin, bmi, dpf, age])]
    features_name = ['clump_thickness', 'uniform_cell_size', 'uniform_cell_shape', 'marginal_adhesion',
                     'single_epithelial_size', 'bare_nuclei', 'bland_chromatin', 'normal_nucleoli', 'mitoses']
    df = pd.DataFrame(features_value, columns=features_name)
    output = model.predict(df)
    if output == 4:
        return 1
    else:
        return 0

#DIABETES

df1 = pd.read_csv('new_approach/diabetes.csv')

df1 = df1.rename(columns={'DiabetesPedigreeFunction': 'DPF'})

df_copy = df1.copy(deep=True)
df_copy[['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']] = df_copy[['Glucose', 'BloodPressure',
                                                                                    'SkinThickness', 'Insulin',
                                                                                    'BMI']].replace(0, np.NaN)

df_copy['Glucose'].fillna(df_copy['Glucose'].mean(), inplace=True)
df_copy['BloodPressure'].fillna(df_copy['BloodPressure'].mean(), inplace=True)
df_copy['SkinThickness'].fillna(df_copy['SkinThickness'].median(), inplace=True)
df_copy['Insulin'].fillna(df_copy['Insulin'].median(), inplace=True)
df_copy['BMI'].fillna(df_copy['BMI'].median(), inplace=True)


X = df1.drop(columns='Outcome')
y = df1['Outcome']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=0)


classifier = RandomForestClassifier(n_estimators=20)
classifier.fit(X_train, y_train)

filename = 'new_approach/diabetes-prediction-rfc-model.pkl'
pickle.dump(classifier, open(filename, 'wb'))


def predictt(data):
        preg = data['pregnancies']
        glucose = data['glucose']
        bp = data['bloodPressure']
        st = data['skinThickness']
        insulin = data['insulin']
        bmi = data['BMI']
        dpf = data['diabetesPedigree']
        age = data['age']

        data = np.array([[preg, glucose, bp, st, insulin, bmi, dpf, age]])
        my_prediction = classifier.predict(data)

        return my_prediction


if __name__ == "__main__":
    for line in sys.stdin:
        data = json.loads(line.strip())
        result=predictt(data)
        resultb=predict(data)
        response = json.dumps({'kidney': '0', 'diabetes': int(result), 'breast_cancer': int(resultb)})
        #response = json.dumps(data)
        print(response)
        sys.stdout.flush()