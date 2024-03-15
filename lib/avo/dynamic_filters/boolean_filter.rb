class Avo::DynamicFilters::BooleanFilter < Avo::DynamicFilters::Filter
  def conditions
    {
      is_true: "Is true",
      is_false: "Is false",
    }.merge!(presence_conditions).invert
  end

  def self.icon
    "check-circle"
  end
end
