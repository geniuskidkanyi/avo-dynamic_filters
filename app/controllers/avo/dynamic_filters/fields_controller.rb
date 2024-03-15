require_dependency "avo/dynamic_filters/application_controller"

module Avo
  module DynamicFilters
    class FieldsController < ApplicationController
      before_action :set_filter

      def create
        view = Avo::ViewInquirer.new("index")

        @filter.field = @filter.resource_class.constantize.new(view: view).detect_fields.get_field filter_params[:field_id]

        render layout: false
      end

      private

      def set_filter
        @filter = Avo::DynamicFilters::Filter.build(**filter_params.to_h.symbolize_keys)
      end

      def filter_params
        params.permit(:type, :resource_class, :field_id)
      end
    end
  end
end
