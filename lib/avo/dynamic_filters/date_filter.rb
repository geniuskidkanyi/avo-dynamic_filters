class Avo::DynamicFilters::DateFilter < Avo::DynamicFilters::Filter
  def conditions
    {
      is: "Is",
      is_not: "Is not",
      lte: "Is on or before",
      gte: "Is on or after",
      is_within: "Is within",
    }.merge!(presence_conditions).invert
  end

  def self.icon
    "calendar-days"
  end
end
