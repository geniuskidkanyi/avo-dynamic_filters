class Avo::DynamicFilters::TagsFilter < Avo::DynamicFilters::Filter
  def conditions
    base_conditions = {
      array_is: "Are",
      array_contains: "Contain",
      array_overlap: "Overlap",
    }

    # array_contained_in is added by gem active_record_extended
    if Arel::Attributes::Attribute.method_defined?(:contained_in_array)
      # Add options for fields that do NOT use acts_as_tagable_on
      unless field.acts_as_taggable_on
        base_conditions[:array_contained_in] = "Contained in"
      end
    end

    base_conditions.invert
  end

  def suggestions
    return [] if just_filterable?

    return Avo::ExecutionContext.new(target: options[:suggestions], filter: self).handle if options.fetch(:suggestions).present?

    []
  end

  def self.icon
    "tag"
  end
end
