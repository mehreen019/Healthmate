import joblib
import pandas as pd
import pickle
import numpy as np
import sys
import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split



if __name__ == "__main__":
    for line in sys.stdin:
        data = json.loads(line.strip())
        #response = json.dumps({'kidney': 'none'})
        response = json.dumps(data)
        print(response)
        sys.stdout.flush()