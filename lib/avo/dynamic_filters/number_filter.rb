class Avo::DynamicFilters::NumberFilter < Avo::DynamicFilters::Filter
  def conditions
    {
      is: "=",
      is_not: "!=",
      gt: ">",
      gte: ">=",
      lt: "<",
      lte: "<=",
    }.merge!(presence_conditions).invert
  end

  def self.icon
    "hashtag"
  end
end
