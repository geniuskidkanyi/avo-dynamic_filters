module Avo
  module DynamicFilters
    class Plugin < Avo::Plugin
      class << self
        def boot
          Avo::Fields::BaseField.include Avo::DynamicFilters::Concerns::FieldExtensions
          Avo::BaseResource.include Avo::DynamicFilters::Concerns::ResourceExtensions
          Avo::BaseController.include Avo::DynamicFilters::Concerns::BaseControllerExtensions

          Avo.asset_manager.add_javascript "/avo-filters-assets/avo_filters"
        end

        def init
        end
      end
    end
  end
end
