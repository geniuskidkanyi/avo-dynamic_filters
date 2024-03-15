Avo::DynamicFilters::Engine.routes.draw do
  scope :filters do
    resources :fields
    resources :statics
  end
end
