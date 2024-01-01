import sys
import pickle
import turicreate as tc

# Load model from the directory
model  = tc.load_model('./matimg.model')
rf_data = tc.load_sframe('./matimg.sframe')

# Load the picture as an Sframe
imgFile = sys.argv[-1]
imgSfrm = tc.image_analysis.load_images(imgFile)

results = model.query(imgSfrm, k=3)

PATHs = []
for i in range(3):
    idx = results[i]['reference_label']
    PATHs.append(rf_data[idx]['path'])

print('done')

fid = open('simimg.list','wb')
pickle.dump(PATHs,fid)
fid.close()
