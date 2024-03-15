module Avo
  module DynamicFilters
    class Engine < ::Rails::Engine
      isolate_namespace Avo::DynamicFilters

      config.after_initialize do
        # Allow array_contains predicate in Ransack
        # Enables filtering by array (tags field)
        # https://github.com/activerecord-hackery/ransack/issues/321
        ::Ransack.configure do |config|
          {
            array_eq: :eq,
            array_contains: :contains,
            array_overlap: :overlaps,
            array_contained_in: :contained_in_array,
          }.each do |ransack_predicate, arel_predicate|
            config.add_predicate ransack_predicate,
              arel_predicate: arel_predicate,
              formatter: proc { |value| "{#{value}}" },
              validator: proc { |value| value.present? },
              type: :string
          end
        end
      end

      initializer "avo-dynamic_filters.init" do
        if defined?(Avo)
          Avo.plugin_manager.register Avo::DynamicFilters::Plugin
        end
      end

      config.app_middleware.use(
        Rack::Static,
        urls: ["/avo-filters-assets"],
        root: Avo::DynamicFilters::Engine.root.join("app", "assets", "builds")
      )
    end
  end
end
