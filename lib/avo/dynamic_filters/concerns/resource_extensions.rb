module Avo
  module DynamicFilters
    module Concerns
      module ResourceExtensions
        extend ActiveSupport::Concern

        def get_filterable_fields
          get_field_definitions.select do |field|
            next unless field.filterable?

            true
          end
        end

        def has_filters?
          get_filterable_fields.present?
        end
      end
    end
  end
end
