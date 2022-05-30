class SingleDeletableFileInput < SimpleForm::Inputs::Base
  delegate :url_helpers, to: 'Rails.application.routes'

  include ActionView::Helpers::AssetTagHelper
  include ActionDispatch::Routing::PolymorphicRoutes

  def input(wrapper_options = nil)
    format('
      <div class="sdfi-deletable-file js-sdfi-deletable-file %s">
        %s
        <div class="%s">
          <button type="button" class="btn js-sdfi-deletable-file__change-btn">%s</button>
          <label for="%s" class="sdfi-deletable-file__label js-sdfi-deletable-file__label">
            %s
          </label>
          <div class="sdfi-deletable-file__delete-btn js-sdfi-deletable-file__delete-btn"></div>
          <div class="sdfi-deletable-file__upload-background"></div>
          <div class="sdfi-deletable-file__upload-progress"></div>
          <input type="hidden" name="%s" class="js-sdfi-deletable-file__infos-field" %s />
          <input type="hidden" name="%s" class="js-sdfi-deletable-file__delete-field" %s />
        </div>
        %s
        %s
      </div>
    ', has_file_class, input_field(wrapper_options), field_classes(wrapper_options), change_file_text, field_id, existing_file_name_or_default_text, input_infos_name, input_infos_value, input_delete_name, input_delete_value, preview_div, resize_div)
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
    I18n.t('simple_form_bs5_file_input.replace_file')
  end

  def field_id
    "#{object_name}_#{reflection_or_attribute_name}"
  end

  def existing_file_name_or_default_text
    "#{file_attachment.filename}" if should_display_file?
  end

  def input_delete_name
    "#{@builder.object_name}[#{attribute_name.to_s}_delete]"
  end

  def input_delete_value
    "value='true'" if @builder.object.send("#{attribute_name}_delete") == 'true'
  end

  def input_infos_name
    "#{@builder.object_name}[#{attribute_name.to_s}_infos]"
  end

  def input_infos_value
    "value='#{@builder.object.send("#{attribute_name}_infos")}'" if @builder.object.send("#{attribute_name}_infos")
  end

  def preview_div
    if options[:preview]
      format('<div class="sdfi-deletable-file__preview js-sdfi-deletable-file__preview" data-size="%s">%s</div>', preview_image_width, preview_image_tag)
    end
  end

  def resize_div
    if options[:resize]
      format('<div class="sdfi-deletable-file__resize js-sdfi-deletable-file__resize modal" tabindex="-1">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">%s</h5>
                      <button type="button" class="btn-close js-sdfi-deletable-file__resize-cancel" data-bs-dismiss="modal" aria-label="%s"></button>
                    </div>
                    <div class="modal-body">
                      <div class="sdfi-sdfi-deletable-file__resize-image js-sdfi-sdfi-deletable-file__resize-image" data-ratio="%s">

                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-sm btn-secondary js-sdfi-deletable-file__resize-cancel" data-bs-dismiss="modal">%s</button>
                      <button type="button" class="btn btn-sm btn-primary js-sdfi-deletable-file__resize-validate">%s</button>
                    </div>
                  </div>
                </div>
              </div>', modal_title, close_btn_text, resize_ratio, close_btn_text, validate_btn_text)
    end
  end

  private

  def file_attachment
    @builder.object.send("#{attribute_name}_attachment")
  end

  def should_display_file?
    file_attachment.present?
  end

  def preview_image_width
    options[:preview] == true ? default_preview_image_width : options[:preview].to_i
  end

  def resize_ratio
    options[:resize] == true ? '' : options[:resize]
  end

  def preview_image_tag
    # Pas de fichier, pas de chocolat
    return unless should_display_file?
    # Fichier invariable, pas de chocolat non plus
    return unless file_attachment&.variable?
    variant = file_attachment.variant(resize: "#{preview_image_width}x")
    path = url_helpers.polymorphic_url variant, only_path: true
    image_tag path, class: 'img-fluid img-thumbnail', width: preview_image_width
  end

  def default_preview_image_width
    1000
  end

  def modal_title
    I18n.t('simple_form_bs5_file_input.modal_title')
  end

  def close_btn_text
    I18n.t('simple_form_bs5_file_input.modal_close')
  end

  def validate_btn_text
    I18n.t('simple_form_bs5_file_input.modal_validate')
  end
end
