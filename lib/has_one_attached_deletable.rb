class ActiveRecord::Base
  def self.has_one_attached_deletable(name, **options, &block)
    class_eval do
      attr_accessor :"#{name}_delete"
      attr_accessor :"#{name}_infos"

      before_validation { send(name).purge_later if send("#{name}_attachment").present? && send("#{name}_delete") == 'true' }
      after_commit :"resize_#{name}", unless: Proc.new { |u| u.send("#{name}_infos").blank? }

      define_method :"#{name}_delete=" do |value|
        instance_variable_set :"@#{name}_delete", value
      end

      define_method :"resize_#{name}" do
        return unless send(name).attached?


        params = JSON(send("#{name}_infos"))
        # reset the infos to prevent multiple resize if multiple save
        instance_variable_set :"@#{name}_infos", nil

        # From Rails 6, ImageProcessing uses an 'auto-orient' by default to interpret the EXIF Orientation metadata.
        # We declare it in the transformations hash for Rails 5
        transformations = {
          :'auto-orient' => true,
          crop: "#{params['width'].round}x#{params['height'].round}+#{params['x'].round}+#{params['y'].round}",
          repage: true,
          :'+' => true
        }

        variant = Rails::VERSION::MAJOR >= 6  ? send(name).variant(**transformations)
                                              : send(name).variant(combine_options: transformations)

        variant_url = variant.processed.url
        downloaded_image = URI.open(variant_url)
        attachable = { io: downloaded_image, filename: send(name).filename.to_s }

        if Rails::VERSION::MAJOR >= 6
          # Prevent double-update on the record, losing ActiveModel::Dirty data.
          # Based on Rails source code:
          # - https://github.com/rails/rails/blob/v6.0.2.2/activestorage/lib/active_storage/attached/model.rb
          # - https://github.com/rails/rails/blob/v6.0.2.2/activestorage/lib/active_storage/attached/one.rb
          attachment_change = ActiveStorage::Attached::Changes::CreateOne.new("#{name}", self, attachable)
          attachment_change.save
          attachment_change.upload
        else
          self.send(name).attach(**attachable)
        end
      end
    end

    has_one_attached name, **options, &block
  end
end
