# frozen_string_literal: true

class Avo::DynamicFilters::FiltersComponent < ViewComponent::Base
  include Avo::ApplicationHelper
  include Turbo::FramesHelper

  attr_reader :resource
  attr_reader :turbo_frame

  def initialize(resource:, turbo_frame:, dynamic_filters_component_id:)
    @resource = resource
    @turbo_frame = turbo_frame
    @dynamic_filters_component_id = dynamic_filters_component_id
  end

  def parsed_filters
    parsed_params = Avo::DynamicFilters::Filter.unpack_params(params)

    parsed_params
      .select do |param_filter|
        param_filter.id.in? resource.get_filterable_fields.map(&:id).map(&:to_s)
      end
      .map do |filter_param|
        # get field
        field = resource.get_field filter_param.id
        # initialize filter object
        filter = Avo::DynamicFilters::Filter.build type: field.type, resource_class: resource.class, field_id: filter_param.id
        filter.condition = filter_param.condition
        filter.value = filter_param.value
        filter.field = field

        filter
      end
  end

  def turbo_frame_id
    @turbo_frame_id ||= "avo_filters_holder_#{SecureRandom.hex(4)}"
  end
end
