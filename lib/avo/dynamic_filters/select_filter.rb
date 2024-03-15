class Avo::DynamicFilters::SelectFilter < Avo::DynamicFilters::Filter
  def conditions
    {
      is: "Is",
      is_not: "Is not",
    }.merge!(presence_conditions).invert
  end

  def self.icon
    "arrow-down-circle"
  end

  def options
    if field.present? && field.options_for_filter.respond_to?(:options_for_filter)
      return field.options_for_filter
    end

    []
  end
end
