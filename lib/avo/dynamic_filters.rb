require "zeitwerk"
require "avo"
require "avo/dynamic_filters/version"
require "avo/dynamic_filters/engine"

loader = Zeitwerk::Loader.for_gem_extension(Avo)
loader.setup

module Avo
  module DynamicFilters
    # Your code goes here...
  end
end

loader.eager_load
