import pandas as pd
from sklearn.svm import OneClassSVM
import matplotlib.pyplot as plt
from numpy import where
import numpy as np

data = pd.read_csv("data.csv")
df = data[["hour", "usage"]]

# model = OneClassSVM(kernel = 'rbf', gamma = 0.001, nu = 0.02).fit(df)

# y_pred = model.predict(df)
# print(y_pred)

# outlier_index = where(y_pred == -1) 
# # filter outlier values
# outlier_values = df.iloc[outlier_index]
# print(outlier_values)

# plt.scatter(data["hour"], df["usage"])
# plt.scatter(outlier_values["hour"], outlier_values["usage"], c = "r")

# plt.show()
data = df['usage']
mean = np.mean(data) 
# calculate standard deviation
sd = np.std(data)
# determine a threhold
threshold = 2
# create empty list to store outliers
outliers = []
# detect outlier
for i in data: 
    z = (i-mean)/sd # calculate z-score
    if abs(z) > threshold:  # identify outliers
        outliers.append(i) # add to the empty list
# print outliers    
print("The detected outliers are: ", outliers)