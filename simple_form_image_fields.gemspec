lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "simple_form_image_fields/version"

Gem::Specification.new do |s|
  s.name        = 'simple_form_image_fields'
  s.version     = SimpleFormImageFields::VERSION
  s.summary     = "Simple Form Image Fields"
  s.description = "Improve Simple Form basic input field, add controls/preview on the field."
  s.authors     = ["Pierre-andré Boissinot"]
  s.email       = 'pa@boissinot.paris'
  s.files         = Dir.chdir(File.expand_path('..', __FILE__)) do
    `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  end
  s.require_paths = ['lib']
  s.homepage    =
    'https://github.com/noesya/simple_form_image_fields'
  s.license       = 'MIT'

  s.add_dependency "rails"
  s.add_dependency "simple_form"

  s.add_development_dependency "listen"
  s.add_development_dependency "sqlite3"
end
