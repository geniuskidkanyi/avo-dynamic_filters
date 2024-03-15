module Avo
  module DynamicFilters
    module Concerns
      module FieldExtensions
        extend ActiveSupport::Concern

        def filterable?
          @args[:filterable].present?
        end

        def filterable
          @args[:filterable]
        end

        # Returns if the `filterable` option is a boolean or not.
        # If it isn't then it's a configuration obejct that we pass along.
        # Returns a boolean
        def just_filterable?
          filterable.is_a?(TrueClass) || filterable.is_a?(FalseClass)
        end

        # Private API
        # Used by belongs_to fields to filter by custom attributes
        # Example: belongs_to :user, filterable: { attributes: [:first_name, :last_name] }
        def filterable_attributes
          return nil if !filterable.is_a?(Hash) || !filterable[:attributes].is_a?(Array)

          filterable[:attributes].map { |attribute| "#{id}_#{attribute}" }.join("_or_")
        end

        # Private API
        # Used by tags fields to set some options
        # Example: field: :tags, as: :tags :user, filterable: {
        #   suggestions: -> { ["one", "two"] }
        # }
        def tags_options
          if filterable.is_a?(Hash)
            @args[:filterable]
          end
        end
      end
    end
  end
end
