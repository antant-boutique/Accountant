#import pickle
import turicreate as tc

# Load images from the downloaded data
reference_data  = tc.image_analysis.load_images('./matimg')
reference_data = reference_data.add_row_number()

# Save the SFrame for future use
reference_data.save('./matimg.sframe')

model = tc.image_similarity.create(reference_data)
model.save('matimg.model')
#fid = open('matimg.model','w')
#pickle.dump(model,fid)
