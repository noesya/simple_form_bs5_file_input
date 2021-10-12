class SingleDeletableFileInput < SimpleForm::Inputs::Base
  delegate :url_helpers, to: 'Rails.application.routes'

  include ActionView::Helpers::AssetTagHelper

  def input(wrapper_options = nil)
    format('%s<div class="custom-file">
    %s
    <div class="custom-file-background"></div>
    <div class="custom-file-upload_progress"></div>
    <label for="%s" class="custom-file-label" data-default="%s">%s</label>
    <button class="btn custom-file-delete %s" type="button">%s</button>
    <input type="hidden" name="%s" class="custom-file-delete-field" %s />
    </div>', preview, input_field(wrapper_options), field_id, default_label_text, existing_file_name_or_default_text, is_button_hidden, I18n.t('simple_form_image_fields.single_deletable_file.delete'), input_hidden_name, input_hidden_value)
  end

  def preview
    if options[:display_preview]
      format('<div class="preview">%s</div>', preview_image_tag)
    end
  end

  def input_field(wrapper_options)
    merged_input_options = merge_wrapper_options(input_html_options, wrapper_options)
    if options[:direct_upload]
      merged_input_options[:data] = {} if merged_input_options[:data].nil?
      merged_input_options[:data]['direct-upload-url'] = Rails.application.routes.url_helpers.rails_direct_uploads_path
    end
    @builder.file_field(attribute_name, merged_input_options)
  end

  def field_id
    "#{object_name}_#{reflection_or_attribute_name}"
  end

  def default_label_text
    I18n.t('simple_form_image_fields.single_deletable_file.choose_file')
  end

  def input_file_name
      "#{@builder.object_name}[#{attribute_name}]"
  end

  def existing_file_name_or_default_text
    if should_display_file?
      "#{file_attachment.filename}"
    else
      default_label_text
    end
  end

  def preview_image_tag
    if should_display_file? && file_attachment.blob&.variant?
      image_tag(file_attachment.blob.variant(resize: "200x200").processed.service_url, class: 'custom-file-preview')
    else
      '<img src="#" class="custom-file-preview" style="display: none;">'
    end
  end

  def is_button_hidden
    'd-none' unless should_display_file?
  end

  def input_hidden_name
    "#{@builder.object_name}[#{attribute_name.to_s}_delete]"
  end

  def input_hidden_value
    "value='true'" if @builder.object.send("#{attribute_name}_delete") == 'true'
  end

  def file_attachment
    @builder.object.send("#{attribute_name}_attachment")
  end

  def should_display_file?
    file_attachment.present?
  end
end
