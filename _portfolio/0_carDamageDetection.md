---
layout: single
title: "Mask RCNN"
excerpt: "Identifying damage to cars using Mask RCNN Image Segmentation"
header:
  teaser: assets/images/car-damage-th.jpg
---

Project to identify what part of a car is damaged with the goal of speeding up insurance claims.

## Setup

In this project I use Mask RCNN framework as provided by [Matterport](https://github.com/matterport/Mask_RCNN) to train and predict for car body damage based on images of damaged cars.

Data is provided by [Kaggle](https://www.kaggle.com/anujms/car-damage-detection#0001.JPEG)

Each train and validation image has been annotated using [VGG Annotator](http://www.robots.ox.ac.uk/~vgg/software/via/via-1.0.6.html) to identify the region of interest (damage)

I used Google Cloud VM for the processing:
- 4 CPU, 15 GB RAM
- 1 NVidia Tesla P100 GPU
- Tensorflow 1.15 + Keras
- Jupyter Lab


Code is available here on [github](https://github.com/SextonCJ/CarDamageMaskRCNN)


## Project
Given we know that a car is damaged, can we identify what part of the car is damaged and how serious that damage actually is?

<img src="/assets/images/carDamage/carDamage1.png" alt="damage" width="600"/>

### What is Mask-RCNN?

The RCNN part refers to Regional CNN. CNN is a convolutional neural network that works well for images because unlike ANN, only the last layer is fully connected, this means it extracts fewer features and makes it more feasible for image processing. Features are extracted in layers with increasing levels of detail.

<img src="/assets/images/carDamage/CNN.png" alt="CNN" width="600"/>  

Mask-RCNN is based on Faster R-CNN, which at a very high level is a fast architecture for extracting bounding boxes of images.

It does this by building on a backbone framework (e.g. Resnet), adding a layer for region proposal, i.e. identifying parts of the image, and then filtering to the Regions Of Interest - these are the bounding boxes. On the image below you see on the left a football player with a bounding box around him - this is the Region of Interest.

<img src="/assets/images/carDamage/maskRCNN.png" alt="maskRCNN" width="600"/>

The Mask part of this picks this up by applying instance segmentation, First by aligning the ROI to improve the bounding box placement. Then it adds a layer for pixel wise segmentation, by predicting a mask for each ROI and adding a mask. It does this with a Fully Convolutional Network which for brevity sake is a type of CNN

Faster R-CNN is an improvement on Fast R-CNN, Fast R-CNN uses selective search to find bounding boxes, Faster R-CNN is faster because it uses a regional proposal network which implements the region proposal directly into the architecture, removing the need for the selective search algorithm

### Training

Start with Pre-trained weights based on Coco dataset and set the custom parameters, for example:
- Backbone: Resnet 101
- Images per GPU: 2
- Num Classes: 2 (Damage + Background)
- Epochs: 15
- Steps per Epoch: 100

Models were trained for Windshield, Scratch, Body, Totaled and All (any damage)

Masks were only applied when the probability was > 90%
We can see the accuracy by checking whether a mask was generated.

You can see that we had way more training images for Body. That hasn’t made a huge difference here but it’s noticeable when we check against holdout data.

15 Epochs  

| Type       | Train | Validation | Val Acc 15 Epochs | Val Acc 50 Epochs |
| ---------- | ----: | ---------: | ----------------: | ----------------: |
| Body       | 457   | 196        | 0.70              | 0.70              |
| Scracthed  | 101   | 43         | 0.84              | 0.51              |
| Totaled    | 48    | 25         | 0.92              | 0.96              |
| Windshield | 36    | 14         | 0.64              | 1.00              |
| All        | 642   | 278        | 0.92              | 0.97              |

50 Epochs


(Body, Scratched, Totaled, Windshield)  
<img src="/assets/images/carDamage/resultsImages.png" alt="validation examples" width="600"/>  

### Testing on unseen images

Some examples of correctly predicted masks. I think it’s quite impressive that this can be achieved with such little training data. The masks are pretty accurate here.  

<img src="/assets/images/carDamage/unseen_1.png" alt="unseen" width="600"/>  

### Improvements

An interesting next step could be to examine the percentage of damage rather than look specifically for types of damage.

<img src="/assets/images/carDamage/nextSteps.png" alt="% diff" width="600"/>  
