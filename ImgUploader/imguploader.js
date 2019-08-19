let name="";
let modal,target;
let cropper,img_input,status,size;
let passurl="";
var Filter={};
Filter.tmpCanvas = document.createElement('canvas');
Filter.tmpCtx = Filter.tmpCanvas.getContext('2d');
$(".img-upload-input").on('change',function(event) {
    let shape=$(this).attr('pshape')!=undefined ? $(this).attr('pshape') :'square';
    modal=$(this).attr('editor');
    target=$(this).attr('target');
    status=$(this).attr('status');
    passurl=$(this).attr('passurl');
    size=$(this).attr('size');
    let w=$(this).attr('w')!=undefined ? $(this).attr('w') :'300';
    let h=$(this).attr('h')!=undefined ? $(this).attr('h') :'300';
    let file_reader=new FileReader();
    let file=this.files[0]
    if(file !=undefined)
    {
        name=file.name;
        file_reader.readAsDataURL(file);
        let fileExtension = name.replace(/^.*\./, '');
        let validImageTypes = ["jpg", "jpeg", "png","svg"];
        try 
        {
            img_input=$(this);
            if (validImageTypes.includes(fileExtension)) 
            {
                cropper= $(modal).find('.img-edit-container').croppie({
                    enableExif: true,
                    viewport: 
                    {
                        width:Number(w),
                        height:Number(h),
                        type:shape
                    },
                    boundary: { width: Number(w)+100, height: Number(h)+100 },
                    enableOrientation: true
                });
                file_reader.onload=function(event){
                    cropper.croppie('bind',{
                        url:event.target.result
                    });
                    apply_filter();
                }
            }
            else 
            {
                if(status!=undefined)
                {
                    console.log("not valid extension");
                    $(status).html("<div class=\"alert alert-danger\">Please Select Valid File Image File. <small>Supported Extensions are (.png .svg .jpg .jpeg) </small></div>");
                }
            }
        } 
        catch(e) 
        {
            if(modal==undefined)
            {
                console.log("No Editor Modal Found. Create a Editor modal. Refer to documentation for help.")
            }
            console.log(e);
        }
    }
});
$(".img-upload-btn").on('click',function(event) {
    Filter.original=undefined;
    Filter.previous=undefined;
    cropper.croppie('result',{
        type:'canvas',
        size:size
    }).then(function(response){
        if(passurl!="" || passurl!=undefined)
        {
            $.ajax({
                data:{"image":response,"name":name},
                url:passurl,
                type:'POST'
            }).done(function(data)
              {
                if(target != undefined && data["response"])
                {
                    console.log(data["response"])
                    $(target).attr('src', response);
                }
                if(data["status"]!=undefined)
                {
                    if(status!=undefined)
                    {
                        if(data["category"] !=undefined)
                        {
                            $(status).html("<div class=\"alert alert-"+data["category"]+"\">"+data["status"]+"</div>");
                        }
                        else 
                        {
                            $(status).html("<div class=\"alert alert-info\">"+data["status"]+"</div>");
                        }
                    }
                    else
                    {
                        console.log(data["status"]);
                    }
                }
                else
                {
                    console.log("No Status is send from server");
                }
            });
        }
    });
    if(cropper !=undefined)
    {
        cropper.croppie('destroy');
    }
    if(img_input!=undefined)
        img_input.val('');
    event.preventDefault();
});
$(".img-remove-btn").on('click', function(event) {
    Filter.original=undefined;
    Filter.previous=undefined;
    if(img_input!=undefined)
        img_input.val('');
    if(cropper !=undefined)
    {
        cropper.croppie('destroy');
    }
    event.preventDefault();
});
$(".img-rotate-right").on('click',function(event){
    cropper.croppie('rotate',-90);
});
$(".img-rotate-left").on('click',function(event){
    cropper.croppie('rotate',90);
});
function clear_canvas(cropper_canvas)
{
    var ctx=cropper_canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cropper_canvas.width, cropper_canvas.height);  
}
function draw_canvas(canvas,data)
{
    var ctx=canvas.getContext("2d");
    ctx.putImageData(data, 0, 0);
}
function getPixels(canvas)
{
    var ctx;
    ctx = canvas.getContext('2d');
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
$(".img-clear-filter").on('click',function(event){
    if(Filter.original!=undefined)
    {
        canvas=$(modal).find('canvas')[0];
        clear_canvas(canvas);
        draw_canvas(canvas,Filter.original);
        Filter.previous=Filter.original;
    }
});

Filter.grayscale=function(pixels){
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        d[i] = d[i + 1] = d[i + 2] = v
    }
    return pixels;
},
Filter.brightness=function(pixels,adjustment){
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        d[i] += adjustment;
        d[i + 1] += adjustment;
        d[i + 2] += adjustment;
    }
    return pixels;
},
Filter.threshold=function(pixels, threshold) {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
    d[i] = d[i + 1] = d[i + 2] = v
  }
  return pixels;
},
Filter.blur=function(pixels){
    var weights=[1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9];
    return Filter.convolution(pixels,weights);
},
Filter.sharpen=function(pixels){
    var weights=[0, -1, 0, -1, 5, -1,0, -1, 0];
    return Filter.convolution(pixels,weights);
}
Filter.createImageData = function(w, h) {
  return this.tmpCtx.createImageData(w, h);
};
Filter.convolution=function(pixels, weights, opaque) {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side / 2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = Filter.createImageData(w, h);
  var dst = output.data;

  var alphaFac = opaque ? 1 : 0;

  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y * w + x) * 4;
      var r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (var cy = 0; cy < side; cy++) {
        for (var cx = 0; cx < side; cx++) {
          var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
          var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
          var srcOff = (scy * sw + scx) * 4;
          var wt = weights[cy * side + cx];
          r += src[srcOff] * wt;
          g += src[srcOff + 1] * wt;
          b += src[srcOff + 2] * wt;
          a += src[srcOff + 3] * wt;
        }
      }
      dst[dstOff] = r;
      dst[dstOff + 1] = g;
      dst[dstOff + 2] = b;
      dst[dstOff + 3] = a + alphaFac * (255 - a);
    }
  }
  return output;
};
function apply_filter()
{
    var ranges=$(modal).find('.filter');
    var canvas=$(modal).find('canvas')[0];
    if(ranges!=undefined && canvas!=undefined)
    {
        for (var i = 0; i < ranges.length; i++) {
            if(ranges[i].getAttribute('type')==="range")
            {
                ranges[i].onchange=function(event) {
                    if(Filter.original==undefined)
                    {
                        Filter.original=getPixels(canvas);
                        Filter.previous=Filter.original;
                    }
                    clear_canvas(canvas);
                    draw_canvas(canvas,Filter.previous);
                    pixels=getPixels(canvas);
                    result=Filter[$(this).attr('filter')](pixels,Number($(this).val()));
                    clear_canvas(canvas);
                    draw_canvas(canvas,result);
                };
            }
            else
            {
                ranges[i].onclick=function(event) {
                    if(Filter.original==undefined)
                    {
                        Filter.original=getPixels(canvas);
                        Filter.previous=Filter.original;
                    }
                    clear_canvas(canvas);
                    draw_canvas(canvas,Filter.previous);
                    pixels=getPixels(canvas);
                    result=Filter[$(this).attr('filter')](pixels);
                    clear_canvas(canvas);
                    draw_canvas(canvas,result);
                };
            }
        }
    }    
}