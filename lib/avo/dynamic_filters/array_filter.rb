class Avo::DynamicFilters::ArrayFilter < Avo::DynamicFilters::Filter
  def conditions
    base_conditions = {
      array_is: "Are",
      array_contains: "Contain",
      array_overlap: "Overlap"
    }

    # array_contained_in is added by gem active_record_extended
    if Arel::Attributes::Attribute.method_defined?(:contained_in_array)
      base_conditions[:array_contained_in] = "Contained in"
    end

    base_conditions.invert
  end

  def self.icon
    "circle-stack"
  end
end
