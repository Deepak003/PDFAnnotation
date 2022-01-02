$('#show').on('click', function () {
    $('.center').show();
    document.getElementById('webpageurlVal').value ='';
});

$('#close').on('click', function () {
    $('.center').hide();
    //$('#show').show();
});

function addURL(event){
    $('.center').hide();
    document.getElementById('pdf-container').innerHTML='<img id="ajax-loader" src="loading.gif" />';
    //document.getElementById('pdf-container').innerHTML='<textarea>Next, use our Get Started docs to setup Tiny!</textarea>';
    //tinymce.init({selector:"textarea"});
    fetch(`https://webpage-pdf.herokuapp.com/pdf?target=${document.getElementById('webpageurlVal').value}`).then(function(t) {
            return t.blob().then((b)=>{
                loadPDFWebURL(URL.createObjectURL(b));
                $('#ajax-loader').hide();
            }
        );
    });
}

var pdf;
const fileload = document.getElementById('file-input').files.length;

if(fileload ==0){
    pdf = new PDFAnnotate("pdf-container",'pdf.pdf', {
        onPageUpdated(page, oldData, newData) {
          console.log(page, oldData, newData);
        },
        ready() {
          console.log("Plugin initialized successfully");
        },
        scale: 1.5,
        pageImageCompression: "MEDIUM", // FAST, MEDIUM, SLOW(Helps to control the new PDF file size)
    });
}

function loadPDFWebURL(url){
    pdf = new PDFAnnotate("pdf-container",url, {
        onPageUpdated(page, oldData, newData) {
        console.log(page, oldData, newData);
        },
        ready() {
        console.log("Plugin initialized successfully");
        },
        scale: 1.5,
        pageImageCompression: "MEDIUM", // FAST, MEDIUM, SLOW(Helps to control the new PDF file size)
    });
}
    
function loadPDF(event){
    document.getElementById('pdf-container').innerHTML='';
    const file = URL.createObjectURL(document.getElementById('file-input').files[0]);
    pdf = new PDFAnnotate("pdf-container",file, {
        onPageUpdated(page, oldData, newData) {
        console.log(page, oldData, newData);
        },
        ready() {
        console.log("Plugin initialized successfully");
        },
        scale: 1.5,
        pageImageCompression: "MEDIUM", // FAST, MEDIUM, SLOW(Helps to control the new PDF file size)
    });
}

function changeActiveTool(event) {
    var element = $(event.target).hasClass("tool-button")
      ? $(event.target)
      : $(event.target).parents(".tool-button").first();
    $(".tool-button.active").removeClass("active");
    $(element).addClass("active");
}

function enableSelector(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enableSelector();
}

function enablePencil(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enablePencil();
}

function enableAddText(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enableAddText();
}

function enableAddArrow(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enableAddArrow();
}

function addImage(event) {
    event.preventDefault();
    pdf.addImageToCanvas()
}

function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

function getHexColor(colorStr) {
    var a = document.createElement('div');
    a.style.color = colorStr;
    var colors = window.getComputedStyle( document.body.appendChild(a) ).color.match(/\d+/g).map(function(a){ return parseInt(a,10); });
    document.body.removeChild(a);
    return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
}

function enableRectangle(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.setColor(hexToRGB(getHexColor(this.color), 0.2));
    pdf.setBorderColor(this.color);
    pdf.enableRectangle();
}

function deleteSelectedObject(event) {
  event.preventDefault();
  pdf.deleteSelectedObject();
}

function savePDF() {
    // pdf.savePdf();
    pdf.savePdf('sample.pdf'); // save with given file name
}

function clearPage() {
    pdf.clearActivePage();
}

function showPdfData() {
    var string = pdf.serializePdf();
    $('#dataModal .modal-body pre').first().text(string);
    PR.prettyPrint();
    $('#dataModal').modal('show');
}

$(function () {
    $('.color-tool').click(function () {
        $('.color-tool.active').removeClass('active');
        $(this).addClass('active');
        color = $(this).get(0).style.backgroundColor;
        pdf.setColor(color);
    });

    $('#brush-size').change(function () {
        var width = $(this).val();
        pdf.setBrushSize(width);
    });

    $('#font-size').change(function () {
        var font_size = $(this).val();
        pdf.setFontSize(font_size);
    });
});
