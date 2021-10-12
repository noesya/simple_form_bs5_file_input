class ActiveRecord::Base
  def self.has_one_attached_deletable(name, dependent: :purge_later)
    class_eval do
      attr_accessor :"#{name}_delete"

      before_validation { send(name).purge_later if send("#{name}_attachment").present? && send("#{name}_delete") == 'true' }

      define_method :"#{name}_delete=" do |value|
        instance_variable_set :"@#{name}_delete", value
      end
    end

    has_one_attached name
  end
end
