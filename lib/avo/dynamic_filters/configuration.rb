module Avo
  module DynamicFilters
    class Configuration
      include ActiveSupport::Configurable

      config_accessor(:button_label) { lambda { I18n.t "avo.filters" } }
      config_accessor(:always_expanded) { false }
      config_accessor(:param_key) { :filters }

      def button_label
        Avo::ExecutionContext.new(target: config[:button_label]).handle
      end
    end

    def self.configuration
      @configuration ||= Configuration.new
    end

    def self.configure
      yield configuration
    end
  end
end
