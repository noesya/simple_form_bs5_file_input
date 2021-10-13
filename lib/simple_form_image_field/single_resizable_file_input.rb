class SingleResizableFileInput < SimpleForm::Inputs::Base
  delegate :url_helpers, to: 'Rails.application.routes'

  include ActionView::Helpers::AssetTagHelper

  def input(wrapper_options = nil)
    format('<div class="form-cropper %s">
      <div class="modal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">%s</h5>
              <button type="button" class="close modal_close" aria-label="%s">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="img-container image-crop">
                <img src="">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-sm btn-secondary modal_close">%s</button>
              <button type="button" class="btn btn-sm btn-primary modal_validate">%s</button>
            </div>
          </div>
        </div>
      </div>
      <div class="image-preview">
        <img src="%s" class="img-fluid">
      </div>
      <label for="%s" title="%s" class="btn btn-primary btn-upload">
        %s
        <span class="btn-upload_change">%s</span>
        <span class="btn-upload_send">%s</span>
      </label>
      <input class="form-control hidden form-cropper_infos" type="hidden" name="%s">
      <input class="form-control hidden form-cropper_delete" type="hidden" name="%s">
      <button class="btn btn-danger btn-delete" type="button">%s</button>
    </div>',
    empty_class,
    modal_title,
    close_button_text,
    close_button_text,
    validate_button_text,
    preview_image_url,
    field_id,
    change_image_text,
    input_field(wrapper_options),
    change_image_text,
    send_image_text,
    input_infos_name,
    input_delete_name,
    delete_image_text)
  end

  def empty_class
    file_instance.attached? ? '' : 'form-cropper__empty'
  end

  def modal_title
    I18n.t('simple_form_image_fields.single_resizable_file.modal_title')
  end

  def close_button_text
    I18n.t('simple_form_image_fields.single_resizable_file.modal_close')
  end

  def validate_button_text
    I18n.t('simple_form_image_fields.single_resizable_file.modal_validate')
  end

  def preview_image_url
    file_instance.attached? ? url_helpers.rails_service_blob_path(file_instance.signed_id, file_instance.filename.to_s) : ''
  end

  def field_id
    "#{object_name}_#{reflection_or_attribute_name}"
  end

  def change_image_text
    I18n.t('simple_form_image_fields.single_resizable_file.change_image')
  end

  def input_field(wrapper_options)
    input_html_options[:class] << 'form-cropper_image'.to_sym
    merged_input_options = merge_wrapper_options(input_html_options, wrapper_options)
    @builder.file_field(attribute_name, merged_input_options)
  end

  def send_image_text
    I18n.t('simple_form_image_fields.single_resizable_file.send_image')
  end

  def input_infos_name
    "#{@builder.object_name}[#{attribute_name.to_s}_infos]"
  end

  def input_delete_name
    "#{@builder.object_name}[#{attribute_name.to_s}_delete]"
  end

  def delete_image_text
    I18n.t('simple_form_image_fields.single_resizable_file.delete_image')
  end

  def file_instance
    @builder.object.send(attribute_name)
  end

end
