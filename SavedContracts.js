//=======================================’Moving Between Fieldsets=============================================================
let current_fs, next_fs, previous_fs;
const nextButtons = document.querySelectorAll(".next");
const ExpensesCheckbox = document.getElementById("expenses");
const CompensationCheckbox = document.getElementById("compensation-check");
const fieldsets = document.querySelectorAll("fieldset");

function setFocusToFirstInput(fieldset) {
  var firstFocusable = fieldset.find("input, select , textarea").first();
  if (firstFocusable.length) {
    firstFocusable.focus();
  }
}

function moveToNextInput(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let formElements = Array.from(
      event.target.form.querySelectorAll("input, select, button , textarea")
    );
    let index = formElements.indexOf(event.target);

    if (index > -1 && index < formElements.length - 1) {
      let nextElement = formElements[index + 1];
      if (nextElement.tagName === "BUTTON" || nextElement.type === "button") {
        nextElement.click();
      } else {
        nextElement.focus();
      }
    }
  }
}

$(document).ready(function () {
  $("input, select, button , textarea").on("keydown", moveToNextInput);

  var firstFieldset = $("fieldset").first();
  setFocusToFirstInput(firstFieldset);
});

$(".next").click(function () {
  const nextBtn = this; // Use `this` to refer to the current button
  const current_fs = $(nextBtn).closest("fieldset");
  let next_fs = current_fs.next();

  next_fs = current_fs.next();
  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

  next_fs.show();
  current_fs.hide();

  setFocusToFirstInput(next_fs);
});

$(".previous").click(function () {
  const prevBtn = this; // Use `this` to refer to the current button
  current_fs = $(prevBtn).closest("fieldset");
  previous_fs = current_fs.prev();
  $("#progressbar li")
    .eq($("fieldset").index(current_fs))
    .removeClass("active");

  previous_fs.show();
  current_fs.hide();

  setFocusToFirstInput(previous_fs);
});
//====================================================================================================
//========================================Upload examination Imgs Lists============================================================
//====================================================================================================
jQuery(document).ready(function () {
  ImgUpload();
});

function HideFirstImg() {
  var firstImg = document.getElementById("upload-img1");
  firstImg.style.display = "none";
}

var imgArray = [];

function ImgUpload() {
  var imgWrap = "";

  $(".upload__inputfile").each(function () {
    $(this).on("change", function (e) {
      imgWrap = $(this).closest(".upload__box").find(".upload_img-wrap_inner");
      var maxLength = 22;
      var files = e.target.files;
      var filesArr = Array.prototype.slice.call(files);
      var uploadBtnBox = document.getElementById("checking-img");
      var uploadBtnBox1 = document.getElementById("upload__btn-box");
      var errorMessageDivs = document.getElementsByClassName(
        "Examination-error-message"
      );

      if (imgArray.length + filesArr.length > maxLength) {
        uploadBtnBox.disabled = true;
        // Loop
        for (var j = 0; j < errorMessageDivs.length; j++) {
          errorMessageDivs[j].textContent =
            "الرجاء ... التحقق من جميع البنود و بحد اقصى 22 صورة";
          errorMessageDivs[j].style.display = "block";
        }
        uploadBtnBox1.style.display = "none";
      } else {
        uploadBtnBox.disabled = false;
        // Loop
        for (var j = 0; j < errorMessageDivs.length; j++) {
          errorMessageDivs[j].style.display = "none";
        }
        uploadBtnBox1.style.display = "block";
      }

      var processedCount = 0;
      var totalToProcess = Math.min(
        filesArr.length,
        maxLength - imgArray.length
      );

      for (var i = 0; i < totalToProcess; i++) {
        (function (f) {
          // console.log("Selected file type:", f.type);

          if (
            f.type === "image/heic" ||
            f.type === "image/heif" ||
            f.name.endsWith(".heic") ||
            f.name.endsWith(".heif")
          ) {
            console.log("Processing HEIC/HEIF file:", f.name);

            heic2any({
              blob: f,
              toType: "image/jpeg",
            })
              .then(function (convertedBlob) {
                var reader = new FileReader();
                reader.onload = function (e) {
                  var html =
                    "<div class='upload__img-box'><div style='background-image: url(" +
                    e.target.result +
                    ")' data-number='" +
                    $(".upload__img-close1").length +
                    "' data-file='" +
                    f.name +
                    "' class='img-bg'><div class='upload__img-close1'><img src='img/delete.png'></div></div></div>";

                  imgWrap.append(html);
                  imgArray.push({
                    f: f,
                    url: e.target.result,
                  });
                  console.log(imgArray);

                  processedCount++;
                  if (processedCount === totalToProcess) {
                    setTimeout(setImageRowHeight, 100);
                  }
                };
                reader.readAsDataURL(convertedBlob);
              })
              .catch(function (err) {
                console.error("Error converting HEIC/HEIF image:", err);
                processedCount++;
                if (processedCount === totalToProcess) {
                  setTimeout(setImageRowHeight, 100);
                }
              });
          } else {
            var reader = new FileReader();
            reader.onload = function (e) {
              var html =
                "<div class='upload__img-box'><div style='background-image: url(" +
                e.target.result +
                ")' data-number='" +
                $(".upload__img-close1").length +
                "' data-file='" +
                f.name +
                "' class='img-bg'><div class='upload__img-close1'><img src='img/delete.png'></div></div></div>";
              imgWrap.append(html);
              imgArray.push({
                f: f,
                url: e.target.result,
              });
              // console.log(imgArray);

              processedCount++;
              if (processedCount === totalToProcess) {
                setTimeout(setImageRowHeight, 100);
              }
            };
            reader.readAsDataURL(f);
          }
        })(filesArr[i]);
      }
    });
  });

  $("body").on("click", ".upload__img-close1", function (e) {
    e.stopPropagation();
    var file = $(this).parent().data("file");

    for (var i = 0; i < imgArray.length; i++) {
      if (imgArray[i].f.name === file) {
        imgArray.splice(i, 1);
        break;
      }
    }

    $(this).parent().parent().remove();
    console.log(imgArray);

    var maxLength = 22;
    var uploadBtnBox = document.getElementById("checking-img");
    var errorMessageDivs = document.getElementsByClassName(
      "Examination-error-message"
    );
    var uploadBtnBox1 = document.getElementById("upload__btn-box");

    if (imgArray.length >= maxLength) {
      uploadBtnBox.disabled = true;
      // Loop
      for (var j = 0; j < errorMessageDivs.length; j++) {
        errorMessageDivs[j].textContent =
          "الرجاء ... التحقق من جميع البنود و بحد اقصى 22 صورة";
        errorMessageDivs[j].style.display = "block";
      }
      uploadBtnBox1.style.display = "none";
    } else {
      uploadBtnBox.disabled = false;
      // Loop
      for (var j = 0; j < errorMessageDivs.length; j++) {
        errorMessageDivs[j].style.display = "none";
      }
      uploadBtnBox1.style.display = "block";
    }

    setTimeout(setImageRowHeight, 50);
  });
}

function setImageRowHeight() {
  if (window.innerWidth <= 991) {
    const imagesRow = document.querySelector(".virtual-check-images-row");
    if (imagesRow) {
      imagesRow.style.height = "";
    }
    return;
  }
  const virtualCheckData = document.querySelector(".virtual-check-data");
  const imagesRow = document.querySelector(".virtual-check-images-row");

  if (!virtualCheckData || !imagesRow) return;

  let attempts = 0;
  const maxAttempts = 5;

  function measureHeight() {
    const parentHeight = virtualCheckData.offsetHeight;
    const currentReadingRows = document.querySelectorAll(
      ".CurrentReadingg_row"
    );
    const errorMessage = document.querySelector(
      ".virtual-check-data > .row.mt-auto"
    );

    let otherElementsHeight = 0;

    currentReadingRows.forEach((row) => {
      otherElementsHeight += row.offsetHeight;
    });

    if (errorMessage) {
      otherElementsHeight += errorMessage.offsetHeight;
    }
    const buffer = 30;
    const availableHeight = parentHeight - otherElementsHeight - buffer - 50;

    if (availableHeight > 50 || attempts >= maxAttempts) {
      imagesRow.style.height = `${Math.max(availableHeight, 200)}px`;
      return true;
    }
    return false;
  }

  function tryMeasure() {
    attempts++;
    const success = measureHeight();

    if (!success && attempts < maxAttempts) {
      setTimeout(tryMeasure, 100);
    }
  }

  tryMeasure();
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(setImageRowHeight, 100);
  setTimeout(setImageRowHeight, 500);
  setTimeout(setImageRowHeight, 1000);
});

window.addEventListener("resize", function () {
  setTimeout(setImageRowHeight, 50);
  setTimeout(setImageRowHeight, 100);
  setTimeout(setImageRowHeight, 200);
});

$("body").on("click", ".img-bg", function (e) {
  var imageUrl = $(this).css("background-image");
  imageUrl = imageUrl.replace(/^url\(['"](.+)['"]\)/, "$1");
  var newTab = window.open();

  $(newTab.document.head).html(`
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Image</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      body {
        background-color: black;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .image-container {
        width: 70vw;
        height: 70vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
      }
    </style>
  `);

  newTab.document.body.innerHTML = `
    <div class="image-container">
      <img src="${imageUrl}" alt="View Image">
    </div>
  `;
});
//====================================================================================================
//====================================================================================================
const DataIcon2 = document.getElementById("payment-contract-value-icon");
const dropdown2 = document.getElementById(
  "payment-dropdowncontent-contractValue"
);

DataIcon2.addEventListener("click", function (event) {
  event.stopPropagation();
  if (dropdown2.style.display === "block") {
    dropdown2.style.display = "none";
  } else {
    dropdown2.style.display = "block";
  }
});
document.addEventListener("click", function (event) {
  if (!DataIcon2.contains(event.target) && !dropdown2.contains(event.target)) {
    dropdown2.style.display = "none";
  }
});

dropdown2.addEventListener("click", function (event) {
  event.stopPropagation();
});
//====================================================================================================
//====================================================================================================
const DataIcon4 = document.getElementById("contract-value-icon");
const dropdown4 = document.getElementById("dropdown-content-contractValue");

DataIcon4.addEventListener("click", function (event) {
  event.stopPropagation();
  if (dropdown4.style.display === "block") {
    dropdown4.style.display = "none";
  } else {
    dropdown4.style.display = "block";
  }
});
document.addEventListener("click", function (event) {
  if (!DataIcon4.contains(event.target) && !dropdown4.contains(event.target)) {
    dropdown4.style.display = "none";
  }
});

dropdown4.addEventListener("click", function (event) {
  event.stopPropagation();
});
//====================================================================================================
$("#examination-images").click(function () {
  $("#FirstUpload-img3").hide();
});



// // // //////////////////////////////////////////////// رفع صورة التوقيع ////////////////////////////////////////////////////////////////////////
let saveSignatureBtn = null;
document
  .getElementById("UploadSigntaurePic")
  .addEventListener("click", function () {
    saveSignatureBtn = "UploadSigntaurePic";
  });

document
  .getElementById("WriteSignature")
  .addEventListener("click", function () {
    saveSignatureBtn = "WriteSignature";
  });
const uploadContainer = document.querySelector(".upload-container");
const mainContainer = document.querySelector(".Signature-main-container");
const UploadSigntaurePic = document.getElementById("UploadSigntaurePic");
const imageUpload = document.getElementById("imageUpload");
var imgeURL;
const uploadedImg = null;
//
UploadSigntaurePic.addEventListener("click", function () {
  imageUpload.click();
});
imageUpload.addEventListener("change", function () {
  const file = imageUpload.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageURL = e.target.result;
       mainContainer.innerHTML =
        '<i class="fa-regular fa-circle-xmark"  style="cursor: pointer;"></i>';
       Previewing_Signature(imageURL)
    };
    reader.readAsDataURL(file);
  }
});

removeSignatureImg.addEventListener("click", function (event) {
  event.preventDefault();
  if (uploadContainer.firstChild) {
    uploadContainer.innerHTML = "";
    mainContainer.innerHTML = "";
    uploadContainer.classList.remove("previewing");
    uploadContainer.innerHTML =
      ' <img class="upload-icon" src="img/Rectangle 144.png" alt="Upload Icon"><p>ارفق صورة التوقيع</p>';
  }
});
// //////////////////////////////////////////////// كتابة التوقيع ////////////////////////////////////////////////////////////////////////
const WriteSignature = document.getElementById("WriteSignature");
WriteSignature.addEventListener("click", function () {
  document.body.classList.add("no-scroll");
  uploadContainer.innerHTML = "";
  mainContainer.innerHTML = "";
  uploadContainer.innerHTML =
    '<canvas id="canvas" width="200" height="200" class="mb-2 bg-white"></canvas>';
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.lineWidth = 4;

  var drawing = false;
  var prevX = 0;
  var prevY = 0;
  var currX = 0;
  var currY = 0;
  
  function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
  }

  canvas.addEventListener("mousedown", handleMouseDown, false);
  canvas.addEventListener("mousemove", handleMouseMove, false);
  canvas.addEventListener("mouseup", handleMouseUp, false);

  canvas.addEventListener("touchstart", handleTouchStart, false);
  canvas.addEventListener("touchmove", handleTouchMove, false);
  canvas.addEventListener("touchend", handleTouchEnd, false);

  function handleMouseDown(e) {
    drawing = true;
    prevX = e.clientX - canvas.getBoundingClientRect().left;
    prevY = e.clientY - canvas.getBoundingClientRect().top;
  }

  function handleMouseMove(e) {
    if (!drawing) return;
    currX = e.clientX - canvas.getBoundingClientRect().left;
    currY = e.clientY - canvas.getBoundingClientRect().top;

    drawLine(prevX, prevY, currX, currY);
    prevX = currX;
    prevY = currY;
  }

  function handleMouseUp() {
    drawing = false;
  }

  function handleTouchStart(e) {
    drawing = true;
    prevX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    prevY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
  }

  function handleTouchMove(e) {
    if (!drawing) return;
    currX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    currY = e.touches[0].clientY - canvas.getBoundingClientRect().top;

    drawLine(prevX, prevY, currX, currY);
    prevX = currX;
    prevY = currY;
  }

  function handleTouchEnd() {
    drawing = false;
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dataURL = null; // Clear the stored signature
  }

  document.getElementById("clear").addEventListener("click", function () {
    clearCanvas();
  });
});

function SaveWrittenSignature() {
  document.body.classList.remove("no-scroll");
  var canvas = document.getElementById("canvas");
  var dataURL = canvas.toDataURL();
  Previewing_Signature(dataURL)
  $("#signature-modal").modal("hide");
}

// Save the uploded signature image
function SaveUplodedSignature() {
  const img = document.getElementById("signatureImage");
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  const base64 = canvas.toDataURL("image/jpeg");
  console.log(base64);
  $("#signature-modal").modal("hide");
}
// // // //////////////////////////////////////////////// عرض صورة التوقيع ////////////////////////////////////////////////////////////////////////
function Previewing_Signature(imageURL){
   const previewImage = document.createElement("img");
      previewImage.classList.add("preview-image");
      previewImage.classList.add("bg-white");
      previewImage.src = imageURL;
      previewImage.id = "signatureImage";
      imgeURL = imageURL;
      uploadContainer.innerHTML = "";
      uploadContainer.appendChild(previewImage);
      uploadContainer.classList.add("previewing");
      previewImage.addEventListener("click", function () {
        var newTab = window.open();
        $(newTab.document.head).html(`
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>View Image</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            body {
              background-color: black;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .image-container {
              width: 70vw;
              height: 70vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              width: auto;
              height: auto;
              object-fit: contain;
              background-color:white;
            }
          </style>
          `);
        newTab.document.body.innerHTML = `
          <div class="image-container">
            <img src="${imgeURL}" alt="View Image">
          </div>
        `;
      });
}

document.getElementById("save").addEventListener("click", function () {
  if (saveSignatureBtn === "UploadSigntaurePic") {
    SaveUplodedSignature();
  } else if (saveSignatureBtn === "WriteSignature") {
    SaveWrittenSignature();
  } else {
    console.log("No button has been clicked yet");
  }
});