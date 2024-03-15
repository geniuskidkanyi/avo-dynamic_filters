class Avo::DynamicFilters::ParamFilter
  attr_reader :condition
  attr_reader :id
  attr_reader :value

  def initialize(id:, condition:, value:)
    @condition = condition
    @id = id
    @value = value
  end
end
