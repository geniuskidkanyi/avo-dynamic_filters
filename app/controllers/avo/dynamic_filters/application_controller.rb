module Avo
  module DynamicFilters
    class ApplicationController < ActionController::Base
      include Avo::InitializesAvo

      before_action :init_app
    end
  end
end
