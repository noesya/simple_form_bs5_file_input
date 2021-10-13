class SingleDeletableFileInput < SimpleForm::Inputs::Base
  delegate :url_helpers, to: 'Rails.application.routes'

  include ActionView::Helpers::AssetTagHelper
  include ActionDispatch::Routing::PolymorphicRoutes

  def input(wrapper_options = nil)
    format('
      <div class="sdfi-deletable-file js-sdfi-deletable-file %s">
        %s
        %s
        <div class="%s">
          <button type="button" class="btn js-sdfi-deletable-file__change-btn">%s</button>
          <label for="%s" class="sdfi-deletable-file__label js-sdfi-deletable-file__label">
            %s
          </label>
          <div class="sdfi-deletable-file__delete-btn js-sdfi-deletable-file__delete-btn"></div>
          <div class="sdfi-deletable-file__upload-progress"></div>
          <input type="hidden" name="%s" class="js-sdfi-deletable-file__hidden-field" %s />
        </div>
      </div>
    ', has_file_class, preview_div, input_field(wrapper_options), field_classes(wrapper_options), change_file_text, field_id, existing_file_name_or_default_text, input_hidden_name, input_hidden_value)
  end

  def preview_div
    if options[:preview]
      format('<div class="sdfi-deletable-file__preview js-sdfi-deletable-file__preview" data-size="%s">%s</div>', options[:preview], preview_image_tag(options[:preview]))
    end
  end

  def has_file_class
    'sdfi-deletable-file--with-file' if should_display_file?
  end

  def input_field(wrapper_options)
    merged_input_options = merge_wrapper_options(input_html_options, wrapper_options)
    if options[:direct_upload]
      merged_input_options[:data] = {} if merged_input_options[:data].nil?
      merged_input_options[:data]['direct-upload-url'] = Rails.application.routes.url_helpers.rails_direct_uploads_path
    end
    @builder.file_field(attribute_name, merged_input_options)
  end

  def field_classes(wrapper_options)
    # "form-control is-valid single_deletable_file optional"
    "sdfi-deletable-file__block #{merge_wrapper_options(input_html_options, wrapper_options)[:class].join(' ')}"
  end

  def change_file_text
    I18n.t('simple_form_image_fields.single_deletable_file.replace_file')
  end

  def field_id
    "#{object_name}_#{reflection_or_attribute_name}"
  end

  def existing_file_name_or_default_text
    if should_display_file?
      "#{file_attachment.filename}"
    else
      default_label_text
    end
  end

  def input_hidden_name
    "#{@builder.object_name}[#{attribute_name.to_s}_delete]"
  end

  def input_hidden_value
    "value='true'" if @builder.object.send("#{attribute_name}_delete") == 'true'
  end

  private

  def file_attachment
    @builder.object.send("#{attribute_name}_attachment")
  end

  def should_display_file?
    file_attachment.present?
  end

  def default_label_text
    I18n.t('simple_form_image_fields.single_deletable_file.choose_file')
  end

  def preview_image_tag(size)
    if should_display_file? && file_attachment&.variable?
      image_tag(file_attachment.variant(resize: size).processed.url, class: 'custom-file-preview')
    end
  end
end
