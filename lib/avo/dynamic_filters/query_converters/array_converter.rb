module Avo
  module DynamicFilters
    module QueryConverters
      class ArrayConverter < BaseConverter
        def predicates
          [
            :array_is,
            :array_contains,
            :array_overlap,
            :array_contained_in,
          ]
        end

        def array_is
          add_to_query "#{id}_array_eq", value
        end

        def array_contains
          add_to_query "#{id}_array_contains", value
        end

        def array_overlap
          add_to_query "#{id}_array_overlap", value
        end

        def array_contained_in
          add_to_query "#{id}_array_contained_in", value
        end
      end
    end
  end
end
