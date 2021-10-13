/*global $, document, window */
window.inputSingleDeletableFile = {
    onDelete: function (e) {
        'use strict';
        e.preventDefault();
        e.stopPropagation();
        var scope = $(this).parents('.single_deletable_file'),
            label_field = $('.custom-file-label', scope);
        $('.custom-file-delete-field', scope).val('true');
        $('input[type="file"]', scope).val('');
        label_field.removeClass('selected').html(label_field.data('default'));
        $(this).addClass('d-none');
        $('.custom-file-preview', scope).hide();
    },

    onChange: function () {
        'use strict';
        var scope = $(this).parents('.single_deletable_file'),
            file_name = $(this).val().split('\\').pop(),
            has_preview = ($('.custom-file-preview', scope).length > 0);
        if (file_name !== '' && file_name !== undefined) {
            $('.custom-file-label', scope).addClass('selected').html(file_name);
            $('.custom-file-delete', scope).removeClass('d-none');
            $('.custom-file-delete-field', scope).val('');
        }
        // preview
        if (has_preview && this.files && this.files[0]) {
           var reader = new FileReader();
           reader.onload = function (e) {
               $('.custom-file-preview', scope).attr('src', e.target.result);
               $('.custom-file-preview', scope).show();
           }
           reader.readAsDataURL(this.files[0]);
        }
    },

    bindEvents: function (field) {
        'use strict';
        $('.custom-file-delete', $(field)).on('click', this.onDelete);
        $('input[type="file"]', $(field)).on('change', this.onChange);
    }
};

$(document).ready(function () {
    'use strict';
    $('.custom-file').each(function () {
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
