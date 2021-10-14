/*global $, document, window */
window.inputSingleDeletableFile = {
    onDelete: function (e) {
        'use strict';
        var $scope = $(this).parents('.js-sdfi-deletable-file');
        e.preventDefault();
        e.stopPropagation();
        $('.js-sdfi-deletable-file__hidden-field', $scope).val('true');
        $('input[type="file"]', $scope).val('');
        $scope.removeClass('sdfi-deletable-file--with-file');
        // $('.custom-file-preview', scope).hide();
    },

    onChange: function () {
        'use strict';
        var $scope = $(this).parents('.js-sdfi-deletable-file'),
            fileName = $(this).val()
                .split('\\')
                .pop(),
            hasPreview = $('.js-sdfi-deletable-file__preview', $scope).length > 0,
            reader,
            size;
        if (fileName !== '') {
            $scope.addClass('sdfi-deletable-file--with-file');
            $('.js-sdfi-deletable-file__label', $scope).html(fileName);
            $('.js-sdfi-deletable-file__hidden-field', $scope).val('');
        }
        // preview
        if (hasPreview && this.files && this.files[0]) {
            size = $('.js-sdfi-deletable-file__preview', $scope).attr('data-size')
                .split('x');
            reader = new FileReader();
            reader.onload = function (e) {
                $('.js-sdfi-deletable-file__preview', $scope).html('<img src="' + e.target.result + '" width="' + size[0] + '" height="auto" class="img-fluid img-thumbnail">');
            };
            reader.readAsDataURL(this.files[0]);
        }
    },

    bindEvents: function (field) {
        'use strict';
        // click on the fake "replace file" btn launch the file input choice
        $('.js-sdfi-deletable-file__change-btn', $(field)).on('click', function () {
            $('input[type="file"]', $(field)).click();
        });
        $('.js-sdfi-deletable-file__delete-btn', $(field)).on('click', this.onDelete);
        $('input[type="file"]', $(field)).on('change', this.onChange);
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
