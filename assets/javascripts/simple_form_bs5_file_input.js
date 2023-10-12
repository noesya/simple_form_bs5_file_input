/*global $, document, window, bootstrap */
window.inputSingleDeletableFile = {
    onFileDelete: function (e) {
        'use strict';
        var $scope = $(this).parents('.js-sdfi-deletable-file');
        e.preventDefault();
        e.stopPropagation();
        $('.js-sdfi-deletable-file__infos-field', $scope).val('');
        $('.js-sdfi-deletable-file__delete-field', $scope).val('true');
        $('input[type="file"]', $scope).val('');
        $scope.removeClass('sdfi-deletable-file--with-file');
    },

    onFileSelected: function () {
        'use strict';
        var $scope = $(this).parents('.js-sdfi-deletable-file'),
            $resizeModal = $('.js-sdfi-deletable-file__resize', $scope),
            files = this.files,
            file,
            isResizable,
            isPreviewable,
            hasPreview = $('.js-sdfi-deletable-file__preview', $scope).length > 0,
            hasResize = $resizeModal.length > 0,
            modal,
            reader,
            size;

        if (!files.length) {
            return;
        }

        file = files[0];
        isResizable = (/^image\/(png|jpeg)+$/).test(file.type);
        isPreviewable = (/^image\/[a-z+]+$/).test(file.type);

        if (isResizable && hasResize || isPreviewable && hasPreview) {
            reader = new FileReader();
            reader.readAsDataURL(file);
            if (isResizable && hasResize) {
                // Resizable images
                reader.onload = function () {
                    modal = new bootstrap.Modal($resizeModal, {
                        backdrop: 'static',
                        keyboard: false
                    });
                    $resizeModal.attr('data-image-result', this.result);
                    $resizeModal.attr('data-filename', file.name);
                    modal.show();
                };
            } else {
                // Previewable images
                $scope.addClass('sdfi-deletable-file--with-file');
                $('.js-sdfi-deletable-file__label', $scope).html(file.name);
                $('.js-sdfi-deletable-file__delete-field', $scope).val('');
                size = $('.js-sdfi-deletable-file__preview', $scope).attr('data-size')
                    .split('x');
                reader.onload = function (e) {
                    $('.js-sdfi-deletable-file__preview', $scope).html('<img src="' + e.target.result + '" width="' + size[0] + '" height="auto" class="img-fluid img-thumbnail">');
                };
            }
        } else {
            // Non-resizable and non-previewable files
            $scope.addClass('sdfi-deletable-file--with-file');
            $('.js-sdfi-deletable-file__label', $scope).html(file.name);
            $('.js-sdfi-deletable-file__delete-field', $scope).val('');
            $('.js-sdfi-deletable-file__preview', $scope).html('');
        }
    },

    onResizeModalShown: function (e) {
        'use strict';
        var $modal = $(e.target),
            $scope = $modal.parents('.js-sdfi-deletable-file'),
            $imgContainer = $('.js-sdfi-sdfi-deletable-file__resize-image', $scope),
            $image,
            image = $modal.attr('data-image-result'),
            ratio = $imgContainer.attr('data-ratio');

        $imgContainer.html('<img class="js-" src="' + image + '">');

        $image = $('img', $imgContainer);
        $image.css('opacity', 0);
        setTimeout(function () {
            // init cropper with a small delay
            $image.cropper({
                aspectRatio: ratio,
                autoCropArea: 1,
                movable: false,
                guides: false,
                background: false,
                viewMode: 1,
                zoomable: false,
                crop: function (data) {
                    $('.js-sdfi-deletable-file__infos-field', $scope).val(JSON.stringify(data.detail));
                }
            });
            $image.css('opacity', 1);
        }, 100);
    },

    onResizeModalCancel: function (e) {
        'use strict';
        var $scope = $(e.target).parents('.js-sdfi-deletable-file');
        $('.js-sdfi-deletable-file__infos-field', $scope).val('');
        $('.js-sdfi-deletable-file__delete-field', $scope).val('true');
        $('input[type="file"]', $scope).val('');
        $scope.removeClass('sdfi-deletable-file--with-file');
    },

    onResizeModalValidate: function (e) {
        'use strict';
        var $scope = $(e.target).parents('.js-sdfi-deletable-file'),
            $resizeModal = $('.js-sdfi-deletable-file__resize', $scope),
            $imgContainer = $('.js-sdfi-sdfi-deletable-file__resize-image', $scope),
            $image = $('img', $imgContainer),
            filename = $resizeModal.attr('data-filename'),
            hasPreview = $('.js-sdfi-deletable-file__preview', $scope).length > 0,
            imageData,
            resizeModal = $resizeModal[0],
            modal = bootstrap.Modal.getInstance(resizeModal),
            size;

        $scope.addClass('sdfi-deletable-file--with-file');
        $('.js-sdfi-deletable-file__label', $scope).html(filename);
        $('.js-sdfi-deletable-file__delete-field', $scope).val('');

        // set the preview if we have preview
        if (hasPreview) {
            size = $('.js-sdfi-deletable-file__preview', $scope).attr('data-size')
                .split('x');
            imageData = $image.data('cropper')
                .getCroppedCanvas()
                .toDataURL();

            $('.js-sdfi-deletable-file__preview', $scope).html('<img src="' + imageData + '" width="' + size[0] + '" height="auto" class="img-fluid img-thumbnail">');
        }
        modal.hide();
    },

    bindEvents: function (field) {
        'use strict';
        // click on the fake "replace file" btn launch the file input choice
        $('.js-sdfi-deletable-file__change-btn', $(field)).on('click', function () {
            $('input[type="file"]', $(field)).click();
        });
        $('.js-sdfi-deletable-file__delete-btn', $(field)).on('click', this.onFileDelete);
        $('input[type="file"]', $(field)).on('change', this.onFileSelected);

        $('.js-sdfi-deletable-file__resize', field).on('shown.bs.modal', this.onResizeModalShown);
        $('.js-sdfi-deletable-file__resize-cancel', field).on('click', this.onResizeModalCancel);
        $('.js-sdfi-deletable-file__resize-validate', field).on('click', this.onResizeModalValidate);
    }
};

$(document).ready(function () {
    'use strict';
    $('.js-sdfi-deletable-file').each(function () {
        window.inputSingleDeletableFile.bindEvents(this);
    });
});

/* Direct upload methods */

window.addEventListener('direct-upload:initialize', function (event) {
    'use strict';
    var target = event.target,
        $scope = $(target).parents('.js-sdfi-deletable-file');
    if ($scope.length > 0) {
        $('.sdfi-deletable-file__upload-progress', $scope).css('width', '0%');
        $scope.addClass('sdfi-deletable-file--uploading');
    }
});

window.addEventListener('direct-upload:progress', function (event) {
    'use strict';
    var target = event.target,
        progress = event.detail.progress,
        $scope = $(target).parents('.js-sdfi-deletable-file');
    if ($scope.length > 0) {
        $('.sdfi-deletable-file__upload-progress', $scope).css('width', progress + '%');
    }
});

window.addEventListener('direct-upload:error', function (event) {
    'use strict';
    var target = event.target,
        error = event.detail.error,
        $scope = $(target).parents('.js-sdfi-deletable-file');
    if ($scope.length > 0) {
        event.preventDefault();
        $('.sdfi-deletable-file__upload-progress', $scope).css('width', '0%');
        $scope.removeClass('sdfi-deletable-file--uploading');
        alert(error);
    }
});
