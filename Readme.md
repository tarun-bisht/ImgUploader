# ImgUploader

Open Source Image Uploader created with jquery. Build over Cropper Library.

#Examples
[Demo Material](https://tarun-bisht.github.io/ImgUploader/)

## Key Features
* Customizable Image upload menu
* Edit Image before uploading
* Image Cropping facility
* Apply filters to Image
* Upload Image using ajax
* Easily Integrable with bootstrap

## Installation

Include Jquery, Croppie and ImgUploader library to HTML inside Footer if using Bootstrap modal then ensure that bootstrap and it's JavaScript file are include in template.
```html
<script src="image_uploader/croppie.min.js"></script>
<script src="image_uploader/img.uploader.min.js"></script>
```
Including Croppie CSS to HTML inside *<head>*
```html
<link href="image_uploader/croppie.css" rel="stylesheet">
```
## ImgUploader Classes
* "classes ending with suffix -bs are bootstrap modal specific"
#### img-upload-input and img-upload-input-bs
This class is applied to *<input>* which triggers ImgUploader Library after image file is choosen.
#### img-edit-container
This class is applied to empty container *<div>* which will act as Image Editor Canvas.
#### img-upload-btn and img-upload-btn-bs
This class is applied to button which will upload image using ajax when it is clicked.
#### img-remove-btn and img-remove-btn-bs
This class is applied to button which cancels upload operation and clear file input. It is mandatory to use this class in editor to destroy all editor instances on button click.
#### img-rotate-left
This class is applied to button which will rotate Image to left.
#### img-rotate-left
This class is applied to button which will rotate Image to right.
#### img-clear-filter
This class is applied to button which will clear all the filters applied to image.

## Input Tag Parameters for file upload
*<input>* with class *.img-upload-input* can use following parameters
#### editor
This parameter pass id of Image Uploader Menu which appear to the user after the image has been selected
#### passurl
This parameter pass url where image data has to be send via ajax.
#### size 
defines size of cropped image. Valid values are *"viewport", *"original" or *"{width,height}". viewport will make image size as size of canvas viewport and original will only crop and retain original size.
#### pshape (optional)
This parameter pass type of cropper to be used to crop image. Valid values are *"circle" and *"square". Default is *"square" if parameter is not passed.
#### w (optional)
define width of editor viewport. Default value is 300
#### h (optional)
define width of editor viewport. Default value is 300
pshape="square",w=300,h=100,size="original"
#### target (optional)
This parameter pass id of Image which display new uploaded image.
#### status (optional)
This parameter pass id of empty container which will display upload status send by server. 

## Apply Different Filters to Image
To apply filter to Uploaded Image create a input range or a button which will apply filter to image and assign *"class  filter" with filter type to *"filter" attribute. Input type choosen depends on type of filter.
Currently following filters are applied to image:
#### Brightness
Increases/Decrease Brightness level of a Image. * "Range Input"
```html
<label>Brightness</label>
<input type="range" class="form-control-range filter" min=0 max=200 value=100 step=1 filter="brightness"/>
```
#### Threshold
Make Brighter area white and darker area black depending on threshold value. * "Range Input"
```html
<label>Threshold</label>
<input type="range" class="form-control-range filter" min=0 max=200 value=100 step=1 filter="threshold"/>
```
#### Grayscale
Turns Image into grayscale. * "Single Input"
```html
<button type="button" class="btn btn-dark filter" filter="grayscale">Grayscale</button>
```
#### Sharpen
Sharp Edges in Image. * "Single Input"
```html
<button type="button" class="btn btn-dark filter" filter="sharpen">Sharpen</button>
```
#### Blur
Smooth out sharp edges in image. * "Single Input"
```html
<button type="button" class="btn btn-dark filter" filter="blur">Blur</button>
```

## Usage
### 1. Creating an Image Uploader Menu
This menu will appear to the user after the image has been selected. The menu creation is customizable and its design depends on the developer. The menu can also be in the form of a Modal. in this example, bootstrap modal is used.
```html
<!-- Using Bootstrap Modal -->
<div class="modal fade" id="img-upload-panel">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Upload Profile Photo</h4>
        <button type="button" class="img-remove-btn-bs close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="row container">
          <div class="col">
            <div class="img-edit-container"></div>
          </div>
          </div>
          <div class="row container">
          <div class="col">
            <label>Brightness</label>
            <input type="range" class="form-control-range filter" min=0 max=200 value=100 step=1 filter="brightness"/>
          </div>
          <div class="col">
            <label>Threshold</label>
            <input type="range" class="form-control-range filter" min=0 max=200 value=100 step=1 filter="threshold"/> 
          </div>
        </div>
        <div class="row container">
          <div class="col">
              <button type="button" class="btn btn-dark filter" filter="grayscale">Grayscale</button>
          </div>
          <div class="col">
              <button type="button" class="btn btn-dark filter" filter="sharpen">Sharpen</button>
          </div>
          <div class="col"> 
              <button type="button" class="btn btn-dark filter" filter="blur">Blur</button>
          </div>
          <div class="col"> 
              <button type="button" class="btn btn-dark img-clear-filter">Clear</button>
          </div>
          <div class="col"> 
              <button type="button" class="btn btn-dark img-rotate-left">Rotate Left</button>
          </div>
          <div class="col"> 
              <button type="button" class="btn btn-dark img-rotate-right">Rotate Right</button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-secondary img-remove-btn-bs">Close</button>
          <button type="button" class="btn btn-primary img-upload-btn-bs">Upload</button>
      </div>
    </div>
  </div>
</div>
```
```html
<div class="container" id="img-upload-panel">
  <h4 class="modal-title">Upload Photo</h4>
  <div class="row">
    <div class="col">
      <div class="img-edit-container"></div>
    </div>
  </div>
  <div class="row container">
    <div class="col">
      <label>Brightness</label>
      <input type="range" class="form-control-range filter" min=0 max=200 value=100 step=1 filter="brightness"/>
    </div>
    <div class="col">
      <label>Threshold</label>
      <input type="range" class="form-control-range filter" min=0 max=200 value=100 step=1 filter="threshold"/>
    </div>
  </div>
  <div class="row container">
    <div class="col">
      <button type="button" class="btn btn-dark filter" filter="grayscale">Grayscale</button>
    </div>
    <div class="col">
      <button type="button" class="btn btn-dark filter" filter="sharpen">Sharpen</button>
    </div>
    <div class="col"> 
      <button type="button" class="btn btn-dark filter" filter="blur">Blur</button>
    </div>
    <div class="col"> 
      <button type="button" class="btn btn-dark img-clear-filter">Clear</button>
    </div>
    <div class="col"> 
      <button type="button" class="btn btn-dark img-rotate-left">Rotate Left</button>
    </div>
    <div class="col"> 
      <button type="button" class="btn btn-dark img-rotate-right">Rotate Right</button>
    </div>
  </div>
  <div class="container">
      <button type="button" class="btn btn-secondary img-remove-btn">Clear</button>
      <button type="button" class="btn btn-primary img-upload-btn">Upload</button>
  </div>
</div>
```
### 2.Creating an *<input>* tag for choosing Image.
```html
<input type=file class="img-upload-input" editor="#img-upload-panel" target="#profile-img" status="#status" passurl="/profile-img-process" pshape="circle" w=200 h=200 size="viewport"/>
```
```html
<input type=file class="img-upload-input" editor="#img-upload-panel" target="#image" status="#status" passurl="" pshape="square" w=300 h=150 size="{1920,480}"/>
```
## Acknowlegement
The backbone of this plugin is Cropper Library so all credit goes to it.
* [Cropper Library](https://foliotek.github.io/Croppie/)
* [Ancient Secret of Computer Vison Videos](https://pjreddie.com/courses/computer-vision/)
* [Blog Post](https://www.html5rocks.com/en/tutorials/canvas/imagefilters/)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)