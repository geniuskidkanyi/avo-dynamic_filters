module Avo
  module DynamicFilters
    module Concerns
      module BaseControllerExtensions
        extend ActiveSupport::Concern
        included do
          require "ransack"

          def apply_dynamic_filters
            return if params[Avo::DynamicFilters.configuration.param_key].blank?

            # Apply dynamic filters
            query_builder = Avo::DynamicFilters::QueryBuilder.new(resource: @resource, params: params, query: @query)

            @query = @query.ransack(query_builder.ransack_query)
            @query = query_builder.apply_acts_as_taggable(query: @query.result)
            @query = query_builder.apply_custom_query(query: @query)
          end

          def pagy_query
            @query.instance_of?(Ransack::Search) ? @query.result(distinct: false) : @query
          end
        end
      end
    end
  end
end
