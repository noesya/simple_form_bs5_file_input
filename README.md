# simple_form_image_fields

A nice improvement for the image fields in [Simple Form](https://github.com/heartcombo/simple_form).

**Simple Form Image Fields** aims to add directs controls to your image fields in Simple Form.



## Installation

Add it to your Gemfile:

```ruby
gem 'simple_form_image_fields'
```

Run the following command to install it:

```console
bundle install
```

Add it to your application.sass:

```
@import 'simple_form_image_fields'
```

Add it to your application.js:

```
//= require simple_form_image_fields
```

### Bootstrap

**Simple Form Image Fields** relies on the [Bootstrap](http://getbootstrap.com/) markup, so it presumes that you installed Simple Form with the Bootstrap option. To do that you have to use the `bootstrap` option in the Simple Form install generator, like this:

```console
rails generate simple_form:install --bootstrap
```

You have to be sure that you added a copy of the [Bootstrap](http://getbootstrap.com/)
assets on your application.

## Usage
TODO après ici
**Simple Form Password Image Fields** comes with two new input types. One is meant to replace the standard `:password` field: `:password_with_hints`. The second one is meant to replace the `:password_confirmation` field: `:password_with_sync`.

To start using **Simple Form Password With Hints** you just have to change the input type of the `:password` / `:password_confirmation` fields.

So basically your field:
```erb
<%= f.input :password %>
```
becomes
```erb
<%= f.input :password,
            as: :password_with_hints,  
            validators: {
              length: 6,
              uppercase_char: true,
              lowercase_char: true,
              numeric_char: true,
              special_char: '#&@?!'
            } %>
```

and your field
```erb
<%= f.input :password_confirmation %>
```
becomes
```erb
<%= f.input :password_confirmation,
            as: :password_with_sync,  
            compare_with_field: :password %>
  ```

For both kind of fields you can add an option `allow_password_uncloaking: true` which will add an eye on the right side of the field. Clicking on the eye will toggle the visibility of the password field between stars (******) and text (Mypassword!).

Of course you can add every other current option to your fields.

For `:password_with_hints` field you can safely ignore every validator you don't want to use. Just set the test to false or delete the line.

### Model validation

Please keep in mind that the controls are only indicatives, and don't prevent to submit the fields, even when all checks are not filled.
So you will have to ensure of the password complexity in the model file.
Basically in your `User` model you will have to add a test like this:
```erb
validate :password_complexity

def password_complexity
  # Regexp extracted from https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
  return if password.blank? || password =~ /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!,@$%^&*+£µ-]).{8,70}$/
  errors.add :password, 'Your password is not strong enough'
end
```

This regex matches the validators:
```erb
validators: {
  length: 8,
  uppercase_char: true,
  lowercase_char: true,
  numeric_char: true,
  special_char: '#?!,@$%^&*+£µ-'
}
```

If you use `Devise` you might want to use the gem setup directly. And maybe add the special chars list in the configuration.
So in you `config/application.rb` you might add `config.allowed_special_chars = '#?!,@$%^&*+£µ-'`.
And then your regex in the model file should look like that:
```erb
/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#{Rails.application.config.allowed_special_chars}]).{#{Devise.password_length.first},#{Devise.password_length.last}}$/
```
and the validator:
```erb
validators: {
  length: Devise.password_length.first,
  uppercase_char: true,
  lowercase_char: true,
  numeric_char: true,
  special_char: Rails.application.config.allowed_special_chars
}
```


## I18n

**Simple Form With Hints** uses the I18n API to manage the texts displayed. Feel free to overwrite the keys or add languages.

## Information

### Supported Ruby / Rails versions

We intend to maintain support for all Ruby / Rails versions that haven't reached end-of-life.

For more information about specific versions please check [Ruby](https://www.ruby-lang.org/en/downloads/branches/)
and [Rails](https://guides.rubyonrails.org/maintenance_policy.html) maintenance policies, and our test matrix.

### Bug reports

If you discover any bugs, feel free to create an issue on GitHub. Please add as much information as
possible to help us in fixing the potential bug. We also encourage you to help even more by forking and sending us a pull request.

https://github.com/noesya/simple_form_password_with_hints/issues

## Maintainers

* Pierre-André Boissinot (https://github.com/pabois)


## License

MIT License.
