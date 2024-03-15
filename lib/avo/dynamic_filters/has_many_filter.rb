class Avo::DynamicFilters::HasManyFilter < Avo::DynamicFilters::Filter
  def conditions
    {
      is: "is",
      is_not: "is_not",
    }.merge!(presence_conditions)
  end

  def self.icon
    "arrow-up-right"
  end
end
