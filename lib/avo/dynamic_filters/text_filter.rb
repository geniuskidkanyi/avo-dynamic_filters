class Avo::DynamicFilters::TextFilter < Avo::DynamicFilters::Filter
  def conditions
    {
      contains: "Contains",
      does_not_contain: "Does not contain",
      is: "Is",
      is_not: "Is not",
      starts_with: "Starts with",
      ends_with: "Ends with",
    }.merge!(presence_conditions).invert
  end

  def presence_conditions
    if nullable_field?
      return super.merge!(
        {
          is_present: "Is present",
          is_blank: "Is blank",
        }
      )
    end

    {}
  end

  def self.icon
    "font"
  end
end
