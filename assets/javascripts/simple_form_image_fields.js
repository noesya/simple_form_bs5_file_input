/*global $, document, window */
window.inputSingleDeletableFile = {
    onDelete: function (e) {
        'use strict';
        var scope = $(this).parents('.js-sdfi-deletable-file');
        e.preventDefault();
        e.stopPropagation();
        $('.js-sdfi-deletable-file__hidden-field', scope).val('true');
        $('input[type="file"]', scope).val('');
        scope.removeClass('sdfi-deletable-file--with-file');
        // $('.custom-file-preview', scope).hide();
    },

    onChange: function () {
        'use strict';
        var scope = $(this).parents('.js-sdfi-deletable-file'),
            fileName = $(this).val()
                .split('\\')
                .pop(),
            hasPreview = $('.js-sdfi-deletable-file__preview', scope).length > 0,
            reader,
            size;
        if (fileName !== '') {
            scope.addClass('sdfi-deletable-file--with-file');
            $('.js-sdfi-deletable-file__label', scope).html(fileName);
            $('.js-sdfi-deletable-file__hidden-field', scope).val('');
        }
        // preview
        if (hasPreview && this.files && this.files[0]) {
            size = $('.js-sdfi-deletable-file__preview', scope).attr('data-size').split('x');
            reader = new FileReader();
            reader.onload = function (e) {
                $('.js-sdfi-deletable-file__preview', scope).html('<img src="' + e.target.result + '" width="' + size[0] + '" height="auto">');
            };
            reader.readAsDataURL(this.files[0]);
        }
    },

    bindEvents: function (field) {
        'use strict';
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
        $parent = $(target).parents('.custom-file');
    $('.custom-file-upload_progress', $parent).css('width', '0%');
    $parent.addClass('custom-file__uploading');
    $('body').addClass('direct_upload');
});

window.addEventListener("direct-upload:progress", function (event) {
    var target = event.target,
        progress = event.detail.progress,
        $parent = $(target).parents('.custom-file');

    $('.custom-file-upload_progress', $parent).css('width', progress + '%');
});

window.addEventListener("direct-upload:error", function (event) {
    var target = event.target,
        error = event.detail.error,
        $parent = $(target).parents('.custom-file');
    event.preventDefault();
    $('.custom-file-upload_progress', $parent).css('width', '0%');
    $parent.removeClass('custom-file__uploading');
    $('body').removeClass('direct_upload');
    alert(error);
});
