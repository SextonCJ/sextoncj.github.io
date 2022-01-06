---
layout: single
title: "Mask RCNN"
excerpt: "Identifying damage to cars using Mask RCNN Image Segmentation"
header:
  teaser: assets/images/car-damage-th.jpg
---

This project uses deep learning computer vision to classify damage to cars for insurance claims.  The goal is to identify which part of the car is damaged using photos uploaded by the user, so that the time taken to process the insurance claim process can be kept to a minimum.

## Setup

The Mask-RCNN framework is used, as provided by [Matterport](https://github.com/matterport/Mask_RCNN), to train and predict for car body damage based on labeled images of damaged cars.

The original dataset of damaged car images is taken from [Kaggle](https://www.kaggle.com/anujms/car-damage-detection#0001.JPEG). These were subsequently annotated using [VGG Annotator](http://www.robots.ox.ac.uk/~vgg/software/via/via-1.0.6.html) to identify the region of interest (damage).

A Google Cloud VM was used for the processing:
- 4 CPU, 15 GB RAM
- 1 NVidia Tesla P100 GPU
- Tensorflow 1.15 + Keras
- Jupyter Lab

Code is available here on [github](https://github.com/SextonCJ/CarDamageMaskRCNN)

## Project
Given we know that a car is damaged, can we identify what part of the car is damaged and how serious that damage actually is? I fine tune Mask-RCNN to identify the the damaged on the car. Mask-RCNN is an established instance segmentation algorithm, i.e. it can classify and separate different objects in an image. In this use case, the uploaded photo may contain many objects, but specifically a car including the damage to that car. The model is fine tuned to separate and classify the damage as either a scratch, the windshield, the body, or major damage (totaled).

<img src="/assets/images/carDamage/carDamage2.png" alt="damage" width="600"/>

### Training

Starting with pre-trained weights based on the Coco dataset to identify car objects, we then fine tune by training against annotated images of the damage.

- Backbone: Resnet 101
- Images per GPU: 2
- Num Classes: 2 (Damage + Background)
- Epochs: 15 / 50
- Steps per Epoch: 100

Models were trained for Windshield, Scratch, Body, Totaled and All (any damage), with experiments at 15 epochs and 50 epochs.

Masks were only applied when the probability was > 90%
We can see the accuracy by checking whether a mask was generated.

| Type       | Train | Validation | Val Acc 15 Epochs | Val Acc 50 Epochs |
| ---------- | ----: | ---------: | ----------------: | ----------------: |
| Body       | 457   | 196        | 0.70              | 0.70              |
| Scratched  | 101   | 43         | 0.84              | 0.51              |
| Totaled    | 48    | 25         | 0.92              | 0.96              |
| Windshield | 36    | 14         | 0.64              | 1.00              |
| All        | 642   | 278        | 0.92              | 0.97              |


(Body, Scratched, Totaled, Windshield)  
<img src="/assets/images/carDamage/resultsImages.png" alt="validation examples" width="600"/>  

### Testing on unseen images

These are some examples of correctly predicted masks. I think it’s quite impressive that this can be achieved with less than 1000 training  images. The masks are accurately represented on the images.  

<img src="/assets/images/carDamage/unseen_1.png" alt="unseen" width="600"/>  

### Improvements

An interesting next step could be to examine the percentage of damage rather than look specifically for types of damage.

<img src="/assets/images/carDamage/nextSteps.png" alt="% diff" width="600"/>  
