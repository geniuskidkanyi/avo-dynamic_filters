module Avo
  module DynamicFilters
    module QueryConverters
      class BaseConverter
        attr_reader :resource
        attr_reader :id
        attr_reader :value
        attr_reader :condition
        attr_reader :query

        class << self
          def build(id:, condition:, value:, resource:, field:)
            converter_type = Avo::DynamicFilters::Filter.field_to_filter field.type
            converter_klass = "Avo::DynamicFilters::QueryConverters::#{converter_type.to_s.camelize}Converter"

            converter_klass.safe_constantize.new(id: id, condition: condition, value: value, resource: resource)
          end
        end

        def initialize(id:, condition:, value:, resource:)
          @resource = resource
          @id = id
          @condition = condition
          @value = value

          @query = {}
        end

        def parsed
          if condition.in?(predicates.map(&:to_s))
            send condition
          end

          query
        end

        def add_to_query(predicate, value)
          @query[predicate] = value
        end

        def predicates
          [
            :is,
            :is_not,
            :contains,
            :does_not_contain,
            :starts_with,
            :ends_with,
            :gt,
            :gte,
            :lt,
            :lte,
            :is_present,
            :is_blank,
            :is_null,
            :is_not_null,
            :is_true,
            :is_false,
            :is_within
          ]
        end

        def is
          add_to_query "#{id}_eq", value
        end

        def is_not
          add_to_query "#{id}_not_eq", value
        end

        def contains
          add_to_query "#{id}_cont", value
        end

        def does_not_contain
          add_to_query "#{id}_not_cont", value
        end

        def starts_with
          add_to_query "#{id}_start_any", value
        end

        def ends_with
          add_to_query "#{id}_end", value
        end

        def gt
          add_to_query "#{id}_gt", value
        end

        def gte
          add_to_query "#{id}_gteq", value
        end

        def lt
          add_to_query "#{id}_lt", value
        end

        def lte
          add_to_query "#{id}_lteq", value
        end

        def is_present
          add_to_query "#{id}_present", 1
        end

        def is_blank
          add_to_query "#{id}_blank", 1
        end

        def is_null
          add_to_query "#{id}_null", 1
        end

        def is_not_null
          add_to_query "#{id}_not_null", 1
        end

        def is_true
          add_to_query "#{id}_true", 1
        end

        def is_false
          add_to_query "#{id}_false", 1
        end

        private

        def field
          resource.get_field id
        end
      end
    end
  end
end
