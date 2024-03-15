module Avo
  module DynamicFilters
    module QueryConverters
      class DateConverter < BaseConverter
        def is
          add_to_query "#{id}_gteq", parsed_date.beginning_of_day
          add_to_query "#{id}_lteq", parsed_date.end_of_day
          add_to_query "m", "and"
        end

        def is_not
          add_to_query "#{id}_lt", parsed_date.beginning_of_day
          add_to_query "#{id}_gt", parsed_date.end_of_day
          add_to_query "m", "or"
        end

        def lte
          add_to_query "#{id}_lteq", parsed_date.end_of_day
        end

        def is_within
          values = value.split " to "

          before_value, after_value = values

          group = [
            combinator: "and",
            c: [
              {
                a: {"0": {name: id}},
                p: "gteq",
                v: {"0": {value: before_value}}
              },
              {
                a: {"0": {name: id}},
                p: "lteq",
                v: {"0": {value: after_value}}
              }
            ]
          ]

          add_to_query "g", group
        end

        private

        def parsed_date
          Date.parse(value)
        end
      end
    end
  end
end
