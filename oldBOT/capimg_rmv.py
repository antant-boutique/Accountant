from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import sys

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

imgFile = sys.argv[-1]
raw_image = Image.open(imgFile).convert('RGB')

inputs = processor(raw_image, return_tensors="pt")

out = model.generate(**inputs)
caption = processor.decode(out[0], skip_special_tokens=True)
print(caption)
