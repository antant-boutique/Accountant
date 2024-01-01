from PIL import Image
import open_clip
import torch
import sys

model, _, transform = open_clip.create_model_and_transforms(
  model_name="coca_ViT-B-32",
  pretrained="laion2b_s13b_b90k"
)

imgFile = sys.argv[-1]
im = Image.open(imgFile).convert("RGB")
im = transform(im).unsqueeze(0)


with torch.no_grad(), torch.cuda.amp.autocast():
  generated = model.generate(im)

caption = open_clip.decode(generated[0]).split("<end_of_text>")[0].replace("<start_of_text>", "")
print(caption)
