/*global $, RegExp */
$(function () {
    'use strict';
    var getCheckRegex = function (key, $check) {
            var regex,
                min,
                chars;
            switch (key) {
            case 'uppercase':
                regex = '[A-Z]';
                break;
            case 'lowercase':
                regex = '[a-z]';
                break;
            case 'number':
                regex = '[0-9]';
                break;
            case 'special':
                // hyphen must be at the end
                chars = $check.data('chars');
                regex = '[' + chars + ']';
                break;
            case 'length':
                min = $check.data('length');
                regex = '.{' + min + ',128}';
                break;
            default:
                break;
            }
            return regex;
        },
        performCheck = function ($container, key, password) {
            var $check = $('.js-sfpwh-hint-' + key, $container),
                regexKey = getCheckRegex(key, $check),
                regex = new RegExp(regexKey);
            if ($check.length) {
                if (password.match(regex)) {
                    $check.removeClass('sfpwh-hint--invalid');
                } else {
                    $check.addClass('sfpwh-hint--invalid');
                }
            }
        },
        compareFields = function (e) {
            var $field = $(e.data.$field),
                $target = $(e.data.$target),
                $container = $field.parents('.password_with_sync'),
                $check = $('.js-sfpwh-hint-match', $container);

            if ($field.val() !== '' && $field.val() === $target.val()) {
                $check.removeClass('sfpwh-hint--invalid');
            } else {
                $check.addClass('sfpwh-hint--invalid');
            }
        };

    $('.js-sfpwh-hints-input').on('input', function () {
        var $container = $(this).parents('.password_with_hints'),
            checks = ['length', 'uppercase', 'lowercase', 'number', 'special'],
            password = $(this).val(),
            i;
        for (i = 0; i < checks.length; i += 1) {
            performCheck($container, checks[i], password);
        }
    });

    $('.js-sfpwh-password-toggle').on('click', function () {
        var $container = $(this).parents('.password_with_hints, .password_with_sync'),
            $input = $('.js-sfpwh-input', $container),
            type = $input.attr('type');
        $(this).toggleClass('sfpwh-password-toggle-revealed');
        if (type === 'text') {
            $input.attr('type', 'password');
        } else {
            $input.attr('type', 'text');
        }
    });

    $('.js-sfpwh-sync-input').each(function (index, value) {
        var $field = $(value),
            $form = $field.parents('form'),
            $target = $('input[name="' + $field.data('link-to') + '"]', $form);

        $field.on('input', { $field: $field, $target: $target }, compareFields);
        $target.on('input', { $field: $field, $target: $target }, compareFields);
    });
});
