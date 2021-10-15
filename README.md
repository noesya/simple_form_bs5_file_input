# simple_form_bs5_file_input

A nice improvement for the `file` field in [Simple Form](https://github.com/heartcombo/simple_form).

**Simple Form Bootstrap 5 File Input** aims to add directs controls to your file fields in Simple Form.


## Installation

Add it to your Gemfile:

```ruby
gem 'simple_form_bs5_file_input'
```

Run the following command to install it:

```console
bundle install
```

Add it to your application.sass:

```
@import 'simple_form_bs5_file_input'
```

Add it to your application.js:

```
//= require simple_form_bs5_file_input
```

### Active Storage

**Simple Form Bootstrap 5 File Input** relies on [Active Storage](https://github.com/rails/rails/tree/main/activestorage), so it presumes that you installed Active Storage.

### Bootstrap

**Simple Form Bootstrap 5 File Input** relies on the [Bootstrap 5](http://getbootstrap.com/) markup, so it presumes that you installed Simple Form with the Bootstrap option. To do that you have to use the `bootstrap` option in the Simple Form install generator, like this:

```console
rails generate simple_form:install --bootstrap
```

You have to be sure that you added a copy of the [Bootstrap 5](http://getbootstrap.com/)
assets on your application.

## Usage
**Simple Form Bootstrap 5 File Input** comes with one new input type which is meant to replace the standard `:file` field: `:single_deletable_file`

To start using **Simple Form Bootstrap 5 File Input** you just have to change the input type of the `:file` field to these new kind.

So basically your field:
```erb
<%= f.input :my_file %>
```
becomes
```erb
<%= f.input :my_file,
            as: :single_deletable_file %>
```
Of course you can still add the options you want, like for example `input_html: { accept: '.jpg,.jpeg,.png' }`

You can also add a direct preview (WARNING: preview can only work with images!) by using `preview: true` or any custom width for the preview: `preview: 500`. If you don't specify the preview size it will be 1000px width by default.
Note that the preview uses the boostrap classes `img-fluid` and `img-thumbnail`.

### Model
You also have to change the type of you file in your model.
So instead of declaring:
```
has_one_attached :picture
```

you will have to declare:
```
has_one_attached_deletable :picture
```

### Controller
If you use strict parameters you will need to allow the `:[filename]_delete` and the `:[filename]_infos` params in the controller.
So instead of:
```
params.require(:user).permit(:first_name, :last_name, :picture)
```
you will have:
```
params.require(:user).permit(:first_name, :last_name, :picture, :picture_delete, :picture_infos)
```

That's all folks!

## Direct upload

The new field is still compatible with the `direct_upload` param.
```erb
<%= f.input :my_file,
            as: :single_deletable_file,
            direct_upload: true %>
```
Please remember to include the `activestorage.js` library in order to use the direct_upload feature.
Direct upload will send the file BEFORE the page submission. You will get a progress bar in the file field while the file is uploading.

## Resize

You can add an option to the field to resize the image after upload (of course it has to be an image!).

Add `resize: true` to your field.

You can also specify a ratio for the cropper. For example `resize: 1` will lock the aspect ratio to a square. Beware of the float constraints in rails. If you want a 4/3 ratio use `resize: 4/3.to_f` as 4/3 otherwise gives 1.


The resizer is based on [CropperJS](https://github.com/fengyuanchen/cropperjs) so you have to add cropper and jquery-cropper to your dependencies:
```
yarn add cropperjs
yarn add jquery-cropper
```
then include the js files in your application.js file:
```
//= require cropperjs/dist/cropper
//= require jquery-cropper/dist/jquery-cropper
```
and include the css in your application.sass file:
```
@import 'cropperjs/dist/cropper'
```


## I18n

**Simple Form Bootstrap 5 File Input** uses the I18n API to manage the texts displayed. Feel free to overwrite the keys or add languages.

## Information

### Supported Ruby / Rails versions

We intend to maintain support for all Ruby / Rails versions that haven't reached end-of-life.

For more information about specific versions please check [Ruby](https://www.ruby-lang.org/en/downloads/branches/)
and [Rails](https://guides.rubyonrails.org/maintenance_policy.html) maintenance policies, and our test matrix.

### Bug reports

If you discover any bugs, feel free to create an issue on GitHub. Please add as much information as
possible to help us in fixing the potential bug. We also encourage you to help even more by forking and sending us a pull request.

https://github.com/noesya/simple_form_bs5_file_input/issues

## Maintainers

* Pierre-André Boissinot (https://github.com/pabois)


## License

MIT License.
