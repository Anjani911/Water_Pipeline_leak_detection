# utils/data_handler.py
import pandas as pd

def preprocess_data(data):
    data = data.fillna(0)
    data = data[['water_supplied_litres', 'water_consumed_litres', 'flowrate_lps', 'pressure_psi']]
    return data
