# frozen_string_literal: true

class Avo::DynamicFilters::FilterComponent < ViewComponent::Base
  include Avo::ApplicationHelper

  attr_reader :filter
  attr_reader :render_open

  renders_one :conditions
  renders_one :value

  def initialize(filter:, render_open: false, dropdown_data: {})
    @filter = filter
    @render_open = render_open
    @dropdown_data = dropdown_data
  end

  def field
    filter.field
  end

  def pill_value
    case filter.condition.to_sym
    when :is_present, :is_blank, :is_not_empty, :is_empty, :is_true, :is_false, :is_null, :is_not_null
      filter.condition.to_s.gsub("is_", "").humanize.downcase
    else
      "#{humanize_condition(filter.condition)} \"#{humanized_value}\" "
    end
  end

  def humanize_condition(condition)
    case condition.to_sym
    when :gt
      ">"
    when :gte
      ">="
    when :lt
      "<"
    when :lte
      "<="
    when :array_is
      "are"
    when :array_contains
      "contain"
    when :array_overlap
      "overlap"
    when :array_contained_in
      "contained in"
    else
      filter.condition.humanize.downcase
    end
  end

  def humanized_value
    value = filter.value
    options = field.options_for_filter
    if options.present?
      if options.is_a? Array
        options = options.to_h
      end

      options.invert.transform_keys(&:to_s)[value.to_s]
    else
      value
    end
  rescue
    value
  end

  def dropdown_data
    @dropdown_data.merge({
      toggle_target: "panel",
      transition_enter: "transition ease-out duration-100",
      transition_enter_start: "transform opacity-0 -translate-y-1",
      transition_enter_end: "transform opacity-100 translate-y-0",
      transition_leave: "transition ease-in duration-75",
      transition_leave_start: "transform opacity-100 translate-y-0",
      transition_leave_end: "transform opacity-0 -translate-y-1",
    })
  end
end
