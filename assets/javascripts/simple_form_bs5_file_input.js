//= require polyfills/element_closest.js

/*global document, window, bootstrap */

window.inputSingleDeletableFile = {
    cropperInstances: [],
    onFileDelete: function (e) {
        'use strict';
        var scope = this.closest('.js-sdfi-deletable-file')
        
        e.preventDefault();
        e.stopPropagation();

        scope.querySelector('.js-sdfi-deletable-file__infos-field').value = '';
        scope.querySelector('.js-sdfi-deletable-file__delete-field').value = true;
        scope.querySelector('input[type="file"]').value = '';

        scope.classList.remove('sdfi-deletable-file--with-file');
    },

    onFileSelected: function () {
        'use strict';
        var scope = this.closest('.js-sdfi-deletable-file'),
            resizeModal = scope.querySelector('.js-sdfi-deletable-file__resize'),
            preview = scope.querySelector('.js-sdfi-deletable-file__preview'),
            files = this.files,
            file,
            modal,
            reader,
            size;
        

        if (!files.length) {
            return;
        }

        file = files[0];

        if (!resizeModal) {
            // name display is delayed if we need to resize
            scope.classList.add('sdfi-deletable-file--with-file');
            scope.querySelector('.js-sdfi-deletable-file__label').innerHTML = file.name;
            scope.querySelector('.js-sdfi-deletable-file__delete-field').value = '';
        }


        if (/^image\/[a-z+]+$/.test(file.type) && (resizeModal || preview)) {
            reader = new FileReader();
            reader.readAsDataURL(file);
            if (resizeModal) {
                reader.onload = function () {
                    modal = new bootstrap.Modal(resizeModal, {
                        backdrop: 'static',
                        keyboard: false
                    });
                    resizeModal.setAttribute('data-image-result', this.result);
                    resizeModal.setAttribute('data-filename', file.name);
                    modal.show();
                };
            } else if (preview) {
                size = preview.getAttribute('data-size').split('x');
                reader.onload = function (e) {
                    preview.innerHTML = '<img src="' + e.target.result + '" width="' + size[0] + '" height="auto" class="img-fluid img-thumbnail">';
                };
            }
        }
    },

    onResizeModalShown: function (e) {
        'use strict';
        var modal = e.target,
            scope = modal.closest('.js-sdfi-deletable-file'),
            imgContainer = scope.querySelector('.js-sdfi-sdfi-deletable-file__resize-image'),
            imageElement,
            image = modal.getAttribute('data-image-result'),
            ratio = imgContainer.getAttribute('data-ratio'),
            cropper;

        imgContainer.innerHTML = '<img class="js-" src="' + image + '">';

        imageElement = imgContainer.querySelector('img');
        imageElement.style.opacity = 0;

        setTimeout(function () {
            // init cropper with a small delay
            cropper = new Cropper(
                imageElement, 
                {
                    aspectRatio: ratio,
                    autoCropArea: 1,
                    movable: false,
                    guides: false,
                    background: false,
                    viewMode: 1,
                    zoomable: false,
                    crop: function (data) {
                        scope.querySelector('.js-sdfi-deletable-file__infos-field').value = JSON.stringify(data.detail);
                    }
                });

            window.inputSingleDeletableFile.cropperInstances.push(cropper);
            imageElement.setAttribute('data-cropper-index', window.inputSingleDeletableFile.cropperInstances.length - 1);

            imageElement.style.opacity = 1;
        }, 100);
    },

    onResizeModalCancel: function (e) {
        'use strict';
        var scope = e.target.closest('.js-sdfi-deletable-file');
        scope.querySelector('.js-sdfi-deletable-file__infos-field').value = '';
        scope.querySelector('.js-sdfi-deletable-file__delete-field').value = '';
        scope.querySelector('input[type="file"]').value = '';
        scope.classList.remove('sdfi-deletable-file--with-file');
    },

    onResizeModalValidate: function (e) {
        'use strict';
        var scope = e.target.closest('.js-sdfi-deletable-file'),
            resizeModal = scope.querySelector('.js-sdfi-deletable-file__resize'),
            imgContainer = scope.querySelector('.js-sdfi-sdfi-deletable-file__resize-image'),
            image = imgContainer.querySelector('img'),
            filename = resizeModal.getAttribute('data-filename'),
            preview = scope.querySelector('.js-sdfi-deletable-file__preview'),
            imageData,
            modal = bootstrap.Modal.getInstance(resizeModal),
            size,
            cropperIndex = parseInt(image.getAttribute('data-cropper-index'), 10),
            cropper = window.inputSingleDeletableFile.cropperInstances[cropperIndex];

        scope.classList.add('sdfi-deletable-file--with-file');
        scope.querySelector('.js-sdfi-deletable-file__label').innerHTML = filename;
        scope.querySelector('.js-sdfi-deletable-file__delete-field').value = '';

        // set the preview if we have preview
        if (preview) {
            size = preview.getAttribute('data-size')
                .split('x');

            imageData = cropper.getCroppedCanvas().toDataURL();

            scope.querySelector('.js-sdfi-deletable-file__preview').innerHTML = '<img src="' + imageData + '" width="' + size[0] + '" height="auto" class="img-fluid img-thumbnail">';
        }
        modal.hide();
    },

    bindEvents: function (field) {
        'use strict';
        var resize = field.querySelector('.js-sdfi-deletable-file__resize');
        // click on the fake "replace file" btn launch the file input choice
        field.querySelector('.js-sdfi-deletable-file__change-btn').addEventListener('click', function() {
            field.querySelector('input[type="file"]').click();
        });

        field.querySelector('.js-sdfi-deletable-file__delete-btn').addEventListener('click', this.onFileDelete)
        field.querySelector('input[type="file"]').addEventListener('change', this.onFileSelected);

        if (resize) {
            field.querySelector('.js-sdfi-deletable-file__resize').addEventListener('shown.bs.modal', this.onResizeModalShown);
            field.querySelector('.js-sdfi-deletable-file__resize-cancel').addEventListener('click', this.onResizeModalCancel);
            field.querySelector('.js-sdfi-deletable-file__resize-validate').addEventListener('click', this.onResizeModalValidate);
        }
    }
};

document.addEventListener("DOMContentLoaded", function() {
    var fileInputs = document.querySelectorAll('.js-sdfi-deletable-file'),
        i;

    for (i = 0; i < fileInputs.length; i += 1) {
        window.inputSingleDeletableFile.bindEvents(fileInputs[i]);
    }
});

/* Direct upload methods */
window.addEventListener('direct-upload:initialize', function (event) {
    'use strict';
    var target = event.target,
        scope = target.closest('.js-sdfi-deletable-file');

    if (scope) {
        scope.querySelector('.sdfi-deletable-file__upload-progress').style.width = '0%';
        scope.classList.add('sdfi-deletable-file--uploading');
    }
});

window.addEventListener('direct-upload:progress', function (event) {
    'use strict';
    var target = event.target,
        progress = event.detail.progress,
        scope = target.closest('.js-sdfi-deletable-file');
    if (scope) {
        scope.querySelector('.sdfi-deletable-file__upload-progress').style.width = progress + '%';
    }
});

window.addEventListener('direct-upload:error', function (event) {
    'use strict';
    var target = event.target,
        error = event.detail.error,
        scope = target.closest('.js-sdfi-deletable-file');
    if (scope) {
        event.preventDefault();
        scope.querySelector('.sdfi-deletable-file__upload-progress').style.width = '0%';
        scope.classList.remove('sdfi-deletable-file--uploading');
        alert(error);
    }
});
