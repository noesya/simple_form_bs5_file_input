require 'has_one_attached_deletable'
require 'simple_form_image_field/single_deletable_file_input'

module SimpleFormImageField
  def self.add_paths!
    Sprockets.append_path stylesheets_path
    Sprockets.append_path images_path
    Sprockets.append_path javascripts_path
  end

  def self.add_locales!
    I18n.load_path += Dir["#{root_path}/config/locales/*.yml"]
  end

  private

  def self.stylesheets_path
    File.join assets_path, 'stylesheets'
  end

  def self.images_path
    File.join assets_path, 'images'
  end

  def self.javascripts_path
    File.join assets_path, 'javascripts'
  end

  def self.assets_path
    @assets_path ||= File.join root_path, 'assets'
  end

  def self.root_path
    @root_path ||= File.expand_path '..', File.dirname(__FILE__)
  end

end

SimpleFormImageField.add_paths!
SimpleFormImageField.add_locales!
