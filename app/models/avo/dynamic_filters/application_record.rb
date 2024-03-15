module Avo
  module DynamicFilters
    class ApplicationRecord < ActiveRecord::Base
      self.abstract_class = true
    end
  end
end
